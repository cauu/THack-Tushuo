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
