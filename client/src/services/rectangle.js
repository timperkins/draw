angular.module('services.rectangle', [
	'services.state',
	'services.layer'
])
	.factory('Rectangle', ['state', 'Layer', function(state, Layer) {
		var Rectangle = function(data) {
			Layer.call(this, data);

			// angular.extend(this, data);
			// Layer.layers.push(this);
			// Layer.current.rectangle = this;
		};
		Rectangle.prototype = Object.create(Layer.prototype);
		// Rectangle.layers = [];
		// Rectangle.current = {
		// 	rectangle: null
		// };

		return Rectangle;
	}]);