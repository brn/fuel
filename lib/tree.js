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
var element_1 = require("./element");
var domops_1 = require("./domops");
var isComponent = element_1.FuelElementView.isComponent, createDomElement = element_1.FuelElementView.createDomElement, instantiateComponent = element_1.FuelElementView.instantiateComponent, isFuelElement = element_1.FuelElementView.isFuelElement, isFragment = element_1.FuelElementView.isFragment, isTextNode = element_1.FuelElementView.isTextNode, isDisposed = element_1.FuelElementView.isDisposed, getTextValueOf = element_1.FuelElementView.getTextValueOf;
var wrap = element_1.wrapNode;
function fastCreateDomTree(context, element, createStem, fragment) {
    if (fragment === void 0) { fragment = null; }
    while (isComponent(element)) {
        _a = instantiateComponent(context, element, createStem), element = _a[0], context = _a[1];
    }
    if (element) {
        var dom = createDomElement(element._ownerElement, element, createStem);
        var children = element.children;
        var length_1 = children.length;
        var flags = 0 | 0;
        var cursor = 0;
        if (fragment) {
            fragment.appendChild(dom);
        }
        while (length_1 > cursor) {
            var el = children[cursor++];
            if (isFuelElement(el) || Array.isArray(el)) {
                flags = 2 /* ELEMENT_INSERTED */;
                dom.appendChild(fastCreateDomTree(context, wrap(null, el, element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A), createStem));
            }
            else if ((flags & 1 /* LAST_NODE_IS_TEXT */) > 0) {
                dom.lastChild.nodeValue += "" + el;
            }
            else if ((flags & 2 /* ELEMENT_INSERTED */) === 0) {
                flags |= 1 /* LAST_NODE_IS_TEXT */;
                dom.textContent += "" + el;
            }
            else {
                flags |= 1 /* LAST_NODE_IS_TEXT */;
                dom.appendChild(domops_1.domOps.newTextNode("" + el));
            }
        }
    }
    else {
        return domops_1.domOps.newFragment();
    }
    return fragment || element.dom;
    var _a;
}
exports.fastCreateDomTree = fastCreateDomTree;
