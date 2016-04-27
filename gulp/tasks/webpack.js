var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var webpack = require('gulp-webpack');
var config = require('../config');
require('babel-core/register');

gulp.task('webpack', function () {
    gulp.src([config.webpack.entry.main])
        .pipe(webpack(config.webpack))
//        .pipe(gulpif(config.js.uglify, uglify().on('error', gutil.log)))
        .pipe(gulp.dest(config.js.dest));
});
