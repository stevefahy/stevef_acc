angular.module('accountPage', ['taxController', 'taxService', 'accountController', 'accountService', 'accountPageController', 'accountPageService', 'stockController', 'stockService', 'historyController', 'historyService', 'ngResource'])

.service('getData', ['$http', '$resource', function($http, $resource) {
    // The complete url is from https://developer.yahoo.com/yql/.
    // STOCK
    this.getStockQuote = function(ticker) {
        var url = 'https://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.quotes where symbol in ('" + ticker + "')");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    };
    // STOCK HISTORICAL
    this.getStockQuoteHistory = function(ticker, date) {
        var url = 'https://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.historicaldata where symbol = '" + ticker + "' and startDate = '" + date + "' and endDate = '" + date + "'");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    };
    // FX
    this.getFX = function(currencies) {
        var url = 'https://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.xchange where pair in ('" + currencies + "')");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    };
    // FX HISTORICAL
    this.getFXhistory = function(currency, date) {
        var url = 'https://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.historicaldata where symbol = '" + currency + "=X' and startDate ='" + date + "' and endDate = '" + date + "'");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    };
}]);
//https://developer.yahoo.com/yql/console/?q=show%20tables&env=store://datatables.org/alltableswithkeys#h=select+*+from+yahoo.finance.xchange+where+pair+in+(%22USDEUR%22)
//https://developer.yahoo.com/yql/console/?q=show%20tables&env=store://datatables.org/alltableswithkeys#h=select+*+from+yahoo.finance.historicaldata+where+symbol++++%3D+%22AAPL%22+and++++startDate+%3D+%222017-04-04%22+and++++endDate+++%3D+%222017-04-04%22
// Historical FX
//https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22EUR%3DX%22%20and%20startDate%20%3D%20%222017-03-17%22%20and%20endDate%20%3D%20%222017-03-17%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
