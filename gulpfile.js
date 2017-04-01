/**
 * The MIT License (MIT)
 * Copyright (c) Taketoshi Aono
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * @fileoverview 
 * @author Taketoshi Aono
 */

const _                  = require('lodash');
const fs                 = require('fs');
const gulp               = require('gulp');
const path               = require('path');
const {execSync, spawn}  = require('child_process');

const DIST = 'dist';


gulp.task('serve', () => {
  const express = require('express');
  const serveStatic = require('serve-static');

  const app = express();
  app.use(serveStatic('./'));

  app.listen(9000);
});


function typescript(srcs = [], useSourcemaps = false) {
  const tsc = require('gulp-typescript');
  const sourceMaps = require('gulp-sourcemaps');
  const project = tsc.createProject('tsconfig.json', {
    typescript: require('typescript'),
    declaration: true
  });
  const src = gulp.src(srcs.concat(['src/**/*', '_references.ts']));
  return (() => {
    if (useSourcemaps) {
      return src.pipe(sourceMaps.init());
    }
    return src;
  })()
    .pipe(project());
}


/**
 * Compile typescript
 */
gulp.task('typescript', () => {
  return typescript(['!src/**/__tests__/**', '!src/**/__bench__/**'])
    .pipe(gulp.dest('lib/'))
    .on('error', () => process.exit(1));
});


/**
 * Compile typescript with sourcemaps.
 */
gulp.task('typescript-test', () => {
  const sourceMaps = require('gulp-sourcemaps');
  return typescript([], true)
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('lib/'))
    .on('error', () => process.exit(1));
});


/**
 * Minify javascript, mangle all vars and props.
 */
gulp.task('minify', ['typescript'], done => {
  minify({file: 'lib/index.js', uglify: true, souceMaps: false, builtins: false, onEnd: done, filesize: true, isTsify: false});
});


/**
 * Minify javascript, without any mangles.
 */
gulp.task('minify-debug', ['typescript'], done => {
  minify({file: 'lib/index.js', uglify: false, souceMaps: true, builtins: false, onEnd: done, filesize: false, isTsify: false});
});


/**
 * Bundle and minify javascript.
 */
function minify({file, uglify = false, sourceMaps = false, onEnd = null, builtins = true, filesize = false, isTsify = true, dist = DIST}) {
  const browserify = require('browserify');
  const collapse   = require('bundle-collapser/plugin');
  const tsify      = require('tsify');
  const source     = require('vinyl-source-stream');
  const buffer     = require('vinyl-buffer');
  const sourcemaps = require('gulp-sourcemaps');
  const guglify    = require('gulp-uglify');
  const Uglify     = require('uglify-js');
  const derequire  = require('gulp-derequire');
  const size       = require('gulp-check-filesize');
  const gif        = require('gulp-if');

  let reserved = Uglify.readReservedFile('./reserved.json');
  reserved = Uglify.readDefaultReservedFile(reserved);

  const b = browserify(file, {debug: sourceMaps, builtins, standalone: 'Fuel'})
    .on('error', e => {
      console.error(e);
      process.exit(1);
    });
  return (() => {
    if (isTsify) {
      return b.plugin(tsify);
    }
    return b;
  })()
    .plugin(collapse)
    .bundle()
    .pipe(source(`${path.basename(file).replace(/\.[^.]+$/, '')}.bundle.js`))
    .pipe(derequire())
    .pipe(buffer())
    .pipe(gif(uglify, guglify({
      mangle: true,
      compress: true,
      mangleProperties: {
        reserved: reserved.props,
        ignore_quoted: true
      }
    })))
    .pipe(gif(sourceMaps, sourcemaps.init({loadMaps: true})))
    .pipe(gif(sourceMaps, sourcemaps.write()))
    .pipe(gif(filesize, size({enableGzip: true})))
    .pipe(gulp.dest(`./${dist}`))
    .on('end', () => onEnd && onEnd());
}


gulp.task('local-install', () => {
  execSync('npm link', {stdio: [0,1,2]});
  execSync(`npm link fueldom`, {stdio: [0,1,2]});
});


/**
 * Remove temporary files.
 */
gulp.task('clean', (cb) => {
  return require('del')([DIST], cb);
});



/**
 * Bundle and compile all spec files.
 */
gulp.task('bundle-all-tests', (done) => {
  const async = require('async');
  async.forEachSeries(require('glob').sync('src/**/__tests__/*.spec.ts*'), (file, done) => {
    minify({file, onEnd: done, sourceMaps: true});
  }, done);
});


/**
 * Bundle and compile all combine test spec files.
 */
gulp.task('bundle-ct', (done) => {
  const async = require('async');
  async.forEachSeries(require('glob').sync('ct/*.spec.ts*'), (file, done) => {
    minify({file, onEnd: done, sourceMaps: true});
  }, done);
});


const KARMA_CONF = require('./karma.conf')();


const doRunKarma = (singleRun, browser, done) => {
  const karma = require('karma');
  return new karma.Server(_.assign(KARMA_CONF, {
    browsers: [browser],
    singleRun: singleRun
  }), done).start();
};


const runKarma = (singleRun, browser, done) => {
  if (!singleRun) {
    doRunKarma(false, browser, done);
  } else {
    doRunKarma(true, browser, done);
  }
};


/**
 * Run karma
 */
gulp.task('test', ['typescript-test'], () => {
  require('glob').sync('./lib/**/__tests__/*.spec.js').forEach(c => {
    execSync(`node ./node_modules/.bin/mocha ${c}`, {stdio: [0, 1, 2]});
  });
});


/**
 * Run benchmark.
 */
gulp.task('bench', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'minify',
    'local-install',
    () => minify({file: './bench/index.tsx', dist: './bench'})
  );
});

/**
 * Run benchmark.
 */
gulp.task('bench-debug', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'minify-debug',
    'local-install',
    () => minify({file: './bench/index.tsx', dist: './bench'})
  );
});


/**
 * Run karma
 */
gulp.task('run-test-chrome', runKarma.bind(null, true, 'Chrome'));

gulp.task('run-test-phantom', runKarma.bind(null, true, 'PhantomJS'));


/**
 * Run karma
 */
gulp.task('tdd-chrome', runKarma.bind(null, false, 'Chrome'));


/**
 * Run karma
 */
gulp.task('tdd', runKarma.bind(null, false, 'PhantomJS'));


/**
 * Run karma
 */
gulp.task('test-debug', runKarma.bind(null, true, 'PhantomJS_debug'));


gulp.task('test-phantom', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'clean',
    'bundle-all-tests',
    'run-test-phantom'
  );
});


gulp.task('test-chrome', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'clean',
    'bundle-all-tests',
    'run-test-chrome'
  );
});


gulp.task('ct-chrome', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'clean',
    'minify',
    'local-install',
    'bundle-ct',
    'run-test-chrome'
  );
});


gulp.task('publish', done => {
  const proc = spawn('npm', ['publish'], { stdio: 'inherit' });
  proc.on('end', done);
});


gulp.task('release', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'test-all',
    'clean',
    'minify',
    'publish'
  );
});


gulp.task('test-all', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'clean',
    'bundle-all-tests',
    'run-test-chrome',
    'clean',
    'minify',
    'local-install',
    'bundle-ct',
    'run-test-chrome'
  );
});


gulp.task('default', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'clean',
    'minify'
  );
});
