angular.module('canvas.draw-text', [
		'services.drawing'
	])
	.directive('drawText', ['Drawing', function(Drawing) {
		return {
			restrict: 'E',
			templateUrl: 'canvas/draw-text.tpl.html',
			replace: true,
			scope: {
				layer: '='
			},
			controller: function($scope, $element, Drawing, $timeout) {
				var textarea = $element.find('textarea:first');

				$scope.Drawing = Drawing;

				Drawing.current.layerCurrent.inputFocus = function() {
					textarea.focus();
					setLayerOutline();
				};

				$scope.focus = function(e) {
					setLayerOutline();
					Drawing.current.state.inTextBox = true;
					Drawing.current.layerCurrent = $scope.layer;
				};

				$scope.blur = function(e) {
					$element.spellcheck = false;
					Drawing.current.state.inTextBox = false;
				};

				$scope.mousedown = function(e) {
					e.stopPropagation();
				};

				$scope.keydown = function(e) {
					if (e.which == 27) { // escape key
						$timeout(function() {
							textarea.blur();
						});
					}
				};

				function setLayerOutline() {
					// console.log('setLayerOutline');
					// Drawing.current.layerOutline = $scope.layer;
				}
			}
		};
	}]);