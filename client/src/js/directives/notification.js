(function() {
    'use strict';

    angular
      .module('anti.cheat.directives')
      .directive('notification', ['$location', '$interval', notification]); 

    function notification($location, $interval) {
       var linkFunc = function(scope, element, attr) {
           var WEEK_NAME = [
               '星期天',
               '星期一',
               '星期二',
               '星期三',
               '星期四',
               '星期五',
               '星期六'
           ];
           var menu =element[0].children[0];
           var SWIPE_OUT_MIN_VELOCITY = 1; 
           var currTime = new Date;

           var updateTime = function() {
               currTime = new Date();
               scope.time = currTime.getHours() + ':' + currTime.getMinutes(); 
               scope.date = currTime.getMonth() + '月' + currTime.getDate();
               scope.weekday = WEEK_NAME[currTime.getDay()];
           }

           updateTime();
           $interval(function() {
               updateTime();
           }, 30000);
           
           scope.onSwipe = function onSwipe(event) {
               console.log('event', event);
               if(!!element.find(event.target)) {
                   if(event.direction == 4 &&event.velocityX > SWIPE_OUT_MIN_VELOCITY) {
                       $location.path('/');
                       return;
                   }
                   if(event.deltaX < -10) {
                       return;
                   }
                   else {
                       element.children().css({
                           'left': event.deltaX +'px' 
                       });
                   }
               }
           };

           scope.onSwipeEnd = function onSwipeEnd(event) {
               console.log(element.children());
               var left = element.children().css('left').match(/(|-)\d+/);
               //var right = element.children().css('right').match(/-\d+/);
               console.log('left is', left);
               if(!!left && left[0] > menu.offsetWidth/3) {
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
           templateUrl: '../../template/notification.html',
           link: linkFunc
       };
       return directive;
        
    }
})();

