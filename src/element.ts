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
  BuiltinFuelElement,
  StatelessFuelElement,
  ComponentFuelElement,
  FactoryFuelElement,
  BuiltinElementValue,
  TextTable,
  FuelDOMNode,
  Property,
  FuelComponent,
  StatelessComponent,
  FuelComponentStatic,
  FuelComponentType,
  CONVERSATION_TABLE,
  Bytes,
  DOMEvents,
  DOMAttributes,
  Stem
} from './type';
import {
  setStyle
} from './node';
import {
  Symbol,
  merge,
  invariant
} from './util';
import {
  SharedEventHandlerImpl
} from './event';
import {
  Renderer
} from './renderer/renderer';
import {
  Difference,
  DifferenceBits,
  AttrState
} from './difference';


const FUEL_ELEMENT_MARK = Symbol('__fuel_element');
const TAG_NAMES = {map: {}, count: 1};
const SYNTHETIC_TEXT = 'SYNTHETIC_TEXT';
const PROTOTYPE = 'prototype';

TAG_NAMES.map[String(TAG_NAMES.map[SYNTHETIC_TEXT] = 0)] = SYNTHETIC_TEXT;

function isFunction(maybeFn: any): maybeFn is Function {
  return typeof maybeFn === 'function'
}

export const INSTANCE_ELEMENT_SYM = Symbol('__fuelelement');

export const FuelElementView = {
  allocateTextTagName(): number {return 0;},

  allocateTagName(tagName: string): number {
    const id = TAG_NAMES.map[tagName.toLowerCase()];
    if (id) {
      return id;
    }
    TAG_NAMES.map[String(TAG_NAMES.map[tagName] = TAG_NAMES.count)] = tagName;
    return TAG_NAMES.count++;
  },

  isComponent(fuelElement: FuelElement): fuelElement is FactoryFuelElement {
    return typeof fuelElement.type !== 'number';
  },

  isStatelessComponent(fuelElement: FuelElement): fuelElement is StatelessFuelElement {
    return isFunction(fuelElement.type) && !isFunction(fuelElement.type[PROTOTYPE].render)
  },

  isComponentClass(fuelElement: FuelElement): fuelElement is ComponentFuelElement {
    return isFunction(fuelElement.type) && isFunction(fuelElement.type[PROTOTYPE].render);
  },

  tagNameOf(fuelElement: FuelElement): string {
    return TAG_NAMES.map[String(fuelElement.type)];
  },

  hasChildren(el: FuelElement): boolean {
    return el.children.length > 0;
  },

  isFuelElement(fuelElement: any): fuelElement is FuelElement {
    return fuelElement && fuelElement[FUEL_ELEMENT_MARK] === Bytes.FUEL_ELEMENT_MARK;
  },

  isTextNode(fuelElement: FuelElement): fuelElement is BuiltinFuelElement {
    return fuelElement.type === 0;
  },

  getTextValueOf(fuelElement: FuelElement): string {
    return fuelElement.props[0].value;
  },

  getComponentRenderedTree(fuelElement: FuelElement): FuelElement {
    return fuelElement._componentRenderedElementTreeCache;
  },

  getProps({props, children}: FuelElement, isInsertChildren = false): Object {
    const attrs = {};
    for (let i = 0, len = props.length; i < len; i++) {
      const {name, value} = props[i];
      attrs[name] = value;
    }
    if (isInsertChildren) {
      attrs['children'] = children.length? children: null;
    }
    return attrs;
  },

  invokeDidMount(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentDidMount();
    }
  },

  invokeDidUpdate(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentDidUpdate();
    }
  },

  invokeWillUnmount(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentWillUnmount();
    }
  },

  stripComponent(fuelElement: FuelElement) {
    while (fuelElement && FuelElementView.isComponent(fuelElement)) {
      fuelElement = fuelElement._componentRenderedElementTreeCache;
    }
    return fuelElement;
  },

  instantiateComponent(context: any, fuelElement: FactoryFuelElement, oldElement?: FuelElement): [FuelElement, any] {
    const {props} = fuelElement
    const attrs = FuelElementView.getProps(fuelElement, true);
    const oldAttrs = oldElement? FuelElementView.getProps(oldElement): null;
    if (FuelElementView.isStatelessComponent(fuelElement)) {
      return [fuelElement.type(attrs, context), context];
    }

    if (FuelElementView.isComponentClass(fuelElement)) {
      let instance: FuelComponent<any, any> = fuelElement._componentInstance;
      let callReceiveHook = !!instance;
      if (!instance) {
        instance = fuelElement._componentInstance = new fuelElement.type(attrs, context);
      } else {
        if ((instance as any)._context) {
          (instance as any)._context = context;
        }
      }

      instance[INSTANCE_ELEMENT_SYM] = fuelElement;

      const newContext = merge(context, instance.getChildContext());

      if (fuelElement._componentRenderedElementTreeCache && !instance.shouldComponentUpdate(attrs, oldAttrs)) {
        if (callReceiveHook) {
          fuelElement._stem.enterUnsafeUpdateZone(() => {
            instance.componentWillReceiveProps(attrs);
            (instance as any)._props = attrs;
          });
        }
        return [fuelElement._componentRenderedElementTreeCache, newContext];
      }

      if (callReceiveHook) {
        fuelElement._stem.enterUnsafeUpdateZone(() => {
          instance.componentWillReceiveProps(attrs);
          (instance as any)._props = attrs;
        });
      }

      if (fuelElement._componentRenderedElementTreeCache) {
        instance.componentWillUpdate();
      } else {
        instance.componentWillMount();
      }

      const rendered: FuelElement = fuelElement._componentRenderedElementTreeCache = instance.render();

      // If rendered component was FuelComponent,
      // _componentInstance must not to be setted.
      if (rendered) {
        if (!FuelElementView.isComponent(rendered)) {
          rendered._componentInstance = instance;
        }
        rendered._stem = fuelElement._stem;
      }
      fuelElement._stem.registerOwner(fuelElement);

      return [rendered, newContext];
    }

    invariant(true, `factory element requried but got ${FuelElementView.tagNameOf(fuelElement)}.`);
  },

  addEvent(rootElement: FuelElement, fuelElement: FuelElement, type, eventHandler) {
    let handler = rootElement._stem.getEventHandler();
    if (!handler) {
      handler = new SharedEventHandlerImpl();
      rootElement._stem.setEventHandler(handler);
    }
    const root = FuelElementView.stripComponent(rootElement);
    handler.addEvent(root.dom, fuelElement.dom, type, eventHandler);
  },

  createDomElement(rootElement: FuelElement, fuelElement: FuelElement, renderer: Renderer, createStem: () => Stem) {
    if (fuelElement.type === 0) {
      return fuelElement.dom = renderer.createTextNode(FuelElementView.getTextValueOf(fuelElement)) as any;
    }

    const {props, type} = fuelElement
    const attrs = [];
    const tagName = FuelElementView.tagNameOf(fuelElement);
    const dom = renderer.createElement(tagName);

    fuelElement.dom = dom as any;

    let isScoped = false;

    for (let i = 0, len = props.length; i < len; i++) {
      let {name, value} = props[i];
      if (DOMEvents[name]) {
        FuelElementView.addEvent(rootElement, fuelElement, name, value);
        continue;
      } else if (name === 'checked' || name === 'selected') {
        booleanAttr(dom, name, value);
        continue;
      } else if (name === 'scoped') {
        isScoped = true;
      } else if (((value.isObservable || value.subscribe)) && isScoped) {
        makeStem(fuelElement, name, value, createStem);
        continue;
      } else if (name === 'style') {
        for (const style in value) {
          setStyle(dom, style, value[style]);
        }
        continue;
      } else if (name === 'ref') {
        const refType = typeof value;
        if (refType === 'string') {
          if (FuelElementView.isComponent(rootElement)) {
            rootElement._componentInstance.refs[value] = dom as any;
          }
        } else if (refType === 'function') {
          value(dom);
        }
        continue;
      }
      if (name === 'htmlFor') {
        name = 'for';
      }

      invariant(!DOMAttributes[name] && name.indexOf('data-') === -1, `${name} is not a valid dom attributes.`);
      dom[name] = value;
    }
    return dom;
  }
}


