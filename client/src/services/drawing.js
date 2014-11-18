angular.module('services.drawing', [
	'ui.router',
	'services.crud-object',
	'services.defaults',
	'services.layer',
	'services.rectangle',
	'services.oval',
	'services.text-box'
])
	.factory('Drawing', ['CrudObject', 'defaults', '$stateParams', '$http', '$q', 'Layer', '$rootScope', 'Rectangle', 'Oval', 'TextBox', '$location', '$state', function(CrudObject, defaults, $stateParams, $http, $q, Layer, $rootScope, Rectangle, Oval, TextBox, $location, $state) {
               
		var Drawing = function(data) {
			var self = this;

			self.title = defaults.drawing.title;
			self.collection = 'drawing';
			self.layers = [];
			self.background = {};
			self.layerCurrent = null;
			self.state = {
				color: defaults.color,
				tool: defaults.tool,
				inTextBox: false
			};
			
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
		Drawing.createDrawing = function() {
			var drawing = new Drawing({
					background: {
						x: defaults.CANVAS_OVERFLOW/2,
						y: 50,
						title: 'Background',
						type: 'rectangle',
						color: '#fff',
						width: 1100,
						height: 500,
						background: true
					}
				}),
				deferred = $q.defer();
			drawing.create().then(function() {
				Drawing.drawings.push(drawing);
				Drawing.current = drawing;
				deferred.resolve();
				// panel.show('layers', 'right');
			});
			return deferred.promise;
		};
		Drawing.removeDrawing = function(drawing) {
			var removeIndex = _.isNumber(drawing) ? drawing : Drawing.drawings.indexOf(drawing);

			if (removeIndex > -1) {
				var toDelete = Drawing.drawings[removeIndex];

				Drawing.drawings.splice(removeIndex, 1);
				toDelete.delete();
				Drawing.current = Drawing.drawings[0];
			}
		};
		Drawing.hasDrawings = function() {
			return Drawing.drawings.length > 0;
		};

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
				Drawing.current.layerCurrent = Drawing.current.layers[0];
				Drawing.current.layerOutline = Drawing.current.layerCurrent;
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

			// Update layers
			Layer.layers.length = 0;
			angular.extend(Layer.layers, Drawing.current.layers);
			Layer.background.layer = Drawing.current.background;

			// Update location
			// console.log('Drawing.current change', Drawing.current.id);
			$state.go('singleDrawing', {
				drawingId: Drawing.current.id
			});
			// $location.search({'drawingId': Drawing.current.id});
		});

		// Update layerOutline when layerCurrent changes
		$rootScope.$watch(function() {
			if (Drawing.current) {
				return Drawing.current.layerCurrent;
			}
			return;
		}, function(newVal, oldVal) {
			if (!Drawing.current || Drawing.current.layerCurrent.background || Drawing.current.layerCurrent.type == 'text') {
				return;
			}
			Drawing.current.layerOutline = Drawing.current.layerCurrent;
		});

		// We need to set layerOutline when the tool changes to transform
		// and unset layerOutline when the tool changes to text
		$rootScope.$watch(function() {
			if (Drawing.current) {
				return Drawing.current.state.tool;
			}
			return;
		}, function(newVal, oldVal) {
			if (!Drawing.current) {
				return;
			}
			if (Drawing.current.state.tool == 'transform') {
				Drawing.current.layerOutline = Drawing.current.layerCurrent;
			} else if (Drawing.current.state.tool == 'text') {
				Drawing.current.layerOutline = null;
			}
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
				case 'text':
					return new TextBox(layer);
					break;
			}
		}

		return Drawing;

	}]);