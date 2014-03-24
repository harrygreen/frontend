// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    //import modules
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jquerybuilder');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-server-mocha');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html-snapshot');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        timeout: {
            app: 'app',
            dist: 'dist',
            dev: 'dev',
            tests: 'tests',
            jquery_src: 'node_modules/jquery/src/'
        },

        dist: {
            options: {
             base: '<%= timeout.dist %>'
            }
        },

        //Setup a server for testing and preview
        connect: {
            server: {
                options: {
                  port: 8080,
                  base: './',
                  livereload: 35729
                }
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['node_modules/jquery/dist/jquery.js'],
                dest: 'dev/scripts/core.js',
            },
        },

        //Compile less
        less: {
            base: {
                options: {
                    paths: ['<%= timeout.app %>/styles']
                },
                files: {
                    '<%= timeout.dev %>/styles/timeout.css' : '<%= timeout.app %>/styles/timeout.less'
                }
            }
        },

        //watch files for changes// Watch is a blocking task, no other task is running while this one is running.
        watch: {
            less: {
                options: { livereload: true },
                files: ['<%= timeout.app %>/styles/**/*.less' ],
                tasks: ['less']
            },
            js : {
                options: { livereload: true },
                files: ['<%= timeout.app %>/scripts/**/*.js' ],
                tasks: ['copy:js', 'uglify']
            },
            tests: { // On Javascript Change run tests
                options: { livereload: true },
                files: '<%= timeout.tests %>/**/*.js',
                tasks: ['mocha-server']
            },
            gruntfile: {
                options: { livereload: true },
                files: ['GruntFile.js']
            },
            templates: {
                options: { livereload: true },
                files: ['<%= timeout.app %>/**/*.html' ],
                tasks: ['copy']
            }
        },

        //open browser to this address, probably v4.d/index
        open: {
            dev: {
                path: 'http://localhost:8080/dev/'
            }
        },

        clean: {
            all: ["dev", "dist", "cache"],
            dev: ["dev"],
            dist: ["dist"],
            cache: ["cache"]
        },

        copy: {
            index: {
                src:  '<%= timeout.app %>/index.html',
                dest: '<%= timeout.dev %>/index.html',
                filter: 'isFile'
            },
            templates: {
                expand: true,
                src:  '<%= timeout.app %>/templates/*',
                dest: '<%= timeout.dev %>/templates',
                filter: 'isFile',
                flatten: true
            },
            snapshots: {
                expand: true,
                src:  '<%= timeout.app %>/snapshots/*',
                dest: '<%= timeout.dev %>/snapshots',
                filter: 'isFile',
                flatten: true
            },
            js: {
                expand: true,
                src:  '<%= timeout.app %>/scripts/*',
                dest: '<%= timeout.dev %>/scripts',
                filter: 'isFile',
                flatten: true
            }
        },

        //Tests
        "mocha-server": {
            test: {
                src: 'tests/*.js',
                options: {
                    ui: 'tdd',
                    growl: true,
                    reporter: 'nyan',
                },
            },
        },

        uglify: {
            options: {
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
              files: [{
                  expand: true,
                  cwd: '<%= timeout.dev %>/scripts',
                  src: '**/*.js',
                  dest: '<%= timeout.dist %>/js'
              }]
            }
        },

        htmlSnapshot: {
            all: {
              options: {
                //that's the path where the snapshots should be placed
                //it's empty by default which means they will go into the directory
                //where your Gruntfile.js is placed
                snapshotPath: '<%= timeout.app %>/snapshots/',
                //This should be either the base path to your index.html file
                //or your base URL. Currently the task does not use it's own
                //webserver. So if your site needs a webserver to be fully
                //functional configure it here.
                sitePath: 'http://www.timeout.com/london',
                //you can choose a prefix for your snapshots
                //by default it's 'snapshot_'
                fileNamePrefix: 'sp_',
                //by default the task waits 500ms before fetching the html.
                //this is to give the page enough time to to assemble itself.
                //if your page needs more time, tweak here.
                msWaitForPages: 1000,
                //sanitize function to be used for filenames. Converts '#!/' to '_' as default
                //has a filename argument, must have a return that is a sanitized string
                sanitize: function (requestUri) {
                    //returns 'index.html' if the url is '/', otherwise a prefix
                    if (/\//.test(requestUri)) {
                      return 'index.html';
                    } else {
                      return requestUri.replace(/\//g, 'prefix-');
                    }
                },
                //if you would rather not keep the script tags in the html snapshots
                //set `removeScripts` to true. It's false by default
                removeScripts: false,
                //set `removeLinkTags` to true. It's false by default
                removeLinkTags: false,
                //set `removeMetaTags` to true. It's false by default
                removeMetaTags: false,
                //Replace arbitrary parts of the html
                replaceStrings:[
                    {'this': 'will get replaced by this'},
                    {'/old/path/': '/new/path'}
                ],
                // allow to add a custom attribute to the body
                bodyAttr: 'data-prerendered',
                //here goes the list of all urls that should be fetched
                urls: [
                  '',
                  '#!/en-gb/showcase'
                ],
                // a list of cookies to be put into the phantomjs cookies jar for the visited page
                cookies: [
                  {"path": "/", "domain": "localhost", "name": "lang", "value": "en-gb"}
                ]
              }
            }
        }
    });


    grunt.registerTask('customBuild_jquery', function () {
        var done = this.async();
        grunt.util.spawn({
            grunt: true,
            args: [''], //works negatively // 'ajax' , 'effects' etc
            opts: {
                cwd: 'node_modules/jquery'
            }
        }, function (err, result, code) {
            grunt.log.warn('A custom jquery version has been built.');
            done();
        });
    });


    grunt.registerTask('test', function () {
        grunt.task.run(['mocha-server']);
    });

    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean',
            'customBuild_jquery',   
            'concat',       
            'mocha-server',
            'less',
            'copy',
            'uglify'
        ]);
    });

    grunt.registerTask('snapshot', function () {
        grunt.task.run(['htmlSnapshot', 'copy:snapshots']);
    });

    //Register all Tasks you need to run
    grunt.registerTask('serve', function () {
        grunt.log.warn('Grunt will now open a browser and will watch your TypeScript and Less files for changes.');

        grunt.task.run([            
            'build',
            'connect',
            'open',
            'watch' //watch is a blocking action, should run at the end
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('default', function () {
        grunt.task.run(['serve']);
    });

}


/// TODO Add Chai and improve the testing framework
/// Sources:
/// https://github.com/pghalliday/grunt-mocha-test
/// http://visionmedia.github.io/mocha/
/// https://www.npmjs.org/package/grunt-server-mocha