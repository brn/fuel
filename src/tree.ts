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
  FuelComponent,
  FuelComponentStatic,
  Stem
} from './type';
import {
  FuelElementView,
  createTextNode,
  makeFragment,
  FLY_WEIGHT_ELEMENT_A,
  FLY_WEIGHT_FRAGMENT_A,
  wrapNode
} from './element';
import {
  invariant,
  requestIdleCallback,
  typeOf,
  isDefined
} from './util'
import {
  ElementForest,
  makeForest,
  FORESET_SENTINEL
} from './forest';
import {
  domOps
} from './domops';


const {
  isComponent,
  createDomElement,
  instantiateComponent,
  isFuelElement,
  isFragment,
  isTextNode,
  isDisposed,
  getTextValueOf
} = FuelElementView;


const enum TextInsertionState {
  LAST_NODE_IS_TEXT = 1,
  ELEMENT_INSERTED = 2
}


const wrap = wrapNode;
export function fastCreateDomTree(context: any, element: FuelElement, createStem: () => Stem, fragment: Node = null) {
  while (isComponent(element)) {
    [element, context] = instantiateComponent(context, element, createStem);
  }

  if (element) {
    const dom = createDomElement(element._ownerElement, element, createStem);
    const {children} = element;
    const {length} = children;
    let flags = 0;
    let cursor = 0;

    if (fragment) {fragment.appendChild(dom);}

    while (length > cursor) {
      const el: FuelElement|string|number|(any[]) = children[cursor++];
      if (isFuelElement(el) || Array.isArray(el)) {
        flags = TextInsertionState.ELEMENT_INSERTED;
        dom.appendChild(fastCreateDomTree(context, wrap(null, el, FLY_WEIGHT_ELEMENT_A, FLY_WEIGHT_FRAGMENT_A), createStem));
      } else if ((flags & TextInsertionState.LAST_NODE_IS_TEXT) > 0) {
        dom.lastChild.nodeValue += `${el}`;
      } else if ((flags & TextInsertionState.ELEMENT_INSERTED) === 0) {
        flags |= TextInsertionState.LAST_NODE_IS_TEXT;
        dom.textContent += `${el}`;
      } else {
        flags |= TextInsertionState.LAST_NODE_IS_TEXT;
        dom.appendChild(domOps.newTextNode(`${el}`));
      }
    }
  } else {
    return domOps.newFragment();
  }

  return fragment || element.dom;
}
