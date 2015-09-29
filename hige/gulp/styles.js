'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {

  var lessOptions = {
    paths: [
      'bower_components',
      paths.src + '/app',
      paths.src + '/components'
    ]
  };

  var srcList = [
    '!' + paths.src + '/app/vendor.less',
    '!' + paths.src + '/app/index_light.less',
    '!' + paths.src + '/app/index_dark.less',
    '!' + paths.src + '/app/rtl.less',
    paths.src + '/{app,components}/**/*.less',
    paths.src + '/commons/{components,directives}/**/*.less',
    paths.src + '/commons/styles/*.less'
  ];


  var injectFiles = gulp.src(srcList, { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(paths.src + '/app/', '');
      filePath = filePath.replace(paths.src + '/components/', '../components/');
      filePath = filePath.replace(paths.src + '/commons/', '../commons/');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var indexDarkFilter = $.filter('index_dark.less'),
      indexLightFilter = $.filter('index_light.less');

  return gulp.src([
    paths.src + '/app/rtl.less',
    paths.src + '/app/vendor.less',
    paths.src + '/app/index_dark.less',
    paths.src + '/app/index_light.less'
  ])
    .pipe(indexDarkFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexDarkFilter.restore())
    //.pipe($.less())
    .pipe(indexLightFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexLightFilter.restore())
    .pipe($.less())

  .pipe($.autoprefixer())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    //.pipe($.replace('/bower_components/bootstrap/fonts/','../fonts/'))
    .pipe(gulp.dest(paths.tmp + '/serve/app/'));
});
