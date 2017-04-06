var stockConroller = angular.module('stockController', [])
    .controller('stockController', ['$scope', '$http', '$filter', 'Stocks', 'summary', '$resource', 'getData', function($scope, $http, $filter, Stocks, summary, $resource, getData) {

        $scope.summary = summary;
        var s = summary;
        $scope.showSection = false;
        var today = new Date();

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

        getStockData = function(stock, index) {
            $scope.ticker_name = stock;
            var api = getData.getStockQuote($scope.ticker_name);
            var data = api.get({ symbol: $scope.ticker_name }, function() {
                var quote = data.query.results.quote;
                // make available to summary
                summary.current_stocks_data[index] = quote;
                stock_loop++;
                checkHTTPLoaded();
            });
        };
        // FX
        getFXData = function(currencies, index) {
            $scope.currency_pair = currencies;
            var api = getData.getFX($scope.currency_pair);
            var data = api.get({ symbol: $scope.currency_pair }, function() {
                var rate = data.query.results.rate;
                // make available to summary
                summary.current_stocks_fx[index] = rate;
                fx_loop++;
                checkHTTPLoaded();
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
            summary.current_stocks = [];
            summary.current_stocks_data = [];
            summary.current_stocks_period = [];
            summary.current_stocks_gain = [];
            summary.current_stocks_fx = [];
            summary.current_stocks_calculated = [];
            // categorize as CURRENT, PAST or FUTURE stocks
            angular.forEach($scope.stocks, function(value, index) {
                angular.forEach(value.stock_obj, function(value2, index2) {
                    var is_current = 'past';
                    summary.current_stocks.push(value2);
                    // starts before today
                    if (s.elapsedDays(today, value2.startdate) + 1 > 0) {
                        // ends before today
                        if (s.elapsedDays(today, value2.enddate) + 1 > 0) {} else {
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
                    getStockData(summary.current_stocks[index].ticker, index);
                    getFXData('EUR' + summary.current_stocks[index].currency, index);
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
