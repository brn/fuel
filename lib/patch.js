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
var difference_1 = require("./difference");
var element_1 = require("./element");
var util_1 = require("./util");
var forest_1 = require("./forest");
var isComponent = element_1.FuelElementView.isComponent, instantiateComponent = element_1.FuelElementView.instantiateComponent, getComponentRenderedTree = element_1.FuelElementView.getComponentRenderedTree, stripComponent = element_1.FuelElementView.stripComponent, isFuelElement = element_1.FuelElementView.isFuelElement, isFragment = element_1.FuelElementView.isFragment, isTextNode = element_1.FuelElementView.isTextNode, nameOf = element_1.FuelElementView.nameOf;
var wrap = element_1.wrapNode;
/**
 * Render Component of new tree and strip old tree component.
 * @param context Context object.
 * @param leftElement New vdom tree.
 * @param rightElement old vdom tree.
 * @param createStem Stem factory function.
 * @returns Array of [new-rendered-vdom-tree, old-rendered-vdom-tree, updated-context]
 */
function renderComponent(context, leftElement, rightElement, createStem) {
    while (isComponent(leftElement)) {
        _a = instantiateComponent(context, leftElement, createStem), leftElement = _a[0], context = _a[1];
    }
    if (isComponent(rightElement)) {
        rightElement = stripComponent(rightElement);
    }
    return [leftElement, rightElement, context];
    var _a;
}
/**
 * Create indices of key.
 * @param start Start index.
 * @param end End index.
 * @param elementList List of FuelElement.
 * @param isCheckKeyDuplication Whether check key duplication or not.
 * @returns Map of key and position.
 */
function makeKeyIndices(start, end, elementList, isCheckKeyDuplication) {
    var keyIndices = {};
    for (; start < end; start++) {
        var el = elementList[start];
        var key = el.key;
        if (isFuelElement(el) && key !== null && key !== undefined) {
            if (isCheckKeyDuplication) {
                util_1.invariant(keyIndices[key], "Duplicate key(" + key + ") found on " + nameOf(el) + ".");
            }
            keyIndices[key] = start;
        }
    }
    return keyIndices;
}
/**
 * Compare and patch two vdom tree.
 * Logic inspired by https://github.com/dfilatov/vidom
 * @param rootContext Context
 * @param nextElement New vdom tree.
 * @param prevElement Old vdom tree.
 * @param patchOps Patch operations.
 * @param createStem Stem factory function.
 * @param runtimeKeyCheck Whether check key duplication or not.
 */
