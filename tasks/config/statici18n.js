/**
 *
 */
module.exports = function(grunt) {

  grunt.initConfig({
    i18n: {
      dist: {
        options: {
          baseDir: 'www',
          outputDir: 'public',
        }
      },
      options: {
        fileFormat: 'json',
        exclude: ['components/'],
        locales: ['en', 'fr'],
        locale: 'en',
        localesPath: 'locales'
      }
    }
  });
  grunt.loadNpmTasks('grunt-i18n-static');
};
