(function() {
    'use strict';

    angular
      .module('anti.cheat')
      .factory('CloudMap', CloudMap)
      ;

    CloudMap.$inject = ['$http', '$timeout'];

    function CloudMap($http, $timeout) {
        var KEY = "85d1d9c4bff04a3dfb12b2da06c0b7ad";
        var TABLE_ID = "55f151a5e4b0cc124e139ddf";
        var nearbyMarkers;
        var userPosition;
        var createMarkerObservers = [];

        var notifyMarkerObservers = function() {
            angular.forEach(createMarkerObservers, function(cb) {
                cb();
            });
        };

        var CloudMap = {
            cancelCreate: cancelCreate,
            createMarker: createMarker,
            registerMarkerObserver: registerMarkerObserver,
            setNearbyMarkers: setNearbyMarkers,
            getNearbyMarkers: getNearbyMarkers,
            setUserPosition: setUserPosition,
            getNearestMarker: getNearestMarker,
            agreeMarkerInfo: agreeMarkerInfo,
            disagreeMarkerInfo: disagreeMarkerInfo
        };

        return CloudMap; 

        //J stands for agree, r stands for disagree, z is a parameter
        //z 越大， n对结果的影响越大，p的影响越小
        function welson(j, r, z) {
            var n = j+r;
            var p = j/n;

            var s = (p+z*z/(2*n)) - z*Math.sqrt( (p*(1-p) +z*z/(4*n)) / n)  
            s = s/(1 + z*z/n);
            return s;
        }
        function agreeMarkerInfo(id, agree, cb) {
            return $http.jsonp('http://yuntuapi.amap.com/datamanage/data/update?callback=JSON_CALLBACK',
                               {
                                   params: {
                                       key: KEY,
                                       tableid: TABLE_ID,
                                       data: {
                                           _id: id,
                                           e_agree: agree
                                       }
                                   }
                               })
                      .success(agreeMarkerInfoSuccessFn)
                      .error(agreeMarkerInfoErrorFn);

            function agreeMarkerInfoSuccessFn(data, status, headers, config) {
                cb(agree);
            }
            function agreeMarkerInfoErrorFn(data, status, headers, config) {
            }
        }

        function disagreeMarkerInfo(id, disagree, cb) {
            return $http.jsonp('http://yuntuapi.amap.com/datamanage/data/update?callback=JSON_CALLBACK',
                               {
                                   params: {
                                       key: KEY,
                                       tableid: TABLE_ID,
                                       data: {
                                           _id: id,
                                           e_disagree: disagree
                                       }
                                   }
                               })
                      .success(disagreeMarkerInfoSuccessFn)
                      .error(disagreeMarkerInfoErrorFn);

            function disagreeMarkerInfoSuccessFn(data, status, headers, config) {
                cb(disagree);
            }
            function disagreeMarkerInfoErrorFn(data, status, headers, config) {
            }
        }

        function getNearestMarker() {
            var tempDistance = 9999;
            var tempMarker = null;
            for(var i in nearbyMarkers) {
                console.log('welson', welson(nearbyMarkers[i].e_agree, nearbyMarkers[i].e_disagree, 1)||0);
                if(nearbyMarkers[i]._distance < tempDistance) {
                    tempDistance = nearbyMarkers[i]._distance;
                    tempMarker = nearbyMarkers[i];
                }
            }
            return tempMarker;
        }

        function setUserPosition(position) {
            userPosition = position;
        }

        function setNearbyMarkers(markers, cb) {
            console.log('设置附近的markers', markers);
            if(!!nearbyMarkers) {
                nearbyMarkers = [];
            }
            nearbyMarkers = markers;
            cb(getNearestMarker());
        }

        function getNearbyMarkers() {
            return nearbyMarkers;
        }

        function cancelCreate() {
            notifyMarkerObservers();
        }

        function registerMarkerObserver(cb) {
           createMarkerObservers.push(cb); 
        }
        
        function createMarker(markerInfo, cb) {
            return $http.jsonp('http://yuntuapi.amap.com/datamanage/data/create?callback=JSON_CALLBACK',
                                {
                                 params: markerInfo 
                             })
                      .success(createMarkerSuccessFn)
                      .error(createMarkerErrorFn);

            function createMarkerSuccessFn(data, status, headers, config) {
                cb();
                $timeout(function() {
                    notifyMarkerObservers();
                }, 5000);
            }

            function createMarkerErrorFn(data, status, headers, config) {
                console.error('出错');
                console.log(data,status);
            }
        }
        
    }
})();
