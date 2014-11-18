angular.module('toolbar', [
    'services.drawing',
    'services.panel',
    'ui.bootstrap'
  ])
  .controller('ToolbarController', ['$scope', 'Drawing', 'panel', function($scope, Drawing, panel) {
  	$scope.Drawing = Drawing;
  	$scope.panel = panel;

    $scope.$watch(function() {
      if (!Drawing.current) {
        return;
      }
      return Drawing.current.state.tool;
    }, function(newVal, oldVal) {
      if (!newVal || newVal == oldVal) {
        return;
      }
      Drawing.current.save();
    });
    // $scope.toolbarModel = drawFactory.tool;
    // $scope.state = drawFactory.state;
  }]);