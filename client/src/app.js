/**
	
Load Order:
	1. All drawings /drawing
	2. If drawingId in URL, get that id from $stateParams
	3. Else select the top drawing (in alphabetical order), get its id
	4. Then /drawing/id so we can cache the id on the server
	5. getLayers()

Drawing Clicked:
	1. Reset state and add id to $stateParams $state.go()
	2. On $stateUpdate /drawing/id to cache the id on the server
	3. getLayers()

getLayers():
	1. If drawingId is cached, get the layers from the cache
	2. Else, get all layers /layer (the server will use the cached drawingId)
			then cache the layers with drawingId as key
	3. Set Layer.layers, Layer.current, Layer.background.layer

**/


angular.module('draw', [
    'templates-app',
    'canvas',
    'full-page',
    'toolbar',
    'header',
    'panel',
    'overlay',
    'ui.router',
    'services.layer',
    'services.rectangle',
    'services.oval',
    'services.drawing',
    'services.defaults',
    'services.panel',
    'services.overlay'
  ])
  .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
  	$stateProvider
  		.state('singleDrawing', {
  			url: '/:drawingId/',
  			controller: 'SingleDrawingController',
  			templateUrl: 'full-page/full-page.tpl.html'
  		})
  		.state('allDrawings', {
  			url: '/',
  			controller: 'AllDrawingsController',
  			templateUrl: 'full-page/full-page.tpl.html'
  		});
    $locationProvider.html5Mode({
    	enabled: true,
    	requireBase: false
    });
    // $routeProvider.otherwise({redirectTo:'/projectsinfo'});
  }])
  .controller('AppController', ['$q', '$http', '$stateParams', 'Drawing', '$filter', function($q, $http, $stateParams, Drawing, $filter) {
  	var deferred = $q.defer();

		$http.get('/drawing').success(function(data) {
			var drawings = [];

			for (var i=0; i<data.length; i++) {
				var drawing = new Drawing(data[i]);
				drawings.push(drawing);
				if (drawing.id == $stateParams.drawingId) {
					Drawing.current = drawing;
				}
			}
			Drawing.drawings = drawings;
			if (!drawings.length) {
				// Create a new drawing
				Drawing.createDrawing();
			} else if (!Drawing.current) {
				// Select the first drawing
				// TODO: filter alphabetize, $state.go
				Drawing.current = Drawing.drawings[0];
				// panel.active = 'drawings';
			}
			deferred.resolve();
		});
		Drawing.promise = deferred.promise;
  }])
  .controller('AllDrawingsController', ['$scope', function($scope) {
  	// $scope.allDrawings = true;
  	// console.log('in AllDrawingsController');

  	// panel.show('drawings', 'left')
  }])
  .controller('SingleDrawingController', ['$scope', function($scope) {
  	// $scope.allDrawings = false;
  	// console.log('in SingleDrawingController');
  }])



	.controller('DrawController', ['$scope', '$stateParams', 'Layer', 'Rectangle', 'Oval', 'Drawing', '$http', '$timeout', '$q', 'defaults', 'panel', 'overlay', function($scope, $stateParams, Layer, Rectangle, Oval, Drawing, $http, $timeout, $q, defaults, panel, overlay) {

		// if (Drawing.current) {
		// 	Drawing.current = null;
		// } else {
		// 	findAllDrawings().then(findDrawing).then(wait).then(findAllLayers);
			
		// }
		// findAllDrawings().then(findDrawing).then(wait).then(findAllLayers);
		// Drawing.promise.then(findDrawing).then(wait).then(findAllLayers);
		// Drawing.promise.then(findDrawing).then(wait);



		// function findDrawing() {
		// 	var deferred = $q.defer();

		// 	if ($stateParams.drawingId) {
		// 		// We just need to send the current drawingId so it can get cached
		// 		// console.log('send to cache');
		// 		$http.get('/drawing/' + $stateParams.drawingId).success(function(data) {
		// 			// Drawing.current = new Drawing(data[0]);
		// 			deferred.resolve();
		// 		}).error(function(data) {
		// 			console.log('error on find Drawing', data);
		// 			deferred.reject();
		// 		});			
		// 	}
		// 	return deferred.promise;
		// }


		// // just for fun
		// function wait() {
		// 	var deferred = $q.defer();

		// 	$timeout(function() {
		// 		deferred.resolve();
		// 	}, 500);
		// 	return deferred.promise;
		// }


		

		// function createLayer(layer) {
		// 	switch (layer.type) {
		// 		case 'rectangle':
		// 			return new Rectangle(layer);
		// 			break;
		// 		case 'oval':
		// 			return new Oval(layer);
		// 			break;
		// 	}
		// }

	}]);
