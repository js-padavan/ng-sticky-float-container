var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var deploy = require('gulp-gh-pages');

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: false
  });
});

gulp.task('watch', function(){
    gulp.watch('demo/index.html', function(){
        gulp.run('index');
    });

    gulp.watch('src/**/*.js', function() {
      gulp.run('js');
    })
});


gulp.task('index', function () {
  var target = gulp.src('demo/index.html');
  var sources = gulp.src(['**/*.js'], {cwd: 'src', read: false});

  return target.pipe(inject(sources)).pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
  return gulp.src('src/*.js').pipe(gulpCopy('dist/', {prefix: 1}))
})


gulp.task('build', ['index', 'js']);

gulp.task('serve', ['watch', 'connect']);

gulp.task('deploy', ['build'], function() {
  return gulp.src("./dist/**/*").pipe(deploy());
})
