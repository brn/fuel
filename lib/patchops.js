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
var type_1 = require("./type");
var node_1 = require("./node");
var tree_1 = require("./tree");
var element_1 = require("./element");
var util_1 = require("./util");
var collect_1 = require("./recycler/collect");
var domops_1 = require("./domops");
var difference_1 = require("./difference");
var getTextValueOf = element_1.FuelElementView.getTextValueOf, attachFuelElementToNode = element_1.FuelElementView.attachFuelElementToNode, invokeDidMount = element_1.FuelElementView.invokeDidMount, invokeDidUpdate = element_1.FuelElementView.invokeDidUpdate, invokeWillUnmount = element_1.FuelElementView.invokeWillUnmount, createDomElement = element_1.FuelElementView.createDomElement, isTextNode = element_1.FuelElementView.isTextNode, stripComponent = element_1.FuelElementView.stripComponent, setDisposed = element_1.FuelElementView.setDisposed, isFragment = element_1.FuelElementView.isFragment, getFuelElementFromNode = element_1.FuelElementView.getFuelElementFromNode;
var PatchOpsImpl = (function () {
    function PatchOpsImpl(createStem) {
        this.createStem = createStem;
        this.removes = [];
    }
    PatchOpsImpl.prototype.move = function (moveTo, moveType, oldElement) {
        var target = oldElement.dom.parentNode.childNodes[moveTo];
        if (moveType === 2 /* AFTER */) {
            target = target.nextElementSibling;
            if (!target) {
                oldElement.dom.parentNode.appendChild(oldElement.dom);
                return;
            }
        }
        oldElement.dom.parentNode.insertBefore(oldElement.dom, target);
    };
    PatchOpsImpl.prototype.replace = function (index, parent, newElement, oldElement, context) {
        invokeWillUnmount(oldElement);
        var target = parent.dom.childNodes[index];
        var isText = isTextNode(newElement);
        var tree;
        if (isText || !newElement.children.length) {
            if (isText && target.nodeType === 3) {
                target.nodeValue = getTextValueOf(newElement);
                return;
            }
            tree = createDomElement(parent._ownerElement, newElement, this.createStem);
        }
        else {
            tree = tree_1.fastCreateDomTree(context, newElement, this.createStem);
        }
        if (target && !isFragment(newElement)) {
            parent.dom.replaceChild(tree, target);
            collect_1.collect(oldElement, true);
            invokeDidMount(newElement);
        }
    };
    PatchOpsImpl.prototype.update = function (newElement, oldElement) {
        newElement.dom = oldElement.dom;
        var newProps = newElement.props;
        var oldProps = oldElement.props;
        var newPropsKeys = util_1.keyList(newProps);
        var oldPropsKeys = util_1.keyList(oldProps);
        var newPropsLength = newPropsKeys.length;
        var oldPropsLength = oldPropsKeys.length;
        var isSkip = newPropsLength === oldPropsLength && ((newPropsLength === 2 && newPropsKeys[1] === 'key') || newPropsLength === 1);
        if (!isSkip) {
            var keys = oldPropsLength > newPropsLength ? oldPropsKeys : newPropsKeys;
            for (var i = 0, len = oldPropsLength > newPropsLength ? oldPropsLength : newPropsLength; i < len; i++) {
                var key = keys[i];
                if (key === 'children' || key === 'key') {
                    continue;
                }
                if (type_1.DOMEvents[key]) {
                    var lowerKey = key.slice(2).toLowerCase();
                    var rootElement = stripComponent(newElement._ownerElement);
                    if (oldProps[key]) {
                        newElement._ownerElement._stem.getEventHandler().replaceEvent(oldElement.dom, lowerKey, newProps[key]);
                    }
                    else {
                        newElement._ownerElement._stem.getEventHandler().addEvent(rootElement.dom, oldElement.dom, lowerKey, oldProps[key]);
                    }
                }
                else if (key === 'style') {
                    var _a = difference_1.compareStyle(oldProps[key] || {}, newProps[key] || {}), styleDiff = _a[0], count = _a[1];
                    if (count) {
                        for (var style in styleDiff) {
                            node_1.setStyle(oldElement.dom, style, styleDiff[style]);
                        }
                    }
                }
                else if (!newProps[key]) {
                    oldElement.dom.removeAttribute(key);
                }
                else if (!oldProps[key]) {
                    oldElement.dom[key] = newProps[key];
                }
                else {
                    if (!difference_1.compare(newProps[key], oldProps[key])) {
                        oldElement.dom[key] = newProps[key];
                    }
                }
            }
        }
        attachFuelElementToNode(newElement.dom, newElement);
        invokeDidUpdate(newElement);
    };
    PatchOpsImpl.prototype.insert = function (index, context, parent, newElement) {
        var tree;
        if (isTextNode(newElement) || !newElement.children.length) {
            tree = createDomElement(parent._ownerElement, newElement, this.createStem);
        }
        else {
            tree = tree_1.fastCreateDomTree(context, newElement, this.createStem);
        }
        if (parent && parent.dom && !isFragment(newElement)) {
            var target = parent.dom.childNodes[index];
            parent.dom.insertBefore(tree, target);
            invokeDidMount(newElement);
        }
    };
    PatchOpsImpl.prototype.append = function (context, parent, newElement) {
        var tree;
        var isText = isTextNode(newElement);
        var hasParentDom = parent && parent.dom;
        if (isText || !newElement.children.length) {
            if (isText && hasParentDom && parent.dom.lastChild.nodeType === 3) {
                parent.dom.lastChild.nodeValue = getTextValueOf(newElement);
                return;
            }
            tree = createDomElement(parent._ownerElement, newElement, this.createStem);
        }
        else {
            tree = tree_1.fastCreateDomTree(context, newElement, this.createStem);
        }
        if (hasParentDom && !isFragment(newElement)) {
            var parentNode = tree.parentNode;
            if (parentNode && parentNode !== parent) {
                parent.dom.appendChild(tree);
            }
            invokeDidMount(newElement);
        }
    };
    PatchOpsImpl.prototype.remove = function (index, parent, oldElement) {
        invokeWillUnmount(oldElement);
        if (parent.dom) {
            var el = parent.dom.childNodes[index];
            if (el) {
                this.removes.push([oldElement, el]);
            }
        }
        if (!isFragment(oldElement) && !isTextNode(oldElement)) {
            setDisposed(oldElement);
        }
        oldElement._stem = null;
    };
    PatchOpsImpl.prototype.updateText = function (index, parent, newElement) {
        var node = parent.dom.childNodes[index];
        var value = element_1.FuelElementView.getTextValueOf(newElement);
        if (node) {
            if (node.nodeType === 3) {
                node.nodeValue = value;
            }
            else {
                parent.dom.replaceChild(domops_1.domOps.newTextNode(value), node);
            }
        }
        else {
            parent.dom.appendChild(domops_1.domOps.newTextNode(value));
        }
    };
    PatchOpsImpl.prototype.setText = function (parent, newElement) {
        parent.dom.textContent = getTextValueOf(newElement);
        console.log(parent.dom.parentNode.parentNode.parentNode);
    };
    PatchOpsImpl.prototype.createChildren = function (context, newElement) {
        tree_1.fastCreateDomTree(context, newElement, this.createStem);
    };
    PatchOpsImpl.prototype.removeChildren = function (el) {
        el.dom.textContent = '';
    };
    PatchOpsImpl.prototype.executeRemove = function () {
        for (var i = 0, len = this.removes.length; i < len; i++) {
            var _a = this.removes[i], el = _a[0], dom = _a[1];
            if (dom.parentNode) {
                dom.parentNode.removeChild(dom);
                collect_1.collect(el, true);
            }
        }
        this.removes = [];
    };
    return PatchOpsImpl;
}());
exports.PatchOpsImpl = PatchOpsImpl;
