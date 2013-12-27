'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			files: ['assets/less/**/*.less'],
			tasks: ['less'],
		},
		less: {
			development: {
				files: [{
					expand: true,
					cwd: 'assets/less',
					dest: 'assets/css',
					src: ['application.less'],
					ext: '.css'
				}],
			},
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'asset/js/*.js'
				]
			}
		}
	});

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

};