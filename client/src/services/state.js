angular.module('services.state', [
		'services.defaults'
	])
	.factory('state', ['defaults', function(defaults) {
		return {
			tool: 'transform',
			action: '',
			panel: 'default',
			saveState: defaults.saveState
		};
	}]);