module.exports = function(grunt) {
  this.initConfig({
    coffeelint: {
      app: {
        files: {
          src: ["src/main.coffee", "test/test.coffee"]
        },
        options: {
          configFile: 'coffeelint.json'
        }
      }
    },
    coffee: {
      options: {
        bare: true
      },
      glob: {
        expand: true,
        cwd: '.',
        src: ["**/*.coffee"],
        dest: ".",
        ext: '.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      coffeeDev: {
        files: ["**/*.coffee"],
        tasks: ['default']
      }
    }
  });
  this.registerTask('default', ['coffeelint', 'coffee', 'mochaTest']);
  this.loadNpmTasks('grunt-coffeelint');
  this.loadNpmTasks('grunt-contrib-coffee');
  this.loadNpmTasks('grunt-contrib-watch');
  return this.loadNpmTasks('grunt-mocha-test');
};
