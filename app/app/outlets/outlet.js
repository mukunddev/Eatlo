'use strict';

var  outletModule = angular.module('EatLo.Outlet', []);

outletModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/outlets', {
    templateUrl: 'app/outlets/outlet.html',
    controller: 'OutletCtrl'
  });
}]);

