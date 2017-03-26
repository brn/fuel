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
  BufferType,
  HAS_TYPED_ARRAY,
  BUFFER_SIZE_MULTIPLER
} from './type';


export const makeBuffer: (number) => BufferType = HAS_TYPED_ARRAY? size => {
  return new Uint16Array(new ArrayBuffer(size * BUFFER_SIZE_MULTIPLER));
}: size => {
  return new Array(size);
};


export function setBuffer(buffer: BufferType, value: BufferType, offset: number = 0) {
  if (buffer instanceof Uint16Array) {
    buffer.set(value, offset);
    return buffer;
  }
  buffer.splice.apply(buffer, [offset, value.length, ...value as number[]]);
  return buffer;
}


export const Symbol = typeof window['Symbol'] === 'function'? window['Symbol']: (() => {
  const map = {};
  function Symbol(sym: string) {
    return `@@${sym}`;
  }
  Symbol['for'] = (sym: string) => {
    if (map[sym]) {
      return map[sym];
    }
    return map[sym] = Symbol(sym);
  }
})();

export function invariant(condition: any, message: string, warn = false) {
  if (condition) {
    if (!warn) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
}

const HAS_REQUEST_ANIMATION_FRAME = typeof window.requestAnimationFrame === 'function';
export const requestAnimationFrame = HAS_REQUEST_ANIMATION_FRAME? cb => window.requestAnimationFrame(cb): cb => setTimeout(cb, 60)

const HAS_REQUEST_IDLE_CALLBACK = typeof window['requestIdleCallback'] === 'function';
export const requestIdleCallback = HAS_REQUEST_IDLE_CALLBACK? cb => window['requestIdleCallback'](cb): cb => cb();
