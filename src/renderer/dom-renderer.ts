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
  Renderer
} from './renderer';
import {
  FuelDOMNode
} from '../type';


const DOM_NODE_CACHE = {};

export class DomRenderer implements Renderer {
  private id: number = 0;

  public updateId() {this.id++}

  public createElement(tagName: string): FuelDOMNode {
    if (DOM_NODE_CACHE[tagName]) {
      return DOM_NODE_CACHE[tagName].cloneNode(false);
    }
    const ret = DOM_NODE_CACHE[tagName] =  document.createElement(tagName) as any;
    ret.setAttribute('data-id', `${this.id}`);
    return ret;
  }

  public createTextNode(text: string): FuelDOMNode {
    return document.createTextNode(text) as any;
  }
}
