angular.module('header', [
		'services.color-palette',
		'services.state',
		'services.panel'
	])
	.controller('HeaderController', ['$scope', 'colorPalette', 'state', 'panel', function($scope, colorPalette, state, panel) {
		$scope.colorPalette = colorPalette;
		$scope.state = state;
		$scope.panel = panel;
		// $scope.shapes = drawFactory.shapes;
		// $scope.activeShapes = drawFactory.activeShapes()[0];
		// $scope.font = drawFactory.font;
		// $scope.current = drawFactory.current;
		// $scope.FONT_SIZES = [6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60];
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

		// $scope.fontSizeClick = function(e, size) {
		// 	// e.stopPropagation();

		// 	if ($scope.current.shape) {
		// 		$scope.current.shape.font.size = size;
		// 	} else {
		// 		$scope.current.shape = {
		// 			font: {
		// 				size: size
		// 			}
		// 		};
		// 	}
		// 	// $scope.fontSizeDropDown.isOpen = false;
		// };
	}]);