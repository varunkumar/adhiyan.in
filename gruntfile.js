module.exports = function(grunt) {

  grunt.initConfig({
    'useminPrepare': {
      html: 'public/index.html',
      options: {
        root: './public/',
        dest: './public/',
        flow: {
          steps: {
            'js': ['uglifyjs'],
            'css': ['concat', 'cssmin']
          },
          post: []
        }
      }
    },
    uglify: {
      generated: {
        options: {
          mangle: false,
          sourceMap: true
        }
      }
    },
    'usemin': {
      html: 'public/index.html'
    },
    copy: {
      main: {
        src: 'public/index-src.html',
        dest: 'public/index.html',
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('build', ['copy', 'useminPrepare', 'uglify', 'concat', 'cssmin', 'usemin']);
};