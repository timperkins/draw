angular.module('panel', [
		'services.color-palette',
		'services.layer',
		'services.drawing',
		'services.defaults',
		'services.panel',
		'components.draw-input',
		'ui.sortable'
	])
  .controller('PanelController', ['$scope', '$element', 'colorPalette', 'Layer', 'Rectangle', '$timeout', 'Drawing', 'defaults', 'panel', '$state', function($scope, $element, colorPalette, Layer, Rectangle, $timeout, Drawing, defaults, panel, $state) {

		$scope.Drawing = Drawing;
		$scope.Layer = Layer;
		$scope.background = Layer.background;
		$scope.sorting = false;
		$scope.overTrash = false;
		$scope.colorPalette = colorPalette;
		$scope.panel = panel;
		$scope.$state = $state;

		$scope.$watch('sorting', function(newVal, oldVal) {
			if (newVal) {
				$(document).on('mousemove.panelSorting', function(e) {
					$scope.$apply(function() {
						if (collision($('.ui-sortable-helper'), $('.trash'))) {
							$scope.overTrash = true;
						} else {
							$scope.overTrash = false;
						}
					});
				});
			} else {
				$(document).off('.panelSorting');
			}
		});

		$scope.newDrawing = function() {
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
			});
			drawing.create().then(function() {
				Drawing.drawings.push(drawing);
				Drawing.current = drawing;
				panel.show('layers', 'right');
			});
		};

		var prevLayerOutline = null;
		$scope.layerMouseEnter = function(layer) {
			Drawing.current.layerOutline = layer;
			layer.panelHover = true;
		};
		$scope.layerClick = function(layer) {
			prevLayerOutline = layer;
		};
		$scope.layerMouseLeave = function() {
			Drawing.current.layerOutline.panelHover = false;
			Drawing.current.layerOutline = prevLayerOutline;
		};

		// Update the linked list when a layer is repositioned
		$scope.sortableOptions = {
			start: function(e, ui) {
				$scope.$apply(function() {
					$scope.sorting = true;
				});
				ui.item.startPos = ui.item.index();
			},
			update: function(e, ui) {
				$(document).off('.panelSorting');
				if ($scope.overTrash) {
					ui.item.sortable.cancel();
					$scope.overTrash = false;
					$timeout(function() {
						Drawing.current.removeLayer(ui.item.startPos).save();
						Drawing.current.save();
						prevLayerOutline = Drawing.current.layerCurrent;
					}, 10);	
				}
			},
			stop: function(e, ui) {
				// Call this in case update doesn't fire first (not sure why)
				if ($scope.overTrash) {
					ui.item.sortable.cancel();
					$scope.overTrash = false;
					$timeout(function() {
						Drawing.current.removeLayer(ui.item.startPos).save();
						Drawing.current.save();
						prevLayerOutline = Drawing.current.layerCurrent;
					}, 10);
				}
				$scope.sorting = false;
				Drawing.current.save();
			}
		}

		function collision($div1, $div2) {
			var x1 = $div1.offset().left;
			var y1 = $div1.offset().top;
			var h1 = $div1.outerHeight(true);
			var w1 = $div1.outerWidth(true);
			var b1 = y1 + h1;
			var r1 = x1 + w1;
			var x2 = $div2.offset().left;
			var y2 = $div2.offset().top;
			var h2 = $div2.outerHeight(true);
			var w2 = $div2.outerWidth(true);
			var b2 = y2 + h2;
			var r2 = x2 + w2;

			if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
			return true;
		}
  }]);