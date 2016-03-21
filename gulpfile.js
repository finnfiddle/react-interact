var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var less = require('gulp-less');
// var del = require('del');
// var fs = require('fs-extra');

// gulp.task('clean', function(done) {
//   del.sync(paths.dist);
//   del.sync(path.join(paths.api, 'dist'));
//   done();
// });

// gulp.task('copy:fonts', function(done) {
//   fs.copy(path.join(paths.src, 'fonts'), path.join(paths.dist, 'fonts'), done);
// });

gulp.task('connect', function(done) {
  var express = require('express');
  var port = 8082;
  var app = express();

  // serve static assets normally
  app.use('', express.static(__dirname));

  app.listen(port);
  console.log("server started on port " + port);
});

const j = require('jade')
j.filters.escape = function( block ) {
  return block
    // .replace( /&/g, '&amp;'  )
    .replace( /</g, '&lt;'   )
    .replace( />/g, '&gt;'   );
    // .replace( /"/g, '&quot;' )
    // .replace( /#/g, '&#35;'  )
    // .replace( /\\/g, '\\\\'  )
    // .replace( /\n/g, '\\n'   );
};

gulp.task('jade', function(done){
  gulp
    .src('source/jade/*.jade')
    .pipe(jade({
      pretty: true,
      jade: j,
      locals: {
        uri_prefix: '',
      }
    }))
    .pipe(gulp.dest(''))
    .on('end', done);
});

gulp.task('jade:prod', function(done){
  gulp
    .src('source/jade/*.jade')
    .pipe(jade({
      pretty: true,
      jade: j,
      locals: {
        uri_prefix: '/react-interact',
      }
    }))
    .pipe(gulp.dest(''))
    .on('end', done);
});

gulp.task('less', function(done) {
  gulp.src('source/less/main.less')
    .pipe(less())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('css'))
    .on('end', done);
});

gulp.task('watch', function() {
	gulp.watch('**/*.less', ['less']);
	gulp.watch('**/*.jade', ['jade']);
});

gulp.task('default', [
  // 'clean',
  'less',
  'jade',
  'connect',
  'watch',
]);

gulp.task('prod', [
  // 'clean',
  'less',
  'jade:prod',
]);
