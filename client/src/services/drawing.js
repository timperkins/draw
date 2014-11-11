angular.module('services.drawing', [
	'services.crud-object',
	'services.defaults',
	'services.layer',
	'services.rectangle',
	'services.oval'
])
	.factory('Drawing', ['CrudObject', 'defaults', '$stateParams', '$http', '$q', 'Layer', '$rootScope', 'Rectangle', 'Oval', function(CrudObject, defaults, $stateParams, $http, $q, Layer, $rootScope, Rectangle, Oval) {
               
		var Drawing = function(data) {
			var self = this;

			self.title = defaults.drawing.title;
			self.collection = 'drawing';
			self.layers = [];
			self.background = {};
			self.layerCurrent = null;
			
			if (data.layers) {
				for (var i=0; i<data.layers.length; i++) {
					var layerData = data.layers[i];

					self.layers.push(createLayer(layerData));
				}
				self.layerCurrent = self.layers[0];

				delete(data.layers);
			}

			if (data.background) {
				self.background = new Rectangle(data.background);
				delete(data.background);
			}
			
			angular.extend(self, data);
			CrudObject.call(self, data);
		};
		Drawing.current = null;
		Drawing.promise = null;
		Drawing.drawings = [];

		Drawing.prototype = Object.create(CrudObject.prototype);
		Drawing.prototype.addLayer = function(layer, pos) {
			var self = this;

			self.layers.splice(Layer.current.index, 0, layer);
			self.layerCurrent = layer;
			return self;
		};
		Drawing.prototype.removeLayer = function(layer) {
			var self = this,
				removeIndex = _.isNumber(layer) ? layer : self.layers.indexOf(layer);

			if (removeIndex > -1) {
				self.layers.splice(removeIndex, 1);
			}
			return self;
		};

		$rootScope.$on('$stateChangeSuccess', function() {
			// console.log('state change');
		});

		$rootScope.$watch(function() {
			return Drawing.current;
		}, function(newVal, oldVal) {
			if (!Drawing.current) {
				return;
			}
			console.log('d cur change');

			// Update layers
			Layer.layers.length = 0;
			angular.extend(Layer.layers, Drawing.current.layers);
			Layer.background.layer = Drawing.current.background;
		});

		// Update layerOutline
		$rootScope.$watch(function() {
			if (Drawing.current) {
				return Drawing.current.layerCurrent;
			}
			return;
		}, function(newVal, oldVal) {
			if (!Drawing.current) {
				return;
			}
			console.log('watch layerCurrent!');
			Drawing.current.layerOutline = Drawing.current.layerCurrent;
		});

		function createLayer(layer) {
			switch (layer.type) {
				case 'rectangle':
					// console.log('is rectangle');
					return new Rectangle(layer);
					break;
				case 'oval':
					return new Oval(layer);
					break;
			}
		}

		return Drawing;

	}]);