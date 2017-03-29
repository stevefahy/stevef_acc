angular.module('accountPage', ['cgtController', 'cgtService', 'accountController', 'accountService', 'accountPageController', 'accountPageService', 'stockController', 'stockService', 'ngResource'])

.service('getData', ['$http', '$resource', function($http, $resource) {
    // This service method is not used in this example.
    this.getJSON = function(filename) {
        return $http.get(filename);
    };
    // The complete url is from https://developer.yahoo.com/yql/.
    this.getStockQuote = function(ticker) {

        var url = 'https://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.quotes where symbol in ('" + ticker + "')");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    };
}]);
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