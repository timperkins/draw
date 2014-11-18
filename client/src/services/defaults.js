angular.module('services.defaults', [])
	.factory('defaults', function() {
		return {
			color: '#cc0000',
			saveState: 'All changes saved',
			drawing: {
				title: 'Untitled Drawing'
			},
			tool: 'text',
			font: {
				size: 16
			},
			CANVAS_OVERFLOW: 200
		};
	});