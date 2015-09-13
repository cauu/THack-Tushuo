(function() {
    'use strict';

    angular.module('anti.cheat', [
        //Third-party module
        'ui.router',
        'ngAnimate',
        'angular-carousel',
        'hmTouchEvents',
        'angular-md5',
        'base64',
        'ngCookies',
        'ui.bootstrap',

        //Foundation module
        'foundation',
        'foundation.dynamicRouting',
        'foundation.dynamicRouting.animations',
        //My modules
        'anti.cheat.services',
        'anti.cheat.directives',
        'anti.cheat.controllers'
    ])
      .config(config)
      .run(run)
    ;

    config.$inject = ['$urlRouterProvider', '$locationProvider'];

    function config($urlProvider, $locationProvider) {
        console.log('config is called');
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
          enabled:false,
          requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }

    function run() {
        FastClick.attach(document.body);
    }
})();

(function () {
    'use strict';

    angular
      .module('anti.cheat.controllers', [])
      ;
})();

(function () {
    'use stric';

    angular
      .module('anti.cheat.directives', [])
      ;
})();


(function() {
    'use strict';

    angular
      .module('anti.cheat.services', [])
      ;
      //.constant('host', 'my-host-name');

})();

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

(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('aMapController', ['$scope','$location', '$timeout', 'CloudMap', aMapController])
      ;

    function aMapController($scope, $location, $timeout, CloudMap) {
        $scope.mapOptions = {
            center: { x:100, y:30 },
            zoom: 3,
            resizeenable: true,
            lang: 'zh_cn',
            mapStyle: 'normal',
            features: ['bg', 'road'],
        }

        $scope.infoIsInit = false;
        $scope.currMarkerInfo = {};

        var isFirstLogin = true;
        var currLocation;
        var clickStart;
        var clickEnd;
        var tempMarker;
        var markers = [];
        var clearTempMarker = function() {
            if(!!markers) {
                for(var i in markers) {
                    markers[i].setMap(null);
                }
                markers = [];
            }
            if(!!tempMarker) {
                tempMarker.setMap(null);
            }
            tempMarker = null;
            //map.clearMap();
        }
        var addTempMarker = function(lng, lat) {
            console.log('add temp');
            if(!!tempMarker) {
               tempMarker.setMap(null); 
            }
            tempMarker = new AMap.Marker({               
                            position:new AMap.LngLat(lng, lat),
                            draggable: true,
                            icon: new AMap.Icon({
                                imageSize:new AMap.Size(162, 60),
                                size: new AMap.Size(162, 60),
                                image: "./img/locate.png" 
                            })
                        });
            tempMarker.setMap(map);  //在地图上添加点
            tempMarker.on('click', function(e) {
                if(!circle.contains(e.lnglat)) {
                    return;
                }
                $scope.$apply(function() {
                    $location.path('/newmarker').search({
                        lng: e.lnglat.lng,
                        lat: e.lnglat.lat
                    });
                });
            });
        }
        
        $scope.mapEvents = {
            'touchend': function(event) {
               // if(Date.now()-clickStart > 1000) {
               //     addTempMarker(event.lnglat.lng, event.lnglat.lat);
               //     /*
               //     $scope.$apply(function() {
               //         $location.path('/newmarker').search({
               //             lng: event.lnglat.lng,
               //             lat: event.lnglat.lat
               //         });
               //     });
               //     */
               // }
            },
            'touchstart': function(event) {
                //clickStart = Date.now();
                if($scope.infoIsInit) {
                    $scope.$apply(function() {
                        $scope.infoIsInit = false;
                    });
                }
            },
            'mouseup': function(event) {
               // if(Date.now()-clickStart > 1000) {
               //     addTempMarker(event.lnglat.lng, event.lnglat.lat);
               // }
            },
            'mousedown': function(event) {
                //clickStart = Date.now();
                if($scope.infoIsInit) {
                    $scope.$apply(function() {
                        $scope.infoIsInit = false;
                    });
                }
            },
            'moveend': function() {
                if(!!tempMarker) {
                    return;
                }
                cloudSearch();
            }
        };

        /*
        $scope.$watch(function() {
            return CloudMap.getNearestMarker();
        }, function(newValue, oldValue) {
            console.log('最近的marker是', newValue);
            if(!!newValue) {
                console.log('最近的marker是', newValue);
            }
        });
        */

       var lastPos; 
       var circle;

       function drawCircle(center) {
           if(!circle) {
               circle = new AMap.Circle({
                   map: map,
                   center: center,
                   radius: 200,
                   strokeColor: '#FFF6CC',
                   strokeOpacity: 0.8,
                   strokeWeight: 0,
                   fillColor: '#FFF6CC',
                   fillOpacity: 0.6
               });
               circle.on('mouseup', function(event) {
                    if(Date.now()-clickStart > 1000) {
                        addTempMarker(event.lnglat.lng, event.lnglat.lat);
                    }
               });
               circle.on('mousedown', function(event) {
                   clickStart = Date.now();
               }); 
               circle.on('touchstart', function(event) {
                   clickStart = Date.now();
               });
               circle.on('touchend', function(event) {
                    if(Date.now()-clickStart > 1000) {
                        addTempMarker(event.lnglat.lng, event.lnglat.lat);
                    }
               });
           }
           else {
               circle.setCenter(center);
           }
       }

        function onComplete(data) {
            console.log('用户正在移动', data, map.getZoom());
            drawCircle(data.position);
            currLocation = data.position;
            //map.setZoom(17);
            if(isFirstLogin) {
                isFirstLogin = !isFirstLogin;
                map.setZoomAndCenter(17, data.position);
            }
            CloudMap.setUserPosition(data.position);
            cloudSearchNearby(data.position, 300, function(marker){
                console.log('最近的marker是', marker);
                if(!lastPos) {
                    lastPos = data.position;
                    $timeout(function(){
                       $scope.$apply(function() {
                           console.log(marker.e_title);
                           $location.path('/notification');
                       });
                    }, 5000);
                }
                else {
                   console.log(marker.e_title);
                   console.log(lastPos.distance(data.position));
                   if(lastPos.distance(data.position) > 50) {
                       $scope.$apply(function() {
                           console.log(marker.e_title);
                           $location.path('/notification');
                       });
                   }
                }
            });
        }

        function onError(data) {
            console.log('出错', data);
        }

        $scope.mapPlugins= {
            'AMap.Geolocation': function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: false//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                map.addControl(geolocation);
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            　  geolocation.getCurrentPosition(); //启动定位
                //TODO:定位流程
                geolocation.watchPosition();
            }
        };

        var map;

        var initPlugins = function() {
            for(var p in $scope.mapPlugins) {
                map.plugin(p, $scope.mapPlugins[p]);
            }
        };
        
        var initEventListeners = function() {
            for(var e in $scope.mapEvents) {
                map.on(e, $scope.mapEvents[e]);
            }
        };

        function addMarker(i, d) {
            var lngX = d._location.getLng();
            var latY = d._location.getLat();
            var image = d.e_type + '-' + d.e_name + '.png';
            var markerExtra = {
                e_name: d.e_name,
                e_type: d.e_type,
                e_description: d.e_description,
                e_hot: d.e_hot
            };
            var markerOption = {
                map: map,
                //icon: "./img/" + image,
                icon: new AMap.Icon({
                    imageSize:new AMap.Size(28,28),
                    size: new AMap.Size(28,28),
                    image: "./img/" + image
                }),
                offset: new AMap.Pixel(-20, -30),
                position: [lngX, latY],
                extData: markerExtra
            };
            var mar = new AMap.Marker(markerOption);
            mar.setLabel({
                offset: new AMap.Pixel(d._name.length<=2?-2:-10,30),
                content: d._name 
            });
            markers.push(mar);
            AMap.event.addListener(mar, 'click', function(e) {
                console.log('click marker', $scope.infoIsInit);
                $scope.$apply(function() {
                    if(!$scope.infoIsInit) {
                        $scope.infoIsInit = true;
                    }
                    $scope.currMarkerInfo = d;
                    console.log('marker info ',d);
                });
            });
        }


        function cloudSearchCb(data) {
            var resultArr = data.datas;
            var resultNum = resultArr.length;
            for(var i=0; i<resultNum; i++) {
                addMarker(i, resultArr[i]);
            }
        }

        function cloudSearchNearby(center, radius, cb) {
            var search;
            map.plugin(['AMap.CloudDataSearch'], function() {
                search = new AMap.CloudDataSearch('55f151a5e4b0cc124e139ddf');
                search.searchNearBy(center, radius, function(status, result) {
                    if(status == 'complete' && result.info === 'OK') {
                        CloudMap.setNearbyMarkers(result.datas, cb);
                    }
                });
            });
        }

        //加载云图层插件：显示当前地图上的所有marker
        function cloudSearch() {   
            var curView = map.getBounds();
            clearTempMarker();
            var arr = new Array();
            arr.push([curView.getSouthWest().lng, curView.getSouthWest().lat]);
            arr.push([curView.getNorthEast().lng, curView.getNorthEast().lat]);
            var search;

            map.plugin(['AMap.CloudDataSearch'], function () {
        　　　　search = new AMap.CloudDataSearch('55f151a5e4b0cc124e139ddf'); //实例化云图层类
                search.searchInPolygon(arr, function(status, result){
                    if(status === 'complete' && result.info === 'OK') {
                        cloudSearchCb(result);
                    }
                });          
            });
        }

        $scope.showExtra = false;
        $scope.toggleStyle = "{transform: rotate(8deg)}";
        $scope.onExtraToggle = function(event) {
            $scope.showExtra = !$scope.showExtra;
        }

        $scope.onRefreshTap = function(event) {
            cloudSearch();
        }

        $scope.onLocateTap = function(event) {
            map.setCenter(currLocation);
        }

        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;

            initPlugins();

            initEventListeners();

            CloudMap.registerMarkerObserver(cloudSearch);

            //addMarker();
        });
    }
})();

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

(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('NotificationController',['$scope', '$location', NotificationController]);

    function NotificationController($scope, $location) {
        $scope.info = $location.search('info');
    }

})();

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

(function() {
    'use strict';

    angular
      .module('anti.cheat.controllers')
      .controller('TestController', ['$scope','$location', TestController]);

    function TestController($scope, $location) {
        $scope.gotoMarker = function() {
            $location.path('/newmarker');
        }
    }
})();

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


(function () {
    'use strict';

    angular
      .module('anti.cheat.directives')
      .directive('iuSearchBox', iuSearchBox)
      ;

    function iuSearchBox() {
        var linkFunc = function(scope, element, attr) {
            scope.selfieURL = "";
            scope.bgColor = '#d3d3d3';
        };
        
        var directive = {
            restrict: 'AE',
            replace: true,
            templateUrl: '../../template/searchbox.html',
            scope: {
                value: "=",
                hasLoggedIn: "="
            },
            link: linkFunc
        }

        return directive;
    }
})();

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

