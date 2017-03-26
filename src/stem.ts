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
  FuelDOMNode,
  SharedEventHandler,
  Stem,
  FuelComponent,
  ExportProperites,
  CONVERSATION_TABLE
} from './type';
import {
  setStyle
} from './node';
import {
  fastCreateDomTree
} from './tree';
import {
  FuelElementView
} from './element';
import {
  Difference,
  AttrState,
  DifferenceBits,
  isCreateChildren,
  isRemoveChildren,
  isNewElement,
  isRemoveElement,
  isReplaceElement,
  isTextChanged,
  diff
} from './difference';
import {
  Renderer
} from './renderer/renderer';
import {
  invariant,
  requestAnimationFrame,
  requestIdleCallback
} from './util';


type PatchStackType = {
  newElement: FuelElement,
  oldElement: FuelElement,
  newChildren: FuelElement[],
  oldChildren: FuelElement[],
  parsed: boolean,
  difference: Difference,
  root: FuelElement
};


function createStem() {
  return new FuelStem();
}


function replaceElement(root: FuelElement, oldElement: FuelElement, newElement: FuelElement, isKeyedItems: boolean, renderer: Renderer) {
  const newDom = FuelElementView.createDomElement(root, newElement, renderer, createStem);
  const oldDom = oldElement.dom;
  if (oldDom.nodeType === 1 && newDom.nodeType === 1) {
    for (let i = 0, len = oldDom.children.length; i < len; i++) {
      newElement.dom.appendChild(oldDom.children[i]);
    }
  }

  if (!isKeyedItems) {
    const parent = oldElement.dom.parentNode;
    parent.replaceChild(newDom, oldDom);
    clean(root, oldElement, false);
  } else {
    const parent = oldElement.dom.parentNode;
    parent.removeChild(oldDom);
    parent.appendChild(newDom);
  }

  oldElement.dom = null;
}


function copyElementRef(root: FuelElement, oldElement: FuelElement, newElement: FuelElement, isKeyedItem: boolean) {
  newElement.dom = oldElement.dom;
  oldElement.dom = null;
  if (isKeyedItem) {
    newElement.dom.parentNode.appendChild(newElement.dom);
  }
}


function updateElement(diff: Difference, newElement: FuelElement) {
  const domElement = newElement.dom;
  for (let i = 0, len = diff.attr.length; i < len; i++) {
    const {key, value, state} = diff.attr[i];
    switch (state) {
    case AttrState.NEW:
    case AttrState.REPLACED:
      domElement[key] = value;
      break;
    case AttrState.STYLE_CHANGED:
      for (const style in value as any) {
        const val = value[style];
        setStyle(domElement, style, val);
      }
      break;
    case AttrState.REMOVED:
      domElement.removeAttribute(key);
    default:
    }
  }
}


interface Batch {
  mountCallbacks: FuelComponent<any, any>[],
  root: FuelElement,
  parent: FuelElement,
  newElement: FuelElement,
  oldElement: FuelElement,
  isKeyedItem: boolean,
  difference: Difference
}


function clean(rootElement: FuelElement, fuelElement: FuelElement, remove = true) {
  requestIdleCallback(() => doClean(rootElement, fuelElement, remove));
}


function doClean(rootElement: FuelElement, fuelElement: FuelElement, remove = true) {
  const stack = [
    {
      element: fuelElement,
      children: fuelElement.children.slice(),
      dom: fuelElement.dom,
      root: rootElement
    }
  ];

  while (stack.length) {
    const next = stack.pop();
    if (next.dom) {
      if (next.dom['__fuelevent']) {
        next.root._stem.getEventHandler().removeEvent(next.root.dom, next.dom);
      }
      if (next.element._subscriptions) {
        next.element._subscriptions.forEach(s => s.unsubscribe());
      }
      if (remove) {
        next.dom.parentNode.removeChild(next.dom);
      }
      next.dom = null;
    }
    if (next.children.length) {
      const child = next.children.shift();
      stack.push(next);
      stack.push({element: child, children: child.children.slice(), dom: null, root: child._stem? child: next.root});
    }
  }
}


function update({parent, newElement, oldElement, isKeyedItem, difference, root, mountCallbacks}: Batch) {
  const {renderer} = FuelStem;
  if (isNewElement(difference)) {
    if (parent) {
      parent.dom.appendChild(fastCreateDomTree(root, newElement, renderer, createStem, mountCallbacks))
    } else {
      const tree = fastCreateDomTree(root, newElement, renderer, createStem, mountCallbacks);
      if (oldElement) {
        oldElement.dom.parentNode.appendChild(tree);
        clean(root, oldElement, false);
      }
    }
  } else if (isRemoveElement(difference)) {
    clean(root, oldElement);
  } else if (isReplaceElement(difference)) {
    replaceElement(root, oldElement, newElement, isKeyedItem, renderer);
  } else if (isTextChanged(difference)) {
    newElement.dom = oldElement.dom;
    newElement.dom.textContent = FuelElementView.getTextValueOf(newElement);
  } else {
    copyElementRef(root, oldElement, newElement, isKeyedItem);
    updateElement(difference, newElement);
  }

  if (isCreateChildren(difference)) {
    fastCreateDomTree(root, newElement, renderer, createStem, mountCallbacks);
  } else if (isRemoveChildren(difference)) {
    clean(root, oldElement);
  }
}


