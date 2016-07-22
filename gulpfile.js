const gulp = require('gulp');
const exec = require('child_process').exec;
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const forever = require('forever-monitor');
const prefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');

var session = null;

function notifierConfig(config){
    var target = {
        sound: true
    }
    for(var key in config){
        ({ [key]: target[key] } = config);
    }
    return target;
}
function onError(err) {
    notify.onError({
        title:    "Build failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);
    this.emit('end');
};

gulp.task('babel:web', function() {
    return gulp
    .src(['src/web/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
        "presets": [
            "es2015"
        ],
        "plugins": [
            "syntax-async-functions",
            "transform-regenerator",
            "transform-async-to-generator",
            "transform-react-jsx",
            "transform-runtime"
        ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/web'));
});
gulp.task('babel:cron', function() {
    return gulp
    .src(['src/cron/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
        "presets": [
            "es2015"
        ],
        "plugins": [
            "syntax-async-functions",
            "transform-regenerator",
            "transform-async-to-generator",
            "transform-react-jsx",
            "transform-runtime"
        ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/cron'));
});
gulp.task('babel:modules', function() {
    return gulp
    .src(['src/modules/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
        "presets": [
            "es2015"
        ],
        "plugins": [
            "syntax-async-functions",
            "transform-regenerator",
            "transform-async-to-generator",
            "transform-react-jsx",
            "transform-runtime"
        ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/modules'));
});
gulp.task('babel', function(callback) {
    runSequence('babel:web', 'babel:modules', 'babel:cron', callback);
});
gulp.task('sass', function () {
    return gulp
    .src('src/web/components.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(prefixer())
    .pipe(notify(notifierConfig({
        title: 'SASS build complete'
    })))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('dist/web/resources'))

});
gulp.task('copy:json', function() {
    return gulp
    .src('src/web/*.json')
    .pipe(gulp.dest('dist/web'));
});
gulp.task('copy:resources', function() {
    return gulp
    .src('src/web/resources/*.*')
    .pipe(gulp.dest('dist/web/resources/'));
});
gulp.task('copy', function(callback) {
    runSequence('copy:json', 'copy:resources', callback);
});
gulp.task('webpack', function(){
    exec('webpack -p', function (err, stdout, stderr) {
        stderr && console.log(stderr);
    });
})
gulp.task('server:start', function () {
    session = new forever.Monitor('dist/web/index.js');
    session.start();
});
gulp.task('server:stop', function () {
    session.stop();
});
gulp.task('edit:babel', function(callback){
    runSequence('server:stop', 'babel', 'webpack', 'server:start', callback);
})
gulp.task('watch', function() {
    gulp.watch('src/web/**/*..scss', ['sass']);
    gulp.watch('src/**/*.js', ['edit:babel'])
});

/* CLI tasks */
gulp.task('default', function(callback) {
    runSequence('dev', 'server:start', 'watch', callback);
});
gulp.task('dev', function(callback) {
    runSequence('babel', 'sass', 'copy', 'webpack', callback);
});
gulp.task('prod', function(callback) {
    runSequence('dev', 'watch', callback);
});
