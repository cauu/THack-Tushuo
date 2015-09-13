(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('NotificationController',['$scope', '$location', NotificationController]);

    function NotificationController($scope, $location) {
        $scope.info = $location.search('info');
    }

})();
