/**
 * @fileoverview
 * @author Taketoshi Aono
 */


'use strict';


module.exports = () => {
  return {
    "plugins": [
      "karma-mocha",
      "karma-chrome-launcher",
      "karma-phantomjs-launcher",
      "karma-source-map-support",
      "karma-mocha-reporter"
    ],
    "frameworks": ["mocha", "source-map-support"],
    "files": ["dist/*.spec.bundle.js"],
    "reporters": ["mocha"],
    "mochaReporter": {
      "showDiff": true
    },
    "usePolling": false,
    browserNoActivityTimeout: 15000,
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    }
  };
};
