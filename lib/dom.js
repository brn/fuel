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
var stem_1 = require("./stem");
var element_1 = require("./element");
var dom_renderer_1 = require("./renderer/dom-renderer");
exports.FuelDOM = {
    render: function (element, firstNode, cb) {
        if (cb === void 0) { cb = function (dom) { }; }
        var oldElement = element_1.FuelElementView.getFuelElementFromNode(firstNode);
        if (!stem_1.FuelStem.renderer) {
            stem_1.FuelStem.renderer = new dom_renderer_1.DomRenderer();
        }
        if (oldElement) {
            element._stem = oldElement._stem;
        }
        if (!element._stem) {
            element._stem = new stem_1.FuelStem();
        }
        if (oldElement && !oldElement.dom)
            debugger;
        element_1.FuelElementView.attachFuelElementToNode(firstNode, element);
        element._ownerElement = element;
        element._stem.render(element, function (root) {
            firstNode.appendChild(root);
            cb && cb(root);
        });
    }
};
exports.ReactDOM = exports.FuelDOM;
