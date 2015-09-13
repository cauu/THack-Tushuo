(function () {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('SideMenuController', ['$scope', '$location' ,SideMenuController])
      ;

    function SideMenuController($scope, $location) {
        var registerBeforeSwitchTo = function(target) {
           $location.path(target);
        }
        $scope.onPublishTap= function(event) {
           registerBeforeSwitchTo('/newmarker'); 
        };

        $scope.onMyMsg= function(event) {
            registerBeforeSwitchTo('/mymsg');
        }

        $scope.onMyInsuranceTap= function(event) {
            registerBeforeSwitchTo('/insurance');
        }
        
    }

})();
