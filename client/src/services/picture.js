angular.module('services.picture', [
	'services.layer',
	'services.defaults'
])
	.factory('Picture', ['Layer', 'defaults', '$q', function(Layer, defaults, $q) {
		var Picture = function(data) {
			var self = this;

			self.imageLoaded = false;

			Layer.call(self, data);
			angular.extend(self, data);

			Picture.loadPicture(self.src).then(function(image) {
				self.imageLoaded = true;
				self.nativeWidth = image.width;
				self.nativeHeight = image.height;
			});
		};
		Picture.prototype = Object.create(Layer.prototype);
		Picture.loadPicture = function(url) {
			var image = new Image(),
				deferred = $q.defer();

			image.src = url;
			image.onload = function() {
				deferred.resolve(this);
			};
			return deferred.promise;
		};

		// Override _shiftClickAdjust for pictures
		// Instead of creating a square, use the original aspect ratio
		Picture.prototype._shiftClickAdjust = function(e) {
			var self = this;

			if (e.shiftKey) {
				var naturalAspectRatio = self.nativeWidth/self.nativeHeight,
					actualAspectRatio = self.width/self.height;

				if (actualAspectRatio > naturalAspectRatio) {
					// actual width is too big
					self.width = Math.round(self.height * naturalAspectRatio);
				} else {
					// actual height is too big
					self.height = Math.round(self.width / naturalAspectRatio);
				}
			}
		};


		return Picture;
	}]);