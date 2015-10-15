module.exports = (grunt) ->	
	@initConfig
		
		##############################################
		
		coffeelint:
			app:
				files:
					src: ["src/main.coffee", "test/test.coffee"]
				options:
					configFile: 'coffeelint.json'

		coffee: 
			options:
				bare: true
			glob:
				expand: true
				cwd: '.'
				src: ["src/**/*.coffee", "test/**/*.coffee"]
				dest: "."
				ext: '.js'

		mochaTest:
			test:
				options:
					reporter: 'spec'
					clearRequireCache: true
					timeout: 5000
				src: ['test/test.js']

		##############################################

		watch:
			coffeeDev:
				options:
					spawn: false
				files: ["**/*.coffee"]
				tasks: ['default']


	#######################################
	# Default task
	#######################################
	
	@registerTask 'default', [
		'coffeelint'
		'coffee'
		'mochaTest'
	]

	#######################################
	@loadNpmTasks 'grunt-coffeelint'
	@loadNpmTasks 'grunt-contrib-coffee'
	@loadNpmTasks 'grunt-contrib-watch'
	@loadNpmTasks 'grunt-mocha-test'