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


const ON_REGEXP = /^on/;


export class SharedEventHandlerImpl implements SharedEventHandler {
  private events: {[key: string]: {[key: string]: (e: Event) => void} & {count: number}} = {};

  private id: number = 1;

  public addEvent(root: EventTarget, el: EventTarget, type: string, callback: (e: Event) => void) {
    type = type.replace(ON_REGEXP, '').toLowerCase();
    if (!root['__events']) {
      root['__events'] = {};
    }

    if ((el as Node).nodeName === 'INPUT' && type === 'change') {
      type = 'keyup';
    }

    const id = String(this.id++);

    if (!root['__events'][type]) {
      root['__events'][type] = true;
      const handler = (e: Event) => {
        const eventInfo = e.target['__fuelevent'];
        if (eventInfo[e.type] && eventInfo[e.type] === id) {
          const callback = this.events[e.type][id];
          if (callback) {
            callback(e);
          }
        }
      };
      this.events[type] = {count: 1, '0': handler} as any;
      root.addEventListener(type, handler, false);
    } else {
      this.events[type][String(this.events[type].count++)] = callback;
    }

    this.events[type][id] = callback;
    if (!el['__fuelevent']) {
      el['__fuelevent'] = {[type]: id};
    } else {
      el['__fuelevent'][type] = id;
    }
  }

  public removeEvent(root: EventTarget, el: EventTarget, type: string) {
    if (el['__fuelevent']) {
      const eventInfo = el['__fuelevent'];
      if (eventInfo[type]) {
        this.events[type][eventInfo[type]] = null;
        this.events[type].count--;
        eventInfo[type] = null;
        if (this.events[type].count === 0) {
          root.removeEventListener(type, this.events[type]['0']);
          root['__events'][type] = false;
        }
      }
    }
  }

  public replaceEvent(root: EventTarget, el: EventTarget, type: string, value: (e: Event) => void) {
    if (el['__fuelevent']) {
      const eventInfo = el['__fuelevent'];
      if (eventInfo[type]) {
        this.events[type][eventInfo[type]] = value;
      }
    }
  }

  public removeEvents(root: EventTarget, el: EventTarget) {
    if (el['__fuelevent']) {
      const eventInfo = el['__fuelevent'];
      for (const type in eventInfo) {
        if (eventInfo[type] === null) {continue}
        this.events[type][eventInfo[type]] = null;
        this.events[type].count--;
        eventInfo[type] = null;
        if (this.events[type].count === 0) {
          root.removeEventListener(type, this.events[type]['0']);
        }
      }
    }
  }
}
