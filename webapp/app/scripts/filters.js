'use strict';

angular.module('webapp').filter('bootstraplvl', function () {
  return function (input) {
    var blvl = '';
    switch (input) {
      case 'err':
      case 'error':
        blvl = 'danger';
        break;
      case 'warn':
        blvl = 'warning';
        break;
      case 'info':
        blvl = 'success';
        break;
    }
    return blvl;
  };
});

angular.module('webapp').filter('prettydate', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss');
  };
});
