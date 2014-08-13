angular.module('toolbar', [
    'services.state',
    'ui.bootstrap'
  ])
  .controller('ToolbarController', ['$scope', 'state', function($scope, state) {
  	$scope.state = state;
    // $scope.toolbarModel = drawFactory.tool;
    // $scope.state = drawFactory.state;
  }]);