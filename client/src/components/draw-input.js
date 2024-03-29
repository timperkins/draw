angular.module('components.draw-input', [])
    .directive('drawInput', function($timeout) {
    return {
			restrict: 'E',
			templateUrl: 'components/draw-input.tpl.html',
			scope: {
				drawModel: '=',
				unit: '@',
				onBlur: '&'
			},
			replace: true,
			controller: function($scope, $element, $attrs) {
				$scope.tempModel = '';
				var curDrawModel; // Cache $scope.drawModel
				
				$scope.$watch('drawModel', function(newVal) {
					if($scope.drawModel == curDrawModel) {
						return;
					}
					if(typeof $scope.drawModel !== 'undefined') {
						curDrawModel = Math.abs($scope.drawModel);
						$scope.tempModel = curDrawModel + ' ' + $scope.unit;
						// initialized = true;
					}
				});
				$scope.blur = function(e) {
					var inputVal = $scope.tempModel;

					// Remove $scope.unit and trim
					inputVal = inputVal.replace($scope.unit, '').trim();

					// Convert to int
					inputVal = parseInt(inputVal, 10);

					$scope.tempModel = inputVal + ' ' + $scope.unit;
					$scope.drawModel = inputVal;

					// initialized = false;

					console.log('blurred', $scope.tempModel);

					$(document).off('keydown.draw-input');

					// Run the onBlur function
					$scope.onBlur();
				};
				$scope.focus = function(e) {
					var inputField = $($element).find('input'),
						selected = false;

					$($element).on('keydown.draw-input', function(e) {
						console.log('keydown.draw-input');
						e.stopPropagation();
						$scope.$apply(function() {
							var code = e.which;
							switch(code) {
								case 38: // up arrow
									curDrawModel++;
									$scope.tempModel = curDrawModel + ' ' + $scope.unit;
									break;
								case 40: // down arrow
									curDrawModel--;
									$scope.tempModel = curDrawModel + ' ' + $scope.unit;
									break;
							}
						});
					});
				};
			}
    };
});