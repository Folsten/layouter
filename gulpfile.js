const gulp = require('gulp');
const {series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

function serve() {
    browserSync.init({
        server: "./app",
        notify: false
    });

    gulp.watch("./app/scss/**/*.scss").on('change', buildStyles);
    gulp.watch("./app/**/*.html").on('change', browserSync.reload);
    gulp.watch("./app/**/*.js").on('change', browserSync.reload);
    gulp.watch("./app/**/*.[jpg|png|webp|svg]").on('change', browserSync.reload);
}

function cleanFiles() {
    return gulp.src('./dist/**', {read: false})
        .pipe(clean())
}

function buildHtml() {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest('./dist/html'))
}

function buildStyles() {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

function buildJs() {
    return gulp.src('./app/js/**/*')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('./dist/js'))
}

function buildImages() {
    return gulp.src('./app/assets/**/*.[jpg|png|webp|svg]')
        .dest('')
}

exports.cleanFiles = cleanFiles;
exports.buildHtml = buildHtml;
exports.buildStyles = buildStyles;
exports.buildJs = buildJs;
exports.buildImages = buildImages;
exports.serve = serve;
exports.default = series(cleanFiles, buildHtml, buildStyles, buildJs, buildImages);