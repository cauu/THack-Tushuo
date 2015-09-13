(function() {
    'use strict';

    angular
      .module('anti.cheat.directives')
      .directive('infoPanel', ['CloudMap', infoPanel]);

   function infoPanel(CloudMap) {
       var linkFunc = function(scope, element, attrs, ctrl) {
            var planContainer= angular.element(element.children()[0]);
            var isFull = false;
            var stopPropagation = false;

            scope.$watch('isInit', function(newValue, oldValue) {
                console.log('isInit is change', scope.isInit);
                if(scope.isInit == true) {
                    /*
                    $(planContainer).animate({
                        right: '+=100%'
                    });
                    */
                   updateProgressBar();
                }
            });

            scope.$watch(function() {
                return scope.markerInfo._id;
            }, function(newvalue, oldvalue) {
                updateProgressBar();
            });

            scope.onToggle= function(e) {
                if(!!stopPropagation) {
                    stopPropagation = false;
                    return ;
                }
                var showAll = function() {
                    $(planContainer).animate({
                        bottom: '+=14.3rem'
                    });
                };
                var hideAll = function() {
                    $(planContainer).animate({
                        bottom: '-=14.3rem'
                    });
                }
                isFull = !isFull;
                !!isFull? showAll():hideAll();
            }

            scope.onAgree= function(event) {
                CloudMap.agreeMarkerInfo(scope.markerInfo._id, 
                                         scope.markerInfo.e_agree + 1, 
                                         function(agree) {
                                             scope.markerInfo.e_agree = agree; 
                                             updateProgressBar();
                                         });
                stopPropagation = true;
            };

            scope.onDisagree = function(event) {
                CloudMap.disagreeMarkerInfo(scope.markerInfo._id, 
                                         scope.markerInfo.e_disagree + 1, 
                                         function(disagree) {
                                             scope.markerInfo.e_disagree = disagree; 
                                             updateProgressBar();
                                         });
                stopPropagation = true;
            };
            
           function updateProgressBar() {
               scope.agreeWidth = scope.markerInfo.e_agree/(scope.markerInfo.e_disagree + scope.markerInfo.e_agree) * 100 ;
               scope.disagreeWidth = 100 -scope.agreeWidth; 
               scope.agreeRate = Math.round(scope.markerInfo.e_agree/(scope.markerInfo.e_disagree + scope.markerInfo.e_agree) * 100);
               scope.disagreeRate = 100 - scope.agreeRate;
           }

           updateProgressBar();
       };

       var directive = {
           restrict: 'AE',
           templateUrl: '../../template/bottompanel.html',
           scope: {
               isInit: "=",
               markerInfo: "="
           },
           link: linkFunc
       }
       return directive;
   }
})();
