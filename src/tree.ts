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
  FuelComponent,
  FuelComponentStatic,
  Stem,
  FuelDOMNode
} from './type';
import {
  FuelElementView
} from './element';
import {
  Renderer
} from './renderer/renderer';
import {
  invariant
} from './util'


type FastDomTreeStackType = {
  element: FuelElement,
  parentElement: FuelElement,
  children: FuelElement[],
  dom: FuelDOMNode,
  parent: FuelDOMNode,
  root: FuelElement,
  context: any;
};


function makeInitialDomTreeStack(context: any, rootElement: FuelElement, fuelElement: FuelElement): FastDomTreeStackType[] {
  return [
    {
      element: fuelElement,
      parentElement: null,
      children: fuelElement.children.slice(),
      dom: fuelElement.dom,
      parent: null,
      root: rootElement,
      context
    }
  ]
}


export function fastCreateDomTree(
  context: any,
  rootElement: FuelElement,
  fuelElement: FuelElement,
  renderer: Renderer,
  createStem: () => Stem) {
  let createdDomTreeRoot: FuelDOMNode;

  while (fuelElement && FuelElementView.isComponent(fuelElement)) {
    [fuelElement, context] = renderComponent(context, fuelElement, createStem);
  }

  if (!fuelElement) {
    return;
  }

  const stack = makeInitialDomTreeStack(context || {}, rootElement, fuelElement);


  LOOP: while (stack.length) {
    const next = stack.pop();
    const hasChildren = !!next.children.length;

    if (!next.dom) {

      const {element, parentElement, parent} = next;

      if (element.key && next.parentElement) {
        if (!parentElement._keymap) {
          parentElement._keymap = {};
        }
        invariant(parentElement._keymap[element.key], `Duplicate key found: key = ${element.key}`);
        parentElement._keymap[element.key] = element;
      }

      next.dom = FuelElementView.createDomElement(next.root, element, renderer, createStem);

      if (!createdDomTreeRoot) {
        createdDomTreeRoot = next.dom;
      }

      if (parent) {
        parent.appendChild(next.dom);
        FuelElementView.invokeDidMount(next.element);
      }
    }

    let root = next.root;
    if (hasChildren) {
      stack.push(next);
      let child = next.children.shift();

      if (child._stem) {
        root = child;
      }

      let {context} = next;
      while (FuelElementView.isComponent(child)) {
        root = child;
        [child, context] = renderComponent(context, child, createStem);
        if (!child) {
          continue LOOP;
        }
      }
      stack.push({element: child, children: child.children.slice(), dom: null, parent: next.dom, parentElement: next.element, root, context});
    }
  }
  return createdDomTreeRoot;
}


function renderComponent(oldContext: any, fuelElement: FuelElement, createStem: () => Stem) {
  const [nodes, context] = FuelElementView.instantiateComponent(oldContext, fuelElement, null);
  if (nodes) {
    fuelElement._stem.registerOwner(fuelElement);
  }
  return [nodes, context];
}