function patch(rootContext, nextElement, prevElement, patchOps, createStem, runtimeKeyCheck) {
    if (runtimeKeyCheck === void 0) { runtimeKeyCheck = false; }
    var _a = renderComponent(rootContext, nextElement, prevElement, createStem), revealedNextElement = _a[0], revealedPrevElement = _a[1], context = _a[2];
    var cursor = 0;
    var currentNewTree = [forest_1.makeForest(null, [revealedNextElement])];
    var currentOldTree = [forest_1.makeForest(null, [revealedPrevElement])];
    var end = currentNewTree.length;
    var newRoot = [];
    var oldRoot = [];
    var rightIndicesToSkip = {};
    while (currentNewTree || currentOldTree) {
        var newItem = currentNewTree[cursor] || forest_1.FORESET_SENTINEL;
        var oldItem = currentOldTree[cursor] || forest_1.FORESET_SENTINEL;
        var leftElementList = newItem.elements;
        var rightElementList = oldItem.elements;
        var newTreeLen = leftElementList.length;
        var oldTreeLen = rightElementList.length;
        var parent_1 = newItem.parent;
        var keychecks = {};
        var leftLeftCursor = 0;
        var leftRightCursor = newTreeLen - 1;
        var rightLeftCursor = 0;
        var rightRightCursor = oldTreeLen - 1;
        var leftElement = leftElementList.length ? leftElementList[0] : null;
        var rightElement = rightElementList.length ? rightElementList[0] : null;
        var leftRightElement = leftElementList.length ? leftElementList[leftRightCursor] : null;
        var rightRightElement = rightElementList.length ? rightElementList[rightRightCursor] : null;
        var move = 0 /* NONE */;
        var keyIndices = null;
        var index = 0;
        var leftLeftElementKey = leftElement && leftElement.key ? leftElement.key : null;
        var leftRightElementKey = leftRightElement && leftRightElement.key ? leftRightElement.key : null;
        var rightLeftElementKey = rightElement && rightElement.key ? rightElement.key : null;
        var rightRightElementKey = rightRightElement && rightRightElement.key ? rightRightElement.key : null;
        while (leftRightCursor >= leftLeftCursor && rightRightCursor >= rightLeftCursor) {
            var move_1 = 0 /* NONE */;
            var matchType = 0;
            if (rightLeftCursor in rightIndicesToSkip) {
                matchType = 4 /* UPDATE_RIGHT_LEFT */;
            }
            else if (rightRightCursor in rightIndicesToSkip) {
                matchType = 8 /* UPDATE_RIGHT_RIGHT */;
            }
            else {
                var chosenNewElement = leftElement;
                var chosenOldElement = rightElement;
                if (leftLeftElementKey === rightLeftElementKey) {
                    // []...
                    // []...
                    index = leftLeftCursor;
                    matchType |= (1 /* UPDATE_LEFT_LEFT */ | 4 /* UPDATE_RIGHT_LEFT */);
                }
                else if (leftRightElementKey === rightRightElementKey) {
                    // ...[]
                    // ...[]
                    chosenNewElement = leftRightElement;
                    chosenOldElement = rightRightElement;
                    index = leftRightCursor;
                    matchType |= (2 /* UPDATE_LEFT_RIGHT */ | 8 /* UPDATE_RIGHT_RIGHT */);
                }
                else if (leftLeftElementKey !== null && leftLeftElementKey === rightRightElementKey) {
                    // []...
                    // ...[]
                    chosenOldElement = rightRightElement;
                    index = leftLeftCursor;
                    move_1 = 1 /* BEFORE */;
                    matchType |= (1 /* UPDATE_LEFT_LEFT */ | 8 /* UPDATE_RIGHT_RIGHT */);
                }
                else if (leftRightElementKey !== null && leftRightElementKey === rightLeftElementKey) {
                    //  ...[]
                    //  []...
                    chosenNewElement = leftRightElement;
                    index = leftRightCursor;
                    move_1 = 2 /* AFTER */;
                    matchType |= (2 /* UPDATE_LEFT_RIGHT */ | 4 /* UPDATE_RIGHT_LEFT */);
                }
                else if (leftLeftElementKey === null && rightLeftElementKey !== null) {
                    chosenOldElement = null;
                    matchType |= 1 /* UPDATE_LEFT_LEFT */;
                }
                else if (leftLeftElementKey !== null && rightLeftElementKey === null) {
                    chosenNewElement = null;
                    matchType |= 4 /* UPDATE_RIGHT_LEFT */;
                }
                else {
                    if (!keyIndices) {
                        keyIndices = makeKeyIndices(rightLeftCursor, rightRightCursor, rightElementList, runtimeKeyCheck);
                    }
                    if (leftLeftElementKey !== null) {
                        var index_1 = keyIndices[leftLeftElementKey];
                        if (index_1 !== undefined) {
                            rightIndicesToSkip[index_1] = true;
                            chosenOldElement = rightElementList[index_1];
                            move_1 = 1 /* BEFORE */;
                        }
                        else {
                            chosenOldElement = null;
                        }
                    }
                    index = leftLeftCursor;
                    matchType |= 1 /* UPDATE_LEFT_LEFT */;
                }
                if (runtimeKeyCheck) {
                    if (chosenNewElement) {
                        var newKey = chosenNewElement.key;
                        if (util_1.isDefined(newKey)) {
                            util_1.invariant(keychecks[newKey], "Duplicate key(" + newKey + ") found on " + nameOf(chosenNewElement) + ".");
                            keychecks[newKey] = 1;
                        }
                    }
                }
                var newElement = wrap(parent_1, chosenNewElement, element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A);
                var oldElement = wrap(parent_1, chosenOldElement, element_1.FLY_WEIGHT_ELEMENT_B, element_1.FLY_WEIGHT_FRAGMENT_B);
                // Clone old element.
                // If passed element was same as old tree (ex, this.props.children),
                // clone old element and clear _componentRenderedElementTreeCache to recall render method.
                if (!!newElement && !!newElement._componentRenderedElementTreeCache) {
                    newElement = element_1.cloneElement(newElement);
                    newElement._componentRenderedElementTreeCache = null;
                }
                _b = renderComponent(context, newElement, oldElement, createStem), newElement = _b[0], oldElement = _b[1], context = _b[2];
                if (newElement || oldElement) {
                    var nextOp = difference_1.diff(context, index, move_1, parent_1, oldElement, newElement, patchOps);
                    if (nextOp === 1 /* CONTINUE */) {
                        if (newElement) {
                            newRoot.push(forest_1.makeForest(!isFragment(newElement) ? newElement : parent_1 || null, newElement.children));
                        }
                        else {
                            newRoot.push(null);
                        }
                        if (oldElement) {
                            oldRoot.push(forest_1.makeForest(!isFragment(oldElement) ? oldElement : parent_1 || null, oldElement.children));
                        }
                        else {
                            oldRoot.push(null);
                        }
                    }
                    else if (nextOp === 3 /* SKIP_CURRENT_FORESET */) {
                        // Break loop because,
                        // new children length = 1,
                        // text node is newly created.
                        // If break loop, we need to set leftLeftCursor to right most index plus one,
                        // so in order not to operate insert or append after breaking loop.
                        // But rightLeftCursor will not change,
                        // because old element was cleand inenrText or innerHTML,
                        // this mean cleanup process is skipped,
                        // so we cleanup each elements.
                        leftLeftCursor = leftRightCursor + 1;
                        break;
                    }
                }
            }
            if ((matchType & 1 /* UPDATE_LEFT_LEFT */) === 1 /* UPDATE_LEFT_LEFT */) {
                if (++leftLeftCursor <= leftRightCursor) {
                    leftElement = leftElementList[leftLeftCursor];
                    leftLeftElementKey = leftElement ? leftElement.key : null;
                }
            }
            if ((matchType & 2 /* UPDATE_LEFT_RIGHT */) === 2 /* UPDATE_LEFT_RIGHT */) {
                if (--leftRightCursor >= leftLeftCursor) {
                    leftRightElement = leftElementList[leftRightCursor];
                    leftRightElementKey = leftRightElement ? leftRightElement.key : null;
                }
            }
            if ((matchType & 4 /* UPDATE_RIGHT_LEFT */) === 4 /* UPDATE_RIGHT_LEFT */) {
                if (++rightLeftCursor <= rightRightCursor) {
                    rightElement = rightElementList[rightLeftCursor];
                    rightLeftElementKey = rightElement ? rightElement.key : null;
                }
            }
            if ((matchType & 8 /* UPDATE_RIGHT_RIGHT */) === 8 /* UPDATE_RIGHT_RIGHT */) {
                if (--rightRightCursor >= rightLeftCursor) {
                    rightRightElement = rightElementList[rightRightCursor];
                    rightRightElementKey = rightRightElement ? rightRightElement.key : null;
                }
            }
        }
        while (rightLeftCursor <= rightRightCursor) {
            if (!rightIndicesToSkip[rightRightCursor]) {
                var oldElement = element_1.wrapNode(parent_1, rightElementList[rightLeftCursor], element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A);
                patchOps.remove(rightLeftCursor, parent_1, oldElement);
            }
            ++rightLeftCursor;
        }
        while (leftLeftCursor <= leftRightCursor) {
            var oldElement = void 0;
            var newElement = element_1.wrapNode(parent_1, leftElementList[leftLeftCursor], element_1.FLY_WEIGHT_ELEMENT_B, element_1.FLY_WEIGHT_FRAGMENT_A);
            _c = renderComponent(context, newElement, null, createStem), newElement = _c[0], oldElement = _c[1], context = _c[2];
            leftLeftCursor < newTreeLen - 1 ?
                patchOps.insert(leftLeftCursor, context, parent_1, newElement) :
                patchOps.append(context, parent_1, newElement);
            ++leftLeftCursor;
        }
        if (end === ++cursor) {
            cursor = 0;
            currentNewTree = newRoot.length ? newRoot : null;
            currentOldTree = oldRoot.length ? oldRoot : null;
            newRoot = [];
            oldRoot = [];
            var newLength = currentNewTree ? currentNewTree.length : 0;
            var oldLength = currentOldTree ? currentOldTree.length : 0;
            end = newLength > oldLength ? newLength : oldLength;
        }
    }
    patchOps.executeRemove();
    var _b, _c;
}
exports.patch = patch;
