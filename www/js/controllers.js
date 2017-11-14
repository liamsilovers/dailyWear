var controllers = angular.module("dailyWear.controllers", []);

controllers.controller("CheckSexeCtrl", ["$scope", "$rootScope", "$state","SqlLiteService","$ionicHistory", function($scope, $rootScope, $state, SqlLiteService, $ionicHistory){
  
  // init prepare database

  $ionicHistory.nextViewOptions({
       disableBack: true,
       historyRoot: true
  });

   document.addEventListener('deviceready',function(){
        SqlLiteService.init();
        $scope.db.transaction(function(tx){
          tx.executeSql("SELECT sexe FROM user", [], function(tx, rs){
            var sexe = rs.rows.item(0).sexe;
            if(sexe != null)
            {
              $rootScope.user.sexe = sexe;
              console.log("rootSexe " + $rootScope.user.sexe);
              $state.go("menu", {}, {reload: true});
            }
          }, function(tx, error){
            console.log('Transaction ERROR: ' + error.message);
          });
        });
  }, false);

  //document.addEventListener('deviceready',SqlLiteService.init, false);

  var sexe = null;

  $scope.selected = function(element)
  {
    angular.element(element.target).parent().parent().find("span").removeClass("selected");
    angular.element(element.target).addClass("selected");
    sexe = angular.element(element.target).attr("data-sexe");
  }

  $scope.next = function()
  {
    console.log("la valeur de sexe vaut à : " + sexe);
   document.addEventListener('deviceready', function(){
      $scope.db.transaction(function(tx)
      {
            tx.executeSql('INSERT INTO user VALUES(?,?)', [1, sexe], function(tx, rs) {
              //console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
              //console.log("SEXE : " + rs.rows.item(0).sexe);
              console.log(JSON.stringify(rs));
              $rootScope.user.sexe = sexe;
              $state.go("menu", {}, {reload: true});
            }, function(tx, error) {
              console.log('Transaction ERROR: ' + error.message);
            });
      });

   }); // end EventListener 'deviceready'
  }

}]);

controllers.controller('MenuCtrl', ['$scope','$rootScope','$ionicHistory', function($scope, $rootScope, $ionicHistory){
    $rootScope.enterApp = true;
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

}]);

controllers.controller("CategoriesVetementsCtrl", ["$scope","$rootScope","$state", function($scope, $rootScope, $state){

  $scope.selectCategorie = function(element)
  {
    var categorie = null;
    var currentElement = angular.element(element.target);
    if(currentElement.hasClass("item-categories"))
      categorie = angular.element(element.target).attr("data-categorie");
    else
      categorie = angular.element(element.target).parent().attr("data-categorie");

    $rootScope.user.categorie = categorie;

    $state.go("color", {}, {reload: true});

    console.log(JSON.stringify($rootScope.user));
  }

}]);

controllers.controller("ColorCtrl",["$scope","$rootScope","$state", "$timeout", function($scope, $rootScope, $state, $timeout){
    
    // init
    var itemColor =  angular.element(document.getElementsByClassName("item-color"));
    itemColor.removeClass("not-selected");   

    $scope.selectColor = function(element)
    {
      itemColor.addClass("not-selected");
      var currentElement = angular.element(element.target);
      currentElement.removeClass("not-selected");
      var color = currentElement.attr("data-color");
      $rootScope.user.color = color;
      console.log(JSON.stringify($rootScope.user));
      var position = $rootScope.getPosition($rootScope.user.sexe, $rootScope.user.categorie);
      console.log("position N° : " + position);
      document.addEventListener("deviceready", function(){

        $scope.db.transaction(function(tx){
          tx.executeSql("INSERT INTO list_choices VALUES(?,?)", [$rootScope.user.categorie, $rootScope.user.color], function(tx, rs){
            console.log(JSON.stringify(rs));
            // empty variables
            $rootScope.user.categorie = null;
            $rootScope.user.color = null;
            $scope.toast("La catégorie et le couleur que vous avez choisi ont été bien ajoutés");
            $timeout(function(){
              $state.go("menu", {}, {reload: true});
            }, 500);
          }, function(tx, error){
            $scope.toast("Failed transaction : " + error.message);
          });
        });

      }, false);
    }
}]);

controllers.controller('ShowroomCtrl', ['$scope','$ionicActionSheet', '$cordovaCamera', function($scope, $ionicActionSheet, $cordovaCamera){
  
  // init

  var getPicture = function(options, idElement)
  {
    $cordovaCamera.getPicture(options, idElement).then(function(imageData)
    {
        var src = "data:image/jpeg;base64," + imageData;
        var currentElement = angular.element(document.getElementById(idElement)).attr("src", src);
        currentElement.next().addClass("hide");
      }, function(err) {
        $scope.toast("System error : " + error);
      });
  };

  $scope.uploadImage = function(idElement)
  {
    console.log("idElement : " + idElement);
     // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<span class="btn-action-sheet"><i class="ion-camera"></i>&nbsp;Appareil photo</span>' },
       { text: '<span class="btn-action-sheet"><i class="ion-images"></i>&nbsp;Galerie</span>' }
     ],
     titleText: '<strong class="title-action-sheet">Veuillez vous choisir</strong>',
     cancelText: 'Annuler',
     cancel: function() {
          console.log("annuler ...");
        },
     buttonClicked: function(index) {
      if(index == 0)
      {
        console.log("Appareil Caméra");

        document.addEventListener("deviceready", function(){

           var optionsCamera = {
              quality: 100,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 400,
              targetHeight: 400,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation:false
            };

             getPicture(optionsCamera, idElement);

        }, false);

      }
      else if(index == 1)
      {
        var optionsAlbum = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 400,
            targetHeight: 400,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:false,
          };

          getPicture(optionsAlbum, idElement);

      } 
      return true;
     }
   });
  } // end uploadImage

}]);

controllers.controller('SettingCtrl', ['$scope', '$rootScope','$state', function($scope, $rootScope, $state){
    

  $scope.sexe = {"value":null};
  $scope.sexe.value = $rootScope.user.sexe;
    $scope.saveSexe = function()
    {

      if($scope.sexe.value != $scope.user.sexe)
      {
        // delete all rows for table 'list_choices'
        // update column sexe for table 'user'
        // update rootScope
        document.addEventListener("deviceready", function(){
          $scope.db.transaction(function(tx){
            tx.executeSql("DELETE FROM list_choices");
            tx.executeSql("UPDATE user SET sexe = ? WHERE id = ?", [$scope.sexe.value, 1], function(tx, rs){
               console.log(JSON.stringify(rs));
               $rootScope.user.sexe = $scope.sexe.value;
               $scope.toast("La modification a été bien éffectuée !");
               $state.go("menu", {}, {reload: true});
            }, function(tx, error){
              console.log("Transaction failed : " + error.message);
            });
          });
        }, false);
      }
      else
        $state.go("menu", {}, {reload: true});
    }
}]);

controllers.controller('SuggestionCtrl', ['$scope','$rootScope','$state', function($scope,$rootScope,$state){
  // init
  $scope.categorie = {"style" : null};

  $scope.next = function()
  {
    console.log("Style : " + $scope.categorie.style);
    $rootScope.style = $scope.categorie.style;
    if($scope.categorie.style !== null)
      $state.go("suggestionDetail");
  };
}]);

controllers.controller('SuggestionDetailCtrl', ['$scope', '$rootScope',function($scope, $rootScope)
{ 

  $scope.autreTenue = function()
  {
    console.log("autre tenue ...");
  };

}]);
