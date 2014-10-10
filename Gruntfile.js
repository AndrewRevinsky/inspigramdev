'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg   : grunt.file.readJSON('inspigramdev.jquery.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		copy  : {
			main: {
				files: [
					// includes files within path
					{expand: true, flatten: true, src: ['bower_components/jquery/dist/*'], dest: 'static/libs/jquery/', filter: 'isFile'},

					{expand: true, flatten: true, src: ['bower_components/underscore/underscore*'], dest: 'static/libs/underscore/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['static/less/*.css'], dest: 'static/css/', filter: 'isFile'}

					// includes files within path and its sub-directories
					//{expand: true, src: ['path/**'], dest: 'dest/'},

					// makes all src relative to cwd
					//{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

					// flattens results to a single level
					//{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
				]
			},
			bootstrap: {
				expand: true,
				cwd: 'bower_components/bootstrap/dist/',
				src: '**',
				dest: 'static/libs/bootstrap/'
			}
		},
		clean : {
			files: ['dist']
		},
		concat: {
			options: {
				banner      : '<%= banner %>',
				stripBanners: true
			},
			dist   : {
				src : ['src/jquery.<%= pkg.name %>.js'],
				dest: 'dist/jquery.<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist   : {
				src : '<%= concat.dist.dest %>',
				dest: 'dist/jquery.<%= pkg.name %>.min.js'
			}
		},
		qunit : {
			files: ['test/**/*.html']
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src    : 'Gruntfile.js'
			},
			src      : {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src    : ['src/**/*.js']
			},
			test     : {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src    : ['test/**/*.js']
			}
		},
		watch : {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src      : {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test     : {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task.
	//grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify']);
	grunt.registerTask('default', ['copy']);

};
