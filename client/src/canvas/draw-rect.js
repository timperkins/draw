angular.module('canvas.draw-rect', [])
	.directive('drawRect', function() {
		return {
			restrict: 'E',
			templateUrl: 'canvas/draw-rect.tpl.html',
			replace: true,
			scope: {
				layer: '='
			}
		};
	});