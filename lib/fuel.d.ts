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
import { PublicFuelElement, FuelElement, FuelComponent, StatelessComponent, FuelComponentStatic, FuelNode, ReactCompatiblePropsTypes, HTMLAttributes } from './type';
export declare class ComponentImpl<Props, State> implements FuelComponent<Props, State> {
    private _props;
    private _context;
    state: State;
    constructor(_props?: Props, _context?: {});
    refs?: {
        [key: string]: FuelComponent<any, any> | Element;
    };
    readonly ['props']: Props;
    readonly ['context']: {};
    ['componentWillUnmount'](): void;
    ['componentWillMount'](): void;
    ['componentDidMount'](): void;
    ['componentWillUpdate'](): void;
    ['componentDidUpdate'](): void;
    ['componentWillReceiveProps'](props: Props): void;
    ['shouldComponentUpdate'](nextProps: any, prevProps: any): boolean;
    ['render'](): JSX.Element;
    ['getChildContext']<CC extends {}>(): CC;
    /**
     * Will be rewrited after.
     */
    ['setState'](state: State, cb?: () => void): void;
}
export declare class PureComponentImpl<Props, State> extends ComponentImpl<Props, State> {
    ['shouldComponentUpdate'](nextProps: any, prevProps: any): boolean;
}
export declare class Fuel {
    /**
     * Create Fuel element.
     * This function compatible with React.createElement.
     * @param type TagName or Component constructor or stateless function.
     * @param props Props.
     * @param children Children elements.
     * @rreturns FuelElement tree.
     */
    static createElement<P extends {
        key?: string;
    }>(type: string, props: HTMLAttributes, ...children: FuelNode[]): FuelElement;
    static createElement<P extends {
        key?: string;
    }>(type: FuelComponentStatic<P, any>, props: P, ...children: FuelNode[]): FuelElement;
    static createElement<P extends {
        key?: string;
    }>(type: StatelessComponent<P>, props: P, ...children: FuelNode[]): FuelElement;
    static unmountComponentAtNode(el: Node): void;
    /**
     * Base class of FuelComponent.
     */
    static Component: typeof ComponentImpl;
    static PureComponent: typeof PureComponentImpl;
    static isValidElement: (el: any) => boolean;
    static cloneElement: (fuelElement: PublicFuelElement, props?: any, children?: PublicFuelElement[]) => PublicFuelElement;
    static createFactory: (tag: string) => () => FuelElement;
    static Children: {
        map<T>(children: PublicFuelElement[], cb: (el: PublicFuelElement) => T): T[];
        forEach(children: PublicFuelElement[], cb: (el: PublicFuelElement) => void): void;
        count(children: PublicFuelElement[]): number;
        toArray(children: PublicFuelElement[]): PublicFuelElement[];
    };
    static PropTypes: ReactCompatiblePropsTypes;
}
/**
 * Reactjs compatible definitions.
 * If you use typescript with tsx, import React namespace required.
 */
export declare const React: typeof Fuel;
