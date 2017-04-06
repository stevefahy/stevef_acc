var taxConroller = angular.module('taxController', [])
    .controller('taxController', ['$scope', '$http', '$filter', 'Taxs', 'summary', function($scope, $http, $filter, Taxs, summary) {

        $scope.summary = summary;
        var s = summary;
        $scope.showSection = false;
        var today = new Date();
        var year = new Date().getFullYear();
        var start_date;
        var history = false;

        $scope.tax_obj = {
            tax_type: 'type',
            rate: 0,
            startdate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
            enddate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
        };

        // GET =====================================================================
        // when landing on the page, get all taxs and show them
        // use the service to get all the taxs
        Taxs.get()
            .success(function(data) {
                $scope.taxs = data;
                $scope.loading = false;
                getTax();
            });
        // Get current CGT rate
        getTax = function() {

            $scope.taxCalc = {
                tx_tax_type: {

                },
                tx_rate: {

                },
                ac_interest: {

                },
                tx_current: {

                }
            };

            var tax_name;
            angular.forEach($scope.taxs, function(value, index) {
                $scope.taxCalc.tx_tax_type[index] = '';
                $scope.taxCalc.tx_rate[index] = 0;
                angular.forEach(value.tax_obj, function(value2, index2) {
                    // starts before today
                    if (s.elapsedDays(today, value2.startdate) + 1 > 0) {
                        // ends before today
                        if (s.elapsedDays(today, value2.enddate) + 1 > 0) {
                            //
                        } else {
                            // ends after today (and starts before today - current period)
                            $scope.taxCalc.tx_tax_type[index] = value2.tax_type;
                            $scope.taxCalc.tx_rate[index] = value2.rate;
                            $scope.taxCalc.tx_current[index] = value2;
                            tax_name = 'tax_rate_' + value2.tax_type;
                            summary[tax_name] = value2.rate;
                        }
                    }
                });
            });
        };
        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createTax = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.tax_obj.rate !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object);
                Taxs.create($scope.tax_obj)
                    // if successful creation, call our get function to get all the new taxs
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.taxs = data; // assign our new list of taxs
                        getTax();
                    });
            }
        };
        // UPDATE ==================================================================
        // when submitting the update form, send the text to the node API
        $scope.updateTax = function(id, tax_obj) {
            var pms = { 'id': id, 'tax_obj': tax_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (tax_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Taxs.update(pms)
                    // if successful creation, call our get function to get all the new taxs
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.taxs = data; // assign our new list of taxs
                        getTax();
                    });
            }
        };
        // ADD =====================================================================
        $scope.addTax = function(id, tax) {
            var pms = { 'id': id, 'tax_obj': $scope.tax_obj };
            pms.tax_obj.startdate = new Date(pms.tax_obj.startdate).toISOString();
            pms.tax_obj.enddate = new Date(pms.tax_obj.enddate).toISOString();
            var newtax = tax.tax_obj.push(pms.tax_obj);
            pms = { 'id': id, 'tax_obj': tax.tax_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (tax.tax_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Taxs.update(pms)
                    // if successful creation, call our get function to get all the new taxs
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.taxs = data; // assign our new list of taxs
                        getTax();
                    });
            }
        };
        // DELETE ==================================================================
        // delete a todo after checking it
        $scope.deleteTax = function(id) {
            $scope.loading = true;
            Taxs.delete(id)
                // if successful creation, call our get function to get all the new taxs
                .success(function(data) {
                    $scope.loading = false;
                    $scope.taxs = data; // assign our new list of taxs
                    getTax();
                });
        };
        // DELETE SUB CGT =======================================================
        $scope.deleteContent = function(id, contentId) {
            Taxs.deleteContent(id, contentId)
                // if successful creation, call our get function to get all the new taxs
                .success(function(data) {
                    $scope.loading = false;
                    $scope.taxs = data; // assign our new list of taxs
                    getTax();
                });
        };
    }]);
