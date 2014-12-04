angular.module('canvas.draw-picture', [
		'services.drawing',
		'filters.trusted'
	])
	.directive('drawPicture', ['Drawing', function(Drawing) {
		return {
			restrict: 'E',
			templateUrl: 'canvas/draw-picture.tpl.html',
			replace: true,
			scope: {
				layer: '='
			},
			controller: function($scope, $element, Drawing) {

			}
		};
	}]);