'use strict';

angular.module('webapp').controller('MainCtrl', function ($scope, $http) {
  $scope.searchForm = {
    namespace: '.*',
    regex: true,
    level: 'info',
    levelsAbove: true,
    limit: 30
  };

  $scope.count = 0;
  $scope.page = 0;
  $scope.pages = 1;
  $scope.pageToGoto = 0;

  $scope.spinner = 'false';

  $scope.logs = [];

  $scope.levels = ['trace', 'debug', 'info', 'warn', 'err'];

  $scope.refresh = function () {
    $scope.page = 0;
    $scope.pages = 1;
    search();
  };

  $scope.gotopage = function () {
    var page = $scope.pageToGoto - 1; // indexes starts at 0; human will enter 1
    if (page < 0) {
      page = 0;
    } else if (page > $scope.pages - 1) {
      page = $scope.pages - 1;
    }
    $scope.page = page;
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
    $scope.spinner = 'true';
    $scope.searchForm.idx = $scope.page * $scope.searchForm.limit;
    $scope.searchForm.begin = new Date($scope.searchForm.begin).getTime();
    $scope.searchForm.end = new Date($scope.searchForm.end).getTime();
    $http({
      method: 'GET',
      url: '/api/logs?' + $.param($scope.searchForm),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
      $scope.spinner = 'false';
      $scope.logs = data.logs;
      $scope.count = data.count;
      $scope.pages = Math.ceil(data.count / $scope.searchForm.limit) || 1;
    });
  }
});
