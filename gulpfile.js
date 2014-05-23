// Ah, Big Gulp's eh? Welp, see ya later.
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    c = require('chalk'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    map = require('map-stream'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scsslint'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

// Directories
var SRC = 'public/assets',
    DIST = 'public/dist';


// SCSS Linting, Compiling and Minification
var scssLintReporter = function(file) {
  if ( !file.scsslint.success ) {
    gutil.beep();
    notify().write({ message: file.scsslint.errorCount + ' error in scss' });

    // Loop through the warnings/errors and spit them out
    file.scsslint.results.forEach(function(result) {
      var msg =
         c.cyan(file.path) + ':' +
         c.red(result.line) + ' ' +
         ('error' === result.severity ? c.red('[E]') : c.cyan('[W]')) + ' ' +
         result.reason;
      gutil.log(msg);
    });

  } else {
    notify().write({ message: 'SCSS Linted' });
    gulp.start('styles');
  }
};


gulp.task('scss-lint', function() {
  gulp.src(SRC + '/styles/app.scss')
    .pipe(scsslint({
      'config': '.scss-lint.yml'
    }))
    .pipe(scsslint.reporter(scssLintReporter));
});


gulp.task('styles', function(){
  gulp.src(SRC + '/styles/app.scss')
    .pipe(
      sass({
        outputStyle: 'expanded',
        debugInfo: true,
        lineNumbers: true,
        errLogToConsole: true,
        onSuccess: function(){
          notify().write({ message: "SCSS Compiled successfully!" });
        },
        onError: function(err) {
          gutil.beep();
          notify().write(err);
        }
      })
    )
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe( gulp.dest(DIST + '/styles') )
    .pipe(livereload(server));
});


// JS files we'll be using
var JS = [
  SRC + '/js/**/*!(app)*.js',
  SRC + '/js/app.js'
];


// Custom JS Hint Reporter
var jsHintReporter = map(function(file) {
  if ( !file.jshint.success ) {
    gutil.beep();
    notify().write({ message: file.jshint.errorCount + ' error in js' });

    // Loop through the warnings/errors and spit them out
    file.jshint.results.forEach(function(err) {
      if (err) {
        var msg =
           c.cyan(file.path) + ':' +
           c.red(err.line) + ' ' +
           ('error' === err.severity ? c.red('[E]') : c.cyan('[W]')) + ' ' +
           err.reason;
        gutil.log(msg);
      }
    });

  } else {
    notify().write({ message: 'SCSS Linted' });
    gulp.start('styles');
  }
});


// JS Lint
gulp.task("js-lint", function() {
  gulp.src( JS )
  .pipe(jshint())
  .pipe(jsHintReporter);
});


// JS Scripts
gulp.task("scripts", function() {
  gulp.src( JS )
    .pipe(concat('main.js'))
    .pipe(gulp.dest(DIST + '/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DIST + '/js'));
});


// Image Minification
gulp.task('image-min', function () {
    return gulp.src( SRC + '/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest( DIST + '/images' ))
        .pipe(notify('Images compressed'));
});


// Fonts
gulp.task('fonts', function() {
  gulp.src(SRC + '/fonts/**/*')
  .pipe(gulp.dest(DIST + '/fonts'));
});


// Clean dist directory for rebuild
gulp.task('clean', function() {
  return gulp.src(DIST, {read: false})
    .pipe(clean());
});


// Do the creep, ahhhhhhh! (http://youtu.be/tLPZmPaHme0?t=7s)
gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    // Watch .scss files
    gulp.watch(SRC + '/styles/**/*.scss', ['scss-lint', 'styles']);

    // Watch .js files to lint and build
    gulp.watch(SRC + '/js/*.js', ['js-lint', 'scripts']);

    // Watch image files
    gulp.watch( SRC + '/images/**/*', ['image-min']);

  });

});


// Gulp Default Task
gulp.task('default', ['scss-lint', 'js-lint', 'scripts', 'fonts', 'image-min', 'watch']);
