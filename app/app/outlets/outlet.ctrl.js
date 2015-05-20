'use strict';

outletModule.controller('OutletCtrl', ['$scope','CommonFactory','localStorageService','$location','eatloConfig', function($scope, CommonFactory, localStorageService, $location, eatloConfig) {

    var _scope = {};
    $scope.setting.outlet = {}
    _scope.init = function() {
      var data = {
            'company_id': eatloConfig.company_id,
            'oa_last_updated_timestamp': 0,
            'oag_last_updated_timestamp': 0,
            'oam_last_updated_timestamp': 0,
            'offer_last_updated_timestamp': 0,
            'oom_last_updated_timestamp': 0,
            'ot_last_updated_timestamp': 0,
            'outlet_last_updated_timestamp': 0
          }
        /*api call for outlet list*/

        CommonFactory.getOutlets('http://api.done.to/done-outlets-by-company',data)
          .then(function(data){
            $scope.eatlo=data.data.data;
          })
          .catch(function(err){
            $scope.alerts.push({msg: 'error in fetching outlet Information.', type:'danger'});
          }) 
    }

    /*function will execute,when user choose outlet*/
    $scope.chooseOutlet = function(outlet){

        var outletDay, startTime, duration ;
        var day = moment().day() + 1;
        day = day === 0 ? 7 : day ;

        /*it get the outlet timing from the list of outlet timing  based on the matching outlet id and current date*/
        angular.forEach($scope.eatlo.outlet_timing, function(value, key){
            if(outlet.id ===  value.outlet_id && day === value.day_of_week){
                startTime = value.open_time;
                duration = value.duration;
                outletDay = value.day_of_week;
            }
        })
        /*if it is valid time means store is open at current time then it will redirect to product list*/
        if(validateStoreTime(startTime,duration,outletDay)){
            if (localStorageService.get("outlet") === null) {
                localStorageService.set("outlet", JSON.stringify(angular.copy(outlet)));
                $scope.setting.outlet  = outlet;
                $location.path("menu");
            }
            else {
                if (JSON.parse(localStorageService.get("outlet")).id !== outlet.id && localStorageService.get("cart") !== null && JSON.parse(localStorageService.get("cart")).length !== 0) {
                    if (confirm("Your cart will be emptied on changing the outlet. Continue ?")) {
                        localStorageService.set("outlet", JSON.stringify(angular.copy(outlet)));
                        $scope.setting.outlet  = outlet;
                        localStorageService.remove("cart");
                        $location.path("menu");
                    }
                }
                else if(JSON.parse(localStorageService.get("outlet")).id !== outlet.id && (localStorageService.get("cart") === null || JSON.parse(localStorageService.get("cart")).length === 0)) {
                    localStorageService.set("outlet", JSON.stringify(angular.copy(outlet)));
                    $scope.setting.outlet  = outlet;
                    $location.path("menu");
                }
                else if(JSON.parse(localStorageService.get("outlet")).id === outlet.id){
                    $scope.setting.outlet  = outlet;
                    $location.path("menu");
                }
            }
        }
        else{
          alert('Store is closed right now, Please try later');
        }
    }

    /*validating store is open for user or not*/
    function validateStoreTime(startTime,duration,outletDay) {

        var startTime = moment(startTime,"HH:mm:ss");
        var duration = moment(duration,"HH:mm:ss");
        var currentdate = moment();
        var endTime = moment(startTime._d).add(duration,'hours');
        return currentdate >= moment(startTime._d) && currentdate <= moment(endTime._d) ? true :false;
    }

    _scope.init();

}]);