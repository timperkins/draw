angular.module('services.crud-object', [
		'services.state',
		'services.defaults'
	])
	.factory('CrudObject', ['$http', '$rootScope', '$q', '$timeout', 'state', 'defaults', function($http, $rootScope, $q, $timeout, state, defaults) {
		
		var CrudObject = function(data) {
			angular.extend(this, data);
			this.foo = 'yo';
		};



		// Instance methods 
		CrudObject.prototype.create = function() {
			var deferred = $q.defer();

			state.saveState = 'Saving ...';
			this._create(deferred);

			return deferred.promise;
		};
		CrudObject.prototype._create = function(deferred) {
			var self = this;

			$http.post('/' + self.collection, self).success(function(data) {
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
		// CrudObject.prototype.findById = function(id) {
		// 	var self = this;

		// 	$http.get('/' + self.collection + '/' + id).success(function(data) {
		// 		self.current = 
		// 	}).error(function(data) {
		// 		console.log('error on findAll', data);
		// 	});
		// };
		CrudObject.prototype.save = function() {
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
		CrudObject.prototype._save = function() {
			var self = this;

			$http.put('/' + self.collection + '/' + this.id, this).success(function(data) {
				state.saveState = defaults.saveState;
			}).error(function(data) {
				console.log('error', data);
			});	
		};
		CrudObject.prototype.delete = function() {
			var self = this;

			$http.delete('/' + self.collection + '/' + self.id).success(function(data) {
				// delete success
			}).error(function(data) {
				console.log('delete error', data);
			});
		};

		return CrudObject;
	}]);