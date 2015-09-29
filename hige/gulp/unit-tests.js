'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

var zip = require('gulp-zip');

var paths = gulp.paths;

function runTests (singleRun, done) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    paths.src + '/{app,components,services,commons}/**/*.js'
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
}


function coverageReport(){
  gulp.src('coverage/report-html/**/*')
        .pipe(zip('coverage.zip'))
        .pipe(gulp.dest(''));
};

gulp.task('test', [], function (done) {
  runTests(true /* singleRun */, done);
  coverageReport(done);
});
gulp.task('test:auto', function (done) { runTests(false /* singleRun */, done) });
