'use strict';

var  MenuModel = angular.module('EatLo.Menu', []);

MenuModel.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/menu', {
    templateUrl: 'app/menu/menu.html',
    controller: 'MenuCtrl'
  });
}]);

