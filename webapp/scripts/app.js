'use strict';

angular.module('webapp', [
  'ngRoute',
  'ui.bootstrap.datetimepicker'
]).config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
