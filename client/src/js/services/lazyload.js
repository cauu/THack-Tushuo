(function(){
    'use strict';

    angular
      .module('anti.cheat.services')
      .service('lazyLoadApi', ['$window', '$q', function lazyLoadApi($window, $q) {
          function loadScript() {
            console.log('loadScript');
            // use global document since Angular's $document is weak
            var s = document.createElement('script');
            s.src = 'http://webapi.amap.com/maps?v=1.3&key=6d843e041b09f1bf61403cc8226ef669&callback=initMap';
            document.body.appendChild(s);
          }
          var deferred = $q.defer();

          $window.initMap = function () {
            deferred.resolve();
          }

          console.log('lazyload is called');
          if ($window.attachEvent) {
            $window.attachEvent('onload', loadScript);
          } else {
            console.log('attachEvent addEventListener');
//            $window.onload = loadScript;
            $window.addEventListener('load', loadScript, false);
          }

          return deferred.promise;
      }]);
})();
