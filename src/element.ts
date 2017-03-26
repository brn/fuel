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
  Symbol
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

  public static isComponent(fuelElement: FuelElement): boolean {
    return typeof fuelElement.type !== 'number';
  }

  public static isStatelessComponent(fuelElement: FuelElement): boolean {
    return typeof fuelElement.type === 'function' && typeof (fuelElement.type as Function).prototype.render !== 'function';
  }

  public static tagNameOf(fuelElement: FuelElement): string {
    return TAG_NAMES.map[String(fuelElement.type)];
  }

  public static tagTypeOf(fuelElement: FuelElement): number {
    return fuelElement.type as number;
  }

  public static hasChildren(el: FuelElement): boolean {
    return el.children.length > 0;
  }

  public static isFuelElement(fuelElement: FuelElement) {
    return fuelElement && fuelElement[FUEL_ELEMENT_MARK] === Bytes.FUEL_ELEMENT_MARK;
  }

  public static isTextNode(fuelElement: FuelElement): boolean {
    return this.tagTypeOf(fuelElement) === 0;
  }

  public static getTextValueOf(fuelElement: FuelElement): string {
    return fuelElement.props[0].value;
  }

  public static getComponentRenderedTree(fuelElement: FuelElement): FuelElement {
    return fuelElement._componentRenderedElementTreeCache;
  }

  public static getProps({props}: FuelElement): Object {
    const attrs = {};
    for (let i = 0, len = props.length; i < len; i++) {
      const {name, value} = props[i];
      attrs[name] = value;
    }
    return attrs;
  }

  public static instantiateComponent(fuelElement: FuelElement, oldElement?: FuelElement, mountCallbacks?: FuelComponent<any, any>[]) {
    const {props, type} = fuelElement
    const attrs = this.getProps(fuelElement);
    const oldAttrs = oldElement? this.getProps(oldElement): null;
    if (this.isStatelessComponent(fuelElement)) {
      return (type as StatelessComponent<any>)(attrs);
    }

    let instance: FuelComponent<Phai, Phai> = fuelElement._componentInstance;
    let callReceiveHook = !!instance;
    if (!instance) {
      instance = fuelElement._componentInstance = new (type as FuelComponentStatic<Phai, Phai>)(attrs);
      instance.setState = function(state, cb) {
        this.state = state;
        this[ExportProperites.componentWillUpdate]();
        fuelElement._stem.render(fuelElement, () => {
          cb && cb();
          this[ExportProperites.componentDidUpdate]();
        });
      }
      instance[ExportProperites.componentWillMount]();
    }

    if (mountCallbacks) {
      mountCallbacks.push(instance);
    }

    if (fuelElement._componentRenderedElementTreeCache && !instance[ExportProperites.shouldComponentUpdate](attrs, oldAttrs)) {
      if (callReceiveHook) {
        instance.componentWillReceiveProps(attrs);
      }
      return fuelElement._componentRenderedElementTreeCache;
    }
    return fuelElement._componentRenderedElementTreeCache = instance[ExportProperites.render]();
  }

  public static createDomElement(rootElement: FuelElement, fuelElement: FuelElement, renderer: Renderer, createStem: () => Stem) {
    if (this.tagTypeOf(fuelElement) === 0) {
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
        let handler = rootElement._stem.getEventHandler();
        if (!handler) {
          handler = new SharedEventHandlerImpl();
          rootElement._stem.setEventHandler(handler);
        }
        handler.addEvent(this.isComponent(rootElement)? rootElement._componentRenderedElementTreeCache.dom: rootElement.dom, dom, name, value);
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
            rootElement._componentInstance[ExportProperites.refs][name] = dom as any;
          }
        } else if (refType === 'function') {
          value(dom);
        }
        continue;
      }
      if (DOMAttributes[name] || name.indexOf('data-') === 0) {
        dom[name] = value;
      }
    }
    return dom;
  }
}


function cloneNode(fuelElement: FuelElement) {
  const stack = [
    {
      element: fuelElement,
      children: fuelElement.children.slice(),
      parent: null,
      parsed: false
    }
  ];
  let root;
  while (stack.length) {
    const next = stack.pop();
    const {parsed, element, parent} = next;
    let newEl;
    if (!parsed) {
      next.parsed = true;
      newEl = makeFuelElement(element.type, element.key, element.props, []);
      for (const key in element) {
        newEl[key] = element;
      }
      newEl.dom = null;

      if (parent) {
        parent.children.push(newEl);
      } else {
        root = newEl;
      }
    }
    if (next.children.length) {
      const child = next.children.shift();
      stack.push(next);
      stack.push({element: child, children: child.children.slice(), parent: newEl || parent, parsed: false});
    }
  }
  return root;
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


export function makeFuelElement(type: FuelComponentType, key: string|number, props: Property[], children: FuelElement[] = []): FuelElement {
  return {
    [FUEL_ELEMENT_MARK]: Bytes.FUEL_ELEMENT_MARK,
    type,
    key,
    props,
    children,
    dom: null
  }
}
