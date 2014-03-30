module.exports = function(grunt) {
 
    grunt.initConfig({
        jshint: {
            all: ['cake.js']
        },

        uglify: {
            options: {
                 banner: '/* \n * @Author: Linuxenko Svetlana \n * @Project: CakeJS https://github.com/linuxenko/cakejs \n */\n'
            },
            js: {
                files: {
                    'cake.min.js': ['cake.js']
                }
            }
        }
 
    });
 
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
 
    grunt.registerTask('default', ['jshint', 'uglify']);
}