angular.module('accountPage', ['cgtController', 'cgtService', 'accountController', 'accountService', 'accountPageController', 'accountPageService']);

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