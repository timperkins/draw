angular.module('canvas.draw-oval', [])
	.directive('drawOval', function() {
		return {
			restrict: 'E',
			templateUrl: 'canvas/draw-oval.tpl.html',
			replace: true,
			scope: {
				layer: '='
			}
		};
	});