export class FuelStem implements Stem {
  public static renderer: Renderer;

  private tree: FuelElement;

  private batchs: Batch[] = [];

  private batchCallback: () => void = null;

  private mountCallbacks: FuelComponent<any, any>[] = [];

  private sharedEventHandler: SharedEventHandler;

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
    requestAnimationFrame(() => {
      if (this.batchs.length) {
        this.batchs.forEach(b => update(b));
        this.batchs.length = 0;
        this.notifyComponentDidUpdate();
        this.batchCallback && this.batchCallback();
        this.batchCallback = null;
      }
    });
  }

  public render(el: FuelElement, callback: (el: Node) => void = (el => {})) {
    FuelStem.renderer.updateId();
    if (this.tree) {
      this.patch(el);
      this.batchCallback = () => {
        if (FuelElementView.isComponent(el)) {
          this.tree = el._componentRenderedElementTreeCache;
        } else {
          this.tree = el;
        }
        callback(this.tree.dom as any);
      };
      this.renderAtAnimationFrame();
    } else {
      callback(this.attach(el) as any);
    }
  }

  private attach(el: FuelElement) {
    const domTree = fastCreateDomTree(el, el, FuelStem.renderer, createStem, this.mountCallbacks);
    this.notifyComponentDidMount();
    if (FuelElementView.isComponent(el)) {
      this.tree = el._componentRenderedElementTreeCache;
    } else {
      this.tree = el;
    }
    return domTree;
  }

  private notifyComponentDidUpdate() {
    this.mountCallbacks.forEach(v => v[ExportProperites.componentDidUpdate]());
    this.mountCallbacks.length = 0;
  }

  private notifyComponentDidMount() {
    this.mountCallbacks.forEach(v => v[ExportProperites.componentDidMount]());
    this.mountCallbacks.length = 0;
  }

  private patch(root: FuelElement) {
    if (this.batchs.length) {
      this.batchs.length = 0;
    }

    const mountCallbacks = [];
    const stack: PatchStackType[] = [
      {
        newElement: root,
        oldElement: this.tree,
        newChildren: null,
        oldChildren: null,
        parsed: false,
        difference: null,
        root
      }
    ];

    let parent: PatchStackType = null;
    let isKeyedItem = false;

    if (FuelElementView.isComponent(root)) {
      root = FuelElementView.instantiateComponent(root, this.tree, mountCallbacks);
      stack[0].newElement = root;
    }

    while (stack.length) {
      const next = stack.pop();
      const {newElement, oldElement} = next;
      let difference: Difference;
      let currentRoot = next.root;

      if (!next.parsed) {
        difference = diff(oldElement, newElement);
        next.difference = difference;
        this.batchs.push({
          mountCallbacks: this.mountCallbacks,
          root: currentRoot,
          parent: parent? parent.newElement: null,
          newElement,
          oldElement,
          isKeyedItem,
          difference
        });

        next.newChildren = newElement? newElement.children.slice(): [];
        next.oldChildren = oldElement? oldElement.children.slice(): [];
        next.parsed = true;
      }

      if ((next.newChildren.length || next.oldChildren.length) &&
          (!next.difference ||
           next.difference.flags === 0 ||
           next.difference.flags === DifferenceBits.REPLACE_ELEMENT)) {
        parent = next;
        stack.push(next);

        let newChild = next.newChildren.shift();
        let oldChild: FuelElement;

        if (oldElement && oldElement._keymap && newChild && oldElement._keymap[newChild.key]) {
          oldChild = oldElement._keymap[newChild.key];
          if (!newChild._keymap) {
            newChild._keymap = {};
          }
          newChild._keymap[newChild.key] = newChild;
          const index = next.oldChildren.indexOf(oldChild);
          next.oldChildren.splice(index, 1);
          isKeyedItem = true;
        } else {
          oldChild = next.oldChildren.shift();
          isKeyedItem = false;
        }
        
        if (newChild && newChild._stem) {
          currentRoot = newChild;
        }

        if (newChild && FuelElementView.isComponent(newChild)) {
          if (oldChild && FuelElementView.isComponent(oldChild)) {
            while (FuelElementView.isComponent(newChild)) {
              if (FuelElementView.isComponent(oldChild)) {
                newChild._componentInstance = oldChild._componentInstance
                newChild._componentRenderedElementTreeCache = oldChild._componentRenderedElementTreeCache;
                newChild._stem = oldChild._stem;
                oldChild = oldChild._componentRenderedElementTreeCache;
              }
              newChild = FuelElementView.instantiateComponent(newChild, null, mountCallbacks);
            }
          } else {
            while (FuelElementView.isComponent(newChild)) {
              const renderedTree = FuelElementView.instantiateComponent(newChild, null, mountCallbacks);
              newChild._stem.registerOwner(newChild);
              newChild = renderedTree;
            }
          }
        } else if (oldChild && FuelElementView.isComponent(oldChild)) {
          while (FuelElementView.isComponent(oldChild)) {
            oldChild = oldChild._componentRenderedElementTreeCache;
          }
        }

        stack.push({
          newElement: newChild,
          oldElement: oldChild,
          newChildren: null,
          oldChildren: null,
          parsed: false,
          difference: null,
          root: currentRoot
        });
      }
    }
  }
}
