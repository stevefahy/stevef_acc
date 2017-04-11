var accountController = angular.module('accountController', [])
    .controller('accountController', ['$scope', '$http', '$filter', '$parse', '$compile', 'Accounts', 'summary', function($scope, $http, $filter, $parse, $compile, Accounts, summary) {

        $scope.summary = summary;
        var s = summary;
        // DIV Show/hide
        $scope.showAccounts = false;
        $scope.showCreateAccount = false;
        $scope.showSection = false;

        $scope.account_obj = {
            name: 'account here',
            balance: 0,
            currency: '',
            rules: [{ percent: 99, rule: '>', amount: 0 }],
            startdate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
            enddate: $filter("date")(Date.now(), 'yyyy-MM-dd')
        };

        $scope.$on("dateChanged", function(event) {
            calulateInterest();
        });

        // GET =====================================================================
        // when landing on the page, get all accounts and show them
        // use the service to get all the accounts
        Accounts.get()
            .success(function(data) {
                $scope.accounts = data;
                $scope.loading = false;
                calulateInterest();
            });
        addBalanceTotal = function(r, a) {
            summary.account_balance_total += a / r;
        };
        calulateInterest = function() {
            var a = summary.categorizeValues($scope.accounts, 'accounts');
            summary.accounts_past = a.past;
            summary.accounts_current = a.current;
            summary.accounts_future = a.future;
            summary.account_balance_total = 0;
            if (!summary.account_balance_total) {
                summary.account_balance_total = 0;
            }
            summary.account_interest_total = 0;
            for (var j in summary.accounts_current) {
                var ac = 'accounts_current_' + j;
                summary[ac] = summary.accounts_current[j];
                if (!summary.account_interest) {
                    summary.account_interest = [];
                }
                if (!summary.account_balance) {
                    summary.account_balance = [];
                }
                summary.account_interest[j] = summary.calculateInterest(summary.accounts_current[j]);
                summary.account_interest_total += summary.account_interest[j];
                summary.account_balance_total += summary.calculateBalanceTotal(summary.accounts_current[j]);
            }
        };
        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createAccount = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.account_obj.name !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Accounts.create($scope.account_obj)
                    // if successful creation, call our get function to get all the new accounts
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.accounts = data; // assign our new list of accounts
                        calulateInterest();
                    });
            }
        };
        // UPDATE ==================================================================
        $scope.updateAccount = function(id, account_obj) {
            var pms = { 'id': id, 'account_obj': account_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (account_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Accounts.update(pms)
                    // if successful creation, call our get function to get all the new accounts
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.accounts = data; // assign our new list of accounts
                        calulateInterest();
                    });
            }
        };
        // ADD RULE ==================================================================
        $scope.addRule = function(id, contentId, account_obj, rule) {
            var pms = { 'id': id, 'contentId': contentId, 'account_obj': account_obj, 'rule': rule };
            Accounts.addRule(pms)
                // if successful creation, call our get function to get all the new accounts
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of accounts
                    calulateInterest();
                });
        };
        // DELETE RULE ==================================================================
        $scope.deleteRule = function(id, contentId, account_obj, ruleId) {
            var pms = { 'id': id, 'contentId': contentId, 'account_obj': account_obj, 'ruleId': ruleId };
            Accounts.deleteRule(pms)
                // if successful creation, call our get function to get all the new accounts
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of accounts
                    calulateInterest();
                });
        };
        // ADD ACCOUNT ================================================================
        $scope.addAccount = function(id, account) {
            var pms = { 'id': id, 'account_obj': $scope.account_obj };
            pms.account_obj.startdate = new Date(pms.account_obj.startdate).toISOString();
            pms.account_obj.enddate = new Date(pms.account_obj.enddate).toISOString();
            var newaccount = account.account_obj.push(pms.account_obj);
            pms = { 'id': id, 'account_obj': account.account_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (account.account_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Accounts.update(pms)
                    // if successful creation, call our get function to get all the new accounts
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.accounts = data; // assign our new list of accounts
                        calulateInterest();
                    });
            }
        };
        // DELETE ==================================================================
        // delete a account after checking it
        $scope.deleteAccount = function(id) {
            $scope.loading = true;
            Accounts.delete(id)
                // if successful creation, call our get function to get all the new accounts
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of accounts
                    calulateInterest();
                });
        };
        // DELETE SUB ACCOUNT =======================================================
        $scope.deleteContent = function(id, contentId) {
            Accounts.deleteContent(id, contentId)
                // if successful creation, call our get function to get all the new accounts
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of accounts
                    calulateInterest();
                });
        };
    }]);
