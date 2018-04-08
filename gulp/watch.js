'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.less')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});


gulp.task('live', ['build'], function () {

  conf.flags.loadBowerScriptAndStyles = false;

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.less')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.src(path.join(conf.paths.dist, '/scripts/app.js')).pipe(gulp.dest(path.join(conf.paths.tmp, '/')));
      gulp.src(path.join(conf.paths.dist, '/index.html')).pipe(gulp.dest(path.join(conf.paths.tmp, '/')));
      conf.flags.loadStyles = true;
      conf.flags.loadScript = false;
      runSequence('build', function() {
          console.log('build completed for styles change..')
          gulp.src(path.join(conf.paths.tmp, '/app.js')).pipe(gulp.dest(path.join(conf.paths.dist, '/scripts/')));
          gulp.src(path.join(conf.paths.tmp, '/index.html')).pipe(gulp.dest(path.join(conf.paths.dist, '/')));
      });

    } else {
      console.log('********* please restart the gulp live **************');
    }
  });

  gulp.watch([path.join(conf.paths.src, '/app/**/*.js'), path.join(conf.paths.src, '/app/**/*.html')], function(event) {
    if(isOnlyChange(event)) {
      gulp.src(path.join(conf.paths.dist, '/index.html')).pipe(gulp.dest(path.join(conf.paths.tmp, '/')));
      conf.flags.loadStyles = false;
      conf.flags.loadScript = true;
      runSequence('build', function() {
          console.log('build completed for script/html change..');
          gulp.src(path.join(conf.paths.tmp, '/index.html')).pipe(gulp.dest(path.join(conf.paths.dist, '/')));
      });
    } else {
      console.log('********* please restart the gulp live **************');
    }
  });
});
