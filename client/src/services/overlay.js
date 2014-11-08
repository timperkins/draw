angular.module('services.overlay', [])
	.factory('overlay', ['$timeout', function($timeout) {
		return {
			preshow: false,
			visible: false,
			hide: false,
			show: function() {
				var self = this;

				self.preshow = true;
				$timeout(function() {
					self.visible = true;
					self.preshow = false;
				}, 50);
			},
			hide: function() {
				var self = this;

				self.visible = false;
				self.hide = true;
				$timeout(function() {
					self.hide = false;
				}, 1000);
			}
		};
	}]);