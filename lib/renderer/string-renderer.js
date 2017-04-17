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
var FRAGMENT_NAME = 'fuel-fragment';
function toStringHelper() {
    if (this.nodeType === 11) {
        return this.childNodes.map(function (child) { return child ? child.toString() : ''; }).join('');
    }
    if (this.nodeType === 3) {
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
    return "<" + this.nodeName + (attrs.length ? (' ' + attrs.join(' ')) : '') + ">" + this.childNodes.map(function (child) { return child ? child.toString() : ''; }).join('') + "</" + this.nodeName + ">";
}
function innerHTML() {
    if (this.nodeType === 3) {
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
    return "" + this.childNodes.map(function (child) { return child.toString(); }).join('');
}
function removeAttribute(key) {
    this[key] = null;
}
function appendChild(child) {
    var _this = this;
    if (child.nodeName === FRAGMENT_NAME) {
        child.childNodes.slice().forEach(function (v) { return _this.appendChild(v); });
        return;
    }
    this.firstChild = this.childNodes[0];
    this.lastChild = this.childNodes[this.childNodes.length - 1];
    if (child.parentNode) {
        child.parentNode.removeChild(child);
    }
    if (this.childNodes.length) {
        this.childNodes[this.childNodes.length - 1].nextElementSibling = child;
    }
    this.childNodes.push(child);
    child.parentNode = this;
    return child;
}
function removeChild(el) {
    var index = this.childNodes.indexOf(el);
    if (index > -1) {
        this.childNodes.splice(index, 1);
    }
    this.firstChild = this.childNodes[0];
    this.lastChild = this.childNodes[this.childNodes.length - 1];
    el.nextElementSibling = null;
    el.parentNode = null;
}
function replaceChild(newEl, oldEl) {
    var _this = this;
    var index = this.childNodes.indexOf(oldEl);
    if (index > -1) {
        if (newEl.nodeName === FRAGMENT_NAME) {
            var children = newEl.children.slice();
            this.childNodes[index] = children.shift();
            children.slice().forEach(function (c, i) {
                var nextIndex = index + i + 1;
                _this.childNodes.splice(nextIndex, 0, c);
                doReplace.call(_this, nextIndex, c, oldEl);
                c.nextElementSibling = _this.childNodes[nextIndex + 1] || null;
            });
        }
        else {
            this.childNodes[index] = newEl;
            doReplace.call(this, newEl, oldEl);
            newEl.nextElementSibling = oldEl.nextElementSibling;
        }
    }
    this.firstChild = this.childNodes[0];
    this.lastChild = this.childNodes[this.childNodes.length - 1];
}
function doReplace(index, newEl, oldEl) {
    if (index === 0) {
        this.firstChild = newEl;
    }
    if (newEl.parentNode) {
        newEl.parentNode.removeChild(newEl);
    }
    newEl.parentNode = this;
}
function insertBefore(newEl, oldEl) {
    var _this = this;
    if (newEl.nodeName === FRAGMENT_NAME) {
        newEl.children.slice().forEach(function (v) { return _this.insertBefore(v, oldEl); });
        return;
    }
    if (newEl.parentNode) {
        newEl.parentNode.removeChild(newEl);
    }
    var index = this.childNodes.indexOf(oldEl);
    newEl.parentNode = this;
    if (index > -1) {
        if (index === 0) {
            this.childNodes.unshift(newEl);
            this.firstChild = newEl;
        }
        else {
            this.childNodes.splice(index, 0, newEl);
        }
        if (oldEl) {
            newEl.nextElementSibling = oldEl.nextElementSibling;
        }
    }
    else {
        this.childNodes.unshift(newEl);
    }
    this.firstChild = this.childNodes[0];
    this.lastChild = this.childNodes[this.childNodes.length - 1];
}
function unenum(value) {
    return {
        configurable: true,
        writable: true,
        enumerable: false,
        value: value
    };
}
function getter(get, set) {
    var ret = {
        configurable: true,
        enumerable: false,
        get: get
    };
    if (set) {
        ret['set'] = set;
    }
    return ret;
}
function cloneNode(renderer, tree) {
    if (!tree) {
        if (this.nodeType === 1) {
            return renderer.createElement(this.nodeName.toLowerCase());
        }
        else if (this.nodeType === 3) {
            return renderer.createTextNode(this.nodeValue);
        }
        return renderer.createDocumentFragment();
    }
    var root = this.cloneNode(false);
    for (var i = 0, len = this.childNodes.length; i < len; i++) {
        root.appendChild(this.childNodes[i].cloneNode(true));
    }
    return root;
}
var _instance;
var StringRenderer = (function () {
    function StringRenderer(recordGeneration) {
        if (recordGeneration === void 0) { recordGeneration = true; }
        this.recordGeneration = recordGeneration;
        this.id = 0;
    }
    StringRenderer.prototype.updateId = function () { this.id++; };
    StringRenderer.getInstance = function () {
        if (_instance) {
            return _instance;
        }
        return _instance = new StringRenderer();
    };
    StringRenderer.prototype.createElement = function (tagName) {
        var _this = this;
        var self = this;
        return Object.defineProperties(this.recordGeneration ? (_a = {}, _a['data-id'] = this.id, _a) : {}, {
            nodeName: unenum(tagName),
            childNodes: unenum([]),
            nextElementSibling: unenum(null),
            children: getter(function () { return this.childNodes; }),
            toString: unenum(toStringHelper),
            removeAttribute: unenum(removeAttribute),
            appendChild: unenum(appendChild),
            removeChild: unenum(removeChild),
            insertBefore: unenum(insertBefore),
            replaceChild: unenum(replaceChild),
            firstChild: unenum(null),
            lastChild: unenum(null),
            cloneNode: unenum(function (tree) { return cloneNode.call(_this, self, tree); }),
            nodeType: unenum(tagName === FRAGMENT_NAME ? 11 : 1),
            parentNode: unenum(null),
            style: unenum({}),
            textContent: getter(function () {
                return this.childNodes.map(function (v) { return v.textContent; }).join('');
            }, function (v) { this.childNodes = [self.createTextNode(v)]; }),
            nodeValue: unenum(''),
            innerText: getter(function () { return this.textContent; }, function (v) {
                this.childNodes = [self.createTextNode(v)];
                this.textContent = '';
            }),
            innerHTML: getter(function () { return innerHTML.call(this); }, function (v) { this.children.length = 0; this.textContent = v; })
        });
        var _a;
    };
    StringRenderer.prototype.createTextNode = function (text) {
        var _this = this;
        var value = text;
        return Object.defineProperties({}, {
            nodeName: unenum(null),
            childNodes: unenum([]),
            children: unenum([]),
            toString: unenum(toStringHelper),
            nodeType: unenum(3),
            parentNode: unenum(null),
            cloneNode: unenum(function (tree) { return cloneNode.call(_this, self, tree); }),
            textContent: getter(function () { return value; }, function (v) { value = v; }),
            nodeValue: getter(function () { return this.textContent; }, function (v) { this.textContent = v; })
        });
    };
    StringRenderer.prototype.createDocumentFragment = function () {
        return this.createElement(FRAGMENT_NAME);
    };
    return StringRenderer;
}());
exports.StringRenderer = StringRenderer;
