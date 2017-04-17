/**
 * @fileoverview
 * @author Taketoshi Aono
 */

import * as generator from 'vdom-benchmark-generator';
var transformers = generator.transformers;
var Generator = generator.Generator;

var g = new Generator();
g.addGroup([500], [
  [transformers.reverse]
]);

window['generateBenchmarkData'] = function(config) {
  return {
    units: g.generate()
  };
};

// g.addGroup([500], [
//   [transformers.reverse],
//   [transformers.shuffle],
//   [transformers.insertFirst],
//   [transformers.insertLast],
//   [transformers.removeFirst],
//   [transformers.removeLast],
//   [transformers.moveFromEndToStart],
//   [transformers.moveFromStartToEnd]
// ]);

// g.addGroup([50, 10], [
//   [transformers.reverse, transformers.skip],
//   [transformers.shuffle, transformers.skip],
//   [transformers.insertFirst, transformers.skip],
//   [transformers.insertLast, transformers.skip],
//   [transformers.removeFirst, transformers.skip],
//   [transformers.removeLast, transformers.skip],
//   [transformers.moveFromEndToStart, transformers.skip],
//   [transformers.moveFromStartToEnd, transformers.skip]
// ]);

// g.addGroup([5, 100], [
//   [transformers.reverse, transformers.skip],
//   [transformers.shuffle, transformers.skip],
//   [transformers.insertFirst, transformers.skip],
//   [transformers.insertLast, transformers.skip],
//   [transformers.removeFirst, transformers.skip],
//   [transformers.removeLast, transformers.skip],
//   [transformers.moveFromEndToStart, transformers.skip],
//   [transformers.moveFromStartToEnd, transformers.skip]
// ]);
