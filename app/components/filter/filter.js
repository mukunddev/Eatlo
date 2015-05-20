// Filter for representing Integer as decimal value.
angular.module('EatLo.Common')
	.filter("tofixed", function() {
	  return function(input) {
	  	if(!input){
	  		return;
	  	}
	    return parseInt(input).toFixed(2);
	  };
	});