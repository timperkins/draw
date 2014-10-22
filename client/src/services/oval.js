angular.module('services.oval', [
	'services.state',
	'services.layer'
])
	.factory('Oval', ['state', 'Layer', function(state, Layer) {
		var Oval = function(data) {
			Layer.call(this, data);
		};
		Oval.prototype = Object.create(Layer.prototype);

		Oval.prototype.getCX = function() {
			var x = this.getX(),
				width = this.getWidth();

			return x + (width / 2);
		};
		Oval.prototype.getCY = function() {
			var y = this.getY(),
				height = this.getHeight();

			return y + (height / 2);
		};

		return Oval;
	}]);