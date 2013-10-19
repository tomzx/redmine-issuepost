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
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

};