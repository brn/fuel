/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
exports.makeBuffer = types_1.HAS_TYPED_ARRAY ? function (size) {
    return new Uint16Array(new ArrayBuffer(size * types_1.BUFFER_SIZE_MULTIPLER));
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
