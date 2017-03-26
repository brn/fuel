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
function isCreateChildren(diff) {
    return (diff.flags & 1 /* CREATE_CHILDREN */) === 1 /* CREATE_CHILDREN */;
}
exports.isCreateChildren = isCreateChildren;
function isRemoveChildren(diff) {
    return (diff.flags & 2 /* REMOVE_CHILDREN */) === 2 /* REMOVE_CHILDREN */;
}
exports.isRemoveChildren = isRemoveChildren;
function isNewElement(diff) {
    return (diff.flags & 4 /* NEW_ELEMENT */) === 4 /* NEW_ELEMENT */;
}
exports.isNewElement = isNewElement;
function isRemoveElement(diff) {
    return (diff.flags & 8 /* REMOVE_ELEMENT */) === 8 /* REMOVE_ELEMENT */;
}
exports.isRemoveElement = isRemoveElement;
function isReplaceElement(diff) {
    return (diff.flags & 16 /* REPLACE_ELEMENT */) === 16 /* REPLACE_ELEMENT */;
}
exports.isReplaceElement = isReplaceElement;
function isTextChanged(diff) {
    return (diff.flags & 32 /* TEXT_CHANGED */) === 32 /* TEXT_CHANGED */;
}
exports.isTextChanged = isTextChanged;
function compare(valueA, valueB) {
    if (valueA === null) {
        if (valueB || valueB === undefined) {
            return false;
        }
        return true;
    }
    var typeA = typeof valueA;
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
    if (typeA !== 'object' && typeof valueB !== 'object') {
        return valueA === valueB;
    }
    return false;
}
function compareStyle(prev, next) {
    var diff = {};
    var unchanged = {};
    var count = 0;
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
    var oldStyles = Object.keys(prev);
    for (var i = 0, len = oldStyles.length; i < len; i++) {
        if (!diff[oldStyles[i]] && !unchanged[oldStyles[i]]) {
            diff[oldStyles[i]] = '';
            count++;
        }
    }
    return [diff, count];
}
function checkProps(bufferSet, prop, old) {
    var name = prop.name, value = prop.value;
    if (!bufferSet[name]) {
        bufferSet[name] = { state: old ? 2 /* REMOVED */ : 1 /* NEW */, value: value };
    }
    else if (name === 'style') {
        var _a = compareStyle(bufferSet[name].value, value), diff_1 = _a[0], count = _a[1];
        if (count) {
            bufferSet[name] = { state: 3 /* REPLACED */, value: diff_1 };
        }
    }
    else if (!compare(bufferSet[name].value, value)) {
        bufferSet[name] = { state: 3 /* REPLACED */, value: value };
    }
    else {
        bufferSet[name].state = 4 /* UNCHANGED */;
    }
}
function diff(oldElement, newElement) {
    var oldProps = oldElement ? oldElement.props : null;
    var newProps = newElement ? newElement.props : null;
    var result = {
        attr: [],
        flags: 0
    };
    var bufferSet = {};
    if (!oldElement && newElement) {
        result.flags |= 4 /* NEW_ELEMENT */;
        return result;
    }
    else if (!newElement && oldElement) {
        result.flags |= 8 /* REMOVE_ELEMENT */;
        return result;
    }
    else if (element_1.FuelElementView.isTextNode(oldElement) && element_1.FuelElementView.isTextNode(newElement)) {
        if (element_1.FuelElementView.getTextValueOf(oldElement) !== element_1.FuelElementView.getTextValueOf(newElement)) {
            result.flags |= 32 /* TEXT_CHANGED */;
        }
        return result;
    }
    else if (element_1.FuelElementView.tagTypeOf(oldElement) !== element_1.FuelElementView.tagTypeOf(newElement)) {
        result.flags |= 16 /* REPLACE_ELEMENT */;
    }
    else {
        var newPropsLength = newProps.length;
        var oldPropsLength = oldProps.length;
        for (var i = 0, len = oldPropsLength > newPropsLength ? oldPropsLength : newPropsLength; i < len; i++) {
            if (oldProps[i] !== undefined) {
                checkProps(bufferSet, oldProps[i], true);
            }
            if (newProps[i] !== undefined) {
                checkProps(bufferSet, newProps[i], false);
            }
        }
        for (var id in bufferSet) {
            var buf = bufferSet[id];
            switch (buf.state) {
                case 4 /* UNCHANGED */:
                    break;
                default:
                    if (buf.state === 3 /* REPLACED */) {
                        if (id === 'style') {
                            buf.state = 5 /* STYLE_CHANGED */;
                        }
                    }
                    result.attr.push({ key: id, value: buf.value, state: buf.state });
            }
        }
    }
    var isNewElementHasChildren = element_1.FuelElementView.hasChildren(newElement);
    var isOldElementHasChildren = element_1.FuelElementView.hasChildren(oldElement);
    if (!isNewElementHasChildren && isOldElementHasChildren) {
        result.flags |= 2 /* REMOVE_CHILDREN */;
    }
    else if (isNewElementHasChildren && !isOldElementHasChildren) {
        result.flags |= 1 /* CREATE_CHILDREN */;
    }
    return result;
}
exports.diff = diff;
