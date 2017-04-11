angular.module('historyService', [])
    // each function returns a promise object 
    .factory('Historys', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/historys');
            },
            create: function(historyData) {
                return $http.post('/api/historys', historyData);
            },
            delete: function(id) {
                return $http.delete('/api/historys/' + id);
            },
            update: function(pms) {
                var theurl = '/api/historys/' + pms.id;
                return $http.put(theurl, pms);
            },
            deleteContent: function(id, contentId) {
                return $http.post('/api/historys/' + id + '/' + contentId);
            }
        };
    }]);

angular.module('taxService', [])
    // each function returns a promise object 
    .factory('Taxs', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/taxs');
            },
            create: function(taxData) {
                return $http.post('/api/taxs', taxData);
            },
            delete: function(id) {
                return $http.delete('/api/taxs/' + id);
            },
            update: function(pms) {
                var theurl = '/api/taxs/' + pms.id;
                return $http.put(theurl, pms);
            },
            deleteContent: function(id, contentId) {
                return $http.post('/api/taxs/' + id + '/' + contentId);
            }
        };
    }]);

angular.module('accountService', [])
    // each function returns a promise object 
    .factory('Accounts', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/accounts');
            },
            create: function(accountData) {
                return $http.post('/api/accounts', accountData);
            },
            delete: function(id) {
                return $http.delete('/api/accounts/' + id);
            },
            update: function(pms) {
                var theurl = '/api/accounts/' + pms.id;
                return $http.put(theurl, pms);
            },
            deleteContent: function(id, contentId) {
                return $http.post('/api/accounts/' + id + '/' + contentId);
            },
            addRule: function(pms) {
                var theurl = '/api/accounts/' + pms.id + '/' + pms.contentId;
                return $http.put(theurl, pms);
            },
            deleteRule: function(pms) {
                var theurl = '/api/accounts/delete/' + pms.id + '/' + pms.contentId;
                return $http.post(theurl, pms);
            }
        };
    }]);

