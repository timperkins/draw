angular.module('services.state', [
		'services.defaults'
	])
	.factory('state', ['defaults', function(defaults) {
		return {
			// tool: 'rectangle',
			action: '',
			saveState: defaults.saveState
			// drawings: [],
			// currentDrawing: null
		};
	}]);