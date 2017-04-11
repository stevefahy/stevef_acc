var stockConroller = angular.module('stockController', [])
    .controller('stockController', ['$scope', '$http', '$filter', 'Stocks', 'summary', '$resource', 'getData', function($scope, $http, $filter, Stocks, summary, $resource, getData) {

        $scope.summary = summary;
        var s = summary;
        $scope.showSection = false;
        var today = summary.set_date;

        $scope.$on("dateChanged", function(event) {
            getStockBrief();
        });

        $scope.stock_obj = {
            ticker: 'Ticker',
            price: 0,
            currency: 'currency',
            forex: 0,
            amount: 0,
            fee: 0,
            startdate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
            enddate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
        };

        $scope.checkEuro = function(x) {
            if (x == 'EUR') {
                return true;
            } else {
                return false;
            }
        };
        // STOCK
        var stock_loop = 0;
        var fx_loop = 0;
        var stock_loop_total = 0;
        var fx_loop_total = 0;

        // STOCK
        getStockData = function(stock, index) {
            $scope.ticker_name = stock;
            var api = getData.getStockQuote($scope.ticker_name);
            var data = api.get({ symbol: $scope.ticker_name }, function() {
                if (data.query.results.quote.LastTradePriceOnly !== null) {
                    var quote = data.query.results.quote;
                    // make available to summary
                    summary.current_stocks_data[index] = quote;
                    stock_loop++;
                    checkHTTPLoaded();
                } else {
                    console.log('error loading stock');
                }
            });
        };
        // STOCK HISTORY
        getStockDataHistory = function(stock, date, index) {
            $scope.ticker_name = stock;
            var api = getData.getStockQuoteHistory($scope.ticker_name, date);
            var data = api.get({ symbol: $scope.ticker_name }, function() {
                if (data.query.results !== null) {
                    var quote = data.query.results.quote;
                    // adjust
                    var new_object = JSON.parse(JSON.stringify(quote));
                    new_object.LastTradePriceOnly = new_object.Adj_Close;
                    // make available to summary
                    summary.current_stocks_data[index] = new_object;
                    stock_loop++;
                    checkHTTPLoaded();
                } else {
                    console.log('no stock for this date');
                    stock_loop_total--;
                }
            });
        };
        // FX HISTORY
        getFXDataHistory = function(currency, date, index) {
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
                            // adjust
                            var new_object = JSON.parse(JSON.stringify(data2.query.results.quote));
                            new_object.Rate = rate1 / rate2;
                            // make available to summary
                            summary.current_stocks_fx[index] = new_object;
                            fx_loop++;
                            checkHTTPLoaded();
                        });
                    } else {
                        // make available to summary
                        // adjust Object
                        var new_object = JSON.parse(JSON.stringify(data1.query.results.quote));
                        new_object.Rate = rate1;
                        summary.current_stocks_fx[index] = new_object;
                        fx_loop++;
                        checkHTTPLoaded();
                    }
                } else {
                    console.log('no currency for this date');
                    fx_loop_total--;
                }
            });
        };
        // FX
        getFXData = function(currencies, index) {
            $scope.currency_pair = currencies;
            var api = getData.getFX($scope.currency_pair);
            var data = api.get({ symbol: $scope.currency_pair }, function() {
                if (isNaN(data.query.results.rate.Rate) === false) {
                    var rate = data.query.results.rate;
                    // make available to summary
                    summary.current_stocks_fx[index] = rate;
                    fx_loop++;
                    checkHTTPLoaded();
                } else {
                    console.log('error loading fx');
                }
            });
        };
        checkHTTPLoaded = function() {
            if (stock_loop > 0 && stock_loop === stock_loop_total && fx_loop === fx_loop_total) {
                stock_loop = 0;
                fx_loop = 0;
                stock_loop_total = 0;
                fx_loop_total = 0;
                calculateStockTotals();
            }
        };

        calculateStockTotals = function() {
            var cur;
            var orig;
            var perecent_increase;
            for (var l = 0; l < summary.current_stocks_period.length; l++) {
                if (summary.current_stocks_period[l] == 'current') {
                    cur = ((summary.current_stocks_data[l].LastTradePriceOnly * summary.current_stocks[l].amount) / summary.current_stocks_fx[l].Rate) - summary.current_stocks[l].fee;
                    orig = (summary.current_stocks[l].price * summary.current_stocks[l].amount) / summary.current_stocks[l].forex;
                    perecent_increase = (cur - orig) / orig * 100;
                    summary.current_stocks_gain.push({
                        ticker: summary.current_stocks[l].ticker,
                        gain: summary.calculateTAX(summary.tax_rate_CGT, ((((summary.current_stocks_data[l].LastTradePriceOnly * summary.current_stocks[l].amount) / summary.current_stocks_fx[l].Rate) - ((summary.current_stocks[l].price * summary.current_stocks[l].amount) / summary.current_stocks[l].forex)) - summary.current_stocks[l].fee)),
                        percent_gain: perecent_increase,
                        original_value: (summary.current_stocks[l].price * summary.current_stocks[l].amount) / summary.current_stocks[l].forex
                    });
                }
            }
            summary.current_stocks_gain_total = 0;
            for (var g in summary.current_stocks_gain) {
                summary.current_stocks_gain_total += summary.current_stocks_gain[g].original_value + summary.current_stocks_gain[g].gain;
            }
        };
        // GET =====================================================================
        // when landing on the page, get all stocks and show them
        // use the service to gallet  the stocks
        Stocks.get()
            .success(function(data) {
                $scope.stocks = data;
                $scope.loading = false;
                getStockBrief();
            });

        getStockBrief = function() {
            stock_loop_total = 0;
            fx_loop_total = 0;
            summary.current_stocks = [];
            summary.current_stocks_data = [];
            summary.current_stocks_period = [];
            summary.current_stocks_gain = [];
            summary.current_stocks_fx = [];
            summary.current_stocks_calculated = [];
            // categorize as CURRENT, PAST or FUTURE stocks
            angular.forEach($scope.stocks, function(value, index) {
                angular.forEach(value.stock_obj, function(value2, index2) {
                    // Use this loop to format hte date so that it will display in the HTML5 input type date picker
                    value2.startdate = $filter('date')(new Date(value2.startdate), "yyyy-MM-dd");
                    value2.enddate = $filter('date')(new Date(value2.enddate), "yyyy-MM-dd");
                    var is_current = 'past';
                    summary.current_stocks.push(value2);
                    // starts before today
                    if (s.elapsedDays(today, value2.startdate) + 1 > 0) {
                        // ends before today
                        if (s.elapsedDays(today, value2.enddate) + 1 > 0) {
                            //
                        } else {
                            // ends after today (and starts before today - current period)
                            is_current = 'current';
                        }
                    } else {
                        // future start date
                        summary.current_stocks_period.push('future');
                    }
                    summary.current_stocks_period.push(is_current);
                    stock_loop_total++;
                    fx_loop_total++;
                    if ((new Date(summary.set_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))) {
                        // Todays data
                        getStockData(summary.current_stocks[index].ticker, index);
                        getFXData('EUR' + summary.current_stocks[index].currency, index);
                    } else {
                        // Historical data
                        getStockDataHistory(summary.current_stocks[index].ticker, summary.set_date, index);
                        getFXDataHistory(summary.current_stocks[index].currency, summary.set_date, index);
                    }
                });
            });
        };
        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createStock = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.stock_obj.ticker !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object);
                Stocks.create($scope.stock_obj)
                    // if successful creation, call our get function to get all the new stocks
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.stocks = data; // assign our new list of stocks
                        getStockBrief();
                    });
            }

        };
        // UPDATE ==================================================================
        // when submitting the update form, send the text to the node API
        $scope.updateStock = function(id, stock_obj) {
            var pms = { 'id': id, 'stock_obj': stock_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (stock_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Stocks.update(pms)
                    // if successful creation, call our get function to get all the new stocks
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.stocks = data; // assign our new list of stocks
                        getStockBrief();
                    });
            }
        };
        // ADD =====================================================================
        $scope.addStock = function(id, stock) {
            var pms = { 'id': id, 'stock_obj': $scope.stock_obj };
            pms.stock_obj.startdate = new Date(pms.stock_obj.startdate).toISOString();
            pms.stock_obj.enddate = new Date(pms.stock_obj.enddate).toISOString();
            var newstock = stock.stock_obj.push(pms.stock_obj);
            pms = { 'id': id, 'stock_obj': stock.stock_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (stock.stock_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Stocks.update(pms)
                    // if successful creation, call our get function to get all the new stocks
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.stocks = data; // assign our new list of stocks
                        getStockBrief();
                    });
            }
        };
        // DELETE ==================================================================
        // delete a stock after checking it
        $scope.deleteStock = function(id) {
            $scope.loading = true;
            Stocks.delete(id)
                // if successful creation, call our get function to get all the new stocks
                .success(function(data) {
                    $scope.loading = false;
                    $scope.stocks = data; // assign our new list of stocks
                    getStockBrief();
                });
        };
        // DELETE SUB STOCK =======================================================
        $scope.deleteContent = function(id, contentId) {
            Stocks.deleteContent(id, contentId)
                // if successful creation, call our get function to get all the new stocks
                .success(function(data) {
                    $scope.loading = false;
                    $scope.stocks = data; // assign our new list of stocks
                    getStockBrief();
                });
        };
    }]);
