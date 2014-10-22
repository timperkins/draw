angular.module('services.layer', [
	'services.state',
	'services.defaults'
])
	.factory('Layer', ['state', '$http', '$rootScope', '$q', '$timeout', 'defaults', function(state, $http, $rootScope, $q, $timeout, defaults) {
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
			// this.state = state;
			this.fillOpacity = 100;
			this.id = null;
			angular.extend(this, data);

			// We don't want to save the background layer
			// if(!this.background) {
			// 	this.create();
			// }
			
			// Layer.layers.push(this);
			// Layer.current.layer = this;
		};

		Layer.MIN_WIDTH = 1;
		Layer.MIN_HEIGHT = 1;
		Layer.layers = [];
		Layer.background = {
			layer: null
		};
		Layer.current = {
			layer: null,
			index: 0
		};
		Layer.findAll = function() {
			$http.get('/shape').success(function(data) {
				var layers = [], 
					layerMap = {},
					head;

				if (data) {
					for (var i=0; i<data.length; i++) {
						var layer = data[i];

						if (!layer.prev) {
							head = layer;
						}
						layerMap[layer.prev] = layer;
					}
				}
				if (head) {
					var curLayer = new Layer(head);
					do {
						var nextId = curLayer.id;
						
						layers.push(new Layer(curLayer));
						curLayer = layerMap[nextId];
					} while (nextId in layerMap);
				}
				Layer.layers.length = 0;
				angular.extend(Layer.layers, layers);
				if (Layer.layers.length) {
					Layer.current.layer = Layer.layers[0];
				}
			}).error(function(data) {
				console.log('error on findAll', data);
			});
		};

		// Instance methods 
		Layer.prototype.create = function() {
			var deferred = $q.defer();

			state.saveState = 'Saving ...';
			// console.log('this', this);
			this._create(deferred);

			return deferred.promise;
		};
		Layer.prototype._create = function(deferred) {
			var self = this;

			$http.post('/shape', self).success(function(data) {
				var item = data;

				if (item.id) {
					self.id = item.id;
				}
				state.saveState = defaults.saveState;
				deferred.resolve();
			}).error(function(data) {
				console.log('error creating item in db', data);
				deferred.reject();
			});
		};
		Layer.prototype.save = function() {
				var self = this;

				state.saveState = 'Saving ...';

				// Debounce for this instance
				if (self.$saveTimeout) {
					$timeout.cancel(self.$saveTimeout);
				}
				self.$saveTimeout = $timeout(function() {
					self._save();
					delete(self.$saveTimeout);
				}, 500);
		};
		Layer.prototype._save = function() {
			var self = this;

			$http.put('/shape/' + this.id, this).success(function(data) {
				state.saveState = defaults.saveState;
			}).error(function(data) {
				console.log('error', data);
			});	
		};
		Layer.prototype.delete = function() {
			var self = this, 
				removeIndex = Layer.layers.indexOf(self);

			Layer.layers.splice(removeIndex, 1);

			// Update the new current layer
			if (self == Layer.current.layer) {
				if (removeIndex > 0) {
					Layer.current.layer = Layer.layers[removeIndex];
				} else if (Layer.layers.length) {
					Layer.current.layer = Layer.layers[0];
				}
			}
			$http.delete('/shape/' + self.id).success(function(data) {
				// delete success
			}).error(function(data) {
				console.log('delete error', data);
			});
		};

		Layer.prototype.moveTo = function(newX, newY) {
			// console.log('moveTo', newX, newY);
			this.x = newX - this.offset.x;
			this.y = newY - this.offset.y;
			// console.log('this x y', this.x, this.y);
			// _.debounce(this.$save, 1000, true);
			this.save();
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
			state.action = action;

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

		Layer.prototype.getWidth = function() {
			return Math.abs(this.width);
		};

		Layer.prototype.getHeight = function() {
			return Math.abs(this.height);
		};

		Layer.prototype.getX = function() {
			if(state.action == 'drawing' && this.endX && this.endX < this.x) {
				return this.endX;
			}
			return this.x;
		};

		Layer.prototype.getY = function() {
			if(state.action == 'drawing' && this.endY && this.endY < this.y) {
				return this.endY;
			}
			return this.y;
		};

		Layer.prototype.endDrawing = function() {
			var self = this;

			self.drawing = false;

			// Make sure x and y are correct
			if (self.x > self.endX) {
				self.x = self.endX;
			}
			if(self.y > self.endY) {
				self.y = self.endY;
			}

			// We don't need the endpoints any more
			delete(self.endX);
			delete(self.endY);

			self.save();
		};

		// This function accepts the current mouse coordinates.
		// It sets the x, y, width, and height properties of the layer 
		// We let width, height be negative while drawing so as to simplify 
		// the math. x and y are corrected after drawing ends (see this.endDrawing())
		Layer.prototype.setEndpoint = function(endX, endY) {
			var self = this,
				newWidth = self.width, 
				newHeight, 
				newX = self.x, 
				newY, 
				rightX, bottomY;
			
			self.width = endX - self.x;
			self.height = endY - self.y;
			self.endX = endX;
			self.endY = endY;

			// self.save();

			// Transform X
			// if (self.invertX) {
			// 	rightX = self.x + self.width;
			// 	if (endX >= rightX) {
			// 		self.invertX = false;
			// 		newWidth = endX - rightX;
			// 		newX = rightX;
			// 	} else {
			// 		newWidth = rightX - endX;
			// 		newX = endX;
			// 	}
			// } else {
			// 	if (endX < self.x) {
			// 		rightX = self.x;
			// 		self.invertX = true;
			// 		newWidth = self.x - endX;
			// 		newX = endX;
			// 	} else {
			// 		newWidth = endX - self.x;
			// 	}
			// }

			// Compare with Layer.MIN_WIDTH
			// if(newWidth < Layer.MIN_WIDTH) {
			// 	newWidth = Layer.MIN_WIDTH;
			// 	if(self.invertX && endX < rightX
			// 		|| !self.invertX && endX < self.x) {
			// 		self.x = rightX - newWidth;
			// 	} 
			// }

			// Set the new values
			// self.width = newWidth;
			// self.x = newX;

			// Transform Y
			// if (self.invertY) {
			// 	bottomY = self.y + self.height;
			// 	if (endY > bottomY) {
			// 		self.invertY = false;
			// 		newHeight = endY - bottomY;

			// 		self.y = bottomY;

			// 		// Compare with Layer.MIN_HEIGHT
			// 		if(newHeight < Layer.MIN_HEIGHT) {
			// 			newHeight = Layer.MIN_HEIGHT;
			// 		}
			// 	} else {
			// 		newHeight = bottomY - endY;

			// 		self.y = endY;

			// 		// Compare with Layer.MIN_HEIGHT
			// 		if(newHeight < Layer.MIN_HEIGHT) {
			// 			newHeight = Layer.MIN_HEIGHT;
			// 			self.y = bottomY - newHeight;
			// 		}
			// 	}
			// 	self.height = newHeight;
			// } else {
			// 	if (endY < self.y) {
			// 		bottomY = self.y;
			// 		self.invertY = true;
			// 		newHeight = self.y - endY;
			// 		self.y = endY;

			// 		// Compare with Layer.MIN_HEIGHT
			// 		if(newHeight < Layer.MIN_HEIGHT) {
			// 			newHeight = Layer.MIN_HEIGHT;
			// 			self.y = bottomY - newHeight;
			// 		}
			// 	} else {
			// 		newHeight = endY - self.y;

			// 		// Compare with Layer.MIN_HEIGHT
			// 		if(newHeight < Layer.MIN_HEIGHT) {
			// 			newHeight = Layer.MIN_HEIGHT;
			// 		}
			// 	}
			// 	self.height = newHeight;
			// }
		};

		return Layer;

	}]);