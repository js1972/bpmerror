/*global module:false, require*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Task configuration.
		jshint: {
			options: {
				"jshintrc": true
			},

			gruntfile: {
				src: "Gruntfile.js"
			},
			application: {
				src: ["model/**/*.js", "util/**/*.js", "view/**/*.js", "*.js"  , "!model/ODataModelFakeService.js"
				]
			}
		},


		//qunit: {
		//	all: {
		//		src: ["test/**/*.html"]
		//	}
		//},


		watch: {
			gruntfile: {
				files: "<%= jshint.gruntfile.src %>",
				tasks: ["jshint:gruntfile"]
			},
			//qunit: {
			//	files: ["<%= jshint.application.src %>", "<%= qunit.all.src %>"],
			//	tasks: ["qunit"]
			//},
			application: {
				files: "<%= jshint.application.src %>",
				tasks: ["jshint:application"]
			}  ,
				livereload: {
					options: {
						livereload: "<%= connect.options.livereload %>"
					},
					//files: "<%= jshint.application.src %>" // Be careful to not watch npm dependencies
					files: ["model/**/*.js", "util/**/*.js", "view/**/*.js", "*.js", "view/**/*.xml"  , "!model/ODataModelFakeService.js"
					]
				}
		},


		open: {
			root: {
				path: "http://<%= connect.options.hostname %>:<%= connect.options.port %>",
				options: {
					delay: 500
				}
			}
		},


		connect: {
			options: {
				port: 8080,
				livereload: 35729,
				hostname: "localhost",
				base: [".", "../sapui5"]
			},

			//=====================================================================
			//RESOURCE PROXY - un-comment the proxies setting below to configure
			//a proxy. context, host and changeOrigin are necessary. port defaults
			//to 80 anyway and rewrite allows you to re-write the url's sent to
			//the target host if you require this.
			//Also un-comment the connect middleware option under the
			//connect:livereload target - this starts the proxy which looks up
			//the proxies setting to determine which services to act on.
			//When not using grunt-connect-proxy you still must have the
			//livereload target for connect.
			//

			/*
			 * (1) Proxy the odata resources for /bpmodata to thge POY server.
			 * (2) Proxy the sapui5 resources from the /sapui5 directory to
			 *     the /latest directory. This way we can use the PI-Java UI5
			 *     location in our apps but still have them work with localhost
			 *     since on PI the is no grunt (threfore this proxy doesnt
			 *     exist)!
			 */
			proxies: [
				{
					context: "/bpmodata",  // When the url contains this...
					host: "app1pod.inpex.com.au", // Proxy to this host
					changeOrigin: true,
					port: 58200
				},
				{
					context: "/sapui5",  // When the url contains this...
					host: "localhost", // Proxy to this host
					changeOrigin: false,
					port: 8080,
					rewrite: {
						"^/sapui5": "/latest"
					}
				}
			],
			//=====================================================================

			// Requires the Livereload browser extension or a middleware to inject the livereload script
			livereload: {
				options: {
					middleware: function(connect, options) {
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require("grunt-connect-proxy/lib/utils").proxyRequest];

						// Serve static files.
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});

						return middlewares;
					}
				}
			}
		}
	});


	// These plugins provide necessary tasks
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-open");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-connect-proxy");


	grunt.registerTask("default", ["jshint", "qunit:all", "watch"]);
	grunt.registerTask("serve", function() {
		grunt.task.run([
			"configureProxies",
			"connect:livereload",
			"open",
			"watch"
		]);
	});
};