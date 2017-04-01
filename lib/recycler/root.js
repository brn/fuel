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
var element_1 = require("../element");
var element_2 = require("./element");
var node_1 = require("./node");
var wrap = element_1.wrapNode;
var isTextNode = element_1.FuelElementView.isTextNode, isFragment = element_1.FuelElementView.isFragment, isDisposed = element_1.FuelElementView.isDisposed, cleanupElement = element_1.FuelElementView.cleanupElement, setDisposed = element_1.FuelElementView.setDisposed, stripComponent = element_1.FuelElementView.stripComponent;
var recycleNode = node_1.NodeRecycler.recycle;
var recycleElement = element_2.ElementRecycler.recycle;
function collect(fuelElement, all, cb) {
    doCollect(fuelElement, false, all);
    cb && cb();
}
exports.collect = collect;
/**
 * Collect and cleanup element.
 */
function doCollect(fuelElement, isParentDisposed, all) {
    var element = wrap(null, stripComponent(fuelElement), element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A);
    if (!element || isTextNode(element)) {
        return;
    }
    if (isParentDisposed) {
        setDisposed(element);
    }
    var children = element.children;
    var isDisp = isDisposed(element);
    var dom = element.dom;
    if (!isFragment(element) && (all || isDisp)) {
        if (dom && dom.childNodes.length) {
            dom.textContent = '';
        }
        recycleNode(element);
        cleanupElement(element);
        recycleElement(element);
    }
    var length = children.length;
    var cursor = 0;
    while (length > cursor) {
        doCollect(children[cursor++], isDisp, all);
    }
}
