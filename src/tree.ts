/**
 * @fileoverview
 * @author Taketoshi Aono
 */

import {
  FuelElement,
  FuelComponent,
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
  root: FuelElement
};


function makeInitialDomTreeStack(rootElement: FuelElement, fuelElement: FuelElement): FastDomTreeStackType[] {
  return [
    {
      element: fuelElement,
      parentElement: null,
      children: fuelElement.children.slice(),
      dom: fuelElement.dom,
      parent: null,
      root: rootElement
    }
  ]
}


export function fastCreateDomTree(
  rootElement: FuelElement,
  fuelElement: FuelElement,
  renderer: Renderer,
  createStem: () => Stem,
  mountCallbacks: FuelComponent<any, any>[]) {
  let createdDomTreeRoot: FuelDOMNode;

  if (FuelElementView.isComponent(fuelElement)) {
    fuelElement = renderComponent(fuelElement, createStem, mountCallbacks);
    if (!fuelElement) {
      return null;
    }
  }

  const stack = makeInitialDomTreeStack(rootElement, fuelElement);


  while (stack.length) {
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
      }
    }

    let root = next.root;
    if (hasChildren) {
      stack.push(next);
      let child = next.children.shift();

      if (child._stem) {
        root = child;
      }

      while (FuelElementView.isComponent(child)) {
        root = child;
        child = renderComponent(child, createStem, mountCallbacks);
        if (!child) {
          continue;
        }
      }
      stack.push({element: child, children: child.children.slice(), dom: null, parent: next.dom, parentElement: next.element, root});
    }
  }
  return createdDomTreeRoot;
}


function renderComponent(fuelElement: FuelElement, createStem: () => Stem, mountCallbacks: FuelComponent<any, any>[]) {
  const nodes = FuelElementView.instantiateComponent(fuelElement, null, mountCallbacks);
  fuelElement._stem.registerOwner(nodes);
  return nodes;
}
