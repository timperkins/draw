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

			Picture.loadPicture(self.src).then(function() {
				self.imageLoaded = true;
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


		return Picture;
	}]);