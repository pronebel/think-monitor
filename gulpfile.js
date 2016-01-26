var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  usemin = require('gulp-usemin'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch'),
  webpack = require('webpack-stream'),
  minifyCss = require('gulp-minify-css'),
  minifyJs = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename');

var paths = {
  srcFiles: ['spa/src/**/*.*'],
  entry: 'spa/src/index.js',
  index: 'spa/index.html',
  staticRes: 'spa/assets/**/*.*',
  fonts: [
    'node_modules/bootstrap/dist/fonts/*.{woff, woff2}', 
    'node_modules/font-awesome/fonts/*.{woff, woff2}', 
    'bower_components/rdash-ui/dist/fonts/*.{woff, woff2}'],
  dstFiles: ['www/static/**/*.*']
};

/**
 * Handle bower components from index
 */
gulp.task('usemin', function() {
  return gulp.src(paths.index)
    .pipe(usemin({
      js: [minifyJs(), 'concat'],
      css: [minifyCss({
        keepSpecialComments: 0
      }), 'concat'],
    }))
    .pipe(gulp.dest('www/static/'));
});

gulp.task('webpack', function() {
  return gulp.src(paths.entry)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename('build.js'))
    .pipe(gulp.dest('www/static/dist/'));
});

gulp.task('fem', function() {
  return gulp.src('fem/index.js')
      .pipe(webpack(require('./fem.config.js')))
      .pipe(rename('monitor.js'))
      .pipe(gulp.dest('www/static/fem'));
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-fonts']);

gulp.task('copy-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(rename({
      dirname: '/fonts'
    }))
    .pipe(gulp.dest('www/static/'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['copy-static']);

gulp.task('copy-static', function() {
  return gulp.src(paths.staticRes)
    .pipe(gulp.dest('www/static/assets'));
});

/**
 * Live reload server
 */
gulp.task('webserver', function() {
  connect.server({
    root: 'build/',
    livereload: true,
    port: 5000
  });
});

gulp.task('livereload', function() {
  gulp.src(paths.dstFiles)
    .pipe(connect.reload());
});

/**
 * Watch custom files
 */
gulp.task('watch', function() {
  gulp.watch([paths.staticRes], ['copy-static']);
  gulp.watch([paths.index], ['usemin']);
  gulp.watch(paths.srcFiles, ['webpack']);
  gulp.watch(paths.dstFiles, ['livereload']);
});

/**
 * Gulp tasks
 */
gulp.task('build', ['webpack', 'usemin', 'build-assets', 'build-custom']);
gulp.task('default', ['build', 'webserver', 'watch']);