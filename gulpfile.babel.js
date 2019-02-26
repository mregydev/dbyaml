'use strict';

import gulp from 'gulp'

import ts from 'gulp-typescript'

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile',function(){

    let res= gulp.src('src/**/*.ts').pipe(tsProject())

    res.js.pipe(gulp.dest('output'))

    return gulp.src("src/GenerationPipeline/Templates/**/*.ejs").pipe(gulp.dest('output/GenerationPipeline/Templates'))
})

