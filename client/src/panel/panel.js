angular.module('panel', [
		'services.color-palette',
		'services.layer',
		'services.state',
		'components.draw-input',
		'ui.sortable'
	])
  .controller('PanelController', ['$scope', '$element', 'colorPalette', 'Layer', 'state', '$timeout', function($scope, $element, colorPalette, Layer, state, $timeout) {
		$scope.layers = Layer.layers;
		$scope.layerCurrent = Layer.current;
		$scope.background = Layer.background;
		$scope.state = state;
		$scope.sorting = false;
		$scope.overTrash = false;
		// $scope.drawFactory = drawFactory;
		// $scope.drawFactory = {
		//	model: ''
		// };

		$scope.panel = 'default';

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

		$scope.test = function() {
			console.log('test!!!');
		};

		

		// Update the linked list when a layer is repositioned
		var deleted = false;
		$scope.sortableOptions = {
			// start: function(e, ui) {
			// 	ui.item.startPos = ui.item.index();
			// },
			start: function(e, ui) {
				$scope.$apply(function() {
					$scope.sorting = true;
				});
				ui.item.startPos = ui.item.index();
			},
			update: function(e, ui) {
				console.log('up', e, ui);
				// console.log('top of update');
				$(document).off('.panelSorting');
				if ($scope.overTrash) {
					// ui.item.remove();
					console.log('cancel from update');
					ui.item.sortable.cancel();
					// ui.item.remove();
					deleted = true;
					$scope.overTrash = false;
					$timeout(function() {
						
						Layer.layers[ui.item.startPos].delete();
						
					}, 10);	
				}
			},
			// beforeStop: function (event, ui) {
			// 	if(removeIntent == true){
			// 		ui.item.remove();   
			// 	}
			// }
			stop: function(e, ui) {
				// console.log('stop');
				// Call this in case update doesn't fire first (not sure why)
				if ($scope.overTrash) {
					// ui.item.remove();
					ui.item.sortable.cancel();
					// ui.item.remove();
					deleted = true;
					$scope.overTrash = false;
					$timeout(function() {
						
						Layer.layers[ui.item.startPos].delete();
						

					}, 10);
				}

				$scope.sorting = false;
				if (deleted) {
					deleted = false;
					return;
				}

				$scope.$apply(function() {
					console.log('relink');
					Layer.relink();

				});
				// var currentLayer = Layer.current.layer,
				// 	startPos = ui.item.startPos,
				// 	endPos = ui.item.index(),
				// 	movingBackwards = endPos > startPos;

				// if (startPos === endPos) {
				// 	return;
				// }

				// Update prev's




				// Update the layer that was previously behind the current layer (oldNextLayer)
				// var oldNextLayer = movingBackwards ? Layer.layers[startPos] : Layer.layers[startPos + 1];
				// if (oldNextLayer) {
				// 	oldNextLayer.prev = currentLayer.prev;
				// 	oldNextLayer.save();
				// }

				// // Update prev for the current layer
				// var newPrevLayer = Layer.layers[endPos - 1];
				// if (newPrevLayer) {
				// 	currentLayer.prev = newPrevLayer.id;
				// } else {
				// 	// currentLayer is first in the list
				// 	currentLayer.prev = null;
				// }
				// currentLayer.save();

				// // Update the layer behind the current layer
				// var newNextLayer = Layer.layers[endPos + 1];
				// if (newNextLayer) {
				// 	newNextLayer.prev = currentLayer.id;
				// 	newNextLayer.save();		
				// }
			}
		}

		$scope.showSecondary = function(e, layer) {
			// e.stopPropagation();
			$scope.layerCurrent.layer = layer;
			$scope.state.panel = 'secondary';

			// Focus on the title input field
			setTimeout(function() {
				$($element).find('.title-edit:first').focus();	
			}, 500);
		};

		$scope.hideSecondary = function(e) {
			e.stopPropagation();
			$scope.state.panel = 'default';
		};

		$scope.showColors = function(e, model) {
			// e.stopPropagation();
			// console.log(layer);
			// $scope.layerCurrent.layer = layer;
			$scope.state.panel = 'colors';

			
			colorPalette.current.model = model;
			// console.log('model', colorPalette.current.model.strokeColor);
		};

		$scope.hideColors = function(e) {
			e.stopPropagation();
			$scope.state.panel = 'secondary';
		};

		$scope.colorPalette = colorPalette; 

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

		$scope.layerClick = function(i) {
			// Layer.current.index = i;

			// If this is clicked w/o shift or cmd then un-activate the other layers



			// var _ = window._;
			// if(!_.isEqual(clickedLayer, $scope.layerCurrent.layer)) {
			// 	console.log('clicked non active layer');
			// 	Layer.setActive(clickedLayer);
			// }
		};	
  }]);