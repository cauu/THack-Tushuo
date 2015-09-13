(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('MarkerController', MarkerController)
      ;

   MarkerController.$inject = ['$scope', '$location', 'CloudMap'];

   function MarkerController($scope, $location, CloudMap) {
       var EVENTS= {
           'money': '金钱诈骗',
           'safety': '人身安全',
           'quality': '质量问题',
           'others': '其他危险'
       };
       console.log($location.search().lng);
       $scope.close = function(event) {
           console.log('close');
           CloudMap.cancelCreate();
           $location.path('/').search({});
       };

       $scope.publish = function(event) {
          CloudMap.createMarker({
              'key': '85d1d9c4bff04a3dfb12b2da06c0b7ad',
              'tableid': '55f151a5e4b0cc124e139ddf',
              'data': {
                  '_location': $location.search().lng + ',' + $location.search().lat,  
                  'e_name': $scope.eventName,
                  '_name': EVENTS[$scope.eventName],
                  'e_title': $scope.eventTitle,
                  'e_type': $scope.eventType,
                  'e_description': $scope.eventDescription,
                  'e_agree': 0,
                  'e_disagree': 0
              }
          }, function() {
              //$scope.close();
              $location.path('/success').search({});
          });
       };

       $scope.eventType = 1;
       $scope.eventName = 'money';
       $scope.eventTitle = '';
       $scope.eventDescription = '';
       $scope.textAreaStyle = "";
       $scope.onTextAreaTap = function(event) {
           console.log('text area clicked');
           if($scope.textAreaStyle == "") {
               $scope.textAreaStyle = "height: 6rem;border:0.05rem solid #e5e5e5;padding-top:0.2rem";
           }
           /*
           else {
               $scope.textAreaStyle = "height: 2.2rem";
           }
           */
           console.log($scope.textAreaStyle);
       }
       
   }
})();
