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
  SharedEventHandler,
  Stem,
  FuelComponent,
  FuelComponentStatic,
  CONVERSATION_TABLE,
  DOMEvents,
  PatchOps
} from './type';
import {
  setStyle
} from './node';
import {
  fastCreateDomTree
} from './tree';
import {
  collect
} from './recycler/collect';
import {
  FuelElementView
} from './element';
import {
  invariant,
  requestAnimationFrame,
  requestIdleCallback,
  merge
} from './util';
import {
  patch
} from './patch';
import {
  domOps
} from './domops';
import {
  PatchOpsImpl
} from './patchops';


function createStem() {return new FuelStem();}


export class FuelStem implements Stem {
  private patchOps: PatchOps;
  private _enabled = true;

  private batchCallback: () => void = null;

  private sharedEventHandler: SharedEventHandler;

  private lock: boolean = false;

  private renderQueue: {element: FuelElement, cb: (el: Node) => void}[] = [];

  private tree: FuelElement;

  constructor() {
    this.patchOps = new PatchOpsImpl(createStem);
  }

  public enterUnsafeUpdateZone(cb: () => void) {
    this._enabled = false;
    cb();
    this._enabled = true;
  }


  public registerOwner(owner: FuelElement) {
    this.tree = owner;
  }


  public owner(): FuelElement {
    return this.tree;
  }


  public setEventHandler(handler: SharedEventHandler) {
    this.sharedEventHandler = handler;
  }


  public getEventHandler() {
    return this.sharedEventHandler;
  }


  private renderAtAnimationFrame() {
    this.batchCallback && this.batchCallback();
    this.batchCallback = null;
  }

  private drainRenderQueue() {
    const next = this.renderQueue.shift();
    if (next) {
      const {element, cb} = next;
      this.render(element, cb);
    }
  }

  public unmountComponent(fuelElement: FuelElement, cb?: () => void) {
    collect(fuelElement, true, cb);
  }

  public render(el: FuelElement, callback: (el: Node) => void = (el => {}), context: any = {}, updateOwnwer = true) {
    if (!this._enabled) {
      callback(this.tree.dom as any);
      return;
    }

    if (this.lock) {
      this.renderQueue.push({element: el, cb: callback});
      return;
    }

    domOps.updateId();
    if (this.tree) {
      this.lock = true;
      patch(context, el, this.tree, this.patchOps, createStem);

      const old = this.tree;
      if (updateOwnwer) {
        this.tree = el;
      }
      this.batchCallback = () => {
        callback(this.tree.dom as any);
        this.lock = false;
        this.drainRenderQueue();
      };
      this.renderAtAnimationFrame();
    } else {
      callback(this.attach(el, updateOwnwer) as any);
    }
  }


  private attach(el: FuelElement, updateOwner: boolean) {
    const domTree = fastCreateDomTree({}, el, createStem, domOps.newFragment());
    if (updateOwner) {
      this.tree = el;
    }
    return domTree;
  }
}
