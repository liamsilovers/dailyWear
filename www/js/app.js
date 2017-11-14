'use strict';
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('dailyWear', ['ionic','ngCordova','ionic-material','ngSanitize','dailyWear.controllers','dailyWear.services'])

.run(function($ionicPlatform, $rootScope, $timeout, SqlLiteService, $cordovaToast) {

  // init variables
    $rootScope.db = null;
    $rootScope.enterApp = false;
    $rootScope.user = {"sexe": null, "categorie":null, "color":null};
    $rootScope.style = null;

    var position1_woman = ["robes","tops & t-shirts","chemisiers & tuniques","pulls & gillets","vestes","manteaux"];
    var position2_woman = ["pantalons & leggings","jupes","jeans"];

    var position1_man = ["t-shirts","polos","chemises","pulls","vestes","manteaux","costumes","cravates"];
    var position2_man = ["jeans","pantalons"];

    // blanc & white = *
    var algo_color =
      {
        "red":["black","pink","atlantic blue","shell pink","white"],
        "yellow":["atlantic blue","orange","white chocolate","turquoise"],
        "pink":["atlantic blue","baby blue","shell pink","grey","chocolate","teddy bear brown","lilac"],
        "vert": ["bottle green","jade","grey","pastel green","white"],
        "orange":["yellow"],
        "chocolate":["lilac","shel pink","teddy bear brown","grey","ruby red"],
        "lilac":["baby blue","shell pink"],
        "babyblue":["shell pink","grey","jade"],
        "shellpink":["fuschia","grey"],
        "bottlegreen":["teddy bear brown","jade","pastel green","white chocolate","pastel yellow","grey"],
        "teddybearbrown":["grey","white chocolate","pastel yellow","pastel green"],
        "jade":["white chocolate"],
        "whitechocolate":["ruby red","pastel yellow","pastel yellow"]
      };

      // style man & woman

      var businessWoman = '("Robes","Chemisiers & Tuniques","Pantalons & Leggings","Manteaux")';
      var casualDecontracteWoman = '("Tops & T-shirts","Pulls & Gillets","Jupes","Jeans","Vestes")';
      var casualClasseWoman = '("Robes","Chemisiers & Tuniques","Pantalons & Leggings","Jupes")';

      var businessMan = '("Costumes","Chemises","Cravates","Manteaux")';
      var casualDecontracteMan = '("T-shirts","Chemises","Pulls","Jeans","Pantalons","Vestes")';
      var casualClasseWoman = '("Chemises","Polos","Pantalons","Manteaux")';

  // open DataBase 

  $timeout(function(){

  }, 500);

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // global function

  $rootScope.toast = function(message){
     $cordovaToast.showLongBottom(message).then(function(success) {
      // success
    }, function (error) {
      alert("System error");
    });
  }; // end toast

  $rootScope.getPosition = function(sexe, categorie)
  {

    switch(sexe)
    {
      case 'woman':
        if(position1_woman.indexOf(categorie.toLowerCase()) !== -1)
          return 1;
        else if(position2_woman.indexOf(categorie.toLowerCase()) !== -1)
          return 2;
        break;

      case 'man':
      if(position1_man.indexOf(categorie.toLowerCase()) !== -1)
          return 1;
        else if(position2_man.indexOf(categorie.toLowerCase()) !== -1)
          return 2;
        break;
    }

    
  }; // end getPosition

})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

  $stateProvider
    .state("checkSexe", {
      url: "/",
      templateUrl: "templates/checkSexe.html",
      controller: "CheckSexeCtrl",
      cache: false
  })
  .state("menu", {
    url: "/menu",
    templateUrl: "templates/menu.html",
    controller: "MenuCtrl",
    cache: false
  })
  .state("categoriesVetements", {
    url: "/categories-vetements",
    templateUrl: "templates/categories-vetements.html",
    controller: "CategoriesVetementsCtrl"
  })
  .state("color", {
    url: "/color",
    templateUrl: "templates/color.html",
    controller: "ColorCtrl",
    cache: false
  })
  .state("showroom", {
    url: "/showroom",
    templateUrl: "templates/showroom.html",
    controller: "ShowroomCtrl"
  })
  .state("setting", {
    url: "/setting",
    templateUrl: "templates/setting.html",
    controller: "SettingCtrl"
  })
  .state("suggestion", {
    url: "/suggestion",
    templateUrl: "templates/suggestion.html",
    controller: "SuggestionCtrl"
  })
  .state("suggestionDetail", {
    url:"/suggestionDetail",
    templateUrl: "templates/suggestion-detail.html",
    controller: "SuggestionDetailCtrl"
  })
  ;

  $urlRouterProvider.otherwise("/");

});
