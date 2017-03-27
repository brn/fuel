/**
 * @fileoverview
 * @author Taketoshi Aono
 */

const _                  = require('lodash');
const fs                 = require('fs');
const gulp               = require('gulp');
const path               = require('path');
const {execSync}         = require('child_process');

const DIST = 'dist';
const BIN_DIR = path.resolve(process.cwd(), './node_modules/.bin/') + '/';


gulp.task('stop-serve', done => {
  try {
    const pid = fs.readFileSync('.dev.pid', 'utf8');
    process.kill(parseInt(pid, 10));
    fs.unlinkSync('.dev.pid');
  } catch(e) {
    throw new Error('Server process does not exists!');
  }  
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
 * typescriptのコンパイル
 */
gulp.task('typescript', () => {
  return typescript(['!src/**/__tests__/**', '!src/**/__bench__/**'])
    .pipe(gulp.dest('lib/'))
    .on('error', () => process.exit(1));
});


/**
 * typescriptのコンパイル
 */
gulp.task('typescript-test', () => {
  const sourceMaps = require('gulp-sourcemaps');
  return typescript([], true)
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('lib/'))
    .on('error', () => process.exit(1));
});


/**
 * javascriptのminify
 */
gulp.task('minify', ['typescript'], done => {
  minify({file: 'lib/index.js', uglify: true, souceMaps: false, builtins: false, onEnd: done});
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
  const Uglify = require('uglify-js');
  const derequire = require('gulp-derequire');
  let reserved = Uglify.readReservedFile('./reserved.json');
  reserved = Uglify.readDefaultReservedFile(reserved);

  const b = browserify(file, {debug: sourceMaps, builtins, standalone: 'Fuel'})
          .on('error', e => {
            console.error(e);
            process.exit(1);
          })
          .plugin(tsify)
          .bundle()
          .pipe(source(`${path.basename(file).replace(/\.[^.]+$/, '')}.bundle.js`))
          .pipe(derequire())
          .pipe(buffer());

  const next = (() => {
    if (uglify) {
      return b.pipe(guglify({
        mangle: true,
        compress: true,
        mangleProperties: {
          reserved: reserved.props,
          ignore_quoted: true
        }
      }));
    }
    return b;
  })();

  return (() => {
    if (sourceMaps) {
      return next.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write());
    }
    return next;
  })().pipe(gulp.dest(`./${DIST}`))
    .on('end', () => onEnd && onEnd());
}


gulp.task('local-install', () => {
  execSync('npm link', {stdio: [0,1,2]});
  execSync(`npm link fueldom`, {stdio: [0,1,2]});
});


/**
 * 一時ファイルの削除
 */
gulp.task('clean', (cb) => {
  return require('del')([DIST], cb);
});


gulp.task('bundle-all-tests', (done) => {
  const async = require('async');
  async.forEachSeries(require('glob').sync('src/**/__tests__/*.spec.ts*'), (file, done) => {
    minify({file, onEnd: done, sourceMaps: true});
  }, done);
});


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
 * karmaの起動
 */
gulp.task('test', ['typescript-test'], () => {
  require('glob').sync('./lib/**/__tests__/*.spec.js').forEach(c => {
    execSync(`node ./node_modules/.bin/mocha ${c}`, {stdio: [0, 1, 2]});
  });
});


/**
 * karmaの起動
 */
gulp.task('bench', ['typescript-test'], () => {
  require('glob').sync('./lib/**/__bench__/*.bench.js').forEach(c => {
    require(c);
  });
});


/**
 * karmaの起動
 */
gulp.task('run-test-chrome', runKarma.bind(null, true, 'Chrome'));

gulp.task('run-test-phantom', runKarma.bind(null, true, 'PhantomJS'));


/**
 * karmaの起動
 */
gulp.task('tdd-chrome', runKarma.bind(null, false, 'Chrome'));


/**
 * karmaの起動・監視
 */
gulp.task('tdd', runKarma.bind(null, false, 'PhantomJS'));


/**
 * karmaの起動・監視
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


gulp.task('default', () => {
  const runSequence = require('run-sequence');
  return runSequence(
    'clean',
    'minify'
  );
});
