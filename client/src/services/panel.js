angular.module('services.panel', [])
	.factory('panel', ['$timeout', function($timeout) {
		return {
			active: 'layers',
			stagingRight: '',
			stagingLeft: '',
			override: '',
			transition: false,
			show: function(panel, direction, overrideNext) {
				var self = this;

				if (self.override.length) {
					panel = self.override;
					self.override = '';
				} else if (overrideNext) {
					self.override = overrideNext;
				}

				if (direction == 'right') {
					self.stagingRight = panel;
				} else {
					self.stagingLeft = panel;
				}
				
				// The transition needs to run after the new panel has been staged
				self.transition = false;
				$timeout(function() {
					self.transition = true;
					$timeout(function() {
						var oldPanel = self.active;

						// Move 
						if (direction == 'left') {
							self.stagingRight = oldPanel;
							self.stagingLeft = '';
						} else {
							self.stagingLeft = oldPanel;
							self.stagingRight = '';
						}
						self.active = panel;
						$timeout(function() {
							self.transition = false;
							self.stagingRight = '';
							self.stagingLeft = '';
						}, 400);
					}, 50);
				}, 50);
			}
		};
	}]);