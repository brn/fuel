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
  KeyMap,
  CONVERSATION_TABLE
} from '../type';
import {
  FuelElementBit
} from '../bits';
import {
  RecycledNodeDistributor
} from './recycler';
import {
  keyList
} from '../util';


interface RecycledDomNodes {
  nodes: Node[];
  count: number;
}


let recycled = 0;
const NODE_RECYCLE_INDICES: KeyMap<RecycledDomNodes> = {}

export const NodeRecycler: RecycledNodeDistributor = {
  recycle(element: FuelElement) {
    if (recycled === 500) {
      return;
    }

    const dom = element.dom;
    if (dom) {
      const nodeName = element.type
      if (!NODE_RECYCLE_INDICES[nodeName]) {
        NODE_RECYCLE_INDICES[nodeName] = {count: 0, nodes: []}
      }
      const item = NODE_RECYCLE_INDICES[nodeName];


      const keys = keyList(element.props);

      for (let i = 0, len = keys.length; i < len; ++i) {
        let key = keys[i];
        if (key !== 'key' && key !== 'children') {
          if (key === 'className') {key = 'class'}
          (dom as HTMLElement).removeAttribute(key);
        }
      }

      item.nodes[item.count++] = dom;
      ++recycled;
    }
  },

  use(name: string) {
    const item = NODE_RECYCLE_INDICES[name];
    if (item && item.count > 0) {
      const node = item.nodes[--item.count];
      item.nodes[item.count] = null;
      node['__recycled'] = 0;
      --recycled;
      return node || null;
    }
    return null;
  }
}
