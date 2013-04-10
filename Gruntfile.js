module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // JS
    concat: {
      development: {
        files: {
          'build/app/webroot/js/libs.js': ['src/app/webroot/js/libs/jquery/jquery.js', 'src/app/webroot/js/libs/**/*.js'],
          'build/app/webroot/js/<%= pkg.name %>.js': 'src/app/webroot/js/scripts/**/*.js'
        }
      },
      production: {
        files: {
          'release/app/webroot/js/libs.js': ['src/app/webroot/js/libs/jquery/jquery.js', 'src/app/webroot/js/libs/**/*.js'],
          'release/app/webroot/js/<%= pkg.name %>.js': 'src/app/webroot/js/scripts/**/*.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      project: {
        src: 'release/app/webroot/js/<%= pkg.name %>.js',
        dest: 'release/app/webroot/js/<%= pkg.name %>.min.js'
      },
      libs: {
        src: 'release/app/webroot/js/libs.js',
        dest: 'release/app/webroot/js/libs.min.js'
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
        development: {
            files: {
                'build/app/webroot/css/<%= pkg.name %>.css': 'src/app/webroot/scss/style.scss'
            }
        },
        production: {
            files: {
                'release/app/webroot/css/<%= pkg.name %>.css': 'src/app/webroot/scss/style.scss'
            }
        }
    },
    csslint: {
      scssoutput: {
        options: {
          'vendor-prefix': false,
          'adjoining-classes': false
        },
        src: ['release/app/webroot/css/<%= pkg.name %>.css']
      }
    },
    cssmin: {
      compress: {
        options: {
          banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */'
        },
        files: {
          'release/app/webroot/css/<%= pkg.name %>.min.css': 'release/app/webroot/css/<%= pkg.name %>.css'
        }
      }
    },
    // General
    copy: {
      development: {
        files: [
          {expand: true, cwd: 'src/', src: ['*'], dest: 'build/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['app/**'], dest: 'build/'},
          {expand: true, cwd: 'src/',src: ['lib/**'], dest: 'build/'},
          {expand: true, cwd: 'src/',src: ['plugins/**'], dest: 'build/'},
          {expand: true, cwd: 'src/',src: ['vendors/**'], dest: 'build/'}
        ]
      },
      production: {
        files: [
          {expand: true, cwd: 'src/', src: ['*'], dest: 'release/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['app/**'], dest: 'release/'},
          {expand: true, cwd: 'src/',src: ['lib/**'], dest: 'release/'},
          {expand: true, cwd: 'src/',src: ['plugins/**'], dest: 'release/'},
          {expand: true, cwd: 'src/',src: ['vendors/**'], dest: 'release/'}
        ]
      },
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
  grunt.registerTask('minify', ['sass:production', 'concat:production', 'cssmin', 'uglify']);
  grunt.registerTask('build', ['sass:development', 'concat:development', 'copy:development']);
  grunt.registerTask('release', ['sass:production', 'concat:production', 'cssmin', 'uglify', 'copy:production']);

};