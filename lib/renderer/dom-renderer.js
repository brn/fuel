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
var node_1 = require("../recycler/node");
var DOM_NODE_CACHE = {};
var use = node_1.NodeRecycler.use;
var _instance;
var DomRenderer = (function () {
    function DomRenderer() {
        this.id = 0;
    }
    DomRenderer.prototype.updateId = function () { this.id++; };
    DomRenderer.getInstance = function () {
        if (_instance) {
            return _instance;
        }
        return _instance = new DomRenderer();
    };
    DomRenderer.prototype.createElement = function (tagName) {
        var node = use(tagName);
        if (node) {
            return node;
        }
        if ((node = DOM_NODE_CACHE[tagName])) {
            return node.cloneNode(false);
        }
        node = DOM_NODE_CACHE[tagName] = document.createElement(tagName);
        if (__DEBUG__) {
            node['setAttribute']('data-id', "" + this.id);
        }
        return node;
    };
    DomRenderer.prototype.createTextNode = function (text) {
        return document.createTextNode(text);
    };
    DomRenderer.prototype.createDocumentFragment = function () {
        return document.createDocumentFragment();
    };
    return DomRenderer;
}());
exports.DomRenderer = DomRenderer;
