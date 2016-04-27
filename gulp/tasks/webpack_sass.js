var gulp = require('gulp');
var webpack = require('gulp-webpack');
var config = require('../config');

gulp.task('webpack_sass', function () {
    gulp.src([config.webpack_sass.entry.main])
        .pipe(webpack(config.webpack_sass))
        .pipe(gulp.dest(config.webpack_sass.output.path));
});