function booleanAttr(el: FuelDOMNode, name: string, value: boolean) {
  if (value) {
    el[name] = name;
  } else {
    el.removeAttribute(name);
  }
}


function mergeProps(oldP: Property[], p: any) {
  const buf = {};
  for (let i = 0, len = oldP.length; i < len; i++) {
    buf[oldP[i].name] = i;
  }
  for (const key in p) {
    if (buf[key]) {
      oldP[buf[key]].value = p[key];
    } else {
      oldP.push({name: key, value: p[key]});
    }
  }
  return oldP;
}


export function cloneElement(fuelElement: FuelElement, props: any = {}, children: FuelElement[] = fuelElement.children) {
  invariant(!FuelElementView.isFuelElement(fuelElement), `cloneElement only clonable FuelElement but got = ${fuelElement}`);
  const el = makeFuelElement(fuelElement.type, fuelElement.key, mergeProps(fuelElement.props.slice(), props), children);
  el._stem = fuelElement._stem;
  el._componentInstance = fuelElement._componentInstance
  el._componentRenderedElementTreeCache = fuelElement._componentRenderedElementTreeCache;
  el._subscriptions = fuelElement._subscriptions;
  return el;
}


function makeStem(fuelElement: FuelElement, name: string, value: any, createStem: () => Stem) {
  if (value.subscribe) {
    if (!fuelElement._subscriptions) {
      fuelElement._subscriptions = [];
    }
    fuelElement._subscriptions.push(value.subscribe(value => {
      const updated = fuelElement.props.some(p => {
        if (p.name === name) {
          p.value = value;
          return true;
        }
        return false;
      });
      if (!updated) {
        fuelElement.props.push({name, value});
      }
      fuelElement._stem.render(fuelElement);
    }));
    fuelElement._stem = createStem();
    fuelElement._stem.registerOwner(fuelElement);
  }
}


export function makeFuelElement(type: FuelComponentType, key: string|number = null, props: Property[], children: FuelElement[] = []): FuelElement {
  return {
    [FUEL_ELEMENT_MARK]                : Bytes.FUEL_ELEMENT_MARK,
    type,
    key,
    props,
    children,
    dom                                : null,
    _stem                              : null,
    _componentInstance                 : null,
    _componentRenderedElementTreeCache : null,
    _keymap                            : null,
    _subscriptions                     : null
  }
}
