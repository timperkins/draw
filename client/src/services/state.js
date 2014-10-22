angular.module('services.state', [
		'services.defaults'
	])
	.factory('state', ['defaults', function(defaults) {
		return {
			tool: 'rectangle',
			action: '',
			panel: 'default',
			saveState: defaults.saveState
		};
	}]);