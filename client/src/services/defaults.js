angular.module('services.defaults', [])
	.factory('defaults', function() {
		return {
			saveState: 'All changes saved',
			drawing: {
				title: 'Untitled Drawing'
			},
			CANVAS_OVERFLOW: 200
		};
	});