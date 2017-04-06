angular.module('accountPage', ['taxController', 'taxService', 'accountController', 'accountService', 'accountPageController', 'accountPageService', 'stockController', 'stockService', 'ngResource'])

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
    // FX
    this.getFX = function(currencies) {
        var url = 'https://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.xchange where pair in ('" + currencies + "')");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    };
}]);
//https://developer.yahoo.com/yql/console/?q=show%20tables&env=store://datatables.org/alltableswithkeys#h=select+*+from+yahoo.finance.xchange+where+pair+in+(%22USDEUR%22)
/*
angular.module('accountPage').directive('test', function ($compile) {
    return {
         restrict: 'E',
        scope: {
            text: '@'
        },
        template: '<p ng-click="add()">steve</p>',
        controller: function ($scope, $element) {
            $scope.add = function () {
                var el = $compile("<test text='n'></test>")($scope);
                $element.parent().append(el);
            };
        }
    };
});
*/
