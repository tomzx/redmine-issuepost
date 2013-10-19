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
				// files: {
				// 	'path/to/result.css': 'path/to/source.less'
				// }
			},
			// production: {
			// 	options: {
			// 		yuicompress: true
			// 	},
			// 	files: [{
			// 		expand: true,
			// 		cwd: 'Source/asset/less',
			// 		dest: 'Source/asset/css',
			// 		src: ['style.less'],
			// 		ext: '.css'
			// 	}],
			// }
		},
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

};