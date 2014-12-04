angular.module('overlay.image-on-load', [])
	.directive('imageOnLoad', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('load', function() {
					// console.log('load image', scope);
				})
			}
		};
	});