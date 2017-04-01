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
  FuelNode,
  KeyMap
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
  Recycler,
  RecycledElementDistributor
} from './recycler';


const wrap = wrapNode;
const {
  initFuelElementBits
} = FuelElementView;


const RECYCLED_ELEMENT = [];
let recycledElementCount = 0;


export const ElementRecycler: RecycledElementDistributor = {
  recycle(el: FuelElement) {
    if (!el || (el._flags & FuelElementBit.RECYCLED) === FuelElementBit.RECYCLED) {
      return;
    }

    if (recycledElementCount === 500) {
      return;
    }

    el._componentInstance =
      el._componentRenderedElementTreeCache =
      el._stem =
      el._subscriptions =
      el._ownerElement =
      el.children =
      el.props =
      el.key =
      el.dom =
      el.type = null;

    el._flags = FuelElementBit.RECYCLED;
    RECYCLED_ELEMENT[recycledElementCount++] = el;
  },

  use(type: any, props: any, children: FuelNode[]): FuelElement {
    if (recycledElementCount > 0) {
      const el: FuelElement = RECYCLED_ELEMENT[--recycledElementCount];
      RECYCLED_ELEMENT[recycledElementCount] = null;
      el.props = props;
      el.key = props.key;
      el.children = children as any;
      el.type = type;
      el._flags = initFuelElementBits(type);
      return el;
    }
    return null;
  }
}
