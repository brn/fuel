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
  FuelNode
} from '../type';
import {
  FLY_WEIGHT_ELEMENT_A,
  FLY_WEIGHT_FRAGMENT_A,
  wrapNode,
  FuelElementView
} from '../element';
import {
  FuelElementBit
} from '../bits';
import {
  RecycledElementDistributor,
  RecycledNodeDistributor
} from './recycler';
import {
  ElementRecycler
} from './element';
import {
  NodeRecycler
} from './node';


const wrap = wrapNode;
const {
  isFuelElement,
  isTextNode,
  isFragment,
  isDisposed,
  cleanupElement,
  setDisposed,
  stripComponent
} = FuelElementView;


const {recycle: recycleNode} = NodeRecycler;
const {recycle: recycleElement} = ElementRecycler;


export function collect(fuelElement: FuelElement, all?: boolean, cb?: () => void) {
  doCollect(fuelElement, false, all);
  cb && cb();
}


/**
 * Collect and cleanup element.
 */
function doCollect(fuelElement: FuelElement, isParentDisposed: boolean, all: boolean) {
  const element = wrap(null, stripComponent(fuelElement), FLY_WEIGHT_ELEMENT_A, FLY_WEIGHT_FRAGMENT_A);
  const {children} = element;
  const isDisp = isDisposed(element);
  
  if (!isFragment(element)) {
    if (!element) {
      return;
    }
    if (isParentDisposed) {
      setDisposed(element);
    }

    const {dom} = element;

    if (!isFragment(element) && (all || isDisp)) {
      if (dom && dom.childNodes.length) {
        dom.textContent = '';
      }
      recycleNode(element);
      cleanupElement(element);
      recycleElement(element);
    }
  }

  const {length} = children;

  let cursor = 0;
  while (length > cursor) {
    const el = children[cursor++];
    if (isFuelElement(el) || Array.isArray(el)) {
      doCollect(el, isDisp, all);
    }
  }
}
