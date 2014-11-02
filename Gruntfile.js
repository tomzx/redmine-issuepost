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
					dest: 'public/assets/css',
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
		},
		nodewebkit: {
			options: {
				platforms: ['win', 'osx', 'linux32', 'linux64'],
			},
			src: ['./public/**/*']
		},
	});

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

};