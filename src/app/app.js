/**
* angular-starter-kit
*
* @author Andrea SonnY <andreasonny83@gmail.com>
* @copyright 2016 Andrea SonnY <andreasonny83@gmail.com>
*
* This code may only be used under the MIT style license.
*
* @license MIT  https://andreasonny.mit-license.org/@2016/
*/
(function() {
  'use strict';

  angular
    .module('app', [
      'ngRoute',
      'ngAnimate',
      'angular-loading-bar',
      'angular-sortable-view',
      'ngScrollbars'
    ])
    .config(config)
    .run(run);

  // safe dependency injection
  // this prevents minification issues
  config.$inject = ['$routeProvider', '$locationProvider', 'ScrollBarsProvider'];
  // run.$inject = [];

  /**
   * App routing
   *
   * You can leave it here in the config section or take it out
   * into separate file
   *
   */
  function config($routeProvider, $locationProvider, ScrollBarsProvider) {
    // routes
    $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      })
      .otherwise({
        redirectTo: '/404'
      });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    ScrollBarsProvider.defaults = {
      scrollButtons: {
        enable: false // enable scrolling buttons by default
      },
      axis: 'yx' // enable 2 axis scrollbars by default
    };
  }

  /**
   * Run once the App is ready
   */
  function run() {
    // console.log('App ready!');
  }
})();
