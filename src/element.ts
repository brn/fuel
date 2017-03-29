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
  BufferType,
  FuelDOMNode,
  Property,
  FuelComponent,
  StatelessComponent,
  FuelComponentStatic,
  Phai,
  FuelComponentType,
  CONVERSATION_TABLE,
  Bytes,
  DOMEvents,
  DOMAttributes,
  Stem,
  ExportProperites
} from './type';
import {
  setStyle
} from './node';
import {
  makeBuffer,
  setBuffer,
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
TAG_NAMES.map[String(TAG_NAMES.map[SYNTHETIC_TEXT] = 0)] = SYNTHETIC_TEXT;

export class FuelElementView {
  public static allocateTextTagName(): number {return 0;}

  public static allocateTagName(tagName: string): number {
    const id = TAG_NAMES.map[tagName.toLowerCase()];
    if (id) {
      return id;
    }
    TAG_NAMES.map[String(TAG_NAMES.map[tagName] = TAG_NAMES.count)] = tagName;
    return TAG_NAMES.count++;
  }

  public static isComponent(fuelElement: FuelElement): fuelElement is FactoryFuelElement {
    return typeof fuelElement.type !== 'number';
  }

  public static isStatelessComponent(fuelElement: FuelElement): fuelElement is StatelessFuelElement {
    return typeof fuelElement.type === 'function' && typeof (fuelElement.type as Function).prototype.render !== 'function';
  }

  public static isComponentClass(fuelElement: FuelElement): fuelElement is ComponentFuelElement {
    return typeof fuelElement.type === 'function' && typeof (fuelElement.type as Function).prototype.render === 'function';
  }

  public static tagNameOf(fuelElement: FuelElement): string {
    return TAG_NAMES.map[String(fuelElement.type)];
  }

  public static hasChildren(el: FuelElement): boolean {
    return el.children.length > 0;
  }

  public static isFuelElement(fuelElement: any): fuelElement is FuelElement {
    return fuelElement && fuelElement[FUEL_ELEMENT_MARK] === Bytes.FUEL_ELEMENT_MARK;
  }

  public static isTextNode(fuelElement: FuelElement): fuelElement is BuiltinFuelElement {
    return fuelElement.type === 0;
  }

  public static getTextValueOf(fuelElement: FuelElement): string {
    return fuelElement.props[0].value;
  }

  public static getComponentRenderedTree(fuelElement: FuelElement): FuelElement {
    return fuelElement._componentRenderedElementTreeCache;
  }

  public static getProps({props, children}: FuelElement, isInsertChildren = false): Object {
    const attrs = {};
    for (let i = 0, len = props.length; i < len; i++) {
      const {name, value} = props[i];
      attrs[name] = value;
    }
    if (isInsertChildren) {
      attrs['children'] = children.length? children: null;
    }
    return attrs;
  }

  public static invokeDidMount(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentDidMount();
    }
  }

  public static invokeWillMount(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentWillMount();
    }
  }

  public static invokeWillUpdate(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentWillUpdate();
    }
  }

  public static invokeDidUpdate(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentDidUpdate();
    }
  }

  public static invokeWillUnmount(el: FuelElement): void {
    if (el._componentInstance) {
      el._componentInstance.componentWillUnmount();
    }
  }

  public static stripComponent(fuelElement: FuelElement) {
    while (fuelElement && this.isComponent(fuelElement)) {
      fuelElement = fuelElement._componentRenderedElementTreeCache;
    }
    return fuelElement;
  }

  public static instantiateComponent(context: any, fuelElement: FactoryFuelElement, oldElement?: FuelElement): [FuelElement, any] {
    const {props} = fuelElement
    const attrs = this.getProps(fuelElement, true);
    const oldAttrs = oldElement? this.getProps(oldElement): null;
    if (this.isStatelessComponent(fuelElement)) {
      return [fuelElement.type(attrs, context), context];
    }

    if (this.isComponentClass(fuelElement)) {
      let instance: FuelComponent<Phai, Phai> = fuelElement._componentInstance;
      let callReceiveHook = !!instance;
      if (!instance) {
        instance = fuelElement._componentInstance = new fuelElement.type(attrs, context);
      } else {
        if ((instance as any)._context) {
          (instance as any)._context = context;
        }
      }

      instance.setState = function(state, cb) {
        this.state = merge(this.state, state);
        this[ExportProperites.componentWillUpdate]();
        const tree = this.render();
        fuelElement._stem.render(tree, () => {
          fuelElement._componentRenderedElementTreeCache = tree;
          cb && cb();
        }, false);
      }

      const newContext = merge(context, instance.getChildContext());

      if (fuelElement._componentRenderedElementTreeCache && !instance[ExportProperites.shouldComponentUpdate](attrs, oldAttrs)) {
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

      const rendered: FuelElement = fuelElement._componentRenderedElementTreeCache = instance[ExportProperites.render]();
      // If rendered component was FuelComponent,
      // _componentInstance must not to be setted.
      if (rendered) {
        if (!this.isComponent(rendered)) {
          rendered._componentInstance = instance;
        }
        rendered._stem = fuelElement._stem;
      }
      fuelElement._stem.registerOwner(fuelElement);

      return [rendered, newContext];
    }

    invariant(true, `factory element requried but got ${this.tagNameOf(fuelElement)}.`);
  }

  public static removeEvent(rootElement: FuelElement, fuelElement: FuelElement, type) {
    let handler = rootElement._stem.getEventHandler();
    invariant(!handler, 'SharedEventHandler must be exists');
    const root = this.stripComponent(rootElement);
    handler.removeEvent(root.dom, fuelElement.dom, type);
  }

  public static replaceEvent(rootElement: FuelElement, fuelElement: FuelElement, type, fn: (e: Event) => void) {
    let handler = rootElement._stem.getEventHandler();
    invariant(!handler, 'SharedEventHandler must be exists');
    const root = this.stripComponent(rootElement);
    handler.replaceEvent(root.dom, fuelElement.dom, type, fn);
  }

  public static addEvent(rootElement: FuelElement, fuelElement: FuelElement, type, eventHandler) {
    let handler = rootElement._stem.getEventHandler();
    if (!handler) {
      handler = new SharedEventHandlerImpl();
      rootElement._stem.setEventHandler(handler);
    }
    const root = this.stripComponent(rootElement);
    handler.addEvent(root.dom, fuelElement.dom, type, eventHandler);
  }

  public static createDomElement(rootElement: FuelElement, fuelElement: FuelElement, renderer: Renderer, createStem: () => Stem) {
    if (fuelElement.type === 0) {
      return fuelElement.dom = renderer.createTextNode(this.getTextValueOf(fuelElement)) as any;
    }

    const {props, type} = fuelElement
    const attrs = [];
    const tagName = this.tagNameOf(fuelElement);
    const dom = renderer.createElement(tagName);

    fuelElement.dom = dom as any;

    let isScoped = false;

    for (let i = 0, len = props.length; i < len; i++) {
      let {name, value} = props[i];
      if (DOMEvents[name]) {
        this.addEvent(rootElement, fuelElement, name, value);
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
          if (this.isComponent(rootElement)) {
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
      if (DOMAttributes[name] || name.indexOf('data-') === 0) {
        dom[name] = value;
      }
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
