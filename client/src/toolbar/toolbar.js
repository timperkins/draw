angular.module('toolbar', [
    'services.drawing',
    'services.panel',
    'services.overlay',
    'ui.bootstrap'
  ])
  .controller('ToolbarController', ['$scope', 'Drawing', 'panel', 'overlay', function($scope, Drawing, panel, overlay) {
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

    $scope.$watch('Drawing.current.state.tool', function(newVal, oldVal) {
      if (newVal == 'image') {
        overlay.show('image').then(function() {
          Drawing.current.state.tool = 'transform';
        });
      }
    });
    // $scope.toolbarModel = drawFactory.tool;
    // $scope.state = drawFactory.state;
  }]);