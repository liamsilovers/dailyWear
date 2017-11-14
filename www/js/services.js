var services = angular.module("dailyWear.services", []);

services.provider("SqlLiteService",function(){ //Employee

        this.$get = function ($cordovaSQLite, $rootScope) {
          return {
            init: function()
            {
            	if($rootScope.db == null)
            	{
            		try
            		{
            			$rootScope.db = window.sqlitePlugin.openDatabase({name: "dailyWear.db", location: "default",androidDatabaseImplementation: 2, androidLockWorkaround:1});
            			$rootScope.db.transaction(function(tx){
            				//tx.executeSql("DROP TABLE user");
					        tx.executeSql('CREATE TABLE IF NOT EXISTS user (id,sexe)',[]);
					        tx.executeSql('CREATE TABLE IF NOT EXISTS list_choices (categorie,color)',[]);
					      }, function(error){
					        console.log('Transaction ERROR: ' + error.message);
					      }, function(){
					        console.log("table user is created ...");
					      });
            		}
            		catch(e)
            		{
            			console.log("Error System : " + e); // stop application ...
            		}
            	}
            }
          }
        }
});