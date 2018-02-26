var app = angular.module('meanApp',['ngRoute','ngFileUpload','ui.bootstrap']);
app.factory("shareData",function(){
	return {value:0};
});

app.config(function($routeProvider, $locationProvider, $httpProvider){
	$routeProvider.when('/list',{
		templateUrl: 'client/views/user_list_vw.html',
		controller: 'userListController'
	});

	$routeProvider.when('/insert',{
		templateUrl: 'client/views/user_insert_vw.html',
		controller: 'userInsertController'
	});

	$routeProvider.when('/edit',{
		templateUrl: 'client/views/user_edit_vw.html',
		controller: 'userEditController'
	});

});
