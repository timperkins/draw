angular.module('canvas.draw-outline', [])
	.directive('drawOutline', function() {
		return {
			restrict: 'E',
			templateUrl: 'canvas/draw-outline.tpl.html',
			replace: true,
			scope: {
				layer: '=',
				background: '=?'
			},
			link: function(scope) {
				scope.DIAGONAL_BOX_SIZE = 6;
			}
		};
	});