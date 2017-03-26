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
var type_1 = require("../type");
function toStringHelper() {
    if (this.textContent) {
        return this.textContent;
    }
    var attrs = [];
    for (var key in this) {
        var value = this[key];
        if (value !== null) {
            if (type_1.CONVERSATION_TABLE[key]) {
                key = type_1.CONVERSATION_TABLE[key];
            }
            attrs.push(key + "=\"" + value + "\"");
        }
    }
    return "<" + this.tagName + (attrs.length ? (' ' + attrs.join(' ')) : '') + ">" + this.childNodes.map(function (child) { return child.toString(); }).join('') + "</" + this.tagName + ">";
}
function removeAttribute(key) {
    this[key] = null;
}
function appendChild(child) {
    this.removeChild(child);
    this.childNodes.push(child);
    child.parentNode = this;
    return child;
}
function removeChild(el) {
    var index = this.childNodes.indexOf(el);
    if (index > -1) {
        this.childNodes.splice(index, 1);
    }
    el.parentNode = null;
}
function replaceChild(newEl, oldEl) {
    var index = this.childNodes.indexOf(oldEl);
    if (index > -1) {
        this.childNodes[index] = newEl;
        newEl.parentNode = this;
    }
}
function unenum(value) {
    return {
        configurable: true,
        writable: true,
        enumerable: false,
        value: value
    };
}
function getter(get) {
    return {
        configurable: true,
        enumerable: false,
        get: get
    };
}
var StringRenderer = (function () {
    function StringRenderer(recordGeneration) {
        if (recordGeneration === void 0) { recordGeneration = true; }
        this.recordGeneration = recordGeneration;
        this.id = 0;
    }
    StringRenderer.prototype.updateId = function () { this.id++; };
    StringRenderer.prototype.createElement = function (tagName) {
        return Object.defineProperties(this.recordGeneration ? (_a = {}, _a['data-id'] = this.id, _a) : {}, {
            tagName: unenum(tagName),
            childNodes: unenum([]),
            children: getter(function () { return this.childNodes; }),
            toString: unenum(toStringHelper),
            removeAttribute: unenum(removeAttribute),
            appendChild: unenum(appendChild),
            removeChild: unenum(removeChild),
            replaceChild: unenum(replaceChild),
            nodeType: unenum(1),
            parentNode: unenum(null),
            style: unenum({}),
            textContent: unenum('')
        });
        var _a;
    };
    StringRenderer.prototype.createTextNode = function (text) {
        return Object.defineProperties({}, {
            tagName: unenum(null),
            childNodes: unenum([]),
            children: unenum([]),
            toString: unenum(toStringHelper),
            nodeType: unenum(3),
            parentNode: unenum(null),
            textContent: unenum(text)
        });
    };
    return StringRenderer;
}());
exports.StringRenderer = StringRenderer;
