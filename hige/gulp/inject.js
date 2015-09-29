'use strict';

var gulp = require('gulp'),
    preprocess = require('gulp-preprocess'),
    argv = require('yargs').argv;

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

gulp.task('preprocess',function(done){
  console.log(paths.src + '/env .js');
  console.log(paths.src + '/commons/env.js');
    return gulp.src([paths.src + '/env.js'])
    .pipe(preprocess({
      context: {
        REVISION: argv.revision || 'DEV'
    }
    }))
    .pipe(gulp.dest(paths.src + '/commons/'));
    })

gulp.task('inject', ['preprocess','styles'], function () {

  var injectStyles = gulp.src([
    paths.tmp + '/serve/{app,components,commons}/**/*.css',
    '!' + paths.tmp + '/serve/app/vendor.css',
    '!' + paths.tmp + '/serve/app/index_dark.css',
    '!' + paths.tmp + '/serve/app/index_light.css'
  ], { read: false });

  var injectScripts = gulp.src([
    paths.src + '/{app,components,services,commons}/**/*.js',
    '!' + paths.src + '/{app,components,services,commons}/**/*.spec.js',
    '!' + paths.src + '/{app,components,services,commons}/**/*.mock.js'
  ]).pipe($.angularFilesort());

  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components',
    exclude: [/bootstrap\.css/, /bootstrap\.css/, /foundation\.css/]
  };

  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));

});
