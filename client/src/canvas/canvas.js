angular.module('canvas', [
	'services.color-palette',
	// 'services.layer',
	'services.rectangle',
	'services.oval',
	'services.layer',
	'services.state',
	'services.drawing',
	'services.defaults',
	'services.text-box',
	'canvas.draw-rect',
	'canvas.draw-oval',
	'canvas.draw-text',
	'canvas.draw-outline'
	// 'draw.home.draw-factory',
	// 'draw.home.color-palette',
	// 'draw.home.font'
])
	.filter('reverse', function() {
		return function(items) {
			if (items) {
				return items.slice().reverse();
			}
			return;
		};
	})
// .controller('CanvasController', function($scope, $element, $attrs, drawFactory, colorPalette, font, Layer) {
.controller('CanvasController', ['$scope', '$element', 'colorPalette', 'Rectangle', 'Oval', 'Layer', 'state', 'defaults', 'TextBox', '$timeout', '$http', 'Drawing', function($scope, $element, colorPalette, Rectangle, Oval, Layer, state, defaults, TextBox, $timeout, $http, Drawing) {
		$scope.state = state;
		// Drawing.current.layers = Layer.layers;
		// $scope.layerCurrent = Layer.current;
		// console.log('showCanvas');
		$scope.showCanvas = false;
		// if (!Drawing.current) {
		// 	$scope.showCanvas = false;
		// }
		$scope.Drawing = Drawing;
		// $scope.state = drawFactory.state;
		// // $scope.current = drawFactory.current;
		$scope.colorPalette = colorPalette;
		
		var layerOffset;

		// Create the background layer 
		// $scope.background = Layer.background;
		// $scope.background = Drawing.current.layerCurrent.background;
		// if (!Layer.layers.length) {
			// console.log('no layers');
		// }


		$scope.$watch(function() {
			return Drawing.current;
		}, function(newVal, oldVal) {
			// console.log('d cur change', newVal, oldVal);
			if (!newVal) {
				return;
			}
			$scope.background = Drawing.current.background;
			// console.log('Drawing.current', Drawing.current.background);
			$scope.canvasWidth = getCanvasWidth();
			$scope.canvasHeight = getCanvasHeight();

			// Center the canvas
			$scope.centerCanvas(function() {
				// Show the canvas
				$scope.showCanvas = true;
			});
		});
		
		// $scope.background.layer = new Rectangle({
		// 	x: defaults.CANVAS_OVERFLOW/2,
		// 	y: 50,
		// 	id: 99999,
		// 	title: 'Background',
		// 	type: 'rectangle',
		// 	color: '#fff',
		// 	width: 1100,
		// 	height: 500,
		// 	background: true
		// });

		// $scope.canvasHeight = getCanvasHeight();
		// $scope.canvasWidth = getCanvasWidth();

		// Load all the layers
		// $timeout(function() {
		// 	findAllLayers();
		// }, 3000);

		// $scope.$watch('background', function(newVal, oldVal) {
		// 	console.log('bg changed', newVal, oldVal);
		// 	if (!newVal.layer) {
		// 		return;
		// 	}

		// 	if (oldVal.layer) {			
		// 		// Check if the background layer width changed
		// 		if(newVal.layer.width != oldVal.layer.width) {
		// 			$scope.canvasWidth = getCanvasWidth();
		// 		}
		// 		// Check if the background layer height changed
		// 		if(newVal.layer.height != oldVal.layer.height) {
		// 			$scope.canvasHeight = getCanvasHeight();
		// 		}
		// 	} else {
		// 		$scope.canvasWidth = getCanvasWidth();
		// 		$scope.canvasHeight = getCanvasHeight();
		// 	}

		// 	// Center the canvas
		// 	$scope.centerCanvas(function() {
		// 		// Show the canvas
		// 		$scope.showCanvas = true;
		// 	});

		// }, true);

		$scope.centerCanvas = function(callback) {
			if (!Layer.background.layer) {
				return;
			}
			$timeout(function() {
				var canvasWrap = $($element),
					canvasWrapWidth = canvasWrap.width(),
					canvasWrapHeight = canvasWrap.height(),
					canvasWidth = Drawing.current.background.width + defaults.CANVAS_OVERFLOW,
					canvasHeight = Drawing.current.background.height + defaults.CANVAS_OVERFLOW,
					windowWidth = $(window).width(),
					leftOffset = (canvasWidth - canvasWrapWidth) / 2;
				canvasWrap.scrollLeft(leftOffset);

				callback();
			}, 300);
		};

		

		$scope.mouseDown = function(e) {
			console.log('down');
			e.stopPropagation();

			// Do nothing if right clicked
			var rightClick;
			e = e || window.event;
			if("which" in e) { // webkit, firefox
				rightClick = e.which == 3;
			} else { // ie
				rightClick = e.button == 2;
			}
			if(rightClick) {
				return;
			}

			switch (Drawing.current.state.tool) {
				case 'oval':
				case 'rectangle':
				case 'text':
					if ($scope.state.action === '') {
						var numLayers = Drawing.current.layers.length,
							prev = Layer.current.layer ? Layer.current.layer.prev : null,
							type = Drawing.current.state.tool,
							LayerType;

						if (type == 'rectangle') {
							LayerType = Rectangle;
						} else if (type == 'oval') {
							LayerType = Oval;
						} else if (type == 'text') {
							if (Drawing.current.state.inTextBox) {
								return;
							}
							LayerType = TextBox;
						}

						$scope.state.action = 'drawing';
						layerOffset = getLayerOffset(e.pageX, e.pageY);

						var layer = new LayerType({
							x: layerOffset.x,
							y: layerOffset.y,
							title: type.capitalize() + ' (' + numLayers + ')',
							type: type,
							color: Drawing.current.state.color,
							drawing: true,
							prev: prev
						});

						if (type == 'text') {
							layer.fontSize = Drawing.current.state.fontSize;
						}

						// var lastCurrent = Layer.current.layer;

						// Set the new shape to the current layer
						// Layer.current.layer = rect;
						Drawing.current.addLayer(layer, Layer.current.index);


						// Insert it into the list
						// (we may want to call getAll() instead)
						// Drawing.current.layers.splice(Layer.current.index, 0, rect);



						// rect.create().then(function() {
						
						// 	// Set the lastCurrent layer prev to the new shape we created
						// 	if (lastCurrent) {
						// 		lastCurrent.prev = rect.id;
						// 		lastCurrent.save();
						// 	}
						// }, function() {
						// 	// Failed to create
						// });


					}
					break;
				case 'transform':
					if ($scope.state.action === '') {
						$scope.state.action = 'translating';

						var $svg = $svg || $($element).find('svg.canvas:first'),
							elementOffset = $svg.offset();
						/*
						$scope.activelayers().forEach(function(layer) {
							layer.offset = {
								x: e.pageX - elementOffset.left - layer.x,
								y: e.pageY - elementOffset.top - layer.y
							};
						});
						*/

						Drawing.current.layerCurrent.offset = {
							x: e.pageX - elementOffset.left - Drawing.current.layerCurrent.x,
							y: e.pageY - elementOffset.top - Drawing.current.layerCurrent.y
						};
					}
					break;
				case 'text':
					if ($scope.state.action === '') {
						$scope.state.action = 'texting';

						layerOffset = getLayerOffset(e.pageX, e.pageY);
						createText(layerOffset.x, layerOffset.y);
					}
					break;
			}
		};

		$scope.mouseMove = function(e) {
			e.stopPropagation();
			switch (Drawing.current.state.tool) {
				case 'oval':
				case 'rectangle':
				case 'text':
					if ($scope.state.action == 'drawing') {
						layerOffset = getLayerOffset(e.pageX, e.pageY);
						Drawing.current.layerCurrent.setEndpoint(layerOffset.x, layerOffset.y);
					}
					break;
				case 'transform':
					if(!Drawing.current.layerCurrent) {
						return;
					}
					var side = '';
					switch ($scope.state.action) {
						case 'translating':
							Drawing.current.layerCurrent.moveTo(e.offsetX, e.offsetY);
							return;
						case 'resizeLineN':
							side = 'n';
							break;
						case 'resizeLineE':
							side = 'e';
							break;
						case 'resizeLineS':
							side = 's';
							break;
						case 'resizeLineW':
							side = 'w';
							break;
						case 'resizeLineNW':
							side = ['n', 'w'];
							break;
						case 'resizeLineNE':
							side = ['n', 'e'];
							break;
						case 'resizeLineSE':
							side = ['s', 'e'];
							break;
						case 'resizeLineSW':
							side = ['s', 'w'];
							break;
					}
					Drawing.current.layerCurrent.resizeLine(e, side, e.offsetX, e.offsetY);
					break;
			}
		};

		$scope.mouseUp = function(e) {
			e.stopPropagation();

			switch (Drawing.current.state.tool) {
				case 'oval':
				case 'rectangle':
				case 'text':
					if ($scope.state.action == 'drawing') {
						// Drawing.current.layerCurrent.drawing = false;
						Drawing.current.layerCurrent.endDrawing();
						Drawing.current.save();
						// Drawing.current.layerCurrent.save();
					}
					break;
				case 'transform':
					Drawing.current.layerCurrent.drawing = false;
					Drawing.current.save();
					if ($scope.state.action == 'translating') {
						// Drawing.current.layerCurrent.drawing = false;
						// $scope.state.action = '';
					}
					break;
				case 'text':
					break;
			}

			$scope.state.action = '';
		};

		$scope.activelayers = function() {
			var res = [];
			Drawing.current.layers.forEach(function(layer) {
				if (layer.active) {
					res.push(layer);
				}
			});
			return res;
		};

		function getLayerOffset(layerX, layerY) {
			var canvasOffset = $('.canvas:first').offset();

			return {
				x: layerX - canvasOffset.left,
				y: layerY - canvasOffset.top
			};
		}

		function createText(startX, startY) {
			Drawing.current.layers.forEach(function(layer) {
				layer.active = false;
			});
			var id = Drawing.current.layers.length,
				newLayer = {
					x: startX,
					y: startY,
					id: id,
					title: 'Text (' + id + ')',
					show: false,
					active: true,
					type: 'text',
					width: 100,
					height: 30,
					color: colorPalette.currentColor,
					size: font.size
				};

			Drawing.current.layers.unshift(newLayer);
			$scope.current.layer = newLayer;
		}

		function getCanvasWidth() {
			var canvasWrapWidth = $($element).width(),
				canvasWidth;

			if (Drawing.current) {
				// console.log('has bg');
				canvasWidth = Drawing.current.background.width + defaults.CANVAS_OVERFLOW;
				if(canvasWrapWidth > canvasWidth) {
					canvasWidth = canvasWrapWidth;
				}
			}	else {
				canvasWidth = canvasWrapWidth;
			}
			
			// console.log('getCanvasWidth', canvasWidth);
			return canvasWidth; 
		}

		function getCanvasHeight() {
			var canvasWrapHeight = $($element).height(),
				canvasHeight;

			if (Drawing.current) {
				canvasHeight = Drawing.current.background.height + defaults.CANVAS_OVERFLOW;
				if(canvasWrapHeight > canvasHeight) {
					canvasHeight = canvasWrapHeight;
				}
			} else {
				canvasHeight = canvasWrapHeight;
			}

			return canvasHeight; 
		}

		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1);
		}
	}
]);