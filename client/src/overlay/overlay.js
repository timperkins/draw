angular.module('overlay', [
		'services.drawing',
		'services.overlay',
		'ui.router'
	])
	.controller('OverlayController', ['$scope', 'Drawing', '$timeout', 'overlay', '$state', function($scope, Drawing, $timeout, overlay, $state) {
		$scope.drawingTitle = '';
		$scope.overlay = overlay;
		$scope.createDrawing = function() {
			console.log('createDrawing');
			var drawing = new Drawing({
				title: $scope.drawingTitle
			});
			drawing.create().then(function() {
				$state.go('drawing', {
					drawingId: drawing.id
				});
				overlay.hide();
			});
		}; 
	}]);