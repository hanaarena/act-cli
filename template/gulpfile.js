const gulp = require('gulp');
const rollup = require('gulp-rollup');
const eslint = require('rollup-plugin-eslint');
const uglify = require('rollup-plugin-uglify');
const bs = require('browser-sync');
const concat = require('gulp-concat');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');

const browserSync = bs.create();
const reload = browserSync.reload;
const AUTOPREFIXER_BROWSERS = [
  'last 3 versions',
  'ie >= 8',
  'ios >= 7',
  'android >= 4.4'
];

gulp.task('script', function() {
  gulp.src('./src/script/*.js')
    .pipe(rollup({
      entry: 'src/script/index.js',
      format: 'iife',
      plugins: [
        eslint({
          exclude: [
            'src/style/**',
          ]
        }),
        uglify()
      ]
    }))
    .pipe(gulp.dest('./dest/script/'))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('css', function () {
  return gulp.src('./src/style/*.less')
    .pipe(less({}))
    .pipe(concat('index.css'))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(minifycss())
    .pipe(gulp.dest('./dest/style/'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('watch', function () {
  // run local server
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.start(['css', 'script']);

  gulp.watch('./index.html').on('change', reload);
  gulp.watch('./src/style/*.less', ['css']);
  gulp.watch('./src/script/*.js', ['script']);
});
