console.log('top of app.js!');
angular.module('draw', [
    // 'services.shape',
    'templates-app',
    // 'ui.router',
    'canvas',
    'full-page',
    'toolbar',
    'header',
    'panel'
  ])
	// .config(function myAppConfig($urlRouterProvider) {
	// 	$urlRouterProvider.otherwise('/home');
	// })
	.controller('AppController', ['$scope', '$location', function ($scope, $location) {
		console.log('app controller');
    $scope.test = 'foo';
	}]);