/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    jshint: {
      app:  ['src/js/**/*.js'],
      test: ['test/*_helper.js', 'test/support/**/*.js', 'test/tests/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    neuter: {
      app: {
        // src: 'src/app.js',
        // dest: 'build/app.js'
        files: {'build/app.js': ['src/**/*.js']}
      },
      test: {
        src: ['test/*_helper.js', 'test/support/**/*.js', 'test/tests/*.js'],
        dest: 'build/tests.js'
      }
    },

    copy: {
      html: {
        src: 'src/index.html', dest: 'build/index.html'
      },
      test_html: {
        src: 'test/test.html', dest: 'build/test.html'
      },
      test_css: {
        src: 'test/vendor/mocha.css', dest: 'build/mocha.css'
      },
      test_images: {
        expand: true,
        cwd: 'test/vendor/images',
        src: ['**'],
        dest: 'build/images'}
    },

    concat: {
      vendor: {
        src: ['lib/jquery-1.9.1.js',
              'lib/handlebars.js',
              'lib/ember.js',  // 1.0.0-rc.1
              'lib/ember-data.js'],
        dest:'build/vendor.js'
      },
      test_vendor: {
        src: ['test/test_helper.js',
              'test/vendor/mocha.js',
              'test/vendor/chai.js'],
        dest: 'build/test_vendor.js'
      }
    },

    notify : {
      build : {
        options: {
          message : 'Carry on ...',
          title : 'Build complete'
        }
      }
    },

    ember_templates: {
      app: {
        options: {
          templateName: function(libFile) {
            return libFile.replace(/src\/templates\//, '');
          }
        },
        files: {'build/templates.js': ['src/templates/**/*.hbs']}
      }
    },

    watch: {
      files: ['Gruntfile.js', 'src/**/*', 'lib/**/*', 'test/**/*'],
      tasks: ['app', 'test', 'notify:build']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-neuter');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-ember-templates');

  grunt.registerTask('app', [/*'jshint:app',*/'ember_templates', 'copy:html',  'neuter:app']);
  grunt.registerTask('test', [/*'jshint:test',*/ 'neuter:test', 'copy:test_html', 'copy:test_css', 'copy:test_images']);
  grunt.registerTask('vendor', ['concat:vendor', 'concat:test_vendor']);


  grunt.registerTask('default', ['app', 'test', 'vendor', 'notify:build', 'watch']);
};
