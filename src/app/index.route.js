(function() {
  'use strict';

  angular
    .module('pa')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/views/common/content.html"
      })
      .state('login', {
        url: "/login",
        controller: 'loginController',
        templateUrl: "app/views/auth/login.html"
      })
      .state('register', {
        url: "/register",
        controller: 'registerController',
        templateUrl: "app/views/auth/register.html"
      });
    $urlRouterProvider.otherwise('/login');
  }

})();
