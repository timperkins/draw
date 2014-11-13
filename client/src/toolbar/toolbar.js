angular.module('toolbar', [
    'services.state',
    'services.panel',
    'ui.bootstrap'
  ])
  .controller('ToolbarController', ['$scope', 'state', 'panel', function($scope, state, panel) {
  	$scope.state = state;
  	$scope.panel = panel;
    // $scope.toolbarModel = drawFactory.tool;
    // $scope.state = drawFactory.state;
  }]);