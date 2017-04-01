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


declare var global: any;
const g = typeof global === 'object'? global: typeof window === 'object'? window: this || {};

export const Symbol = typeof g.Symbol === 'function'? g.Symbol: (() => {
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

export function invariant(condition: any, message: string|(() => string), warn = false) {
  if (condition) {
    const m = typeof message === 'function'? message(): message;
    if (!warn) {
      throw new Error(m);
    } else {
      console.warn(m);
    }
  }
}

export function merge<T extends {[key: string]: any}, U extends {[key: string]: any}>(a: T, b: U): T & U {
  const ret = {} as T & U;
  for (const key in a) {
    ret[key] = a[key];
  }
  for (const key in b) {
    ret[key] = b[key];
  }
  return ret;
}

const {toString} = Object.prototype;
const oReg = /\[object ([^\]]+)\]/;
export function typeOf(a: any): string {
  return toString.call(a).match(oReg)[1].toLowerCase();
}

const HAS_REQUEST_ANIMATION_FRAME = typeof g.requestAnimationFrame === 'function';
export const requestAnimationFrame = HAS_REQUEST_ANIMATION_FRAME? cb => g.requestAnimationFrame(cb): cb => setTimeout(cb, 60)

const HAS_REQUEST_IDLE_CALLBACK = typeof g['requestIdleCallback'] === 'function';
export const requestIdleCallback = HAS_REQUEST_IDLE_CALLBACK? cb => g['requestIdleCallback'](cb): cb => cb();

export function isDefined(a) {
  return a !== null && a !== undefined;
}
export const keyList = Object.keys;
