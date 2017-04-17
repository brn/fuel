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
  PatchOps,
  KeyMap,
  MoveType
} from './type';
import {
  setStyle
} from './node';
import {
  fastCreateDomTree
} from './tree';
import {
  FuelElementView,
  createTextNode
} from './element';
import {
  typeOf,
  keyList
} from './util';
import {
  collect
} from './recycler/collect';
import {
  domOps
} from './domops';
import {
  compare,
  compareStyle
} from './difference';


const {getTextValueOf, attachFuelElementToNode, invokeDidMount, invokeDidUpdate, invokeWillUnmount, createDomElement, isTextNode, stripComponent, setDisposed, isFragment, getFuelElementFromNode} = FuelElementView;

export class PatchOpsImpl implements PatchOps {
  private removes: [FuelElement, Node][] = [];

  public constructor(private createStem: () => Stem) {}

  move(moveTo: number, moveType: MoveType, oldElement: FuelElement): void {
    let target = oldElement.dom.parentNode.childNodes[moveTo];
    if (moveType === MoveType.AFTER) {
      target = (target as Element).nextElementSibling;
      if (!target) {
        oldElement.dom.parentNode.appendChild(oldElement.dom);
        return;
      }
    }
    oldElement.dom.parentNode.insertBefore(oldElement.dom, target);
  }

  replace(index: number, parent: FuelElement, newElement: FuelElement, oldElement: FuelElement, context: any): void {
    invokeWillUnmount(oldElement);
    const target = parent.dom.childNodes[index];
    const isText = isTextNode(newElement);

    let tree;
    if (isText || !newElement.children.length) {
      if (isText && target.nodeType === 3) {
        target.nodeValue = getTextValueOf(newElement);
        return;
      }
      tree = createDomElement(parent._ownerElement, newElement, this.createStem);
    } else {
      tree = fastCreateDomTree(context, newElement, this.createStem);
    }

    if (target && !isFragment(newElement)) {
      parent.dom.replaceChild(tree, target);
      collect(oldElement, true);
      invokeDidMount(newElement);
    }
  }

  update(newElement: FuelElement, oldElement: FuelElement): void {
    newElement.dom = oldElement.dom;
    const newProps = newElement.props;
    const oldProps = oldElement.props;
    const newPropsKeys = keyList(newProps);
    const oldPropsKeys = keyList(oldProps);
    const newPropsLength = newPropsKeys.length;
    const oldPropsLength = oldPropsKeys.length;
    const isSkip = newPropsLength === oldPropsLength && ((newPropsLength === 2 && newPropsKeys[1] === 'key') || newPropsLength === 1);
    if (!isSkip) {
      const keys = oldPropsLength > newPropsLength? oldPropsKeys: newPropsKeys;

      for (let i = 0, len = oldPropsLength > newPropsLength? oldPropsLength: newPropsLength; i < len; i++) {
        const key = keys[i];
        if (key === 'children' || key === 'key') {
          continue;
        }

        if (DOMEvents[key]) {
          const lowerKey = key.slice(2).toLowerCase();
          const rootElement = stripComponent(newElement._ownerElement);
          if (oldProps[key]) {
            newElement._ownerElement._stem.getEventHandler().replaceEvent(oldElement.dom, lowerKey, newProps[key] as any);
          } else {
            newElement._ownerElement._stem.getEventHandler().addEvent(rootElement.dom, oldElement.dom, lowerKey, oldProps[key] as any);
          }
        } else if (key === 'style') {
          const [styleDiff, count] = compareStyle(oldProps[key] || {}, newProps[key] || {});
          if (count) {
            for (const style in styleDiff) {
              setStyle(oldElement.dom, style, styleDiff[style]);
            }
          }
        } else if (!newProps[key]) {
          (oldElement.dom as HTMLElement).removeAttribute(key);
        } else if (!oldProps[key]) {
          oldElement.dom[key] = newProps[key];
        } else {
          if (!compare(newProps[key], oldProps[key])) {
            oldElement.dom[key] = newProps[key];
          }
        }
      }
    }

    attachFuelElementToNode(newElement.dom, newElement);
    invokeDidUpdate(newElement);
  }

  insert(index: number, context: any, parent: FuelElement, newElement: FuelElement): void {
    let tree;
    if (isTextNode(newElement) || !newElement.children.length) {
      tree = createDomElement(parent._ownerElement, newElement, this.createStem);
    } else {
      tree = fastCreateDomTree(context, newElement, this.createStem);
    }
    if (parent && parent.dom && !isFragment(newElement)) {
      const target = parent.dom.childNodes[index];
      parent.dom.insertBefore(tree, target);
      invokeDidMount(newElement);
    }
  }

  append(context: any, parent: FuelElement, newElement: FuelElement): void {    
    let tree;
    const isText = isTextNode(newElement);
    const hasParentDom = parent && parent.dom;
    if (isText || !newElement.children.length) {
      if (isText && hasParentDom && parent.dom.lastChild.nodeType === 3) {
        parent.dom.lastChild.nodeValue = getTextValueOf(newElement);
        return;
      }
      tree = createDomElement(parent._ownerElement, newElement, this.createStem);
    } else {
      tree = fastCreateDomTree(context, newElement, this.createStem);
    }

    if (hasParentDom && !isFragment(newElement)) {
      const {parentNode} = tree;
      if (parentNode && parentNode !== parent) {
        parent.dom.appendChild(tree);
      }
      invokeDidMount(newElement);
    }
  }

  remove(index: number, parent: FuelElement, oldElement: FuelElement): void {
    invokeWillUnmount(oldElement);
    if (parent.dom) {
      const el = parent.dom.childNodes[index];
      if (el) {
        this.removes.push([oldElement, el]);
      }
    }
    if (!isFragment(oldElement) && !isTextNode(oldElement)) {
      setDisposed(oldElement);
    }
    oldElement._stem = null;
  }

  updateText(index: number, parent: FuelElement, newElement: FuelElement): void {
    const node = parent.dom.childNodes[index];
    const value = FuelElementView.getTextValueOf(newElement);
    if (node) {
      if (node.nodeType === 3) {
        node.nodeValue = value;
      } else {
        parent.dom.replaceChild(domOps.newTextNode(value), node);
      }
    } else {
      parent.dom.appendChild(domOps.newTextNode(value));
    }
  }

  setText(parent: FuelElement, newElement: FuelElement): void {
    parent.dom.textContent = getTextValueOf(newElement);
    console.log(parent.dom.parentNode.parentNode.parentNode);
  }

  createChildren(context: any, newElement: FuelElement) {
    fastCreateDomTree(context, newElement, this.createStem);
  }

  removeChildren(el: FuelElement): void {
    el.dom.textContent = '';
  }

  executeRemove() {
    for (let i = 0, len = this.removes.length; i < len; i++) {
      const [el, dom] = this.removes[i];
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom);
        collect(el, true);
      }
    }
    this.removes = [];
  }
}
