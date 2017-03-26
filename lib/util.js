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
var type_1 = require("./type");
exports.makeBuffer = type_1.HAS_TYPED_ARRAY ? function (size) {
    return new Uint16Array(new ArrayBuffer(size * type_1.BUFFER_SIZE_MULTIPLER));
} : function (size) {
    return new Array(size);
};
function setBuffer(buffer, value, offset) {
    if (offset === void 0) { offset = 0; }
    if (buffer instanceof Uint16Array) {
        buffer.set(value, offset);
        return buffer;
    }
    buffer.splice.apply(buffer, [offset, value.length].concat(value));
    return buffer;
}
exports.setBuffer = setBuffer;
exports.Symbol = typeof window['Symbol'] === 'function' ? window['Symbol'] : (function () {
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
        if (!warn) {
            throw new Error(message);
        }
        else {
            console.warn(message);
        }
    }
}
exports.invariant = invariant;
var HAS_REQUEST_ANIMATION_FRAME = typeof window.requestAnimationFrame === 'function';
exports.requestAnimationFrame = HAS_REQUEST_ANIMATION_FRAME ? function (cb) { return window.requestAnimationFrame(cb); } : function (cb) { return setTimeout(cb, 60); };
var HAS_REQUEST_IDLE_CALLBACK = typeof window['requestIdleCallback'] === 'function';
exports.requestIdleCallback = HAS_REQUEST_IDLE_CALLBACK ? function (cb) { return window['requestIdleCallback'](cb); } : function (cb) { return cb(); };
