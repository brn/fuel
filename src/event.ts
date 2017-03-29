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
  SharedEventHandler
} from './type';
import {
  Symbol
} from './util';


const FUEL_EVENT_SYM = Symbol('__fuelevent');
const ROOT_EVENT_SYM = Symbol('__root_events');
const ON_REGEXP = /^on/;


export class SharedEventHandlerImpl implements SharedEventHandler {
  private events: {[key: string]: {[key: string]: (e: Event) => void} & {count: number, root: Node}} = {};

  private id: number = 1;

  public addEvent(root: EventTarget, el: EventTarget, type: string, callback: (e: Event) => void) {
    type = type.replace(ON_REGEXP, '').toLowerCase();
    if (!root[ROOT_EVENT_SYM]) {
      root[ROOT_EVENT_SYM] = {};
    }

    if ((el as Node).nodeName === 'INPUT' && type === 'change') {
      type = 'keyup';
    }

    const id = String(this.id++);

    if (!root[ROOT_EVENT_SYM][type]) {
      root[ROOT_EVENT_SYM][type] = true;
      const handler = (e: Event) => {
        const eventInfo = e.target[FUEL_EVENT_SYM];
        if (eventInfo && eventInfo[e.type] && eventInfo[e.type] === id) {
          const callback = this.events[e.type][id];
          if (callback) {
            callback(e);
          }
        }
      };
      this.events[type] = {count: 1, '0': handler, root} as any;
      root.addEventListener(type, handler, false);
    } else {
      this.events[type][String(this.events[type].count++)] = callback;
    }

    this.events[type][id] = callback;
    if (!el[FUEL_EVENT_SYM]) {
      el[FUEL_EVENT_SYM] = {[type]: id};
    } else {
      el[FUEL_EVENT_SYM][type] = id;
    }
  }

  public removeEvent(el: EventTarget, type: string) {
    if (el[FUEL_EVENT_SYM]) {
      const eventInfo = el[FUEL_EVENT_SYM];
      if (eventInfo[type]) {
        this.events[type][eventInfo[type]] = null;
        this.events[type].count--;
        eventInfo[type] = null;
        const root = this.events[type].root;
        if (this.events[type].count === 0) {
          root.removeEventListener(type, this.events[type]['0']);
          root[ROOT_EVENT_SYM][type] = false;
          this.events[type].root = null;
        }
      }
    }
  }

  public replaceEvent(el: EventTarget, type: string, value: (e: Event) => void) {
    if (el[FUEL_EVENT_SYM]) {
      const eventInfo = el[FUEL_EVENT_SYM];
      if (eventInfo[type]) {
        this.events[type][eventInfo[type]] = value;
      }
    }
  }

  public removeEvents(el: EventTarget) {
    if (el[FUEL_EVENT_SYM]) {
      const eventInfo = el[FUEL_EVENT_SYM];
      for (const type in eventInfo) {
        this.removeEvent(el, type);
      }
    }
  }
}
