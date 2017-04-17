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
function compare(valueA, valueB) {
    if (valueA === null) {
        if (valueB || valueB === undefined) {
            return false;
        }
        return true;
    }
    var typeA = util_1.typeOf(valueA);
    var typeB = util_1.typeOf(valueB);
    if (typeA === 'number' && !isFinite(valueA)) {
        if (isFinite(valueB)) {
            return false;
        }
        if (valueA === Infinity) {
            if (valueB !== Infinity) {
                return false;
            }
        }
        return true;
    }
    if (typeA === 'date' && typeB === 'date') {
        return valueA.toJSON() === valueB.toJSON();
    }
    else if (typeA === 'regexp' && typeB === 'regexp') {
        return valueA.toString() === valueB.toString();
    }
    return valueA === valueB;
}
exports.compare = compare;
function isStateUpdated(prev, next) {
    var prevType = util_1.typeOf(prev);
    var nextType = util_1.typeOf(next);
    if (prevType !== nextType) {
        return false;
    }
    if (prevType === nextType) {
        return true;
    }
    if (prevType === 'array') {
        var len = prev.length > next.length ? prev.length : next.length;
        for (var i = 0; i < len; i++) {
            if (!compare(prev[i], next[i])) {
                return false;
            }
        }
        return false;
    }
    else if (prevType === 'object') {
        var prevKeys = util_1.keyList(prev);
        var nextKeys = util_1.keyList(next);
        var prevLen = prevKeys.length;
        var nextLen = nextKeys.length;
        if (prevLen !== nextLen) {
            return false;
        }
        var len = prevLen > nextLen ? prevLen : nextLen;
        for (var i = 0; i < len; i++) {
            var pv = prev[prevKeys[i]];
            var nv = next[nextKeys[i]];
            if (!compare(pv, nv)) {
                return false;
            }
        }
        return true;
    }
    return compare(prev, next);
}
exports.isStateUpdated = isStateUpdated;
function compareStyle(prev, next) {
    var diff = {};
    var unchanged = {};
    var count = 0;
    if (next === prev) {
        return [diff, 0];
    }
    for (var name_1 in next) {
        var value = next[name_1];
        if (!(name_1 in prev) || !compare(prev[name_1], value)) {
            diff[name_1] = value;
            count++;
        }
        else {
            unchanged[name_1] = 1;
        }
    }
    var oldStyles = util_1.keyList(prev);
    for (var i = 0, len = oldStyles.length; i < len; i++) {
        if (!diff[oldStyles[i]] && !unchanged[oldStyles[i]]) {
            diff[oldStyles[i]] = '';
            count++;
        }
    }
    return [diff, count];
}
exports.compareStyle = compareStyle;
var stripComponent = element_1.FuelElementView.stripComponent, isTextNode = element_1.FuelElementView.isTextNode, getTextValueOf = element_1.FuelElementView.getTextValueOf;
function diff(context, index, move, parent, oldElement, newElement, patchOps) {
    var isOnlyOneChild = parent ? parent.children.length === 1 : false;
    var isNewElementTextNode = isTextNode(newElement);
    var isOldElementTextNode = isTextNode(oldElement);
    if (move !== 0 /* NONE */) {
        patchOps.move(index, move, oldElement);
    }
    if (oldElement === null && newElement) {
        if (isNewElementTextNode && isOnlyOneChild) {
            patchOps.setText(parent, newElement);
            return 3 /* SKIP_CURRENT_FORESET */;
        }
        else if (isOnlyOneChild) {
            patchOps.removeChildren(parent);
            patchOps.append(context, parent, newElement);
            return 3 /* SKIP_CURRENT_FORESET */;
        }
        else {
            patchOps.insert(index, context, parent, newElement);
        }
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (newElement === null && oldElement) {
        patchOps.remove(index, parent, oldElement);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (isOldElementTextNode && isNewElementTextNode) {
        if (getTextValueOf(oldElement) !== getTextValueOf(newElement)) {
            patchOps.updateText(index, parent, newElement);
        }
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (oldElement.type !== newElement.type) {
        patchOps.replace(index, parent, newElement, oldElement, context);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (!isNewElementTextNode) {
        patchOps.update(newElement, oldElement);
    }
    if ((newElement && newElement.children.length > 0) && (oldElement === null || oldElement.children.length === 0)) {
        patchOps.createChildren(context, newElement);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (newElement && newElement.children.length === 0 && oldElement && oldElement.children.length > 0) {
        patchOps.removeChildren(newElement);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    return 1 /* CONTINUE */;
}
exports.diff = diff;
