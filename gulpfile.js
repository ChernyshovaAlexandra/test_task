const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src('src/js/*.js')
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('minify-css', function () {
  return gulp.src('src/css/*.css')
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(replace({
      'css': '/css/styles.min.css',
      'js': '/js/app.min.js'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});
gulp.task('images', function () {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  browserSync.init({
    server: './src',
  });

  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/*.js', gulp.series('scripts'));
  gulp.watch('src/css/*.css', gulp.series('minify-css'));
  gulp.watch('src/*.html', gulp.series('html', browserSync.reload));
});

gulp.task('default', gulp.series('sass', 'scripts', 'minify-css', 'html', 'images', "watch"));
