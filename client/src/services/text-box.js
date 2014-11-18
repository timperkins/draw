angular.module('services.text-box', [
	'services.layer',
])
	.factory('TextBox', ['Layer', function(Layer) {
		var TextBox = function(data) {
			var self = this;

			self.content = '';

			Layer.call(self, data);
			angular.extend(self, data);
		};
		TextBox.prototype = Object.create(Layer.prototype);
		TextBox.prototype.mousedown = function(e) {
			// stop propagation if on text tool because we don't want to create a new layer
			e.stopPropagation();
		};
		TextBox.prototype.blur = function(e) {
		};
		TextBox.prototype.endDrawing = function() {
			var self = this;

			if (self.inputFocus) {
				self.inputFocus();
			}

			Layer.prototype.endDrawing.call(self);
		};

		return TextBox;
	}]);