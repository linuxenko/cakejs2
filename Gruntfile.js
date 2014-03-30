module.exports = function(grunt) {
 
    grunt.initConfig({
        jshint: {
            all: ['cake.js']
        },

        uglify: {
            js: {
                files: {
                    'cake.js': ['cake.min.js']
                }
            }
        }
 
    });
 
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
 
    grunt.registerTask('default', ['jshint', 'uglify']);
}