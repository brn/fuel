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
  FuelDOMNode
} from './type';
import {
  FuelStem
} from './stem';
import {
  FuelElementView
} from './element';
import {
  DomRenderer
} from './renderer/dom-renderer';


export const FuelDOM = {
  render(element: FuelElement, firstNode: FuelDOMNode|Node, cb: (dom: Node) => void = (dom: Node) => {}) {
    const oldElement = FuelElementView.getFuelElementFromNode(firstNode as FuelDOMNode);

    if (!FuelStem.renderer) {
      FuelStem.renderer = new DomRenderer();
    }

    if (oldElement) {
      element._stem = oldElement._stem;
    } 

    if (!element._stem) {
      element._stem = new FuelStem();
    }
      if (oldElement && !oldElement.dom) debugger;
    FuelElementView.attachFuelElementToNode(firstNode as FuelDOMNode, element);
    element._ownerElement = element;
    element._stem.render(element, root => {
      (firstNode as HTMLElement).appendChild(root as any);
      cb && cb(root as any);
    });
  }
}


export const ReactDOM = FuelDOM;
