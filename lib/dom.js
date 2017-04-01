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
var util_1 = require("./util");
var attachFuelElementToNode = element_1.FuelElementView.attachFuelElementToNode;
exports.FuelDOM = {
    render: function (element, firstNode, cb) {
        if (cb === void 0) { cb = function (dom) { }; }
        var display = firstNode['style'].display;
        firstNode['style'].display = 'none';
        util_1.invariant(element.props.ref, 'Can\'t declare ref props outside of Component');
        util_1.invariant(!firstNode || firstNode.nodeType !== 1, "FuelDOM.render only accept HTMLElement node. but got " + firstNode);
        var oldElement = element_1.FuelElementView.getFuelElementFromNode(firstNode);
        if (oldElement) {
            element._stem = oldElement._stem;
        }
        if (!element._stem) {
            element._stem = new stem_1.FuelStem();
        }
        attachFuelElementToNode(firstNode, element);
        element._ownerElement = element;
        element._stem.render(element, function (root) {
            firstNode.appendChild(root);
            firstNode['style'].display = display;
            cb && cb(firstNode['firstElementChild']);
        });
    }
};
exports.ReactDOM = exports.FuelDOM;
