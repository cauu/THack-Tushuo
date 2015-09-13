(function () {
    'use strict';

    angular
      .module('anti.cheat.directives')
      .directive('iuSearchBox', iuSearchBox)
      ;

    function iuSearchBox() {
        var linkFunc = function(scope, element, attr) {
            scope.selfieURL = "";
            scope.bgColor = '#d3d3d3';
        };
        
        var directive = {
            restrict: 'AE',
            replace: true,
            templateUrl: '../../template/searchbox.html',
            scope: {
                value: "=",
                hasLoggedIn: "="
            },
            link: linkFunc
        }

        return directive;
    }
})();
