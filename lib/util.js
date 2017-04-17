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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g = typeof global === 'object' ? global : typeof window === 'object' ? window : this || {};
exports.Symbol = typeof g.Symbol === 'function' ? g.Symbol : (function () {
    var map = {};
    function Symbol(sym) {
        return "@@" + sym;
    }
    Symbol['for'] = function (sym) {
        if (map[sym]) {
            return map[sym];
        }
        return map[sym] = Symbol(sym);
    };
})();
function invariant(condition, message, warn) {
    if (warn === void 0) { warn = false; }
    if (condition) {
        var m = typeof message === 'function' ? message() : message;
        if (!warn) {
            throw new Error(m);
        }
        else {
            console.warn(m);
        }
    }
}
exports.invariant = invariant;
function merge(a, b) {
    var ret = {};
    for (var key in a) {
        ret[key] = a[key];
    }
    for (var key in b) {
        ret[key] = b[key];
    }
    return ret;
}
exports.merge = merge;
var toString = Object.prototype.toString;
var oReg = /\[object ([^\]]+)\]/;
function typeOf(a) {
    return toString.call(a).match(oReg)[1].toLowerCase();
}
exports.typeOf = typeOf;
var HAS_REQUEST_ANIMATION_FRAME = typeof g.requestAnimationFrame === 'function';
exports.requestAnimationFrame = HAS_REQUEST_ANIMATION_FRAME ? function (cb) { return g.requestAnimationFrame(cb); } : function (cb) { return setTimeout(cb, 60); };
var HAS_REQUEST_IDLE_CALLBACK = typeof g['requestIdleCallback'] === 'function';
exports.requestIdleCallback = HAS_REQUEST_IDLE_CALLBACK ? function (cb) { return g['requestIdleCallback'](cb); } : function (cb) { return cb(); };
function isDefined(a) {
    return a !== null && a !== undefined;
}
exports.isDefined = isDefined;
exports.keyList = Object.keys;
