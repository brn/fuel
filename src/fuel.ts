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
  FuelComponentType,
  FuelComponent,
  Property,
  AttributesMap,
  StatelessComponent,
  FuelComponentStatic,
  FuelNode,
  ExportProperites
} from './type';
import {
  FuelStem
} from './stem';
import {
  FuelElementView,
  makeFuelElement,
  cloneElement
} from './element';
import {
  Renderer
} from './renderer/renderer';
import {
  DomRenderer
} from './renderer/dom-renderer';
import {
  makeBuffer,
  setBuffer,
  invariant
} from './util';
import {
  HTMLAttributes
} from './dom-attr';


/**
 * Iterate over all children and if array is exists, flatten that and
 * if text is exists, convert it to FuelElement.
 * @param arr Children elements.
 * @param skipArray Skip checking array type.
 * @returns Flattened array of FuelElement.
 */
function checkChildren(arr: (FuelElement|any)[], skipArray = false) {
  let ret = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    const v = arr[i];
    if (v === null) {
      continue;
    }

    invariant(v === undefined, 'Undefined passed as element, it\'s seem to mistakes.');

    if (FuelElementView.isFuelElement(v)) {
      ret.push(v);
    } else if (!skipArray && Array.isArray(v)) {
      // We do not check inside children array.
      // So if array exists in children array,
      // that treated as text.
      ret = checkChildren(v, true).concat(ret);
    } else {
      ret.push(createTextNode(v.toString()));
    }
  }
  return ret;
}


/**
 * Create text representation.
 */
function createTextNode(child: string) {
  return makeFuelElement(FuelElementView.allocateTextTagName(), null, [{name: 'value', value: child}]);
}


const VALID_TYPES = {'string': 1, 'function': 1};


export class ComponentImpl<Props, State> implements FuelComponent<Props, State> {
  constructor(private _props: Props = {} as any) {
  }

  public get ['props']() {return this._props}

  public ['componentWillMount']() {}

  public ['componentDidMount']() {}

  public ['componentWillUpdate']() {}

  public ['componentDidUpdate']() {}

  public ['componentWillReceiveProps'](props: Props) {
    this._props = props;
  }

  public ['shouldComponentUpdate'](nextProps, prevProps) {return true;}

  public ['render'](): FuelElement {return null;}

  public ['getChildContext']<CC extends {}>(): CC {return {} as CC;};

  /**
   * Will be rewrited after.
   */
  public ['setState'](state: State, cb?: () => void) {}
}

export class PureComponentImpl<Props, State> extends ComponentImpl<Props, State> {
  public ['shouldComponentUpdate'](nextProps, prevProps) {
    for (const prop in nextProps) {
      if (!(prop in prevProps)) {
        return true;
      }
      if (prevProps[prop] !== nextProps[prop]) {
        return true;
      }
    }
    if (Object.keys(nextProps).length !== Object.keys(prevProps).length) {
      return true;
    }
    return false;
  }
}


export class Fuel {
  /**
   * Create Fuel element.
   * This function compatible with React.createElement.
   * @param type TagName or Component constructor or stateless function.
   * @param props Props.
   * @param children Children elements.
   * @rreturns FuelElement tree.
   */
  public static createElement<P extends {key?: string}>(type: string,                      props: HTMLAttributes, ...children: FuelNode[]): FuelElement;
  public static createElement<P extends {key?: string}>(type: FuelComponentStatic<P, any>, props: P,              ...children: FuelNode[]): FuelElement;
  public static createElement<P extends {key?: string}>(type: StatelessComponent<P>,       props: P,              ...children: FuelNode[]): FuelElement;
  public static createElement<P extends {key?: string}>(type: string|FuelComponentStatic<P, any>|StatelessComponent<P>, props: HTMLAttributes & P, ...children: FuelElement[]): FuelElement {

    invariant(!VALID_TYPES[typeof type], `Fuel element only accept one of 'string' or 'function' but got ${type}`);

    if (children.length) {
      children = checkChildren(children);
    }

    if (!props) {
      props = {} as any;
    }

    // Convert props object to array.
    // Because for in loop is too slow and props will iterate many times.
    let attributes: Property[] = [];
    for (const name in props) {
      if (name !== 'key') {
        const value = props[name];
        attributes.push({name, value});
      }
    }

    const el = makeFuelElement(typeof type === 'string'? FuelElementView.allocateTagName(type): type, props.key, attributes, children);

    // If element is component, We set stem to this FuelElement.
    if (FuelElementView.isComponent(el) || props.scoped) {
      el._stem = new FuelStem();
    }
    return el;
  }


  /**
   * Base class of FuelComponent.
   */
  public static Component = ComponentImpl;

  public static PureComponent = PureComponentImpl;

  public static isValidElement = (el: any) => el? FuelElementView.isFuelElement(el): false

  public static cloneElement = cloneElement

  public static createFactory = (tag: string) => () => Fuel.createElement(tag, {})

  public static Children = {
    map<T>(children: FuelElement[]|null, cb: (el: FuelElement) => T): T[] {
      return children? children.map(cb): [];
    },
    forEach(children: FuelElement[]|null, cb: (el: FuelElement) => void): void {
      children && children.forEach(cb);
    },
    count(children: FuelElement[]|null) {return children? children.length: 0;},
    toArray(children: FuelElement[]|null) {return children? children: [];}
  }
}


/**
 * Reactjs compatible definitions.
 * If you use typescript with tsx, import React namespace required.
 */
export const React = Fuel;
