module.exports = function(grunt) {

  grunt.initConfig({
    'useminPrepare': {
      html: 'index.html',
      options: {
        root: './',
        dest: './',
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
      html: 'index.html'
    },
    copy: {
      main: {
        src: 'index-src.html',
        dest: 'index.html',
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