(function() {
  'use strict';

  angular
    .module('anti.cheat.directives')
    .directive('aMap', ['lazyLoadApi', aMap])
    ;

  var initMap = function(scope, element) {
      var map = new AMap.Map('map-container',{
          view: new AMap.View2D({
              center:new AMap.LngLat(scope.mapOptions.center.x,scope.mapOptions.center.y),
              zoom: scope.mapOptions.zoom || 3
          }),
          resizeenable: scope.mapOptions.resizeenable,
          lang: scope.mapOptions.lang
      });

      map.setMapStyle(scope.mapOptions.mapStyle || 'fresh');
      map.setFeatures(scope.mapOptions.features || ['bg']);
      map.setFitView();
      
      return map;
  }

  
  function aMap(lazyLoadApi) {
      var map;
      /*
      var renderMarker = function(map, markerInfo, scope) {
            var markerIcon;
            markerIcon = "./img/pins/"+markerInfo.name+".png";
            console.log(markerIcon);

            var markerOption = {
              map:map,
              icon:new AMap.Icon({
                      imageSize:new AMap.Size(40,50),
                      image:markerIcon,
                      size:new AMap.Size(40,57)
              }),
              position:new AMap.LngLat(markerInfo.longi, markerInfo.lati),
              offset:new AMap.Pixel(-20,-57)
            };

            var marker = new AMap.Marker(markerOption);

            marker.setExtData({ name:markerInfo.name });

            AMap.event.addListener(marker, "click", function(e){
                var markerName = marker.getExtData().name;

                scope.$emit('showPlan', markerName);
            });

            marker.setMap(map);
      };
      */

      var linkFunc = function(scope, element, attrs, ctrl) {
          scope.init = function() {
              map = initMap(scope, element); 

              map.on('complete', function() {
                  scope.$emit('mapInitialized', map);
              });

          };
           // Loads google map script
          console.log('map linkfn is called');
          lazyLoadApi.then(function () {
                // Promised resolved
                scope.init();
              }, function () {
                // Promise rejected
          });
      };

      var directive = {
         restrict: 'AE',
         replace: true,

         scope: {
             mapOptions: '=',
             mapMarkers: '=',
             mapEvents: '=',
             mapPlugins: '='
         },

         template: '<div id="map-container" style="width:100%;height:100%"></div>',
         link: linkFunc
      };
      return directive;
  }
})();
