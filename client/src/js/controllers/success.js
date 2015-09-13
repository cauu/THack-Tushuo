(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('SuccessController', SuccessController);

    SuccessController.$inject = ['$scope', '$location'];

    function SuccessController($scope, $location) {
        $scope.close = function() {
            $location.path('/');
        }
    }
})();
