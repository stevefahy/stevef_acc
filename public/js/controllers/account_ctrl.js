var accountController = angular.module('accountController', [])
    .controller('accountController', ['$scope', '$http', '$filter', '$parse', '$compile', 'Accounts', 'summary', function($scope, $http, $filter, $parse, $compile, Accounts, summary) {

        $scope.summary = summary;
        var s = summary;
        // DIV Show/hide
        $scope.showAccounts = false;
        $scope.showCreateAccount = false;

        $scope.formatDate = function(x) {
            var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
            return formattedDate;
        };

        $scope.account_obj = {
            name: 'account here',
            balance: 0,
            rules: [{ percent: 99, rule: '>', amount: 0 }],
            startdate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
            enddate: $filter("date")(Date.now(), 'yyyy-MM-dd')
        };


        // GET =====================================================================
        // when landing on the page, get all cgts and show them
        // use the service to get all the todos
        Accounts.get()
            .success(function(data) {
                $scope.accounts = data;
                $scope.loading = false;
                calulateInterest();
            });

        calcPeriodInterest = function(balance, percent, rule, amount, start, end) {

            var today = new Date();
            var daystocalc = 0;
            var balance_calc;
            var interest_accrued = 0;
            var interest_accrued_todate = 0;

            // starts before today
            if (s.elapsedDays(today, start) > 0) {
                // ends before today
                if (s.elapsedDays(today, end) > 0) {
                    // check if the period is within this year
                    daystocalc = s.elapsedDays(end, start) + 1;
                } else {
                    // ends after today
                    daystocalc = s.elapsedDays(today, start);
                }
                if (daystocalc > 0) {
                    if (rule == '>') {
                        if (balance > amount) {
                            balance_calc = amount;
                        } else {
                            balance_calc = 0;
                        }
                    } else {
                        if (balance < amount) {
                            balance_calc = balance;
                        } else {
                            balance_calc = amount;
                        }
                    }
                    if (balance_calc > 0) {
                        interest_accrued = balance_calc * (percent);
                        interest_accrued_todate = (interest_accrued / 365) * daystocalc;
                    }
                } else {
                    // Future rule
                }
            }
            return interest_accrued_todate;
        };

        calulateInterest = function() {

            $scope.accountCalc = {
                ac_balance: {

                },
                ac_rules: {

                },
                ac_interest: {

                },
                ac_current: {

                }

            };

            var count;
            var balance;
            var today = new Date();
            var year = new Date().getFullYear();
            var start_date;
            var history = false;

            angular.forEach($scope.accounts, function(value, index) {
                count = 0;

                $scope.accountCalc.ac_balance[index] = 0;
                $scope.accountCalc.ac_interest[index] = 0;

                angular.forEach(value.account_obj, function(value2, index2) {

                    if (new Date(value2.startdate).getFullYear() < year && new Date(value2.enddate).getFullYear() < year) {
                        // start and end last year
                        // Do history
                        history = true;
                    } else if (new Date(value2.startdate).getFullYear() < year && new Date(value2.enddate).getFullYear() == year) {
                        // starts previous year but ends within current year. use 1 January if current year as start date
                        history = false;
                        start_date = new Date(year, 0, 01);
                    } else if (new Date(value2.startdate).getFullYear() == year) {
                        // start and end this year
                        start_date = value2.startdate;
                        history = false;
                    } else {
                        // start future year
                        history = true;
                    }

                    if (!history) {
                        // if date starts before today
                        if (s.elapsedDays(today, start_date) > 0) {
                            if (s.elapsedDays(today, value2.enddate) > 0) {
                                // ends before today
                            } else {
                                // ends after today (and starts before today - current period)
                                $scope.accountCalc.ac_balance[index] = value2.balance;
                                // store current details for summary
                                $scope.accountCalc.ac_current[index] = value2;
                            }
                        }

                        angular.forEach(value2.rules, function(value3, index3) {
                            if ($scope.accountCalc.ac_rules[index] === undefined) {
                                $scope.accountCalc.ac_rules[index] = value3.percent + value3.rule + value3.amount;
                            } else {
                                $scope.accountCalc.ac_rules[index] += '\n' + value3.percent + value3.rule + value3.amount;
                            }
                            $scope.accountCalc.ac_interest[index] += calcPeriodInterest(value2.balance, value3.percent, value3.rule, value3.amount, start_date, value2.enddate);
                        });
                        count++;
                    }
                });
            });
            calcInterestTotal();
            calcBalanceTotal();
        };

        calcInterestTotal = function() {
            var interesttodateTotal = 0;
            for (var i in $scope.accountCalc.ac_interest) {
                interesttodateTotal += $scope.accountCalc.ac_interest[i];
            }
            $scope.summary.interesttodate = (interesttodateTotal).toFixed(2);
        };
        calcBalanceTotal = function() {
            var balancetodateTotal = 0;
            for (var i in $scope.accountCalc.ac_balance) {
                balancetodateTotal += $scope.accountCalc.ac_balance[i];
            }
            $scope.summary.balancetodate = (balancetodateTotal).toFixed(2);
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
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.accounts = data; // assign our new list of todos
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
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.accounts = data; // assign our new list of todos
                        calulateInterest();
                    });
            }
        };
        // ADD RULE ==================================================================
        $scope.addRule = function(id, contentId, account_obj, rule) {
            var pms = { 'id': id, 'contentId': contentId, 'account_obj': account_obj, 'rule': rule };
            Accounts.addRule(pms)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of todos
                    calulateInterest();
                });
        };
        // DELETE RULE ==================================================================
        $scope.deleteRule = function(id, contentId, account_obj, ruleId) {
            var pms = { 'id': id, 'contentId': contentId, 'account_obj': account_obj, 'ruleId': ruleId };
            Accounts.deleteRule(pms)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of todos
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
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.accounts = data; // assign our new list of todos
                        calulateInterest();
                    });
            }
        };
        // DELETE ==================================================================
        // delete a todo after checking it
        $scope.deleteAccount = function(id) {
            $scope.loading = true;
            Accounts.delete(id)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of todos
                    calulateInterest();
                });
        };
        // DELETE SUB ACCOUNT =======================================================
        $scope.deleteContent = function(id, contentId) {
            Accounts.deleteContent(id, contentId)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.accounts = data; // assign our new list of todos
                    calulateInterest();
                });
        };
    }]);
