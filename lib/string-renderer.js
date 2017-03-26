/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toStringHelper() {
    if (this.text) {
        return this.text;
    }
    var attrs = [];
    for (var key in this.attrs) {
        attrs.push(key + "=\"" + this.attrs[key] + "\"");
    }
    return "<" + this.tagName + (attrs.length ? (' ' + attrs.join('')) : '') + ">" + this.childNodes.map(function (child) { return child.toString(); }).join('') + "</" + this.tagName + ">";
}
function setAttribute(key, value) {
    this.attrs[key] = value;
}
function removeAttribute(key) {
    delete this.attrs[key];
}
function appendChild(child) {
    child.parentNode = this;
    this.childNodes.push(child);
    this.children.push(child);
    return child;
}
function removeChild(el) {
    this.childNodes = this.childNodes.filter(function (child) { return child !== el; });
}
function replaceChild(newEl, oldEl) {
    var index = this.childNodes.indexOf(oldEl);
    if (index) {
        this.childNodes[index] = newEl;
        newEl.parentNode = this;
    }
}
var StringRenderer = (function () {
    function StringRenderer() {
        this.id = 0;
    }
    StringRenderer.prototype.updateId = function () { this.id++; };
    StringRenderer.prototype.createElement = function (tagName) {
        return {
            tagName: tagName,
            attrs: (_a = {}, _a['data-id'] = this.id, _a),
            childNodes: [],
            children: [],
            toString: toStringHelper,
            setAttribute: setAttribute,
            removeAttribute: removeAttribute,
            appendChild: appendChild,
            replaceChild: replaceChild,
            nodeType: 1,
            parentNode: null
        };
        var _a;
    };
    StringRenderer.prototype.createTextNode = function (text) {
        return {
            tagName: null,
            text: text,
            attrs: {},
            childNodes: [],
            children: [],
            toString: toStringHelper,
            nodeType: 3,
            parentNode: null
        };
    };
    return StringRenderer;
}());
exports.StringRenderer = StringRenderer;
