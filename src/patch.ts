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


import {
  FuelElement,
  PatchOps,
  MoveType,
  KeyMap,
  IndexMap,
  Stem
} from './type';
import {
  diff,
  TraversalOp
} from './difference';
import {
  fastCreateDomTree
} from './tree';
import {
  FuelElementView,
  makeFragment,
  makeFuelElement,
  createTextNode,
  FLY_WEIGHT_ELEMENT_A,
  FLY_WEIGHT_ELEMENT_B,
  FLY_WEIGHT_FRAGMENT_A,
  FLY_WEIGHT_FRAGMENT_B,
  wrapNode,
  cloneElement
} from './element';
import {
  invariant,
  typeOf,
  isDefined
} from './util';
import {
  ElementForest,
  makeForest,
  FORESET_SENTINEL
} from './forest';


const {
  isComponent,
  instantiateComponent,
  getComponentRenderedTree,
  stripComponent,
  isFuelElement,
  isFragment,
  isTextNode,
  nameOf
} = FuelElementView;

const wrap = wrapNode;

/**
 * Render Component of new tree and strip old tree component.
 * @param context Context object.
 * @param leftElement New vdom tree.
 * @param rightElement old vdom tree.
 * @param createStem Stem factory function.
 * @returns Array of [new-rendered-vdom-tree, old-rendered-vdom-tree, updated-context]
 */
function renderComponent(context: any, leftElement: FuelElement, rightElement: FuelElement, createStem: () => Stem): [FuelElement, FuelElement, any] {
  while (isComponent(leftElement)) {
    [leftElement, context] = instantiateComponent(context, leftElement, createStem);
  }

  if (isComponent(rightElement)) {
    rightElement = stripComponent(rightElement);
  }

  return [leftElement, rightElement, context];
}


/**
 * Match type bit.
 * Found element position combination enum.
 */
const enum MatchType {
  UPDATE_LEFT_LEFT = 0x00000001,
  UPDATE_LEFT_RIGHT = 0x00000002,
  UPDATE_RIGHT_LEFT = 0x00000004,
  UPDATE_RIGHT_RIGHT = 0x00000008,
}


/**
 * Create indices of key.
 * @param start Start index.
 * @param end End index.
 * @param elementList List of FuelElement.
 * @param isCheckKeyDuplication Whether check key duplication or not.
 * @returns Map of key and position.
 */
