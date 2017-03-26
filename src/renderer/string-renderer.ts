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
  StringNodeReprensation,
  FuelDOMNode,
  CONVERSATION_TABLE
} from '../type';


function toStringHelper(this: FuelDOMNode & StringNodeReprensation) {
  if (this.textContent) {
    return this.textContent;
  }

  const attrs = [];
  for (let key in this) {
    const value = this[key];
    if (value !== null) {
      if (CONVERSATION_TABLE[key]) {
        key = CONVERSATION_TABLE[key];
      }
      attrs.push(`${key}="${value}"`);
    }
  }

  return `<${this.tagName}${attrs.length? (' ' + attrs.join(' ')): ''}>${this.childNodes.map(child => child.toString()).join('')}</${this.tagName}>`;
}


function removeAttribute(this: StringNodeReprensation, key: string) {
  this[key] = null;
}


function appendChild(this: FuelDOMNode, child: FuelDOMNode) {
  this.removeChild(child);
  this.childNodes.push(child);
  child.parentNode = this;
  return child;
}


function removeChild(this: StringNodeReprensation, el: StringNodeReprensation) {
  const index = this.childNodes.indexOf(el);
  if (index > -1) {
    this.childNodes.splice(index, 1);
  }
  el.parentNode = null;
}


function replaceChild(this: StringNodeReprensation, newEl: StringNodeReprensation, oldEl: StringNodeReprensation) {
  const index = this.childNodes.indexOf(oldEl);
  if (index > -1) {
    this.childNodes[index] = newEl;
    newEl.parentNode = this;
  }
}

function unenum(value) {
  return {
    configurable: true,
    writable: true,
    enumerable: false,
    value
  }
}


function getter(get) {
  return {
    configurable: true,
    enumerable: false,
    get
  }
}


export class StringRenderer implements Renderer {
  private id: number = 0;

  public updateId() {this.id++;}

  public constructor(private recordGeneration = true) {}

  public createElement(tagName: string): FuelDOMNode {
    return Object.defineProperties(this.recordGeneration? {['data-id']: this.id}: {}, {
      tagName: unenum(tagName),
      childNodes: unenum([]),
      children: getter(function() { return this.childNodes; }),
      toString: unenum(toStringHelper),
      removeAttribute: unenum(removeAttribute),
      appendChild: unenum(appendChild),
      removeChild: unenum(removeChild),
      replaceChild: unenum(replaceChild),
      nodeType: unenum(1),
      parentNode: unenum(null),
      style: unenum({}),
      textContent: unenum('')
    });
  }


  public createTextNode(text: string): FuelDOMNode {
    return Object.defineProperties({}, {
      tagName: unenum(null),
      childNodes: unenum([]),
      children: unenum([]),
      toString: unenum(toStringHelper),
      nodeType: unenum(3),
      parentNode: unenum(null),
      textContent: unenum(text)
    });
  }
}
