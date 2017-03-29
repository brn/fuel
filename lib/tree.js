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
var util_1 = require("./util");
function makeInitialDomTreeStack(context, rootElement, fuelElement) {
    return [
        {
            element: fuelElement,
            parentElement: null,
            children: fuelElement.children.slice(),
            dom: fuelElement.dom,
            parent: null,
            root: rootElement,
            context: context
        }
    ];
}
function fastCreateDomTree(context, rootElement, fuelElement, renderer, createStem) {
    var createdDomTreeRoot;
    while (fuelElement && element_1.FuelElementView.isComponent(fuelElement)) {
        _a = renderComponent(context, fuelElement, createStem), fuelElement = _a[0], context = _a[1];
    }
    if (!fuelElement) {
        return;
    }
    var stack = makeInitialDomTreeStack(context || {}, rootElement, fuelElement);
    LOOP: while (stack.length) {
        var next = stack.pop();
        var hasChildren = !!next.children.length;
        if (!next.dom) {
            var element = next.element, parentElement = next.parentElement, parent_1 = next.parent;
            if (element.key && next.parentElement) {
                if (!parentElement._keymap) {
                    parentElement._keymap = {};
                }
                util_1.invariant(parentElement._keymap[element.key], "Duplicate key found: key = " + element.key);
                parentElement._keymap[element.key] = element;
            }
            next.dom = element_1.FuelElementView.createDomElement(next.root, element, renderer, createStem);
            if (!createdDomTreeRoot) {
                createdDomTreeRoot = next.dom;
            }
            if (parent_1) {
                parent_1.appendChild(next.dom);
                element_1.FuelElementView.invokeDidMount(next.element);
            }
        }
        var root = next.root;
        if (hasChildren) {
            stack.push(next);
            var child = next.children.shift();
            if (child._stem) {
                root = child;
            }
            var context_1 = next.context;
            while (element_1.FuelElementView.isComponent(child)) {
                root = child;
                _b = renderComponent(context_1, child, createStem), child = _b[0], context_1 = _b[1];
                if (!child) {
                    continue LOOP;
                }
            }
            stack.push({ element: child, children: child.children.slice(), dom: null, parent: next.dom, parentElement: next.element, root: root, context: context_1 });
        }
    }
    return createdDomTreeRoot;
    var _a, _b;
}
exports.fastCreateDomTree = fastCreateDomTree;
function renderComponent(oldContext, fuelElement, createStem) {
    var _a = element_1.FuelElementView.instantiateComponent(oldContext, fuelElement, null), nodes = _a[0], context = _a[1];
    if (nodes) {
        fuelElement._stem.registerOwner(fuelElement);
    }
    return [nodes, context];
}
