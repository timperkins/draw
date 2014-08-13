angular.module('canvas.draw-outline', [])
	.directive('drawOutline', function() {
		return {
			restrict: 'E',
			templateUrl: 'canvas/draw-outline.tpl.html',
			replace: true,
			scope: {
				layer: '='
			},
			link: function(scope) {
				console.log('layer', scope.layer);
			}
		};
	});