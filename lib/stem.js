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
var node_1 = require("./node");
var tree_1 = require("./tree");
var element_1 = require("./element");
var difference_1 = require("./difference");
var util_1 = require("./util");
function createStem() {
    return new FuelStem();
}
function replaceElement(root, oldElement, newElement, isKeyedItems, renderer) {
    var newDom = element_1.FuelElementView.createDomElement(root, newElement, renderer, createStem);
    var oldDom = oldElement.dom;
    if (oldDom.nodeType === 1 && newDom.nodeType === 1) {
        for (var i = 0, len = oldDom.children.length; i < len; i++) {
            newElement.dom.appendChild(oldDom.children[i]);
        }
    }
    if (!isKeyedItems) {
        var parent_1 = oldElement.dom.parentNode;
        parent_1.replaceChild(newDom, oldDom);
        clean(root, oldElement);
    }
    else {
        var parent_2 = oldElement.dom.parentNode;
        parent_2.removeChild(oldDom);
        parent_2.appendChild(newDom);
    }
    oldElement.dom = null;
}
function copyElementRef(root, oldElement, newElement, isKeyedItem) {
    newElement.dom = oldElement.dom;
    oldElement.dom = null;
    if (isKeyedItem) {
        newElement.dom.parentNode.appendChild(newElement.dom);
    }
}
function updateElement(diff, newElement) {
    var domElement = newElement.dom;
    for (var i = 0, len = diff.attr.length; i < len; i++) {
        var _a = diff.attr[i], key = _a.key, value = _a.value, state = _a.state;
        switch (state) {
            case 1 /* NEW */:
            case 3 /* REPLACED */:
                domElement[key] = value;
                break;
            case 5 /* STYLE_CHANGED */:
                for (var style in value) {
                    var val = value[style];
                    node_1.setStyle(domElement, style, val);
                }
                break;
            case 2 /* REMOVED */:
                domElement.removeAttribute(key);
            default:
        }
    }
}
function clean(rootElement, fuelElement) {
    util_1.requestIdleCallback(function () { return doClean(rootElement, fuelElement); });
}
function doClean(rootElement, fuelElement) {
    var stack = [
        {
            element: fuelElement,
            children: fuelElement.children.slice(),
            dom: fuelElement.dom,
            root: rootElement
        }
    ];
    while (stack.length) {
        var next = stack.pop();
        if (next.dom) {
            if (next.dom['__fuelevent']) {
                next.root._stem.getEventHandler().removeEvent(next.root.dom, next.dom);
            }
            if (next.element._subscriptions) {
                next.element._subscriptions.forEach(function (s) { return s.unsubscribe(); });
            }
            next.dom = null;
        }
        if (next.children.length) {
            var child = next.children.shift();
            stack.push(next);
            stack.push({ element: child, children: child.children.slice(), dom: null, root: child._stem ? child : next.root });
        }
    }
}
function update(_a) {
    var parent = _a.parent, newElement = _a.newElement, oldElement = _a.oldElement, isKeyedItem = _a.isKeyedItem, difference = _a.difference, root = _a.root, context = _a.context;
    var renderer = FuelStem.renderer;
    if (difference_1.isNewElement(difference)) {
        if (parent) {
            element_1.FuelElementView.invokeWillMount(newElement);
            parent.dom.appendChild(tree_1.fastCreateDomTree(context, root, newElement, renderer, createStem));
            element_1.FuelElementView.invokeDidMount(newElement);
        }
        else {
            var tree = tree_1.fastCreateDomTree(context, root, newElement, renderer, createStem);
            if (oldElement) {
                element_1.FuelElementView.invokeWillMount(newElement);
                oldElement.dom.parentNode.appendChild(tree);
                element_1.FuelElementView.invokeDidMount(newElement);
                element_1.FuelElementView.invokeWillUnmount(oldElement);
                clean(root, oldElement);
            }
        }
    }
    else if (difference_1.isRemoveElement(difference)) {
        element_1.FuelElementView.invokeWillUnmount(oldElement);
        oldElement.dom.parentNode.removeChild(oldElement.dom);
        clean(root, oldElement);
    }
    else if (difference_1.isReplaceElement(difference)) {
        element_1.FuelElementView.invokeWillMount(newElement);
        element_1.FuelElementView.invokeWillUnmount(oldElement);
        replaceElement(root, oldElement, newElement, isKeyedItem, renderer);
        element_1.FuelElementView.invokeDidMount(newElement);
    }
    else if (difference_1.isTextChanged(difference)) {
        element_1.FuelElementView.invokeWillUpdate(newElement);
        newElement.dom = oldElement.dom;
        newElement.dom.textContent = element_1.FuelElementView.getTextValueOf(newElement);
        element_1.FuelElementView.invokeDidUpdate(newElement);
    }
    else {
        element_1.FuelElementView.invokeWillUpdate(newElement);
        copyElementRef(root, oldElement, newElement, isKeyedItem);
        updateElement(difference, newElement);
        element_1.FuelElementView.invokeDidUpdate(newElement);
    }
    if (difference_1.isCreateChildren(difference)) {
        tree_1.fastCreateDomTree(context, root, newElement, renderer, createStem);
    }
}
var FuelStem = (function () {
    function FuelStem() {
        this.batchs = [];
        this.batchCallback = null;
    }
    FuelStem.prototype.registerOwner = function (owner) {
        this.tree = owner;
    };
    FuelStem.prototype.owner = function () {
        return this.tree;
    };
    FuelStem.prototype.setEventHandler = function (handler) {
        this.sharedEventHandler = handler;
    };
    FuelStem.prototype.getEventHandler = function () {
        return this.sharedEventHandler;
    };
    FuelStem.prototype.renderAtAnimationFrame = function () {
        var _this = this;
        util_1.requestAnimationFrame(function () {
            if (_this.batchs.length) {
                _this.batchs.forEach(function (b) { return update(b); });
                _this.batchs.length = 0;
                _this.batchCallback && _this.batchCallback();
                _this.batchCallback = null;
            }
        });
    };
    FuelStem.prototype.render = function (el, callback) {
        var _this = this;
        if (callback === void 0) { callback = (function (el) { }); }
        FuelStem.renderer.updateId();
        if (this.tree) {
            this.patch(el);
            this.batchCallback = function () {
                if (element_1.FuelElementView.isComponent(el)) {
                    _this.tree = el._componentRenderedElementTreeCache;
                }
                else {
                    _this.tree = el;
                }
                callback(_this.tree.dom);
            };
            this.renderAtAnimationFrame();
        }
        else {
            callback(this.attach(el));
        }
    };
    FuelStem.prototype.attach = function (el) {
        var domTree = tree_1.fastCreateDomTree({}, el, el, FuelStem.renderer, createStem);
        if (element_1.FuelElementView.isComponent(el)) {
            this.tree = el._componentRenderedElementTreeCache;
        }
        else {
            this.tree = el;
        }
        return domTree;
    };
    FuelStem.prototype.patch = function (root) {
        if (this.batchs.length) {
            this.batchs.length = 0;
        }
        var stack = [
            {
                newElement: root,
                oldElement: this.tree,
                newChildren: null,
                oldChildren: null,
                parsed: false,
                difference: null,
                context: {},
                root: root
            }
        ];
        var parent = null;
        var isKeyedItem = false;
        var context = stack[0].context;
        if (element_1.FuelElementView.isComponent(root)) {
            _a = element_1.FuelElementView.instantiateComponent(context, root, this.tree), root = _a[0], context = _a[1];
            stack[0].context = context;
            stack[0].newElement = root;
        }
        while (stack.length) {
            var next = stack.pop();
            var newElement = next.newElement, oldElement = next.oldElement;
            var difference = void 0;
            var currentRoot = next.root;
            if (!next.parsed) {
                difference = difference_1.diff(oldElement, newElement);
                next.difference = difference;
                this.batchs.push({
                    root: currentRoot,
                    parent: parent ? parent.newElement : null,
                    newElement: newElement,
                    oldElement: oldElement,
                    isKeyedItem: isKeyedItem,
                    difference: difference,
                    context: next.context
                });
                next.newChildren = newElement ? newElement.children.slice() : [];
                next.oldChildren = oldElement ? oldElement.children.slice() : [];
                next.parsed = true;
            }
            if ((next.newChildren.length || next.oldChildren.length) &&
                (!next.difference ||
                    next.difference.flags === 0 ||
                    next.difference.flags === 16 /* REPLACE_ELEMENT */)) {
                parent = next;
                stack.push(next);
                var newChild = next.newChildren.shift();
                var oldChild = void 0;
                if (oldElement && oldElement._keymap && newChild && oldElement._keymap[newChild.key]) {
                    oldChild = oldElement._keymap[newChild.key];
                    if (!newChild._keymap) {
                        newChild._keymap = {};
                    }
                    newChild._keymap[newChild.key] = newChild;
                    var index = next.oldChildren.indexOf(oldChild);
                    next.oldChildren.splice(index, 1);
                    isKeyedItem = true;
                }
                else {
                    oldChild = next.oldChildren.shift();
                    isKeyedItem = false;
                }
                if (newChild && newChild._stem) {
                    currentRoot = newChild;
                }
                context = next.context;
                if (newChild && element_1.FuelElementView.isComponent(newChild)) {
                    if (oldChild && element_1.FuelElementView.isComponent(oldChild)) {
                        while (element_1.FuelElementView.isComponent(newChild)) {
                            if (element_1.FuelElementView.isComponent(oldChild)) {
                                newChild._componentInstance = oldChild._componentInstance;
                                newChild._componentRenderedElementTreeCache = oldChild._componentRenderedElementTreeCache;
                                newChild._stem = oldChild._stem;
                                oldChild = oldChild._componentRenderedElementTreeCache;
                            }
                            _b = element_1.FuelElementView.instantiateComponent(context, newChild), newChild = _b[0], context = _b[1];
                        }
                    }
                    else {
                        while (element_1.FuelElementView.isComponent(newChild)) {
                            var _c = element_1.FuelElementView.instantiateComponent(context, newChild, null), renderedTree = _c[0], newContext = _c[1];
                            context = newContext;
                            newChild._stem.registerOwner(newChild);
                            newChild = renderedTree;
                        }
                    }
                }
                else if (oldChild && element_1.FuelElementView.isComponent(oldChild)) {
                    while (element_1.FuelElementView.isComponent(oldChild)) {
                        oldChild = oldChild._componentRenderedElementTreeCache;
                    }
                }
                stack.push({
                    newElement: newChild,
                    oldElement: oldChild,
                    newChildren: null,
                    oldChildren: null,
                    parsed: false,
                    difference: null,
                    root: currentRoot,
                    context: context
                });
            }
        }
        var _a, _b;
    };
    return FuelStem;
}());
exports.FuelStem = FuelStem;
