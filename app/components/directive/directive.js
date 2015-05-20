'use strict';
// Directive for displaying Cart Item
angular.module('EatLo.Directive',[])
	.directive('showCartItem',['$compile', 'localStorageService', function ($compile, localStorageService){
		return{
			scope:{
				showCartItem:'=',
				totalPrice :'=',
				editCart : '&'
			},
			templateUrl: 'app/common/cart.html',

			link:function(scope,ele,attr){
				scope.$watch('showCartItem', function(newVal, oldVal){
					scope.totalPrice = 0;
					scope.totalItem = 0;
					angular.forEach(scope.showCartItem, function(item, key){
						scope.totalPrice = scope.totalPrice + (item.default_selected * item.price)
						scope.totalItem = scope.totalItem + item.default_selected;
					})
					localStorageService.set("cart", JSON.stringify(scope.showCartItem));
				},true)
			}
		}
	}]);