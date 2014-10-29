angular.module('services.drawing', [
	'services.crud-object',
	'services.defaults'
])
	.factory('Drawing', ['CrudObject', 'defaults', '$stateParams', '$http', '$q', function(CrudObject, defaults, $stateParams, $http, $q) {

		var Drawing = function(data) {
			this.title = defaults.drawing.title;
			this.collection = 'drawing';

			
			angular.extend(this, data);
			CrudObject.call(this, data);
		};
		Drawing.current = null;
		Drawing.prototype = Object.create(CrudObject.prototype);

		return Drawing;

	}]);