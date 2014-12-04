angular.module('services.overlay', [
		'services.drawing'
	])
	.factory('overlay', ['$timeout', '$q', 'Drawing', function($timeout, $q, Drawing) {
		var TRANSITION_TIME = 700;

		return {
			content: '',
			preshow: false,
			visible: false,
			notVisible: false,
			_loadOverlay: function() {
				Drawing.current.loadPhotoGallery();
			},
			show: function(content) {
				var self = this,
					deferred = $q.defer();

				self.content = content;
				self.preshow = true;
				$timeout(function() {
					self.visible = true;
					self.preshow = false;

					// Resolve after the transition
					$timeout(function() {
						self._loadOverlay();
						deferred.resolve();
					}, TRANSITION_TIME);
				}, 50);
				return deferred.promise;
			},
			hide: function() {
				console.log('hide overlay');
				var self = this;

				self.visible = false;
				self.notVisible = true;
				$timeout(function() {
					self.notVisible = false;
				}, TRANSITION_TIME);
			}
		};
	}]);