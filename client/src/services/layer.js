angular.module('services.layer', [
	'services.state',
	'services.defaults',
	'services.crud-object'
])
	.factory('Layer', ['state', 'defaults', 'CrudObject', '$stateParams', function(state, defaults, CrudObject, $stateParams) {		

		var Layer = function(data) {
			var self = this;

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
			this.collection = 'layer';

			angular.extend(this, data);

			// Add the drawingId
			// if (!this.background) {
				self.drawingId = $stateParams.drawingId;
				// Check if Drawing is still loading current
				// if (Drawing.current) {
				// 	this.drawingId = Drawing.current.id;
				// } else {
				// 	Drawing.promise.then(function() {
				// 		self.drawingId = Drawing.current.id;
				// 		self.save();
				// 	});
				// }				
			// }


			CrudObject.call(this, data);

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
		
		Layer.relink = function() {
			var curPrev = null;
			
			for (var i=0; i<Layer.layers.length; i++) {
				var curLayer = Layer.layers[i];

				if (curLayer.prev != curPrev) {
					curLayer.prev = curPrev;
					curLayer.save();
				}
				curPrev = curLayer.id;
			}
		};

		// Instance methods
		Layer.prototype = Object.create(CrudObject.prototype);
		Layer.prototype.delete = function() {
			var self = this, 
				removeIndex = Layer.layers.indexOf(self),
				newPrev = self.prev,
				nextLayer = Layer.layers[removeIndex+1];

			if (nextLayer) {
				nextLayer.prev = newPrev;
				nextLayer.save();
			}

			Layer.layers.splice(removeIndex, 1);

			// Update the new current layer
			if (self == Layer.current.layer) {
				if (removeIndex > 0) {
					Layer.current.layer = Layer.layers[removeIndex];
				} else if (Layer.layers.length) {
					Layer.current.layer = Layer.layers[0];
				}
			}

			console.log('about to delete', self);

			CrudObject.prototype.delete.call(self);
		};

		Layer.prototype.moveTo = function(newX, newY) {
			// console.log('moveTo', newX, newY);
			this.x = newX - this.offset.x;
			this.y = newY - this.offset.y;
			// console.log('this x y', this.x, this.y);
			// _.debounce(this.$save, 1000, true);
			// this.save();
		};
		Layer.prototype.resizeLine = function(e, location, newX, newY) {
			if (!angular.isArray(location)) {
				location = [location];
			}



			for (var i=0; i<location.length; i++) {
				var loc = location[i];

				switch (loc) {
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
							console.log('new y', newY, this.height);
						} else {
							// console.log('new y', newY, this.topY);
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
			}
			// Draw a square if the shift key is down (only on diagonal)
			if (e.shiftKey && location.length == 2) {
				console.log('shift', this.width, this.height);
				if (this.width > this.height) {
					this.width = this.height;
				} else {
					this.height = this.width;
				}
			}
		};
		Layer.prototype.mouseDown = function(e, action) {
			e.stopPropagation();
			var self = this;
			state.action = action;
			self.drawing = true;

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
				case 'resizeLineNW':
					self.bottomY = self.y + self.height;
					self.rightX = self.x + self.width;
					break;
				case 'resizeLineNE':
					self.bottomY = self.y + self.height;
					self.leftX = self.x;
					break;
				case 'resizeLineSE':
					self.topY = self.y;
					self.leftX = self.x;
					break;
				case 'resizeLineSW':
					self.topY = self.y;
					self.rightX = self.x + self.width;
					break;
			}
		};

		Layer.prototype.getWidth = function() {
			if (Math.abs(this.width) < Layer.MIN_WIDTH) {
				return Layer.MIN_WIDTH;
			}
			return Math.abs(this.width);
		};

		Layer.prototype.getHeight = function() {
			if (Math.abs(this.height) < Layer.MIN_HEIGHT) {
				return Layer.MIN_HEIGHT;
			}
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
			// Make the width and height are positive
			self.width = Math.abs(self.width);
			self.height = Math.abs(self.height);

			// We don't need the endpoints any more
			delete(self.endX);
			delete(self.endY);
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
		};


		function findAllLayers() {
			$http.get('/layer').success(function(data) {
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
					// var curLayer = createLayer(head);
					var curLayer = head;
					do {
						var nextId = curLayer.id;
						
						layers.push(createLayer(curLayer));
						curLayer = layerMap[nextId];
					} while (nextId in layerMap);
				}
				Layer.layers.length = 0;
				angular.extend(Layer.layers, layers);
				if (Layer.layers.length) {
					console.log('layers', Layer.layers);
					Layer.current.layer = Layer.layers[0];
				}
			}).error(function(data) {
				console.log('error on findAll', data);
			});
		}


		return Layer;

	}]);