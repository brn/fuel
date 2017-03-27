/**
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

  if (FuelElementView.isComponent(fuelElement)) {
    [fuelElement, context] = renderComponent(context, fuelElement, createStem);
    if (!fuelElement) {
      return null;
    }
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
        FuelElementView.invokeWillMount(next.element);
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
        [child, context] = renderComponent(next.context, child, createStem);
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
  fuelElement._stem.registerOwner(nodes);
  return [nodes, context];
}
