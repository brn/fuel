/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _instance;
var TextTableImpl = (function () {
    function TextTableImpl(table, indexMap, length) {
        if (table === void 0) { table = []; }
        if (indexMap === void 0) { indexMap = {}; }
        if (length === void 0) { length = 0; }
        this.table = table;
        this.indexMap = indexMap;
        this.length = length;
    }
    TextTableImpl.getInstance = function () {
        if (!_instance) {
            _instance = new TextTableImpl();
        }
        return _instance;
    };
    TextTableImpl.prototype.valueAt = function (index) {
        return this.table[index];
    };
    TextTableImpl.prototype.registerFunction = function (text) {
        this.table.push(text);
        this.length += text.length + 1;
        return this.table.length - 1;
    };
    TextTableImpl.prototype.register = function (text) {
        if (this.indexMap[text]) {
            return this.indexMap[text];
        }
        var index = this.table.length;
        this.table.push(text);
        this.indexMap[text] = index;
        this.length += text.length + 1;
        return index;
    };
    TextTableImpl.prototype.clear = function () {
        this.table.length = 0;
        this.indexMap = {};
        this.length = 0;
    };
    return TextTableImpl;
}());
exports.TextTableImpl = TextTableImpl;
