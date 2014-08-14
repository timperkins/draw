angular.module('full-page', [
		'services.state',
		'services.layer'
	])
  .controller('FullPageController', ['$scope','state', 'Layer', function($scope, state, Layer) {
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
			console.log('key: ', code);
			switch(code) {
				case 37: // left
					if($scope.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.x = $scope.layerCurrent.layer.x - 1;
						});						
					}
					break;
				case 38: // up
					if($scope.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.y = $scope.layerCurrent.layer.y - 1;
						});
					}
					break;
				case 39: // right
					if($scope.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.x = $scope.layerCurrent.layer.x + 1;
						});
					}
					break;
				case 40: // down
					if($scope.state.tool == 'transform' && $scope.layerCurrent.layer) {
						$scope.$apply(function() {
							$scope.layerCurrent.layer.y = $scope.layerCurrent.layer.y + 1;
						});
					}
					break;
				case 84: // t
					$scope.$apply(function() {
						$scope.state.tool = 'text';
					});
					break;		
				case 85: // u
					$scope.$apply(function() {
						$scope.state.tool = 'rectangle';
					});
					break;
				case 86: // v
					$scope.$apply(function() {
						$scope.state.tool = 'transform';
					});
					break;
			}
    });
  }]);