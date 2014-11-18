angular.module('header', [
		'services.state',
		'services.panel',
		'services.color-palette',
		'services.drawing'
	])
	.controller('HeaderController', ['$scope', 'state', 'panel', 'Drawing', 'colorPalette', function($scope, state, panel, Drawing, colorPalette) {
		$scope.state = state;
		$scope.panel = panel;
		$scope.colorPalette = colorPalette;
		$scope.Drawing = Drawing;
		// $scope.shapes = drawFactory.shapes;
		// $scope.activeShapes = drawFactory.activeShapes()[0];
		// $scope.font = drawFactory.font;
		// $scope.current = drawFactory.current;
		$scope.FONT_SIZES = [6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60];
		// $scope.fontSize = 12;
		// $scope.fontSizeDropDown = {
		// 	isOpen: false
		// };

		// $scope.showColors = function(e, model) {
		// 	state.panel = 'colors';
		// 	colorPalette.current.model = model;

		// 	// Focus on the title input field
		// 	// setTimeout(function() {
		// 	// 	$($element).find('.title-edit:first').focus();
		// 	// }, 500);
		// };

		$scope.fontSizeClick = function(e, size) {
			Drawing.current.state.fontSize = size;
			if (Drawing.current.layerCurrent.type == 'text') {
				Drawing.current.layerCurrent.fontSize = size;
			}

			// e.stopPropagation();

			// if ($scope.current.shape) {
			// 	$scope.current.shape.font.size = size;
			// } else {
			// 	$scope.current.shape = {
			// 		font: {
			// 			size: size
			// 		}
			// 	};
			// }
			// $scope.fontSizeDropDown.isOpen = false;
		};
	}]);