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


export const HAS_TYPED_ARRAY = typeof Uint16Array === 'function';

export const BUFFER_SIZE_MULTIPLER = HAS_TYPED_ARRAY? 2: 1;


export type BufferType = Uint16Array|number[];


export interface Property {
  name: string;
  value: any;
}


export interface SharedEventHandler {
  addEvent(root: EventTarget, el: EventTarget, type: string, callback: (e: Event) => void): void;
  removeEvent(root: EventTarget, el: EventTarget): void;
}


export interface Stem {
  setEventHandler(eventHandler: SharedEventHandler): void;
  getEventHandler(): SharedEventHandler;
  render(el: FuelElement, callback?: (el: Node) => void): void;
  registerOwner(el: FuelElement): void;
  owner(): FuelElement;
}


export interface StringNodeReprensation {
  tagName: string|null;
  attrs: {[key: string]: any};
  childNodes: StringNodeReprensation[];
  children: StringNodeReprensation[];
  nodeType: number;
  parentNode: this;
  text?: string;
}

export type FuelText = string | number;
export type FuelChild = FuelElement | FuelText;

// Should be Array<ReactNode> but type aliases cannot be recursive
export type FuelFragment = {} | Array<FuelChild | any[] | boolean>;
export type FuelNode = FuelChild | FuelFragment | boolean;

export interface FuelDOMNode extends EventTarget {
  removeAttribute(key: string): void;
  appendChild(child: FuelDOMNode): FuelDOMNode;
  parentNode: FuelDOMNode;
  removeChild(node: FuelDOMNode): void;
  replaceChild(newNode: FuelDOMNode, oldNode: FuelDOMNode): void
  childNodes: FuelDOMNode[];
  nodeType: number;
  children: FuelDOMNode[];
  style?: {[key: string]: string};
  textContent: string;
}


export interface Phai {}


export type FuelComponentType = number|string|FuelComponentStatic<Phai, Phai>|StatelessComponent<Phai>;


export interface ESSubscription {
  unsubscribe(): void
}


export interface ESObservable<T> {
  subscribe(value: T): ESSubscription;
}


export interface FuelElement {
  type: FuelComponentType;
  props: Property[],
  key: string|number;
  children: FuelElement[];
  dom: FuelDOMNode;
  _stem?: Stem;
  _componentInstance?: FuelComponent<Phai, Phai>;
  _componentRenderedElementTreeCache?: FuelElement;
  _keymap?: {[key: string]: FuelElement};
  _subscriptions?: ESSubscription[];
}


export interface AttributesMap {
  [key: string]: any;
}

export interface TextTable {
  valueAt(index: number): string;

  registerFunction(text: string): number;

  register(text: string): number;

  clear();
}


export enum BuiltinElementValue {
  CHILDREN = 0x2
}


export interface FuelComponentStatic<Props, State> {
  new(props: Props): FuelComponent<Props, State>
}


export interface FuelComponent<Props, State> {
  props: Props;
  state?: State;
  refs?: {[key:string]: FuelComponent<any, any>|Element};
  componentWillMount(): void;
  componentDidMount(): void;
  componentWillUpdate(): void;
  componentDidUpdate(): void;
  componentWillReceiveProps(props: Props): void;
  render(): FuelElement;
  shouldComponentUpdate(nextProps: Props, prevProps: Props): boolean;
  setState(s: State, cb?: () => void): void;
}

export const ExportProperites = {
  'props': 'props',
  'state': 'state',
  'refs': 'refs',
  'componentWillMount': 'componentWillMount',
  'componentDidMount': 'componentDidMount',
  'componentWillUpdate': 'componentWillUpdate',
  'componentDidUpdate': 'componentDidUpdate',
  'componentWillReceiveProps': 'componentWillReceiveProps',
  'render': 'render',
  'shouldComponentUpdate': 'shouldComponentUpdate',
  'setState': 'shouldComponentUpdate',
  'getChildContext': 'getChildContext',
  "Symbol": "Symbol"
}

export interface StatelessComponent<Props> {
  (props: Props): FuelElement;
}


export const CONVERSATION_TABLE = {
  'className': 'class'
}


export enum Bytes {
  FUEL_ELEMENT_MARK = (Math.random() * 10000) << 1
}


function eventmap(str, ..._): {[key: string]: boolean} {
  return str[0].split(' ').reduce((prev, next) => {
    const key = `on${next}`;prev[key] = true;
    return prev;
  }, {});
}

function attrmap(str, ..._): {[key: string]: boolean} {
  return str[0].split(' ').reduce((prev, next) => {
    prev[next] = true;
    return prev;
  }, {});
}


export const DOMEvents: {[key: string]: boolean} = eventmap`Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel`;


export const DOMAttributes: {[key: string]: boolean} = attrmap`defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable`;

