module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-html2js');

	var vendor = {
		js: [
			'vendor/jquery/dist/jquery.js',
			'vendor/jquery-ui/jquery-ui.js',
			'vendor/angular/angular.js',
			'vendor/angular-ui-sortable/sortable.js',
			'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
			'vendor/angular-ui-router/release/angular-ui-router.js',
			'vendor/underscore/underscore.js'
		]
	};


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true,
				mangle: true
			},
			app: {
				src: ['src/**/*.js'],
				dest: 'build/js/grunt-test.min.js'
			},
			vendor: {
				src: vendor.js,
				dest: 'build/js/vendor.min.js'
			}
		},
		concat: {
			options: {
				sourceMap: true
			},
			app: {
				src: ['src/**/*.js'],
				dest: 'build/js/draw-4.js'
			}
		},
		copy: {
			index: {
				files: [{
					src: ['index.html'],
					cwd: 'src/',
					dest: 'build/',
					expand: true
				}]
			},
			js: {
				files: [{
					src: ['**/*.js'],
					cwd: 'src/',
					dest: 'build/js/',
					expand: true,
					flatten: true
				}]
			}
			// vendor_files: {
			// 	files: [{
			// 		src: ['**'],
			// 		cwd: 'vendor/',
			// 		dest: 'build/vendor',
			// 		expand: true
			// 	}]
			// }
		},
		delta: {
			js: {
				files: 'src/**/*.js',
				tasks: ['uglify:app', 'concat:app', 'copy:js']
			},
			index: {
				files: 'src/index.html',
				tasks: ['copy:index']
			},
			html: {
				files: 'src/**/*.tpl.html',
				tasks: ['html2js:app']
			},
			less: {
				files: 'src/**/*.less',
				tasks: ['less:app']
			}
		},
		html2js: {
			app: {
				options: {
					base: 'src'
				},
				src: ['src/**/*.tpl.html'],
				dest: 'src/templates.js'
				// dest: 'build/templates.js'
			}
		},
		less: {
			app: {
				options: {
					compress: false,
					sourceMap: true,
					sourceMapFilename: 'build/css/grunt-test.css.map',
					sourceMapBasepath: 'build/css',
				},
				files: {
					'build/css/grunt-test.css': 'src/less/main.less'
				}
			}
		}
	});

	grunt.renameTask('watch', 'delta');

	// uglify:vendor is only compiled when watch is initially run
	// because the vendor files take a while (~3 sec) to compile
	grunt.registerTask('watch', ['build', 'uglify:vendor', 'delta']);

	grunt.registerTask('build', ['copy:index', 'copy:js', 'html2js:app', 'uglify:app', 'concat:app', 'less:app']);
};