function makeKeyIndices(start: number, end: number, elementList: FuelElement[], isCheckKeyDuplication: boolean): KeyMap<number> {
  const keyIndices = {};
  for (; start < end; start++) {
    const el = elementList[start];
    const key = el.key;
    if (isFuelElement(el) && key !== null && key !== undefined) {
      if (isCheckKeyDuplication) {
        invariant(keyIndices[key], `Duplicate key(${key}) found on ${nameOf(el)}.`);
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
export function patch(rootContext: any, nextElement: FuelElement, prevElement: FuelElement, patchOps: PatchOps, createStem: () => Stem, runtimeKeyCheck = false): void {
  let [revealedNextElement, revealedPrevElement, context] = renderComponent(rootContext, nextElement, prevElement, createStem);

  let cursor = 0;
  let currentNewTree: ElementForest[] = [makeForest(null, [revealedNextElement])];
  let currentOldTree: ElementForest[] = [makeForest(null, [revealedPrevElement])];
  let end = currentNewTree.length;
  let newRoot: ElementForest[] = [];
  let oldRoot: ElementForest[] = [];
  const rightIndicesToSkip: IndexMap<boolean> = {};

  while (currentNewTree || currentOldTree) {
    const newItem = currentNewTree[cursor] || FORESET_SENTINEL;
    const oldItem = currentOldTree[cursor] || FORESET_SENTINEL;
    const leftElementList = newItem.elements;
    const rightElementList = oldItem.elements;
    const newTreeLen = leftElementList.length;
    const oldTreeLen = rightElementList.length;
    const parent = newItem.parent;
    const keychecks = {};
    let leftLeftCursor = 0;
    let leftRightCursor = newTreeLen - 1;
    let rightLeftCursor = 0;
    let rightRightCursor = oldTreeLen - 1;
    let leftElement = leftElementList.length? leftElementList[0]: null;
    let rightElement = rightElementList.length? rightElementList[0]: null;
    let leftRightElement = leftElementList.length? leftElementList[leftRightCursor]: null;
    let rightRightElement = rightElementList.length? rightElementList[rightRightCursor]: null;
    let move = MoveType.NONE;
    let keyIndices = null;
    let index = 0;
    let leftLeftElementKey = leftElement && leftElement.key? leftElement.key: null;
    let leftRightElementKey = leftRightElement && leftRightElement.key? leftRightElement.key: null;
    let rightLeftElementKey = rightElement && rightElement.key? rightElement.key: null;
    let rightRightElementKey = rightRightElement && rightRightElement.key? rightRightElement.key: null;

    while (leftRightCursor >= leftLeftCursor && rightRightCursor >= rightLeftCursor) {
      let move = MoveType.NONE;
      let matchType = 0;
      
      if (rightLeftCursor in rightIndicesToSkip) {
        matchType = MatchType.UPDATE_RIGHT_LEFT;
      } else if (rightRightCursor in rightIndicesToSkip) {
        matchType = MatchType.UPDATE_RIGHT_RIGHT;
      } else {
        let chosenNewElement = leftElement;
        let chosenOldElement = rightElement;

        if (leftLeftElementKey === rightLeftElementKey) {
          // []...
          // []...
          index = leftLeftCursor;
          matchType |= (MatchType.UPDATE_LEFT_LEFT | MatchType.UPDATE_RIGHT_LEFT);
        } else if (leftRightElementKey === rightRightElementKey) {
          // ...[]
          // ...[]
          chosenNewElement = leftRightElement;
          chosenOldElement = rightRightElement;
          index = leftRightCursor;
          matchType |= (MatchType.UPDATE_LEFT_RIGHT | MatchType.UPDATE_RIGHT_RIGHT);
        } else if (leftLeftElementKey !== null && leftLeftElementKey === rightRightElementKey) {
          // []...
          // ...[]
          chosenOldElement = rightRightElement;
          index = leftLeftCursor;
          move = MoveType.BEFORE;
          matchType |= (MatchType.UPDATE_LEFT_LEFT | MatchType.UPDATE_RIGHT_RIGHT);
        } else if (leftRightElementKey !== null && leftRightElementKey === rightLeftElementKey) {
          //  ...[]
          //  []...
          chosenNewElement = leftRightElement;
          index = leftRightCursor;
          move = MoveType.AFTER;
          matchType |= (MatchType.UPDATE_LEFT_RIGHT | MatchType.UPDATE_RIGHT_LEFT);
        } else if (leftLeftElementKey === null && rightLeftElementKey !== null) {
          chosenOldElement = null;
          matchType |= MatchType.UPDATE_LEFT_LEFT;
        } else if (leftLeftElementKey !== null && rightLeftElementKey === null) {
          chosenNewElement = null;
          matchType |= MatchType.UPDATE_RIGHT_LEFT;
        } else {
          if (!keyIndices) {
            keyIndices = makeKeyIndices(rightLeftCursor, rightRightCursor, rightElementList, runtimeKeyCheck);
          }

          if (leftLeftElementKey !== null) {
            let index = keyIndices[leftLeftElementKey];
            if (index !== undefined) {
              rightIndicesToSkip[index] = true;
              chosenOldElement = rightElementList[index];
              move = MoveType.BEFORE;
            } else {
              chosenOldElement = null;
            }
          }

          index = leftLeftCursor;
          matchType |= MatchType.UPDATE_LEFT_LEFT;
        }

        if (runtimeKeyCheck) {
          if (chosenNewElement) {
            const newKey = chosenNewElement.key;
            if (isDefined(newKey)) {
              invariant(keychecks[newKey], `Duplicate key(${newKey}) found on ${nameOf(chosenNewElement)}.`);
              keychecks[newKey] = 1;
            }
          }
        }

        let newElement = wrap(parent, chosenNewElement, FLY_WEIGHT_ELEMENT_A, FLY_WEIGHT_FRAGMENT_A);
        let oldElement = wrap(parent, chosenOldElement, FLY_WEIGHT_ELEMENT_B, FLY_WEIGHT_FRAGMENT_B);

        // Clone old element.
        // If passed element was same as old tree (ex, this.props.children),
        // clone old element and clear _componentRenderedElementTreeCache to recall render method.
        if (!!newElement && !!newElement._componentRenderedElementTreeCache) {
          newElement = cloneElement(newElement);
          newElement._componentRenderedElementTreeCache = null;
        }

        [newElement, oldElement, context] = renderComponent(context, newElement, oldElement, createStem);

        if (newElement || oldElement) {
          const nextOp = diff(context, index, move, parent, oldElement, newElement, patchOps);
          if (nextOp === TraversalOp.CONTINUE) {
            if (newElement) {
              newRoot.push(makeForest(!isFragment(newElement)? newElement: parent || null, newElement.children));
            } else {
              newRoot.push(null);
            }
            if (oldElement) {
              oldRoot.push(makeForest(!isFragment(oldElement)? oldElement: parent || null, oldElement.children));
            } else {
              oldRoot.push(null);
            }
          } else if (nextOp === TraversalOp.SKIP_CURRENT_FORESET) {
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

      if ((matchType & MatchType.UPDATE_LEFT_LEFT) === MatchType.UPDATE_LEFT_LEFT) {
        if (++leftLeftCursor <= leftRightCursor) {
          leftElement = leftElementList[leftLeftCursor];
          leftLeftElementKey = leftElement? leftElement.key: null;
        }
      }

      if ((matchType & MatchType.UPDATE_LEFT_RIGHT) === MatchType.UPDATE_LEFT_RIGHT) {
        if (--leftRightCursor >= leftLeftCursor) {
          leftRightElement = leftElementList[leftRightCursor];
          leftRightElementKey = leftRightElement? leftRightElement.key: null;
        }
      }

      if ((matchType & MatchType.UPDATE_RIGHT_LEFT) === MatchType.UPDATE_RIGHT_LEFT) {
        if (++rightLeftCursor <= rightRightCursor) {
          rightElement = rightElementList[rightLeftCursor];
          rightLeftElementKey = rightElement? rightElement.key: null;
        }
      }

      if ((matchType & MatchType.UPDATE_RIGHT_RIGHT) === MatchType.UPDATE_RIGHT_RIGHT) {
        if (--rightRightCursor >= rightLeftCursor) {
          rightRightElement = rightElementList[rightRightCursor];
          rightRightElementKey = rightRightElement? rightRightElement.key: null;
        }
      }
    }

    while (rightLeftCursor <= rightRightCursor) {
      if (!rightIndicesToSkip[rightRightCursor]) {
        const oldElement = wrapNode(parent, rightElementList[rightLeftCursor], FLY_WEIGHT_ELEMENT_A, FLY_WEIGHT_FRAGMENT_A);
        patchOps.remove(rightLeftCursor, parent, oldElement);
      }
      ++rightLeftCursor;
    }

    while (leftLeftCursor <= leftRightCursor) {
      let oldElement: FuelElement;
      let newElement = wrapNode(parent, leftElementList[leftLeftCursor], FLY_WEIGHT_ELEMENT_B, FLY_WEIGHT_FRAGMENT_A);
      [newElement, oldElement, context] = renderComponent(context, newElement, null, createStem);
      leftLeftCursor < newTreeLen - 1?
        patchOps.insert(leftLeftCursor, context, parent, newElement) :
        patchOps.append(context, parent, newElement);
      ++leftLeftCursor;
    }


    if (end === ++cursor) {
      cursor = 0;
      currentNewTree = newRoot.length? newRoot: null;
      currentOldTree = oldRoot.length? oldRoot: null;
      newRoot = [];
      oldRoot = [];
      const newLength = currentNewTree? currentNewTree.length: 0;
      const oldLength = currentOldTree? currentOldTree.length: 0;
      end = newLength > oldLength? newLength: oldLength;
    }
  }

  patchOps.executeRemove();
}
