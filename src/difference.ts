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
  Property,
  KeyMap,
  PatchOps,
  DOMEvents,
  MoveType
} from './type';
import {
  FuelElementView
} from './element';
import {
  typeOf,
  keyList
} from './util';
import {
  setStyle
} from './node';

export function compare(valueA: any, valueB: any): boolean {
  if (valueA === null) {
    if (valueB || valueB === undefined) {return false;}
    return true;
  }

  const typeA = typeOf(valueA);
  const typeB = typeOf(valueB);

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
  } else if (typeA === 'regexp' && typeB === 'regexp') {
    return valueA.toString() === valueB.toString();
  }

  return valueA === valueB;
}


export function isStateUpdated(prev: any, next: any): boolean {
  const prevType = typeOf(prev);
  const nextType = typeOf(next);
  if (prevType !== nextType) {
    return false;
  }

  if (prevType === nextType) {
    return true;
  }

  if (prevType === 'array') {
    const len = prev.length > next.length? prev.length: next.length;
    for (let i = 0; i < len; i++) {
      if (!compare(prev[i], next[i])) {
        return false;
      }
    }
    return false;
  } else if (prevType === 'object') {
    const prevKeys = keyList(prev)
    const nextKeys = keyList(next);
    const prevLen = prevKeys.length;
    const nextLen = nextKeys.length;
    if (prevLen !== nextLen) {return false;}
    const len = prevLen > nextLen? prevLen: nextLen;
    for (let i = 0; i < len; i++) {
      const pv = prev[prevKeys[i]];
      const nv = next[nextKeys[i]];
      if (!compare(pv, nv)) {
        return false;
      }
    }
    return true;
  }
  return compare(prev, next);
}


export function compareStyle(prev: KeyMap<any>, next: KeyMap<any>): [KeyMap<string>, number] {
  const diff: KeyMap<string> = {} as any;
  const unchanged = {};
  let count = 0;

  if (next === prev) {
    return [diff, 0];
  }

  for (const name in next) {
    let value = next[name];
    if (!(name in prev) || !compare(prev[name], value)) {
      diff[name] = value;
      count++;
    } else {
      unchanged[name] = 1;
    }
  }
  const oldStyles = keyList(prev);
  for (let i = 0, len = oldStyles.length; i < len; i++) {
    if (!diff[oldStyles[i]] && !unchanged[oldStyles[i]]) {
      diff[oldStyles[i]] = '';
      count++;
    }
  }

  return [diff, count];
}


const {stripComponent, isTextNode, getTextValueOf} = FuelElementView;

export const enum TraversalOp {
  CONTINUE = 1,
  SKIP_CURRENT_CHILDREN,
  SKIP_CURRENT_FORESET
}

export function diff(context: any, index: number, move: MoveType, parent: FuelElement, oldElement: FuelElement, newElement: FuelElement, patchOps: PatchOps): TraversalOp {
  const isOnlyOneChild = parent? parent.children.length === 1: false;
  const isNewElementTextNode = isTextNode(newElement);
  const isOldElementTextNode = isTextNode(oldElement);

  if (move !== MoveType.NONE) {
    patchOps.move(index, move, oldElement);
  }

  if (oldElement === null && newElement) {
    if (isNewElementTextNode && isOnlyOneChild) {
      patchOps.setText(parent, newElement);
      return TraversalOp.SKIP_CURRENT_FORESET;
    } else if (isOnlyOneChild) {
      patchOps.removeChildren(parent);
      patchOps.append(context, parent, newElement);
      return TraversalOp.SKIP_CURRENT_FORESET;
    } else {
      patchOps.insert(index, context, parent, newElement);
    }
    return TraversalOp.SKIP_CURRENT_CHILDREN;
  } else if (newElement === null && oldElement) {
    patchOps.remove(index, parent, oldElement);
    return TraversalOp.SKIP_CURRENT_CHILDREN;
  } else if (isOldElementTextNode && isNewElementTextNode) {
    if (getTextValueOf(oldElement) !== getTextValueOf(newElement)) {
      patchOps.updateText(index, parent, newElement);
    }
    return TraversalOp.SKIP_CURRENT_CHILDREN;
  } else if (oldElement.type !== newElement.type) {
    patchOps.replace(index, parent, newElement, oldElement, context);
    return TraversalOp.SKIP_CURRENT_CHILDREN;
  } else if (!isNewElementTextNode) {
    patchOps.update(newElement, oldElement);
  }

  if ((newElement && newElement.children.length > 0) && (oldElement === null || oldElement.children.length === 0)) {
    patchOps.createChildren(context, newElement);
    return TraversalOp.SKIP_CURRENT_CHILDREN;
  } else if (newElement && newElement.children.length === 0 && oldElement && oldElement.children.length > 0) {
    patchOps.removeChildren(newElement);
    return TraversalOp.SKIP_CURRENT_CHILDREN;
  }
  return TraversalOp.CONTINUE;
}
