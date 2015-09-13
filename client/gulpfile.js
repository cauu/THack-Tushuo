//This file will process all of the assets in the 'src' folder,
//combines them into 'build' folder as a finished app

//1. LIBRARIES
//------------
var gulp = require('gulp');
var Server = require('karma').Server;
var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var rimraf = require('rimraf');
var router = require('front-router');
var sequence = require('run-sequence');

//Check for --production flag
var isProduction = !!(argv.production);

//2. FILE PATHS
//------------

var paths = {
    //Include js, html and scss files
    assets: [
      './src/**/*.*',
      '!./src/{scss,js,views}/*.*',
      '!./src/js/**/*.*',
    ],
    // Sass will check these folders for files when you @import
    sass: [
      './src/scss',
      './bower_components/foundation-apps/scss',
      './bower_components/slick-carousel/slick'
    ],
    //These files include Foundation for Apps and its dependencies
    foundationJS: [
      'bower_components/fastclick/lib/fastclick.js',
      'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
      'bower_components/tether/tether.js',
      'bower_components/hammerjs/hammer.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/slick-carousel/slick/slick.js',
      'bower_components/ryanmullins-angular-hammer/angular.hammer.js',
      'bower_components/angular-slick-carousel/dist/angular-slick.min.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-carousel/dist/angular-carousel.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/oclazyload/dist/ocLazyLoad.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-base64/angular-base64.js',
      'bower_components/angular-md5/angular-md5.js',
      'bower_components/angular-bootstrap/ui-bootstrap.min.js',
      'bower_components/plupload/js/plupload.full.min.js',
      'bower_components/qiniu/src/qiniu.js',
      'bower_components/foundation-apps/js/vendor/**/*.js',
      'bower_components/foundation-apps/js/angular/**/*.js',
      '!bower_components/foundation-apps/js/angular/app.js'
    ],
    //These files are for your app's Javascript
    //Remember to refresh this list when adding new files
    appJS: [
        './src/js/app.js',
        './src/js/**/main.js',
        './src/js/services/*.js',
        './src/js/**/*.js'
    ]
};

//3. TASKS
//--------
//
/**
 * * Run test case once and exit
 * */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done).start();
});

//Cleans the build directory
//Clean means delete all files in build directory
//rimraf is the node module for 'rm -rf' command
gulp.task('clean', function(cb) {
    rimraf('./build', cb);
});

//Copies everything in the client folder except templates, sass and js
gulp.task('copy', function() {
    return gulp.src(paths.assets, {
        base: './src/'
    })
      .pipe(gulp.dest('./build'));
});

// Copies app's page templates and generates URLs for them
gulp.task('copy:templates', function() {
    return gulp.src('./src/views/*.html')
      .pipe(router({
        path: 'build/js/routes.js',
        root: 'src'
      }))
        .pipe(gulp.dest('./build/views'));
});

//Compiles the Foundatin for Apps directive partial into
//a single Javascript file
gulp.task('copy:foundation', function(cb) {
    gulp.src('bower_components/foundation-apps/js/angular/components/**/*.html')
      .pipe($.ngHtml2js({
        prefix: 'components/',
        moduleName: 'foundation',
        declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./build/js'));

    // Iconic SVG icons
    gulp.src('./bower_components/foundation-apps/iconic/**/*')
      .pipe(gulp.dest('./build/img/iconic/'))
    ;

    cb();
});

// Compiles Sass
gulp.task('sass', function () {
  return gulp.src('src/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/css/'))
  ;
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:app'])

gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./build/js/'))
  ;
});

gulp.task('uglify:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.appJS)
    .pipe(uglify)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/js/'))
  ;
});

// Starts a test server, which you can view at http://localhost:8079
gulp.task('server', ['build'], function() {
  gulp.src('./build')
    .pipe($.webserver({
      port: 8079,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});
//Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', ['copy', 'copy:foundation', 'sass', 'uglify'], 'copy:templates', cb);
});

//Default task: build your app, starts a server and recompile assets 
//when they changed
gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['./src/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./src/js/**/*', './js/**/*'], ['uglify:app']);

  // Watch static files
  gulp.watch(['./src/**/*.*', '!./src/views/**/*.*', '!./src/{scss,js}/**/*.*'], ['copy']);

  // Watch app templates
  gulp.watch(['./src/views/**/*.html'], ['copy:templates']);
});
