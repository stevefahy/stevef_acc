var stockConroller = angular.module('stockController', [])
    .controller('stockController', ['$scope', '$http', '$filter', 'Stocks', 'summary', '$resource', 'getData', function($scope, $http, $filter, Stocks, summary, $resource, getData) {

        $scope.summary = summary;
        var s = summary;

$scope.ticker_name = 'GOOGL';

     var api = getData.getStockQuote($scope.ticker_name);
     //console.log('api: ' + api);
    var data = api.get({symbol:$scope.ticker_name}, function() {
        var quote = data.query.results.quote;
        $scope.lang = data.query.lang;
        $scope.lastTradeDate = quote.LastTradeDate;
        $scope.lastTradeTime = quote.LastTradeTime;
        $scope.lastTradePriceOnly = quote.LastTradePriceOnly;

        $scope.Name = quote.Name;
        $scope.symbol = quote.symbol;
    });

  
  /*
$scope.googleFinance = $resource('https://finance.google.com/finance/info', 
                                     {client:'ig', callback:'JSON_CALLBACK'},
                                     {get: {method:'JSONP', params:{q:'googl'}, isArray: true}});
                                     

$scope.indexResult = $scope.googleFinance.get();
*/



        // GET =====================================================================
        // when landing on the page, get all cgts and show them
        // use the service to gallet  the todos
        Stocks.get()
            .success(function(data) {
                $scope.stocks = data;
                $scope.loading = false;
                //getCgt();
            });

         // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createStock = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            /*
            if ($scope.cgt_obj.rate !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object);
                Cgts.create($scope.cgt_obj)
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.cgts = data; // assign our new list of todos
                    });
            }
            */
        };
        // UPDATE ==================================================================
        // when submitting the update form, send the text to the node API
        $scope.updateStock = function(id, cgt_obj) {
        	/*
            var pms = { 'id': id, 'cgt_obj': cgt_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (cgt_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Cgts.update(pms)
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.cgts = data; // assign our new list of todos
                    });
            }
            */
        };
        // ADD =====================================================================
        $scope.addStock = function(id, cgt) {
        	/*
            var pms = { 'id': id, 'cgt_obj': $scope.cgt_obj };
            pms.cgt_obj.startdate = new Date(pms.cgt_obj.startdate).toISOString();
            pms.cgt_obj.enddate = new Date(pms.cgt_obj.enddate).toISOString();
            var newcgt = cgt.cgt_obj.push(pms.cgt_obj);
            pms = { 'id': id, 'cgt_obj': cgt.cgt_obj };
            // validate the text to make sure that something is there
            // if text is empty, nothing will happen
            if (cgt.cgt_obj !== undefined) {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Cgts.update(pms)
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.cgts = data; // assign our new list of todos
                    });
            }
            */
        };
        // DELETE ==================================================================
        // delete a todo after checking it
        $scope.deleteStock = function(id) {
        	/*
            $scope.loading = true;
            Cgts.delete(id)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.cgts = data; // assign our new list of todos
                });
                */
        };
        // DELETE SUB CGT =======================================================
        $scope.deleteContent = function(id, contentId) {
        	/*
            Cgts.deleteContent(id, contentId)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.cgts = data; // assign our new list of todos
                });
                */
        };


    }]);
