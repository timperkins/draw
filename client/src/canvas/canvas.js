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
		var layerOffset;

		$scope.mouseDown = function(e) {
			e.stopPropagation();
			console.log('s', $scope.state.action);
			switch ($scope.state.tool) {
				case 'rectangle':
					if ($scope.state.action === '') {
						var layerId = $scope.layers.length;

						$scope.state.action = 'drawing';
						layerOffset = getLayerOffset(e.pageX, e.pageY);

						new Rectangle({
							x: layerOffset.x,
							y: layerOffset.y,
							id: layerId.toString(),
							title: 'Rectangle (' + layerId + ')',
							type: 'rectangle',
							color: colorPalette.color,
							drawing: true
						});
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