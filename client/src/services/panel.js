angular.module('services.panel', [])
	.factory('panel', ['$timeout', function($timeout) {
		return {
			panelActive: 'layers',
			panelStagingRight: '',
			panelStagingLeft: '',
			panelOverride: '',
			panelTransition: false,
			showPanel: function(panel, direction, overrideNext) {
				var self = this;

				if (self.panelOverride.length) {
					panel = self.panelOverride;
					self.panelOverride = '';
				} else if (overrideNext) {
					self.panelOverride = overrideNext;
				}

				if (direction == 'right') {
					self.panelStagingRight = panel;
				} else {
					self.panelStagingLeft = panel;
				}
				
				// The transition needs to run after the new panel has been staged
				self.panelTransition = false;
				$timeout(function() {
					self.panelTransition = true;
					$timeout(function() {
						var oldPanel = self.panelActive;

						// Move 
						if (direction == 'left') {
							self.panelStagingRight = oldPanel;
							self.panelStagingLeft = '';
						} else {
							self.panelStagingLeft = oldPanel;
							self.panelStagingRight = '';
						}
						self.panelActive = panel;
						$timeout(function() {
							self.panelTransition = false;
							self.panelStagingRight = '';
							self.panelStagingLeft = '';
						}, 400);
					}, 50);
				}, 50);
			}
		};
	}]);