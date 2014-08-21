angular.module('panel', [
		'services.color-palette',
		'services.layer',
		'services.state',
		'components.draw-input',
		'ui.sortable'
	])
  .controller('PanelController', ['$scope', '$element', 'colorPalette', 'Layer', 'state', function($scope, $element, colorPalette, Layer, state) {
		$scope.layers = Layer.layers;
		$scope.layerCurrent = Layer.current;
		$scope.background = Layer.background;
		$scope.state = state;
		// $scope.drawFactory = drawFactory;
		// $scope.drawFactory = {
		//	model: ''
		// };

		$scope.panel = 'default';
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

		/*
		$scope.layerClick = function(clickedLayer) {
			// If this is clicked w/o shift or cmd then un-activate the other layers

			var _ = window._;
			if(!_.isEqual(clickedLayer, $scope.layerCurrent.layer)) {
				console.log('clicked non active layer');
				Layer.setActive(clickedLayer);
			}
		};
		*/		
  }]);