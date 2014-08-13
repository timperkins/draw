angular.module('services.state', [])
	.factory('state', function() {
		return {
			tool: 'rectangle',
			action: '',
			panel: 'default'
		};
	});