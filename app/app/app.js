'use strict';

//Application Module
angular.module('EatLo', [
  'ngRoute',
  'EatLo.Common',
  'EatLo.Outlet',
  'EatLo.Menu',
  'EatLo.Directive',
  'ui.bootstrap',
  'angularMoment',
  'LocalStorageModule'
])

/*setting app level variable*/
.constant("eatloConfig", {
        "demongoon_host": "http://api.done.to",
        "company_id" :6896,
        "only_for_app_product" : [164981,164982,164983,164984],
        'host':'http://eatloapp.com/'
})


.config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
  
  $routeProvider.otherwise({redirectTo: '/menu'});

}])