angular.module('accountPageService', [])
    .factory('summary', ['$filter', 'getData', '$q', 'dateFilter', function($filter, getData, $q, dateFilter) {
        summary = this;
        var summary = {
            'account_interest_total': Number,
            'account_interest': [],
            'current_stocks': [],
            'current_stocks_data': [],
            'current_stocks_period': [],
            'current_stocks_fx': [],
            'current_stocks_calculated': [],
            'account_balance_total': Number,
            'current_stocks_gain_total': Number,
            'set_date': Date
        };

        elapsedDays = function(d1, d2) {
            // ELAPSED DAYS
            var d1t = new Date(d1);
            var d2t = new Date(d2);
            var diff = d1t - d2t;
            var result = Math.floor(diff / (1000 * 60 * 60 * 24));
            return result;
        };
        return {
            // FX
            getFXSingle: function(currencies, amount) {
                var api = getData.getFX(currencies);
                var data = api.get({ symbol: currencies }, function() {
                    var rate = data.query.results.rate.Rate;
                    addBalanceTotal(rate, amount);
                });
            },
            // FX HISTORY
            getFXSingleHistory: function(currency, amount, date) {
                // The YQL FX historical data API can only be checked against USD as the base currency
                // In order to check other currency rates both rates must be retrieved (against USD) 
                // and then divided by each other to get their rate against each other.
                // By default get the EUR/USD rate which required to get all currencies against EUR
                var api1 = getData.getFXhistory('EUR', date);
                var data1 = api1.get({ symbol: 'EUR' }, function() {
                    // Check that a valid value is returned
                    if (data1.query.results !== null) {
                        var rate1 = (1 / data1.query.results.quote.Adj_Close);
                        // If the currency rate required is not USD then get that currency against USD
                        if (currency != 'USD') {
                            var api2 = getData.getFXhistory(currency, date);
                            var data2 = api2.get({ symbol: currency }, function() {
                                var rate2 = (1 / data2.query.results.quote.Adj_Close);
                                addBalanceTotal
(rate1 / rate2, amount);
                            });
                        } else {
                            addBalanceTotal(rate1, amount);
                        }
                    } else {
                        console.log('no currency for this date');
                    }
                });
            },
            elapsedDays: function(d1, d2) {
                // ELAPSED DAYS
                var d1t = new Date(d1);
                var d2t = new Date(d2);
                var diff = d1t - d2t;
                var result = Math.floor(diff / (1000 * 60 * 60 * 24));
                return result;
            },
            getPreviousYear: function(y) {
                new Date(y).getFullYear() - 1;
                return y;
            },
            calculateInterest: function(acc) {
                //var today = new Date();
                var today = this.set_date;
                var daystocalc = 0;
                var interest_accrued = 0;
                var interest_accrued_todate = 0;
                for (var i in acc) {
                    var start = acc[i].startdate;
                    var end = acc[i].enddate;
                    var balance = acc[i].balance;
                    for (var j in acc[i].rules) {
                        var rule = acc[i].rules[j].rule;
                        var amount = acc[i].rules[j].amount;
                        var percent = acc[i].rules[j].percent;
                        // ends before today
                        if (this.elapsedDays(today, end) > 0) {
                            // check if the period is within this year
                            daystocalc = this.elapsedDays(end, start) + .78;
                        } else {
                            // ends after today
                            daystocalc = this.elapsedDays(today, start);
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
                                interest_accrued_todate += (interest_accrued / 365) * daystocalc;
                            }
                        }
                    }
                }
                return interest_accrued_todate;
            },
            categorizeValues: function(list, name) {
                var today = this.set_date;
                var year = new Date().getFullYear();
                var start_date = new Date(year, 0, 01);
                var object = name.substring(0, name.length - 1) + '_obj';
                var past = name + '_past';
                var current = name + '_current';
                var future = name + '_future';
                summary[past] = [];
                summary[current] = [];
                summary[future] = [];
                // starts previous ends future?
                angular.forEach(list, function(value, index) {
                    summary[past][index] = [];
                    summary[current][index] = [];
                    summary[future][index] = [];
                    angular.forEach(value[object], function(value2, index2) {
                        // Use this loop to format hte date so that it will display in the HTML5 input type date picker
                        value2.startdate = $filter('date')(new Date(value2.startdate), "yyyy-MM-dd");
                        value2.enddate = $filter('date')(new Date(value2.enddate), "yyyy-MM-dd");
                        var new_object = JSON.parse(JSON.stringify(value2));
                        if (new Date(new_object.startdate).getFullYear() < year && new Date(new_object.enddate).getFullYear() < year) {
                            // start and end previous year
                            summary[past][index].push(new_object);
                        } else if (new Date(new_object.startdate).getFullYear() < year && new Date(new_object.enddate).getFullYear() == year) {
                            // starts previous year but ends within current year. use 1 January if current year as start date
                            // Divide into two Objects for PAST and CURRENT dates.
                            // Create new Objects before we update the dates
                            var new_object_past = JSON.parse(JSON.stringify(new_object));
                            var new_object_current = JSON.parse(JSON.stringify(new_object));
                            var stored_start_date = new_object.startdate;
                            // CURRENT
                            new_object_current.startdate = new Date(start_date).toISOString();
                            summary[current][index].push(new_object_current);
                            // PAST
                            new_object_past.startdate = stored_start_date;
                            var new_end_year = new Date(new_object_past.enddate).getFullYear() - 1;
                            var new_end_date = new Date(new_end_year, 11, 31);
                            new_object_past.enddate = new Date(new_end_date).toISOString();
                            summary[past][index].push(new_object_past);
                        } else if (new Date(new_object.startdate).getFullYear() == year && new Date(new_object.enddate).getFullYear() == year) {
                            // Starts and ends this year
                            // check if it starts before today
                            if (this.elapsedDays(today, new_object.startdate) + 1 > 0) {
                                // Positive nember returned - started before today
                                summary[current][index].push(new_object);
                            } else {
                                // negative number returned - starts after today
                                summary[future][index].push(new_object);
                            }
                        } else if (new Date(new_object.startdate).getFullYear() > year) {
                            // starts future year
                            summary[future][index].push(new_object);
                        }
                    });
                });
                return { 'past': summary.accounts_past, 'current': summary.accounts_current, 'future': summary.accounts_future };
            },
            stock_gain: function(n) {
                if (angular.isNumber(n) === true) {
                    summary.stock_gain_total += n;
                }
                return n;
            },
            getSymbol: function(str) {
                var symbol;
                if (str == 'USD') {
                    symbol = '$';
                } else if (str == 'GBP') {
                    symbol = '£';
                } else if (str == 'EUR') {
                    symbol = '€';
                } else {
                    symbol = '€';
                }
                return symbol;
            },
            getSummary: function() {
                return summary;
            },
            formatDateLong: function(x) {
                var formattedDate = $filter('date')(new Date(x), "longDate");
                return formattedDate;
            },
            formatDate: function(x) {
                var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
                return formattedDate;
            },
            calculateTAX: function(tax, amount) {
                var amount_after_tax = Number;
                if (amount > 0) {
                    amount_after_tax = amount - (amount * (tax / 100));
                } else {
                    amount_after_tax = amount;
                }
                return amount_after_tax;
            },
            calculateBalanceTotal: function(acc) {
                var balance_total = 0;
                // sort the array of objects so that the latest startdate is first
                acc.sort(function(a, b) {
                    return Date.parse(a.startdate) - Date.parse(b.startdate);
                });
                var maxT = acc[acc.length - 1];
                //var minT = acc[0];
                if (maxT.currency) {
                    if ((new Date(this.set_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))) {
                        this.getFXSingle('EUR' + maxT.currency, maxT.balance);
                    } else {
                        this.getFXSingleHistory(maxT.currency, maxT.balance, this.set_date);
                    }
                } else {
                    balance_total = Number(maxT.balance);
                }
                return balance_total;
            }
        };
    }]);

angular.module('stockService', [])
    // each function returns a promise object 
    .factory('Stocks', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/stocks');
            },
            create: function(stockData) {
                return $http.post('/api/stocks', stockData);
            },
            delete: function(id) {
                return $http.delete('/api/stocks/' + id);
            },
            update: function(pms) {
                var theurl = '/api/stocks/' + pms.id;
                return $http.put(theurl, pms);
            },
            deleteContent: function(id, contentId) {
                return $http.post('/api/stocks/' + id + '/' + contentId);
            }
        };
    }]);
