var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
//var minifyCss  = require('gulp-minify-css'); // gulp-minify-css を追加
var cssnext = require('gulp-cssnext');
var config = require('../config').sass;

var normalize = require('node-normalize-scss'); //初期化用css
//var reset = require('node-reset-scss'); //初期化用css なぜかSASSが落ちるのでコメントアウト
//var sanitize = require('sanitize.css'); //初期化用css パスが取れないので直接読み込み

var bourbon = require('node-bourbon'); //css framework bourbon の導入
var neat = require('node-neat');
bourbon.with(config.src + '/scss/common.scss');

gulp.task('sass', function() {
  gulp.src(config.src)
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    })) //sassのコンパイルエラーでもwatchが止まらないようにする仕組み
    .pipe(sass({includePaths: bourbon.includePaths.concat(neat.includePaths)
                                                    .concat(normalize.includePaths)}))
//    .pipe(minifyCss({advanced:false})) // minify
//    .on('error', function(err) {
//      console.log(err.message);
//    })
    .pipe(cssnext({
          browsers: 'last 2 versions'
      })) //ブラウザ間の差異を緩衝 参照：http://qiita.com/youthkee/items/f456fb5730655cc8f9c2
    .pipe(gulp.dest(config.dest))
});