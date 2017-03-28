/**
 * @fileoverview
 * @author Taketoshi Aono
 */

const _                  = require('lodash');
const fs                 = require('fs');
const gulp               = require('gulp');
const path               = require('path');
const {execSync}         = require('child_process');
const tsc                = require('gulp-typescript');
const del                = require('del');
const express            = require('express');
const serveStatic        = require('serve-static');
const bodyParser         = require('body-parser');


const DIST = 'app';
const BIN_DIR = path.resolve(process.cwd(), './node_modules/.bin/') + '/';


gulp.task('serve', done => {
  const app = express();
  const serve = serveStatic('./');
  app.use(serve);
  app.use(bodyParser.json());
  app.post('/count', (req, res) => {
    res.send(req.body);
  });
  app.listen(9999);
});


function typescript(srcs = [], useSourcemaps = false) {
  const tsc = require('gulp-typescript');
  const sourceMaps = require('gulp-sourcemaps');
  const project = tsc.createProject('tsconfig.json', {
    typescript: require('typescript'),
    traceResolution: true
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
 * typescriptのコンパイル
 */
gulp.task('typescript', () => {
  return typescript(['!src/**/__tests__/**', '!src/**/__bench__/**'])
    .pipe(gulp.dest('lib/'))
    .on('error', () => process.exit(1));
});


/**
 * javascriptのminify
 */
function minify({file, uglify = false, sourceMaps = false, onEnd = null, builtins = true}) {
  const browserify = require('browserify');
  const tsify = require('tsify');
  const source = require('vinyl-source-stream');
  const buffer = require('vinyl-buffer');
  const sourcemaps = require('gulp-sourcemaps');
  const guglify = require('gulp-uglify');

  return browserify(file, {debug: sourceMaps, builtins})
          .on('error', e => {
            console.error(e);
            process.exit(1);
          })
          .plugin(tsify)
          .bundle()
          .pipe(source(`${path.basename(file).replace(/\.[^.]+$/, '')}.bundle.js`))
          .pipe(buffer())
          .pipe(gulp.dest(`./${DIST}`))
          .on('end', () => onEnd && onEnd());
}

gulp.task('update', () => {
  process.chdir('../../');
  execSync('yarn run minify', {stdio: [0,1,2]});
  execSync('npm link', {stdio: [0,1,2]});
  process.chdir(__dirname);
  execSync('npm link fueldom', {stdio: [0,1,2]});
});

gulp.task('update-debug', () => {
  process.chdir('../../');
  execSync('gulp minify-debug', {stdio: [0,1,2]});
  execSync('npm link', {stdio: [0,1,2]});
  process.chdir(__dirname);
  execSync('npm link fueldom', {stdio: [0,1,2]});
});

/**
 * javascriptのminify
 */
gulp.task('minify', ['typescript'], () => {
  return minify({file: 'lib/index.js', uglify: true, souceMaps: false, builtins: false});
});


gulp.task('default', ['minify', 'serve']);
