// TODO: where should this file live? can this file live inside "ux"?

var   gulp    = require('gulp'),
      clean   = require('gulp-clean'),
      github  = require('gulp-gh-pages'),
      sass    = require('gulp-sass');

var bases = {
  build: '.temp/',
  app: 'ux/'
}

var paths = {
  css: 'style/',
  extras: ['extras/**/*'],
  font: ['font/'],
  html: ['html/**/*.htm'],
  js: ['scripts/**/*.js'],
  sass: ['scss/**/*.scss'],
  script: 'script/'
}

// CLean the build folder
gulp.task('clean', function() {
  return gulp.src(bases.build)
    .pipe(clean());
});

gulp.task('sass', ['clean'], function(){
  return gulp.src(paths.sass, {cwd: bases.app})
    .pipe(sass({
      includePaths: ['node_modules/normalize-scss/sass'], // include normalize for use in css
    })) // Using gulp-sass
    .pipe(gulp.dest(bases.build + paths.css));
});

gulp.task('html', ['clean'], function(){
  return gulp.src(paths.html, {cwd: bases.app})
    .pipe(gulp.dest(bases.build));
});

gulp.task('extras', ['clean'], function(){
  return gulp.src(paths.extras, {cwd: bases.app})
    .pipe(gulp.dest(bases.build));
});

// TODO: make this an array somehow
// TODO: this copies the font-awesome/4.4.0 folder (which wont go to github anyway)
gulp.task('font', ['clean'], function(){
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(bases.build + paths.font + 'font-awesome/'));
});

gulp.task('gh-pages', ['build'], function(){
  return gulp.src(bases.build + '**/*')
    .pipe(github({
      cacheDir: '.temp/.publish',
      message: 'Repo Deploy Github Pages: ' + new Date().toISOString()
    }));
});

gulp.task('build', ['clean','sass','html','extras','font']);
gulp.task('deploy', ['build','gh-pages']);
gulp.task('default', ['build']);
