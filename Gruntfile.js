module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // JS
    concat: {
      all: {
        files: {
          'build/app/webroot/js/libs.js': ['src/app/webroot/js/libs/jquery/jquery.js', 'src/app/webroot/js/libs/**/*.js'],
          'build/app/webroot/js/<%= pkg.name %>.js': 'src/app/webroot/js/scripts/**/*.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      project: {
        src: 'build/app/webroot/js/<%= pkg.name %>.js',
        dest: 'build/app/webroot/js/<%= pkg.name %>.min.js'
      },
      libs: {
        src: 'build/app/webroot/js/libs.js',
        dest: 'build/app/webroot/js/libs.min.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        }
      }
    },
    // CSS
    sass: {
        dist: {
            files: {
                'build/app/webroot/css/<%= pkg.name %>.css': 'src/app/webroot/scss/style.scss',
            }
        }
    },
    csslint: {
      scssoutput: {
        options: {
          import: false
        },
        src: ['build/app/webroot/css/<%= pkg.name %>.css']
      }
    },
    cssmin: {
      compress: {
        options: {
          banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */'
        },
        files: {
          'build/app/webroot/css/<%= pkg.name %>.min.css': 'build/app/webroot/css/<%= pkg.name %>.css'
        }
      },
    },
    // General
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: ['*'], dest: 'build/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['app/**'], dest: 'build/'},
          {expand: true, cwd: 'src/',src: ['lib/**'], dest: 'build/'},
          {expand: true, cwd: 'src/',src: ['plugins/**'], dest: 'build/'},
          {expand: true, cwd: 'src/',src: ['vendors/**'], dest: 'build/'}
        ]
      }
    },
    watch: {
      files: 'src/**/*',
      tasks: ['sass', 'concat', 'copy']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('minify', ['sass', 'concat', 'cssmin', 'uglify']);
  grunt.registerTask('build', ['sass', 'concat', 'cssmin', 'uglify', 'copy']);

};