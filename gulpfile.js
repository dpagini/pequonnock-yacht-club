// TODO: where should this file live? can this file live inside "ux"?

var   gulp      = require('gulp'),
      clean     = require('gulp-clean'),
      github    = require('gulp-gh-pages'),
      open      = require('opn'),
      plumber   = require('gulp-plumber'),
      sequence  = require('run-sequence'),
      sass      = require('gulp-sass'),
      util      = require('gulp-util'),
      webserver = require('gulp-webserver');

var bases = {
  build: '.temp/',
  app: 'ux/'
}

var paths = {
  css: 'style/',
  extras: ['extras/**/*'],
  font: ['font/'],
  html: ['html/**/*.htm'],
  img: ['images/**/*'],
  js: ['scripts/**/*.js'],
  sass: ['scss/**/*.scss'],
  script: 'script/'
}

var server = {
  host: 'localhost',
  port: '8011',
  page: 'index.htm'
}

var onError = function(e) {
  util.beep();
  console.log(e);
}

// CLean the build folder
gulp.task('clean', function() {
  return gulp.src(bases.build,{read: false})
    .pipe(clean({force: true}));
});

gulp.task('sass', function(){
  return gulp.src(paths.sass, {cwd: bases.app})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({
      includePaths: ['node_modules/normalize-scss/sass'], // include normalize for use in css
    })) // Using gulp-sass
    .pipe(gulp.dest(bases.build + paths.css));
});

gulp.task('html', function(){
  return gulp.src(paths.html, {cwd: bases.app})
    .pipe(gulp.dest(bases.build));
});

gulp.task('extras', function(){
  return gulp.src(paths.extras, {cwd: bases.app})
    .pipe(gulp.dest(bases.build));
});

gulp.task('images', function(){
  return gulp.src(paths.img, {cwd: bases.app})
    .pipe(gulp.dest(bases.build + 'images/'));
});

// TODO: make this an array somehow
// TODO: this copies the font-awesome/4.4.0 folder (which wont go to github anyway)
gulp.task('font', function(){
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(bases.build + paths.font + 'font-awesome/'));
});

gulp.task('webserver', ['build'], function(){
  gulp.src(bases.build)
    .pipe(webserver({
      host: server.host,
      port: server.port,
      fallback: server.page, // TODO: this is like the 404 page, we need it to read the index.htm of a folder
      livereload: true,
      directoryListing: false
    }));
});

gulp.task('browse',['webserver'], function() {
  open('http://' + server.host + ':' + server.port);
});

gulp.task('watch', ['build','webserver'], function(){
  gulp.watch(bases.app + paths.sass, ['sass']);
  gulp.watch(bases.app + paths.html, ['html']);
});

gulp.task('gh-pages', ['build'], function(){
  return gulp.src(bases.build + '**/*')
    .pipe(github({
      cacheDir: '.temp/.ghpages',
      message: 'Repo Deploy Github Pages: ' + new Date().toISOString()
    }));
});

gulp.task('build', function(callback) {
  // per https://www.npmjs.com/package/run-sequence
  // this may be deprecated when gulp 4.0 is out
  sequence(
    'clean',
    ['sass','html','extras','font','images'],
    callback // required
  );
});
gulp.task('local', ['build','webserver','browse','watch']);
gulp.task('deploy', ['build','gh-pages']);
gulp.task('default', ['local']);
