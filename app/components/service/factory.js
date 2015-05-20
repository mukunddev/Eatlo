'use strict';

angular.module('EatLo.Common',[])
.factory('CommonFactory',['$http', function($http){
    return {
        getOutlets : function (api, data) {
            return $http.post(api, data);
        },

        getMenus : function (api) {
            return $http.get(api);
        }
    }
}]);
