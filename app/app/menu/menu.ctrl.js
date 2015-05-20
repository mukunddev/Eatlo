'use strict';
/*creat seprate module for Menu*/
MenuModel.controller('MenuCtrl', ['$scope','CommonFactory','$location','localStorageService', 'eatloConfig', function($scope, CommonFactory, $location, localStorageService, eatloConfig) {

    var _scope = {};
    $scope.menu = {
        categories : [],
        cartItem : [],
        totalPrice : 0
    };
    var tempCart =[];
    /*this function will call, only if outlet will exist*/
    _scope.init = function () { 
        $scope.outlet = JSON.parse(localStorageService.get("outlet"));
        $scope.setting.outlet  = JSON.parse(localStorageService.get("outlet"));
        $scope.baseImageUrl = eatloConfig.demongoon_host + '/images/' + eatloConfig.company_id +'/';

        if (localStorageService.get("cart") !== null) {
                $scope.menu.cartItem = JSON.parse(localStorageService.get("cart"));
        }

        CommonFactory.getMenus("http://api.done.to/menu/" + $scope.outlet.id)
            .then(function(data){
                $scope.eatlo=data.data;
                angular.extend($scope.menu, {old_products:angular.copy($scope.eatlo.old_products)});
                manageCategory();
                manageActiveProducts();
            })
            .catch(function(err){
                alert("It's taking longer than expected. Retry?");
            }) 

    }

    /*After fetching data from database, managing category*/
    function manageCategory () {

         var allCategory = {
                    id: null,
                    parent_category_id: null,
                    name: "All",
                    description: "Showing all products across all categories served by this outlet.",
                    photo_url: "img/logo.png",
                    selection_min: 1,
                    selection_max: 1,
                    display: "0",
                    sr: -1
              };

        angular.forEach($scope.eatlo.categories, function(value, key){
            if (value.display === "0" && value.id !== 14871 && value.id !== 14870) {
                $scope.menu.categories.push(value);
            }
            else if (value.id === 14870 && (moment().weekday() === 5 || moment().weekday() === 6 || moment().weekday() === 0)) {
                $scope.menu.categories.push(value);
            }
        })

        $scope.menu.categories.push(allCategory);
        angular.extend($scope.menu, {selectedCategory : allCategory}) ;
              
    }

    /*Managing Active(which is available in store) product*/
    function manageActiveProducts () {

      angular.extend($scope.menu, {products : []});
      angular.forEach($scope.eatlo.products, function(value, key){

          value.quantity = 1;
          angular.forEach(value.attributes, function(attribute) {
              value.attribute_bg = "img/"+ attribute.name.toLowerCase() + ".png";
          });
          if (value.parent_outlet_product_id === null && value.category_id !== 14871 && value.category_id !== 14870 && eatloConfig.only_for_app_product.indexOf(value.id) === -1) {
              $scope.menu.products.push(value);
          } 
          else if (value.category_id === 14870 && (moment().weekday() === 5 || moment().weekday() === 6 || moment().weekday() === 0)) {
              $scope.products.push(value);
          }

          /* some time we have some item in cart but not in product list */
          if($scope.menu.cartItem.length!==0){
              angular.forEach($scope.menu.cartItem, function(cartItem) {
                  if(value.id===cartItem.id){
                      tempCart.push(cartItem);
                  }
              });
          }
      })
      
      if($scope.menu.cartItem.length!==0){
          localStorage.removeItem("cart");
          $scope.menu.cartItem.length = 0;
          $scope.menu.cartItem = tempCart;
          localStorageService.set("cart", JSON.stringify($scope.menu.cartItem));
      }
  
    }

    /*this function will call if category change*/
    $scope.changeCategory = function (category) {
        $scope.menu.selectedCategory = category;
    };

    /*when user click on product(user want to add product in cart) this function will execute */
    $scope.addToCart = function (product) {
      /*Assuming 'default_selected' is the count of selected particular item */
      var duplicateItem = false;
        angular.forEach($scope.menu.cartItem, function(item, key){
            if(product.id === item.id){
              item.default_selected++;
              duplicateItem = true;
            }
        })
        if(duplicateItem === false){
            product.default_selected = 1;
            $scope.menu.cartItem.push(product);
        }
            

        //calculateTotalPrice ()
    }
    /*when user want to edit cart this function will get execute*/
    $scope.editCart = function(prod,type){
          angular.forEach($scope.menu.cartItem, function(item, key){
            if(prod.id === item.id && prod.default_selected >1 && type === 'removeitem'){
              item.default_selected = item.default_selected - 1;
            }
            else if(prod.id === item.id && type === 'additem'){
              item.default_selected = item.default_selected + 1;
            }
            else if(prod.id === item.id && type === 'removeitems'){
              $scope.menu.cartItem.splice(key,1);
            }
            
          })
      }

    $scope.getImageUrl = function (path){
      return $scope.baseImageUrl + path;
    }
    $scope.getcategoryImage = function (path) {
      return eatloConfig.host + path;
    }

    /*code to check outlet is available in local storage, if not then it redirect to outlet page*/
    if(localStorageService.get("outlet") === null)
        $location.path('/outlets');
    else{
        _scope.init();
    }

      
        

}]);