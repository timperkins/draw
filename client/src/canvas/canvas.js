angular.module('canvas', [
	'services.color-palette',
	// 'services.layer',
	'services.rectangle',
	'services.layer',
	'services.state',
	'canvas.draw-rect',
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
.controller('CanvasController', ['$scope', '$element', 'colorPalette', 'Rectangle', 'Layer', 'state',
	function($scope, $element, colorPalette, Rectangle, Layer, state) {
		$scope.state = state;
		$scope.layers = Layer.layers;
		$scope.layerCurrent = Layer.current;
		// $scope.state = drawFactory.state;
		// // $scope.current = drawFactory.current;
		$scope.colorPalette = colorPalette;
		var CANVAS_OVERFLOW = 200,
			layerOffset;

		// Create the background layer 
		$scope.background = Layer.background;
		$scope.background.layer = new Rectangle({
			x: CANVAS_OVERFLOW/2,
			y: 50,
			id: 99999,
			title: 'Background',
			type: 'rectangle',
			color: '#fff',
			width: 1100,
			height: 500
		});

		

		$scope.canvasWidth = function() {
			var canvasWrapWidth = $($element).width(),
				canvasWidth = $scope.background.layer.width + CANVAS_OVERFLOW;


			if(canvasWrapWidth > canvasWidth) {
				canvasWidth = canvasWrapWidth;
			}

			return canvasWidth; 
		};

		$scope.centerCanvas = function() {
			var canvasWrap = $($element),
				canvasWrapWidth = canvasWrap.width(),
				canvasWrapHeight = canvasWrap.height(),
				canvasWidth = $scope.background.layer.width + CANVAS_OVERFLOW,
				canvasHeight = $scope.background.layer.height + CANVAS_OVERFLOW,
				windowWidth = $(window).width(),
				leftOffset = (canvasWidth - canvasWrapWidth) / 2;

			canvasWrap.scrollLeft(leftOffset);
		};

		// Center the canvas
		$scope.centerCanvas();

		$scope.mouseDown = function(e) {
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

			console.log('s', $scope.state.action);
			switch ($scope.state.tool) {
				case 'rectangle':
					if ($scope.state.action === '') {
						var layerId = $scope.layers.length;

						$scope.state.action = 'drawing';
						layerOffset = getLayerOffset(e.pageX, e.pageY);

						var rect = new Rectangle({
							x: layerOffset.x,
							y: layerOffset.y,
							id: layerId.toString(),
							title: 'Rectangle (' + layerId + ')',
							type: 'rectangle',
							color: colorPalette.color,
							drawing: true
						});

						// Insert before the current layer
						var insertIndex = 0;
						for(var i=0; i<$scope.layers.length; i++) {
							var layer = $scope.layers[i];
							if(angular.equals(layer, $scope.layerCurrent.layer)) {
								insertIndex = i;
								break;
							}
						}

						console.log('insertIndex', insertIndex);
						$scope.layers.splice(insertIndex, 0, rect);
						// $scope.layers.push(rect);
						$scope.layerCurrent.layer = rect;
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

						$scope.layerCurrent.layer.offset = {
							x: e.pageX - elementOffset.left - $scope.layerCurrent.layer.x,
							y: e.pageY - elementOffset.top - $scope.layerCurrent.layer.y
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
			switch ($scope.state.tool) {
				case 'rectangle':
					if ($scope.state.action == 'drawing') {
						layerOffset = getLayerOffset(e.pageX, e.pageY);
						$scope.layerCurrent.layer.setEndpoint(layerOffset.x, layerOffset.y);
					}
					break;
				case 'text':
					if ($scope.state.action == 'texting') {
						layerOffset = getLayerOffset(e.pageX, e.pageY);
						$scope.layerCurrent.layer.setEndpoint(layerOffset.x, layerOffset.y);
					}
					break;
				case 'transform':
					if(!$scope.layerCurrent.layer) {
						return;
					}
					var side = '';
					switch ($scope.state.action) {
						case 'translating':
							$scope.layerCurrent.layer.moveTo(e.offsetX, e.offsetY);
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
					}
					$scope.layerCurrent.layer.resizeLine(side, e.offsetX, e.offsetY);
					break;
			}
		};

		$scope.mouseUp = function(e) {
			e.stopPropagation();

			switch ($scope.state.tool) {
				case 'rectangle':
					if ($scope.state.action == 'drawing') {
						$scope.layerCurrent.layer.drawing = false;
					}
					break;
				case 'transform':
					if ($scope.state.action == 'translating') {
						$scope.layerCurrent.layer.drawing = false;
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
			$scope.layers.forEach(function(layer) {
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

		// function createRectangle(startX, startY) {
		// 	console.log('rect');
		//     // Remove active from all other layers
		//     $scope.layers.forEach(function(layer) {
		// 		layer.active = false;
		//     });

		// 	var id = $scope.layers.length,
		// 		newLayer = {
		// 			width: 1,
		// 			height: 1,
		// 			x: startX,
		// 			y: startY,
		// 			id: id.toString(),
		// 			title: 'Rectangle (' + id + ')',
		// 			show: false,
		// 			// active: true,
		// 			drawing: true,
		// 			type: 'rectangle',
		// 			color: colorPalette.color
		// 		};

		// 	var s = new Layer(newLayer);

		//     // $scope.layers.unshift(newLayer);
		//     // $scope.layers.push(newLayer);
		//     // $scope.layerCurrent.layer = s;
		//   }

		function createText(startX, startY) {
			$scope.layers.forEach(function(layer) {
				layer.active = false;
			});
			var id = $scope.layers.length,
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

			$scope.layers.unshift(newLayer);
			// $scope.layers.push(newLayer);
			$scope.current.layer = newLayer;
		}

	}
]);