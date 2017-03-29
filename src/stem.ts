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
  FuelComponentStatic,
  ExportProperites,
  CONVERSATION_TABLE,
  DOMEvents
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
  requestIdleCallback,
  merge
} from './util';


type PatchStackType = {
  context: any,
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


function replaceElement(root: FuelElement, parent: FuelElement, oldElement: FuelElement, newElement: FuelElement, isKeyedItems: boolean, renderer: Renderer) {
  const newDom = FuelElementView.createDomElement(root, newElement, renderer, createStem);
  const oldDom = oldElement.dom;
  if (oldDom.nodeType === 1 && newDom.nodeType === 1) {
    for (let i = 0, len = oldDom.children.length; i < len; i++) {
      newElement.dom.appendChild(oldDom.children[i]);
    }
  }

  const parentDom = parent.dom;
  if (!isKeyedItems) {
    parentDom.replaceChild(newDom, oldDom);
    clean(root, oldElement);
  } else {
    parentDom.removeChild(oldDom);
    parentDom.appendChild(newDom);
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


function updateElement(diff: Difference, rootElement: FuelElement, newElement: FuelElement) {
  const domElement = newElement.dom;
  const strippedRoot = FuelElementView.stripComponent(rootElement);
  for (let i = 0, len = diff.attr.length; i < len; i++) {
    const {key, value, state} = diff.attr[i];
    switch (state) {
    case AttrState.NEW:
    case AttrState.REPLACED:
      if (DOMEvents[key]) {
        const lowerKey = key.slice(2).toLowerCase();
        FuelElementView.replaceEvent(strippedRoot, newElement, lowerKey, value as any);
      } else {
        domElement[key] = value;
      }
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
  root: FuelElement,
  parent: FuelElement,
  newElement: FuelElement,
  oldElement: FuelElement,
  isKeyedItem: boolean,
  difference: Difference,
  context: any;
}


function clean(rootElement: FuelElement, fuelElement: FuelElement) {
  requestIdleCallback(() => doClean(rootElement, fuelElement));
}


function doClean(rootElement: FuelElement, fuelElement: FuelElement) {
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
        next.root._stem.getEventHandler().removeEvents(next.root.dom, next.dom);
      }
      if (next.element._subscriptions) {
        next.element._subscriptions.forEach(s => s.unsubscribe());
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


function update({parent, newElement, oldElement, isKeyedItem, difference, root, context}: Batch) {
  const {renderer} = FuelStem;
  if (isNewElement(difference)) {
    if (parent) {
      FuelElementView.invokeWillMount(newElement);
      parent.dom.appendChild(fastCreateDomTree(context, root, newElement, renderer, createStem))
      FuelElementView.invokeDidMount(newElement);
    } else {
      const tree = fastCreateDomTree(context, root, newElement, renderer, createStem);
      if (oldElement) {
        FuelElementView.invokeWillMount(newElement);
        parent.dom.appendChild(tree);
        FuelElementView.invokeDidMount(newElement);
        FuelElementView.invokeWillUnmount(oldElement);
        clean(root, oldElement);
      }
    }
  } else if (isRemoveElement(difference)) {
    FuelElementView.invokeWillUnmount(oldElement);
    oldElement.dom.parentNode.removeChild(oldElement.dom);
    oldElement._stem = null;
    clean(root, oldElement);
  } else if (isReplaceElement(difference)) {
    FuelElementView.invokeWillMount(newElement);
    FuelElementView.invokeWillUnmount(oldElement);
    replaceElement(root, parent, oldElement, newElement, isKeyedItem, renderer);
    FuelElementView.invokeDidMount(newElement);
  } else if (isTextChanged(difference)) {
    FuelElementView.invokeWillUpdate(newElement);
    newElement.dom = oldElement.dom;
    newElement.dom.textContent = FuelElementView.getTextValueOf(newElement);
    FuelElementView.invokeDidUpdate(newElement);
  } else {
    FuelElementView.invokeWillUpdate(newElement);
    copyElementRef(root, oldElement, newElement, isKeyedItem);
    updateElement(difference, root, newElement);
    FuelElementView.invokeDidUpdate(newElement);
  }

  if (isCreateChildren(difference)) {
    fastCreateDomTree(context, root, newElement, renderer, createStem);
  }
}


export class FuelStem implements Stem {
  public static renderer: Renderer;

  private _enabled = true;

  private batchs: Batch[] = [];

  private batchCallback: () => void = null;

  private sharedEventHandler: SharedEventHandler;

  constructor(private tree: FuelElement = null) {}

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
    requestAnimationFrame(() => {
      if (this.batchs.length) {
        this.batchs.forEach(b => update(b));
        this.batchs.length = 0;
        this.batchCallback && this.batchCallback();
        this.batchCallback = null;
      }
    });
  }


  public render(el: FuelElement, callback: (el: Node) => void = (el => {}), updateOwnwer = true) {
    if (!this._enabled) {
      callback(this.tree.dom as any);
      return;
    }

    FuelStem.renderer.updateId();
    if (this.tree) {
      this.patch(el);
      this.batchCallback = () => {
        if (updateOwnwer) {
          this.tree = el;
        }
        callback(this.tree.dom as any);
      };
      this.renderAtAnimationFrame();
    } else {
      callback(this.attach(el, updateOwnwer) as any);
    }
  }


  private attach(el: FuelElement, updateOwner: boolean) {
    const domTree = fastCreateDomTree({}, el, el, FuelStem.renderer, createStem);
    if (updateOwner) {
      this.tree = el;
    }
    return domTree;
  }


  private patchComponent(context: any, newElement: FuelElement, oldElement: FuelElement) {
    if (newElement && FuelElementView.isComponent(newElement)) {
      if (oldElement && oldElement.type !== newElement.type) {
        while (newElement && FuelElementView.isComponent(newElement)) {
          [newElement, context] = FuelElementView.instantiateComponent(context, newElement);
        }
      } else {
        while (newElement && FuelElementView.isComponent(newElement)) {
          if (newElement && oldElement && newElement.type === oldElement.type) {
            newElement._componentInstance = oldElement._componentInstance;
          }
          const [stripedNewTree, newContext] = FuelElementView.instantiateComponent(context, newElement, oldElement);
          context = newContext;
          if (oldElement && FuelElementView.isComponent(oldElement)) {
            oldElement = oldElement._componentRenderedElementTreeCache;
          }
          newElement = stripedNewTree;
        }
      }
    }

    if (oldElement && FuelElementView.isComponent(oldElement)) {
      oldElement = FuelElementView.stripComponent(oldElement);
    }

    return [context, newElement, oldElement];
  }


  private patch(root: FuelElement) {
    if (this.batchs.length) {
      this.batchs.length = 0;
    }

    const stack: PatchStackType[] = [
      {
        newElement: root,
        oldElement: this.tree,
        newChildren: null,
        oldChildren: null,
        parsed: false,
        difference: null,
        context: {},
        root
      }
    ];

    let parent: PatchStackType = null;
    let isKeyedItem = false;
    let context = stack[0].context;

    while (stack.length) {
      const next = stack.pop();
      let {newElement, oldElement} = next;
      let difference: Difference;
      let currentRoot = next.root;

      if (!next.parsed) {

        [context, newElement, oldElement] = this.patchComponent(context, newElement, oldElement);

        if (!newElement && !oldElement) {
          continue;
        }

        if (newElement && oldElement) {
          newElement._stem = oldElement._stem;
        }

        next.newElement = newElement;
        next.oldElement = oldElement;
        next.context = context;

        if (newElement && newElement._stem) {
          currentRoot = next.newElement;
        }

        difference = diff(oldElement, newElement);
        next.difference = difference;
        this.batchs.push({
          root: currentRoot,
          parent: parent? parent.newElement: null,
          newElement,
          oldElement,
          isKeyedItem,
          difference,
          context: next.context
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

        if (newChild._stem) {
          currentRoot = newChild;
        }

        stack.push({
          newElement: newChild,
          oldElement: oldChild,
          newChildren: null,
          oldChildren: null,
          parsed: false,
          difference: null,
          root: currentRoot,
          context
        });
      }
    }
  }
}
