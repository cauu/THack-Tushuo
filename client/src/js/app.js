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
