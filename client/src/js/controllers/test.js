(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('TestController', ['$scope','$location', TestController]);

    function TestController($scope, $location) {
        $scope.gotoMarker = function() {
            $location.path('/newmarker');
        }
    }
})();
