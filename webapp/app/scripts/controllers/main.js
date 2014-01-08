'use strict';

angular.module('webapp').controller('MainCtrl', function ($scope, $http) {
  $scope.searchForm = {
    namespace: '.*',
    regex: true,
    level: 'info',
    limit: 30
  };

  $scope.idx = 0;
  $scope.count = 1;

  $scope.logs = [];

  $scope.search = function () {
    $scope.searchForm.idx = $scope.idx;
    $http({
      method: 'GET',
      url: '/api/logs?' + $.param($scope.searchForm),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
      $scope.logs = data.logs;
      $scope.count = data.count;
    });
  };

  $scope.prev = function () {
    if ($scope.idx - 1 >= 0) {
      $scope.idx--;
      $scope.search();
    }
  };

  $scope.next = function () {
    if ($scope.idx + 1 < $scope.count) {
      $scope.idx++;
      $scope.search();
    }
  };
});
