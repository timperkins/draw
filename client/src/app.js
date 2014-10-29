/**
	
Load Order:
	1. Drawing
		Load by id from url, or create a new Drawing
		Set Drawing.current
	2. Layers
		Find all Layers that match Drawing.current.id
		Set Layer.layers and Layer.current.layer

**/


angular.module('draw', [
    'templates-app',
    'canvas',
    'full-page',
    'toolbar',
    'header',
    'panel',
    'ui.router',
    'services.layer',
    'services.rectangle',
    'services.oval',
    'services.drawing',
    'services.defaults'
  ])
  .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
  	$stateProvider
  		.state('drawing', {
  			url: '/:drawingId/',
  			controller: 'AppController',
  			templateUrl: 'full-page/full-page.tpl.html'
  		})
  		.state('newDrawing', {
  			url: '/',
  			controller: 'AppController',
  			templateUrl: 'full-page/full-page.tpl.html'
  		});
    $locationProvider.html5Mode(true);
    // $routeProvider.otherwise({redirectTo:'/projectsinfo'});
  }])
	.controller('AppController', ['$scope', '$stateParams', 'Layer', 'Rectangle', 'Oval', 'Drawing', '$http', '$timeout', '$q', 'defaults', function($scope, $stateParams, Layer, Rectangle, Oval, Drawing, $http, $timeout, $q, defaults) {

		findDrawing().then(wait).then(findAllLayers);

		function findDrawing() {
			var deferred = $q.defer();
			if ($stateParams.drawingId) {
				// Drawing.promise = deferred.promise;

				// find by id
				$http.get('/drawing/' + $stateParams.drawingId).success(function(data) {
					Drawing.current = new Drawing(data[0]);
					deferred.resolve();
				}).error(function(data) {
					console.log('error on find Drawing', data);
					deferred.reject();
				});

			} else {
				var drawing = new Drawing({
					title: defaults.drawing.title
				});
				drawing.create().then(function() {
					Drawing.current = drawing;
					deferred.resolve();
				});
			}
			return deferred.promise;
		}

		// just for fun
		function wait() {
			var deferred = $q.defer();

			$timeout(function() {
				deferred.resolve();
			}, 500);
			return deferred.promise;
		}


		function findAllLayers() {
			$http.get('/layer').success(function(data) {
				var layers = [], 
					layerMap = {},
					head;

				if (data) {
					for (var i=0; i<data.length; i++) {
						var layer = data[i];

						if (!layer.prev) {
							head = layer;
						}
						layerMap[layer.prev] = layer;
					}
				}
				if (head) {
					// var curLayer = createLayer(head);
					var curLayer = head;
					do {
						var nextId = curLayer.id;
						
						layers.push(createLayer(curLayer));
						curLayer = layerMap[nextId];
					} while (nextId in layerMap);
				}
				Layer.layers.length = 0;
				angular.extend(Layer.layers, layers);
				if (Layer.layers.length) {
					console.log('layers', Layer.layers);
					Layer.current.layer = Layer.layers[0];
				}
			}).error(function(data) {
				console.log('error on findAll', data);
			});
		}

		function createLayer(layer) {
			switch (layer.type) {
				case 'rectangle':
					return new Rectangle(layer);
					break;
				case 'oval':
					return new Oval(layer);
					break;
			}
		}

	}]);
