'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpIf = require('gulp-if');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe(gulpIf(conf.flags.loadStyles, $.inject(injectStyles, injectOptions)))
    .pipe(gulpIf(conf.flags.loadScript, $.inject(injectScripts, injectOptions)))
    .pipe(gulpIf(conf.flags.loadBowerScriptAndStyles, wiredep(_.extend({}, conf.wiredep))))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
