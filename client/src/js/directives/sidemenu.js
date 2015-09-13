(function() {
    'use strict';

    angular
      .module('anti.cheat.directives')
      .directive('iuSideMenu', ['$location',iuSideMenu])
      ;
    
   function iuSideMenu($location) {
       var linkFunc = function(scope, element, attr) {
           var menu =element[0].children[0].children[0];
           var SWIPE_OUT_MIN_VELOCITY = 1; 

           scope.onSwipe = function onSwipe(event) {
               if(!!element.find(event.target)) {
                   if(event.velocityX > SWIPE_OUT_MIN_VELOCITY) {
                       $location.path('/');
                       return;
                   }
                   var x = event.center.x - menu.offsetWidth/2;
                   if(x > 0) {
                       return;
                   }
                   else {
                       element.children().css({
                           'left': x+'px' 
                       });
                   }
               }
           };

           scope.onSwipeEnd = function onSwipeEnd(event) {
               var left = element.children().css('left').match(/-\d+/);
               if(!!left && left[0] < -menu.offsetWidth/3) {
                   $location.path('/');
               }
               else {
                   element.children().css({
                       'left': '0px'
                   });
               }
           };
           
       };

       var directive = {
           restrict: 'AE',
           templateUrl: '../../template/sidemenu.html',
           link: linkFunc
       };
       return directive;
   }
})();
