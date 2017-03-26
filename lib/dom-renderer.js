/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomRenderer = (function () {
    function DomRenderer() {
        this.id = 0;
    }
    DomRenderer.prototype.updateId = function () { this.id++; };
    DomRenderer.prototype.createElement = function (tagName) {
        var ret = document.createElement(tagName);
        ret.setAttribute('data-id', "" + this.id);
        return ret;
    };
    DomRenderer.prototype.createTextNode = function (text) {
        return document.createTextNode(text);
    };
    return DomRenderer;
}());
exports.DomRenderer = DomRenderer;
