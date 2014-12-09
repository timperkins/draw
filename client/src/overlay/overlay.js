angular.module('overlay', [
		'services.drawing',
		'services.overlay',
		'services.picture',
		'ui.router',
		'filters.trusted'
	])
	.controller('OverlayController', ['$scope', 'Drawing', '$timeout', 'overlay', '$state', '$http', 'Picture', function($scope, Drawing, $timeout, overlay, $state, $http, Picture) {
		$scope.image = {};
		$scope.Drawing = Drawing;
		$scope.overlay = overlay;
		$scope.Picture = Picture;

		$scope.selectImage = function(image) {
			// image.selected = !image.selected;

			$scope.state.action = 'transform';
			layerOffset = {
				x: 50,
				y: 50
			};

			var layer = new Picture({
				x: layerOffset.x,
				y: layerOffset.y,
				width: image.nativeWidth,
				height: image.nativeHeight,
				title: 'Picture (' + 0 + ')',
				type: 'picture',
				src: image.src,
				nativeWidth: image.nativeWidth,
				nativeHeight: image.nativeHeight
			});
			var insertIndex = Drawing.current.layerCurrent ? Drawing.current.layerCurrent.index : 0;

			Drawing.current.addLayer(layer, insertIndex);
			Drawing.current.save();

			overlay.hide();
		};

		$scope.removeImage = function(e, image) {
			e.stopPropagation();
			var i = Drawing.current.photoGallery.indexOf(image);

			if (i > -1) {
				Drawing.current.photoGallery.splice(i, 1);
				Drawing.current.save();
			}
		};
	}]);