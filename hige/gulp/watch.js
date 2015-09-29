'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch', ['inject'], function () {
  gulp.watch([
    paths.src + '/*.html',
    paths.src + '/{app,components,commons}/**/*.less',
    paths.src + '/{app,components,services,commons}/**/*.js',
    'bower.json'
  ], ['inject']);
});
