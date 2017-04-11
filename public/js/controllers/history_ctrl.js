var historyController = angular.module('historyController', [])
    .controller('historyController', ['$scope', '$http', '$filter', '$parse', '$compile', '$rootScope', 'dateFilter', 'Accounts', 'Historys', 'summary', function($scope, $http, $filter, $parse, $compile, $rootScope, dateFilter, Accounts, Historys, summary) {

        $scope.summary = summary;
        var s = summary;
        $scope.showHistory = false;
        var today = new Date();
        // Use this loop to format hte date so that it will display in the HTML5 input type date picker
        $scope.dateString = $filter('date')(new Date(today), "yyyy-MM-dd");
        // Set the global current date to today
        $scope.summary.set_date = today;
        // watch for the history date picker value to change
        $scope.$watch('dateString', function(date) {
            // Update the global current date
            $scope.summary.set_date = $scope.dateString;
            $rootScope.$broadcast("dateChanged");
        });

        $scope.history_obj = {
            date: Date,
            balance: Number,
            taxed: Number,
            total: Number,
            stocksgain: []
        };

        $scope.addHistory = function() {
            $scope.history_obj.date = $scope.summary.set_date;
            $scope.history_obj.balance = $scope.summary.account_balance_total;
            $scope.history_obj.taxed = $scope.summary.calculateTAX($scope.summary.tax_rate_DIRT, $scope.summary.account_interest_total);
            $scope.history_obj.total = $scope.summary.account_balance_total + $scope.summary.calculateTAX($scope.summary.tax_rate_DIRT, $scope.summary.account_interest_total);
            if ($scope.summary.current_stocks_gain.length > 0) {
                $scope.history_obj.total += $scope.summary.current_stocks_gain_total;
                $scope.history_obj.stocksgain = $scope.summary.current_stocks_gain;
            }


            $scope.createHistory();
        };
        // GET =====================================================================
        // when landing on the page, get all historys and show them
        // use the service to get all the historys
        Historys.get()
            .success(function(data) {
                $scope.historys = data;
                $scope.loading = false;
            });
        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createHistory = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.history_obj.date !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Historys.create($scope.history_obj)
                    // if successful creation, call our get function to get all the new accounts
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.historys = data; // assign our new list of accounts
                    });
            }
        };
        // DELETE ==================================================================
        // delete a account after checking it
        $scope.deleteHistory = function(id) {
            $scope.loading = true;
            Historys.delete(id)
                // if successful deletion, call our get function to get all the remaining hostorys
                .success(function(data) {
                    $scope.loading = false;
                    $scope.historys = data; // assign our new list of accounts
                });
        };
    }]);
