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
export declare const HAS_TYPED_ARRAY: boolean;
export declare const BUFFER_SIZE_MULTIPLER: number;
export declare type BufferType = Uint16Array | number[];
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
    tagName: string | null;
    attrs: {
        [key: string]: any;
    };
    childNodes: StringNodeReprensation[];
    children: StringNodeReprensation[];
    nodeType: number;
    parentNode: this;
    text?: string;
}
export declare type FuelText = string | number;
export declare type FuelChild = FuelElement | FuelText;
export declare type FuelFragment = {} | Array<FuelChild | any[] | boolean>;
export declare type FuelNode = FuelChild | FuelFragment | boolean;
export interface FuelDOMNode extends EventTarget {
    removeAttribute(key: string): void;
    appendChild(child: FuelDOMNode): FuelDOMNode;
    parentNode: FuelDOMNode;
    removeChild(node: FuelDOMNode): void;
    replaceChild(newNode: FuelDOMNode, oldNode: FuelDOMNode): void;
    childNodes: FuelDOMNode[];
    nodeType: number;
    children: FuelDOMNode[];
    style?: {
        [key: string]: string;
    };
    textContent: string;
}
export interface Phai {
}
export declare type FuelComponentType = number | string | FuelComponentStatic<Phai, Phai> | StatelessComponent<Phai>;
export interface ESSubscription {
    unsubscribe(): void;
}
export interface ESObservable<T> {
    subscribe(value: T): ESSubscription;
}
export interface FuelElement {
    type: FuelComponentType;
    props: Property[];
    key: string | number;
    children: FuelElement[];
    dom: FuelDOMNode;
    _stem?: Stem;
    _componentInstance?: FuelComponent<Phai, Phai>;
    _componentRenderedElementTreeCache?: FuelElement;
    _keymap?: {
        [key: string]: FuelElement;
    };
    _subscriptions?: ESSubscription[];
}
export interface ReactCompatiblePropsTypes {
    array: Object;
    bool: Object;
    func: Object;
    number: Object;
    object: Object;
    string: Object;
    symbol: Object;
    node: Object;
    instanceOf(...args: any[]): Object;
    oneOf(...args: any[]): Object;
    oneOfType(...args: any[]): Object;
    arrayOf(...args: any[]): Object;
    objectOf(...args: any[]): Object;
    shape(...args: any[]): Object;
}
export interface AttributesMap {
    [key: string]: any;
}
export interface TextTable {
    valueAt(index: number): string;
    registerFunction(text: string): number;
    register(text: string): number;
    clear(): any;
}
export declare enum BuiltinElementValue {
    CHILDREN = 2,
}
export interface FuelComponentStatic<Props, State> {
    new (props: Props, context: any): FuelComponent<Props, State>;
}
export interface FuelComponent<Props, State> {
    props: Props;
    state?: State;
    refs?: {
        [key: string]: FuelComponent<any, any> | Element;
    };
    componentWillUnmount(): void;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    componentWillReceiveProps(props: Props): void;
    render(): FuelElement;
    shouldComponentUpdate(nextProps: Props, prevProps: Props): boolean;
    setState(s: State, cb?: () => void): void;
    getChildContext(): any;
}
export declare const ExportProperites: {
    'props': string;
    'state': string;
    'refs': string;
    'componentWillUnmount': string;
    'componentWillMount': string;
    'componentDidMount': string;
    'componentWillUpdate': string;
    'componentDidUpdate': string;
    'componentWillReceiveProps': string;
    'render': string;
    'shouldComponentUpdate': string;
    'setState': string;
    'getChildContext': string;
    "Symbol": string;
};
export interface StatelessComponent<Props> {
    (props: Props, context: any): FuelElement;
}
export declare const CONVERSATION_TABLE: {
    'className': string;
};
export declare enum Bytes {
    FUEL_ELEMENT_MARK,
}
export declare const DOMEvents: {
    [key: string]: boolean;
};
export declare const DOMAttributes: {
    [key: string]: boolean;
};
