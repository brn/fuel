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
  KeyMap
} from './type';
import {
  FuelElementView
} from './element';

export const enum DifferenceBits {
  CREATE_CHILDREN      = 0x00000001,
  NEW_ELEMENT          = 0x00000002,
  REMOVE_ELEMENT       = 0x00000004,
  REPLACE_ELEMENT      = 0x00000008,
  TEXT_CHANGED         = 0x00000010
}


export const enum AttrState {
  NEW = 1,
  REMOVED,
  REPLACED,
  UNCHANGED,
  STYLE_CHANGED
}


export interface PropsDiff {
  value: any;
  state: AttrState;
}


export interface AttrDiff {
  key: string;
  value: string;
  state: AttrState;
}


export interface StyleDiff {
  key: 'style';
  value: {[key: string]: string|number};
  state: AttrState;
}


export interface Difference {
  attr: (AttrDiff|StyleDiff)[]
  flags: number;
}


export function isCreateChildren(diff: Difference): boolean {
  return (diff.flags & DifferenceBits.CREATE_CHILDREN) === DifferenceBits.CREATE_CHILDREN;
}


export function isNewElement(diff: Difference): boolean {
  return (diff.flags & DifferenceBits.NEW_ELEMENT) === DifferenceBits.NEW_ELEMENT;
}


export function isRemoveElement(diff: Difference): boolean {
  return (diff.flags & DifferenceBits.REMOVE_ELEMENT) === DifferenceBits.REMOVE_ELEMENT;
}


export function isReplaceElement(diff: Difference): boolean {
  return (diff.flags & DifferenceBits.REPLACE_ELEMENT) === DifferenceBits.REPLACE_ELEMENT;
}


export function isTextChanged(diff: Difference): boolean {
  return (diff.flags & DifferenceBits.TEXT_CHANGED) === DifferenceBits.TEXT_CHANGED;
}


function compare(valueA: any, valueB: any): boolean {
  if (valueA === null) {
    if (valueB || valueB === undefined) {return false;}
    return true;
  }

  const typeA = typeof valueA;

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


function compareStyle(prev: KeyMap<any>, next: KeyMap<any>): [KeyMap<string>, number] {
  const diff: KeyMap<string> = {} as any;
  const unchanged = {};
  let count = 0;

  for (const name in next) {
    let value = next[name];
    if (!(name in prev) || !compare(prev[name], value)) {
      diff[name] = value;
      count++;
    } else {
      unchanged[name] = 1;
    }
  }
  const oldStyles = Object.keys(prev);
  for (let i = 0, len = oldStyles.length; i < len; i++) {
    if (!diff[oldStyles[i]] && !unchanged[oldStyles[i]]) {
      diff[oldStyles[i]] = '';
      count++;
    }
  }

  return [diff, count];
}


function checkProps(bufferSet: KeyMap<PropsDiff>, name: string, value: any, isOldProps: boolean) {
  if (!bufferSet[name]) {
    bufferSet[name] = {state: isOldProps? AttrState.REMOVED: AttrState.NEW, value};
  } else if (name === 'style') {
    const [diff, count] = compareStyle(bufferSet[name].value, value);
    if (count) {
      bufferSet[name] = {state: AttrState.REPLACED, value: diff};
    }
  } else if (!compare(bufferSet[name].value, value)) {
    bufferSet[name] = {state: AttrState.REPLACED, value};
  } else {
    bufferSet[name].state = AttrState.UNCHANGED;
  }
}


export function diff(oldElement: FuelElement, newElement: FuelElement): Difference {
  const oldProps = oldElement? oldElement.props: null;
  const newProps = newElement? newElement.props: null;
  const result: Difference = {
    attr: [],
    flags: 0
  }
  const bufferSet = {};
  if (!oldElement && newElement) {
    result.flags |= DifferenceBits.NEW_ELEMENT;
    return result;
  } else if (!newElement && oldElement) {
    result.flags |= DifferenceBits.REMOVE_ELEMENT;
    return result;
  } else if (FuelElementView.isTextNode(oldElement) && FuelElementView.isTextNode(newElement)) {
    if (FuelElementView.getTextValueOf(oldElement) !== FuelElementView.getTextValueOf(newElement)) {
      result.flags |= DifferenceBits.TEXT_CHANGED;
    }
    return result;
  } else if (oldElement.type !== newElement.type) {
    result.flags |= DifferenceBits.REPLACE_ELEMENT;
  } else {
    const newPropsKeys = Object.keys(newProps);
    const oldPropsKeys = Object.keys(oldProps);
    const newPropsLength = newPropsKeys.length;
    const oldPropsLength = oldPropsKeys.length;
    const keys = oldPropsLength > newPropsLength? oldPropsKeys: newPropsKeys;

    for (let i = 0, len = oldPropsLength > newPropsLength? oldPropsLength: newPropsLength; i < len; i++) {
      const key = keys[i];
      if (key === 'children') {
        continue;
      }
      if (oldProps[key] !== undefined) {
        checkProps(bufferSet, key, oldProps[key], true);
      }
      if (newProps[key] !== undefined) {
        checkProps(bufferSet, key, newProps[key], false);
      }
    }

    for (const id in bufferSet) {
      const buf = bufferSet[id];
      switch (buf.state) {
      case AttrState.UNCHANGED:
        break;
      default:
        if (buf.state === AttrState.REPLACED) {
          if (id === 'style') {
            buf.state = AttrState.STYLE_CHANGED;
          }
        }
        result.attr.push({key: id, value: buf.value, state: buf.state});
      }
    }
  }
  const isNewElementHasChildren = FuelElementView.hasChildren(newElement);
  const isOldElementHasChildren = FuelElementView.hasChildren(oldElement);

  if (isNewElementHasChildren && !isOldElementHasChildren) {
    result.flags |= DifferenceBits.CREATE_CHILDREN;
  }

  return result;
}
