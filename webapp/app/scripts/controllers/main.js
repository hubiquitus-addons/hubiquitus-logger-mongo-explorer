'use strict';

angular.module('webapp').controller('MainCtrl', function ($scope, $http) {
  $scope.searchForm = {
    namespace: '.*',
    regex: true,
    level: 'info'
  };

  $scope.logs = [];

  $scope.search = function () {
    $http({
      method: 'GET',
      url: '/api/logs?' + $.param($scope.searchForm),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
      $scope.logs = data;
    });
  };
});
