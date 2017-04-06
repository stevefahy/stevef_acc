var accountPageController = angular.module('accountPageController', [])
    .controller('accountPageController', ['$scope', 'summary', function($scope, summary) {
        $scope.summary = summary;
    }]);
