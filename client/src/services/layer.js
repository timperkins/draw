angular.module('services.layer', [
	'services.state'
])
	.factory('Layer', ['state', function(state) {
		var Layer = function(data) {
			this.width = Layer.MIN_WIDTH;
			this.height = Layer.MIN_HEIGHT;
			this.stroke = {
				width: 0,
				color: '#cc0000'
			};
			this.invertX = false;
			this.invertY = false;
			this.radius = 0;
			this.state = state;
			this.fillOpacity = 100;

			angular.extend(this, data);
			// Layer.layers.push(this);
			// Layer.current.layer = this;
		};
		Layer.MIN_WIDTH = 2;
		Layer.MIN_HEIGHT = 2;
		Layer.layers = [];
		Layer.background = {
			layer: null
		};
		Layer.current = {
			layer: null
		};

		// Instance methods    
		Layer.prototype.moveTo = function(newX, newY) {
			this.x = newX - this.offset.x;
			this.y = newY - this.offset.y;
		};
		Layer.prototype.resizeLine = function(location, newX, newY) {
			switch (location) {
				case 'n':
					if (newY < this.bottomY) {
						this.y = newY;
						this.height = this.bottomY - newY;
					} else {
						this.y = this.bottomY;
						this.height = newY - this.bottomY;
					}
					break;
				case 'e':
					if (newX > this.leftX) {
						this.x = this.leftX;
						this.width = newX - this.leftX;
					} else {
						this.x = newX;
						this.width = this.leftX - newX;
					}
					break;
				case 's':
					if (newY > this.topY) {
						this.y = this.topY;
						this.height = newY - this.topY;
					} else {
						this.y = newY;
						this.height = this.topY - newY;
					}
					break;
				case 'w':
					if (newX < this.rightX) {
						this.x = newX;
						this.width = this.rightX - newX;
					} else {
						this.x = this.rightX;
						this.width = newX - this.rightX;
					}
					break;
			}
		};
		Layer.prototype.mouseDown = function(e, action) {
			e.stopPropagation();
			var self = this;
			self.state.action = action;

			switch (action) {
				case 'resizeLineN':
					self.bottomY = self.y + self.height;
					break;
				case 'resizeLineE':
					self.leftX = self.x;
					break;
				case 'resizeLineS':
					self.topY = self.y;
					break;
				case 'resizeLineW':
					self.rightX = self.x + self.width;
					break;
			}
		};
		Layer.prototype.setEndpoint = function(endX, endY) {
			var self = this,
				newWidth, newHeight, rightX, bottomY;

			// Transform X
			if (self.invertX) {
				rightX = self.x + self.width;
				if (endX > rightX) {
					self.invertX = false;
					newWidth = endX - rightX;

					self.x = rightX;

					// Compare with Layer.MIN_WIDTH
					if(newWidth < Layer.MIN_WIDTH) {
						newWidth = Layer.MIN_WIDTH;
					}
				} else {
					newWidth = rightX - endX;

					self.x = endX;

					// Compare with Layer.MIN_WIDTH
					if(newWidth < Layer.MIN_WIDTH) {
						newWidth = Layer.MIN_WIDTH;
						self.x = rightX - newWidth;
					}
				}
				self.width = newWidth;
			} else {
				if (endX < self.x) {
					rightX = self.x;
					self.invertX = true;
					newWidth = self.x - endX;
					self.x = endX;

					// Compare with Layer.MIN_WIDTH
					if(newWidth < Layer.MIN_WIDTH) {
						newWidth = Layer.MIN_WIDTH;
						self.x = rightX - newWidth;
					}
				} else {
					newWidth = endX - self.x;

					// Compare with Layer.MIN_WIDTH
					if(newWidth < Layer.MIN_WIDTH) {
						newWidth = Layer.MIN_WIDTH;
					}
				}
				self.width = newWidth;
			}

			// Transform Y
			if (self.invertY) {
				bottomY = self.y + self.height;
				if (endY > bottomY) {
					self.invertY = false;
					newHeight = endY - bottomY;

					self.y = bottomY;

					// Compare with Layer.MIN_HEIGHT
					if(newHeight < Layer.MIN_HEIGHT) {
						newHeight = Layer.MIN_HEIGHT;
					}
				} else {
					newHeight = bottomY - endY;

					self.y = endY;

					// Compare with Layer.MIN_HEIGHT
					if(newHeight < Layer.MIN_HEIGHT) {
						newHeight = Layer.MIN_HEIGHT;
						self.y = bottomY - newHeight;
					}
				}
				self.height = newHeight;
			} else {
				if (endY < self.y) {
					bottomY = self.y;
					self.invertY = true;
					newHeight = self.y - endY;
					self.y = endY;

					// Compare with Layer.MIN_HEIGHT
					if(newHeight < Layer.MIN_HEIGHT) {
						newHeight = Layer.MIN_HEIGHT;
						self.y = bottomY - newHeight;
					}
				} else {
					newHeight = endY - self.y;

					// Compare with Layer.MIN_HEIGHT
					if(newHeight < Layer.MIN_HEIGHT) {
						newHeight = Layer.MIN_HEIGHT;
					}
				}
				self.height = newHeight;
			}
		};
		Layer.prototype.getWidth = function() {
			if (this.width < 10) {
				return 10;
			}
			return this.width;
		};
		Layer.prototype.getHeight = function() {
			if (this.height < 10) {
				return 10;
			}
			return this.height;
		};

		return Layer;

	}]);