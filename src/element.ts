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
  Property,
  FuelComponent,
  StatelessComponent,
  FuelComponentStatic,
  FuelComponentType,
  CONVERSATION_TABLE,
  Bytes,
  DOMEvents,
  DOMAttributes,
  Stem,
  KeyMap,
  FuelNode
} from './type';
import {
  setStyle
} from './node';
import {
  Symbol,
  merge,
  invariant,
  isDefined,
  keyList
} from './util';
import {
  SharedEventHandlerImpl
} from './event';
import {
  FuelElementBit
} from './bits';
import {
  domOps
} from './domops';


const DOM_LINK = Symbol('__fuel_element_link');
const SYNTHETIC_TEXT = 'SYNTHETIC_TEXT';
const SYNTHETIC_FRAGMENT = 'SYNTHETIC_FRAGMENT';
const PROTOTYPE = 'prototype';


function isFunction(maybeFn: any): maybeFn is Function {
  return typeof maybeFn === 'function'
}

export const INSTANCE_ELEMENT_SYM = Symbol('__fuelelement');

export const FuelElementView = {
  isComponent(fuelElement: any): fuelElement is FactoryFuelElement {
    const bit = FuelElementBit.STATELESS | FuelElementBit.COMPONENT;
    return !!fuelElement && (fuelElement._flags & bit) > 0;
  },

  isStatelessComponent(fuelElement: FuelElement): fuelElement is StatelessFuelElement {
    return !!fuelElement && (fuelElement._flags & FuelElementBit.STATELESS) === FuelElementBit.STATELESS;
  },

  isComponentClass(fuelElement: FuelElement): fuelElement is ComponentFuelElement {
    return !!fuelElement && (fuelElement._flags & FuelElementBit.COMPONENT) === FuelElementBit.COMPONENT;
  },

  isFragment(el: any): boolean {
    return !!el && (el._flags & FuelElementBit.FRAGMENT) === FuelElementBit.FRAGMENT;
  },

  tagNameOf(fuelElement: FuelElement): string {
    return fuelElement.type;
  },

  nameOf(fuelElement: FuelElement): string {
    return !isComponent(fuelElement)? FuelElementView.tagNameOf(fuelElement):
      fuelElement.type.name || fuelElement.type.displayName || 'Anonymouse';
  },

  hasChildren(el: FuelElement): boolean {
    return el.children.length > 0;
  },

  cleanupElement(el: FuelElement) {
    el = FuelElementView.stripComponent(el);
    if (!!el.dom) {
      if (!!el.dom['__fuelevent']) {
        el._ownerElement._stem.getEventHandler().removeEvents(el.dom);
      }
    }
    if (!!el._subscriptions) {
      el._subscriptions.forEach(s => s.unsubscribe());
    }
  },

  attachFuelElementToNode(node: Node, fuelElement: FuelElement) {
    // This make circular references between DOMElement and FuelElement,
    // but all disposable FuelElement will cleanup at stem and all references will be cut off.
    // So, this circular ref does'nt make leaks.
    node[DOM_LINK] = fuelElement;
  },

  detachFuelElementFromNode(node: Node) {
    node[DOM_LINK] = null;
  },

  getFuelElementFromNode(el: Node): FuelElement {
    if (el[DOM_LINK]) {
      return el[DOM_LINK];
    }
    return null;
  },

  isFuelElement(fuelElement: any): fuelElement is FuelElement {
    return !!fuelElement && isDefined(fuelElement._flags) && (fuelElement._flags & FuelElementBit.FUEL_ELEMENT) === FuelElementBit.FUEL_ELEMENT;
  },

  isDisposed(fuelElement: FuelElement) {
    return (fuelElement._flags & FuelElementBit.DISPOSED) === FuelElementBit.DISPOSED;
  },

  setDisposed(fuelElement: FuelElement) {
    fuelElement._flags |= FuelElementBit.DISPOSED;
  },

  isTextNode(fuelElement: FuelElement): fuelElement is BuiltinFuelElement {
    return !!fuelElement && (fuelElement._flags & FuelElementBit.TEXT) === FuelElementBit.TEXT;
  },

  getTextValueOf(fuelElement: FuelElement): string {
    return fuelElement.props.value;
  },

  getComponentRenderedTree(fuelElement: FuelElement): FuelElement {
    return fuelElement._componentRenderedElementTreeCache;
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
    let instance;
    let result = fuelElement;
    while (isComponent(result)) {
      result = result._componentRenderedElementTreeCache;
    }
    return result;
  },

  initFuelElementBits(type: FuelComponentType) {
    const isFn = isFunction(type);
    return FuelElementBit.FUEL_ELEMENT |
      (isFn && isFunction(type['prototype'].render)? FuelElementBit.COMPONENT: isFn? FuelElementBit.STATELESS: type === FRAGMENT_NAME? FuelElementBit.FRAGMENT: type === TEXT_NAME? FuelElementBit.TEXT: FuelElementBit.TAG);
  },

  instantiateComponent(context: any, fuelElement: FactoryFuelElement, createStem: () => Stem): [FuelElement, any] {
    const {props} = fuelElement
    const attrs = fuelElement.props;

    if (FuelElementView.isStatelessComponent(fuelElement)) {
      return [fuelElement.type(attrs, context), context];
    }


    if (FuelElementView.isComponentClass(fuelElement)) {
      let instance: FuelComponent<any, any> = fuelElement._componentInstance;
      let callReceiveHook = !!instance;
      let oldAttrs;

      if (!instance) {
        // If element is component, We set stem to this FuelElement.
        fuelElement._stem = createStem();
        instance = fuelElement._componentInstance = new fuelElement.type(attrs, context);
        oldAttrs = {};
      } else {
        if ((instance as any)._context) {
          (instance as any)._context = context;
        }
        oldAttrs = (instance as any)._props;
      }

      instance[INSTANCE_ELEMENT_SYM] = fuelElement;

      const newContext = merge(context, instance.getChildContext());

      if (instance && fuelElement._componentRenderedElementTreeCache &&
          ((!keyList(oldAttrs).length && !keyList(attrs).length && !(instance as any)._state) || !instance.shouldComponentUpdate(attrs, oldAttrs))) {
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
        rendered._ownerElement = fuelElement;
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

  toStringTree(el: FuelElement, enableChecksum: boolean): string {
    let value;
    let context = {};
    if (isTextNode(el)) {
      return getTextValueOf(el);
    } else {
      while (isComponent(el)) {
        [value, context] = FuelElementView.instantiateComponent(context, el, () => ({}) as any)
      }
      if (!value) {
        return '';
      }
    }

    const attrs = [];
    for (let key in this) {
      const value = this[key];
      if (value !== null) {
        if (CONVERSATION_TABLE[key]) {
          key = CONVERSATION_TABLE[key];
        }
        attrs.push(`${key}="${value}"`);
      }
    }
    if (enableChecksum) {
      attrs.unshift(`data-fuelchecksum=${el._flags}`);
    }

    return `<${value.type}${attrs.length? (' ' + attrs.join(' ')): ''}>${el.children.map(child => FuelElementView.toStringTree(child, enableChecksum)).join('')}</${value.type}>`;
  },

  createDomElement(rootElement: FuelElement, fuelElement: FuelElement, createStem: () => Stem) {
    if (!!fuelElement.dom) {
      return fuelElement.dom;
    } else if (isTextNode(fuelElement)) {
      return fuelElement.dom = domOps.newTextNode(getTextValueOf(fuelElement)) as any;
    } else if (isFragment(fuelElement)) {
      return fuelElement.dom = domOps.newFragment();
    }

    const {props, type} = fuelElement
    const tagName = FuelElementView.tagNameOf(fuelElement);
    const dom = fuelElement.dom = domOps.newElement(tagName);

    let isScoped = false;

    const keys = keyList(props);
    for (let i = 0, len = keys.length; i < len; ++i) {
      let name = keys[i];
      if (name === 'children' || name === 'key') {
        continue;
      }
      const value = props[name];
      if (DOMEvents[name]) {
        FuelElementView.addEvent(rootElement, fuelElement, name, value);
        continue;
      } else if (name === 'checked' || name === 'selected') {
        booleanAttr(dom, name, value);
        continue;
      } else if (name === 'scoped') {
        isScoped = true;
      } else if (value && ((value.isObservable || value.subscribe)) && isScoped) {
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


const {isComponent, isStatelessComponent, isComponentClass, isTextNode, isFuelElement, isFragment, getTextValueOf, initFuelElementBits} = FuelElementView;


function booleanAttr(el: Node, name: string, value: boolean) {
  if (value) {
    el[name] = name;
  } else {
    (el as HTMLElement).removeAttribute(name);
  }
}


export function cloneElement(fuelElement: FuelElement, props: any = {}, children: FuelElement[] = fuelElement.children) {
  invariant(!FuelElementView.isFuelElement(fuelElement), `cloneElement only clonable FuelElement but got = ${fuelElement}`);
  const el = makeFuelElement(fuelElement.type, fuelElement.key, merge(fuelElement.props, props), children);
  el._stem = fuelElement._stem;
  el._componentInstance = fuelElement._componentInstance
  el._ownerElement = fuelElement._ownerElement;
  el._flags = fuelElement._flags;
  return el;
}


/**
 * Create text representation.
 */
export function createTextNode(child: string) {
  return makeFuelElement(TEXT_NAME, null, {value: child});
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


const FRAGMENT_NAME = 'SYNTHETIC_FRAGMENT';
const TEXT_NAME = 'SYNTHETIC_TEXT';


export function makeFuelElement(type: FuelComponentType, key: string|number = null, props: KeyMap<any>, children: FuelElement[] = []): FuelElement {
  const isFn = isFunction(type);
  return {
    type,
    key,
    props,
    children,
    dom                                : null,
    _ownerElement                      : null,
    _flags                             : initFuelElementBits(type),
    _stem                              : null,
    _componentInstance                 : null,
    _componentRenderedElementTreeCache : null,
    _subscriptions                     : null
  };
}


export function makeFragment(children: FuelElement[]): FuelElement {
  const ret = makeFuelElement(FRAGMENT_NAME, null, {}, children);
  return ret;
}


export const FLY_WEIGHT_ELEMENT_A = createTextNode('');
export const FLY_WEIGHT_ELEMENT_B = createTextNode('');

export const FLY_WEIGHT_FRAGMENT_A = makeFragment([]);
export const FLY_WEIGHT_FRAGMENT_B = makeFragment([]);

export function wrapNode(parent: FuelElement, value: any, wrapTarget: FuelElement, wrapFragment: FuelElement): FuelElement {
  if (value === null) {
    return null;
  }

  if (!isFragment(parent) && Array.isArray(value)) {
    wrapFragment.key = null;
    wrapFragment.dom = parent? parent.dom: null;
    wrapFragment.children = value;
    return wrapFragment;
  } else if (!isFuelElement(value)) {
    wrapTarget.key = null;
    wrapTarget.dom = null;
    wrapTarget.props['value'] = `${value}`;
    return wrapTarget;
  } else 
  return value;
}
