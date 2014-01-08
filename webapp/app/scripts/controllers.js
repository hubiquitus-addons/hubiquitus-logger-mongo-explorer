'use strict';

angular.module('webapp').controller('MainCtrl', function ($scope, $http) {
  $scope.searchForm = {
    namespace: '.*',
    regex: true,
    level: 'info',
    levelsAbove: true,
    limit: 30
  };

  $scope.page = 0;
  $scope.pages = 1;

  $scope.logs = [];

  $scope.levels = [
    {name: 'Trace', value: 'trace'},
    {name: 'Debug', value: 'debug'},
    {name: 'Info', value: 'info'},
    {name: 'Warning', value: 'warn'},
    {name: 'Error', value: 'err'}
  ];

  $scope.refresh = function () {
    $scope.page = 0;
    $scope.pages = 1;
    search();
  };

  $scope.prev = function () {
    if ($scope.page - 1 >= 0) {
      $scope.page--;
      search();
    }
  };

  $scope.next = function () {
    if ($scope.page + 1 < $scope.pages) {
      $scope.page++;
      search();
    }
  };

  function search() {
    $scope.searchForm.idx = $scope.page * $scope.searchForm.limit;
    $scope.searchForm.begin = new Date($scope.searchForm.begin).getTime();
    $scope.searchForm.end = new Date($scope.searchForm.end).getTime();
    $http({
      method: 'GET',
      url: '/api/logs?' + $.param($scope.searchForm),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
      $scope.logs = data.logs;
      $scope.pages = Math.ceil(data.count / $scope.searchForm.limit) || 1;
    });
  }
});
