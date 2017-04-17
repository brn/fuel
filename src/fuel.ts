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
  PublicFuelElement,
  FuelElement,
  FuelComponentType,
  FuelComponent,
  Property,
  AttributesMap,
  StatelessComponent,
  FuelComponentStatic,
  FuelNode,
  ReactCompatiblePropsTypes,
  HTMLAttributes,
  KeyMap
} from './type';
import {
  FuelElementView,
  makeFuelElement,
  cloneElement,
  INSTANCE_ELEMENT_SYM
} from './element';
import {
  RecycledElementDistributor,
  RecycledNodeDistributor
} from './recycler/recycler';
import {
  ElementRecycler
} from './recycler/element';
import {
  invariant,
  merge,
  keyList
} from './util';
import {
  isStateUpdated
} from './difference';


const VALID_TYPES = {'string': 1, 'function': 1};


export class ComponentImpl<Props, State> implements FuelComponent<Props, State> {
  private _state: State;

  constructor(private _props: Props = {} as any, private _context = {}) {
    this['_componentRenderedElementTreeCache'] = null;
  }

  public refs?: {[key:string]: FuelComponent<any, any>|Element} = {};

  public get state() {
    return this._state;
  }

  public set state(value) {
    this._state = value;
  }

  public get props() {return this._props}

  public get context() {return this._context;}

  public componentWillUnmount() {}

  public componentWillMount() {}

  public componentDidMount() {}

  public componentWillUpdate() {}

  public componentDidUpdate() {}

  public componentWillReceiveProps(props: Props) {}

  public shouldComponentUpdate(nextProps, prevProps) {return true;}
  
  public render(): JSX.Element {return null;}

  public getChildContext<CC extends {}>(): CC {return {} as CC;};

  /**
   * Will be rewrited after.
   */
  public setState(state: State|((currentState: State, props: Props) => State), cb?: () => void) {
    if (typeof state === 'function') {
      const nextState = state(this._state, this._props);
      if (!isStateUpdated(this._state, nextState)) {
        return;
      }
      this._state = nextState;
    } else {
      if (!isStateUpdated(this._state, state)) {
        return;
      }
      this._state = merge(this._state, state);
    }

    this.forceUpdate(cb);
  }

  public forceUpdate(cb?: () => void) {
    this.componentWillUpdate();
    const newContext = merge(this.context || {}, this.getChildContext());
    const tree = this.render();
    const fuelElement: FuelElement = this[INSTANCE_ELEMENT_SYM];
    tree._componentInstance = this;
    tree._ownerElement = fuelElement;
    tree._stem = fuelElement._stem;
    fuelElement._stem.render(tree as any, () => {
      fuelElement._componentRenderedElementTreeCache = tree as any;
      cb && cb();
    }, newContext, false);
  }
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
    if (keyList(nextProps).length !== keyList(prevProps).length) {
      return true;
    }
    return false;
  }
}


const {isComponent} = FuelElementView;
const {use} = ElementRecycler;
export class Fuel {
  /**
   * Create Fuel element.
   * This function compatible with React.createElement.
   * @param type TagName or Component constructor or stateless function.
   * @param props Props.
   * @param children Children elements.
   * @rreturns FuelElement tree.
   */
  public static createElement<P extends {key?: string, children: any[]}>(type: string,                      props: HTMLAttributes, ...children: FuelNode[]): FuelElement;
  public static createElement<P extends {key?: string, children: any[]}>(type: FuelComponentStatic<P, any>, props: P,              ...children: FuelNode[]): FuelElement;
  public static createElement<P extends {key?: string, children: any[]}>(type: StatelessComponent<P>,       props: P,              ...children: FuelNode[]): FuelElement;
  public static createElement<P extends {key?: string, children: any[]}>(type: string|FuelComponentStatic<P, any>|StatelessComponent<P>, props: HTMLAttributes & P, ...children: FuelElement[]): FuelElement {

    invariant(!VALID_TYPES[typeof type], `Fuel element only accept one of 'string' or 'function' but got ${type}`);

    props = props || {} as any;
    props.children = children;

    return use(type, props, children) || makeFuelElement(type, props.key, props, props.children);
  }


  public static unmountComponentAtNode(el: Node) {
    const fuelElement = FuelElementView.getFuelElementFromNode(el as any);
    if (fuelElement) {
      el.textContent = '';
      fuelElement._stem.unmountComponent(fuelElement);
      FuelElementView.detachFuelElementFromNode(el as any);
    }
  }


  /**
   * Base class of FuelComponent.
   */
  public static Component = ComponentImpl;

  // React compatibility layer.
  public static PureComponent = PureComponentImpl;

  public static isValidElement = (el: any) => el? FuelElementView.isFuelElement(el): false

  public static cloneElement: (fuelElement: PublicFuelElement, props?: any, children?: PublicFuelElement[]) => PublicFuelElement = cloneElement

  public static createFactory = (tag: string) => () => Fuel.createElement(tag, {})

  public static Children = {
    map<T>(children: PublicFuelElement[]|null, cb: (el: PublicFuelElement) => T): T[] {
      return children? children.map(cb): [];
    },
    forEach(children: PublicFuelElement[]|null, cb: (el: PublicFuelElement) => void): void {
      children && children.forEach(cb);
    },
    count(children: PublicFuelElement[]|null) {return children? children.length: 0;},
    toArray(children: PublicFuelElement[]|null) {return children? children: [];}
  }

  // Compatible with react.
  public static PropTypes: ReactCompatiblePropsTypes = {} as any
}


'array bool func number object string symbol node'.split(' ').forEach(a => Fuel.PropTypes[a] = {});
'instanceOf oneOf, oneOfType, arrayOf objectOf shape'.split(' ').forEach(a => Fuel.PropTypes[a] = () => ({}));


/**
 * Reactjs compatible definitions.
 * If you use typescript with tsx, import React namespace required.
 */
export const React = Fuel;
