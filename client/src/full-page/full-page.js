angular.module('full-page', [
		'services.state',
		'services.layer',
		'services.drawing'
	])
  .controller('FullPageController', ['$scope','state', 'Layer', 'Drawing', function($scope, state, Layer, Drawing) {
  	$scope.state = state;
  	$scope.layerCurrent = Layer.current;
    // $scope.state = drawFactory.state;
    // $scope.shapes = drawFactory.shapes;
    // $scope.activeShapes = drawFactory.activeShapes;
    $scope.mouseMove = function(e) {
      // console.log(44);
    };

    // ng-keydown doesn't seem to be working, so we'll just use jQuery for now
    $(document).on('keydown', function(e) {
			var code = e.which;

			if (Drawing.current && Drawing.current.state.inTextBox) {
				return;
			}

			console.log('key: ', code);
			switch(code) {
				case 37: // left
					e.preventDefault();
					if(Drawing.current.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.x = $scope.layerCurrent.layer.x - 1;
							$scope.layerCurrent.layer.save();
						});						
					}
					break;
				case 38: // up
					e.preventDefault();
					if(Drawing.current.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.y = $scope.layerCurrent.layer.y - 1;
							$scope.layerCurrent.layer.save();
						});
					}
					break;
				case 39: // right
					e.preventDefault();
					if(Drawing.current.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.x = $scope.layerCurrent.layer.x + 1;
							$scope.layerCurrent.layer.save();
						});
					}
					break;
				case 40: // down
					e.preventDefault();
					if(Drawing.current.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.y = $scope.layerCurrent.layer.y + 1;
							$scope.layerCurrent.layer.save();
						});
					}
					break;
				case 84: // t
					$scope.$apply(function() {
						Drawing.current.state.tool = 'text';
					});
					break;		
				case 85: // u
					$scope.$apply(function() {
						Drawing.current.state.tool = 'rectangle';
					});
					break;
				case 86: // v
					$scope.$apply(function() {
						Drawing.current.state.tool = 'transform';
					});
					break;
			}
    });
  }]);