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
import { FuelElement, BuiltinFuelElement, StatelessFuelElement, ComponentFuelElement, FactoryFuelElement, FuelComponentType, Stem, KeyMap } from './type';
export declare const INSTANCE_ELEMENT_SYM: any;
export declare const FuelElementView: {
    isComponent(fuelElement: any): fuelElement is FactoryFuelElement;
    isStatelessComponent(fuelElement: FuelElement): fuelElement is StatelessFuelElement;
    isComponentClass(fuelElement: FuelElement): fuelElement is ComponentFuelElement;
    isFragment(el: any): boolean;
    tagNameOf(fuelElement: FuelElement): string;
    nameOf(fuelElement: FuelElement): string;
    hasChildren(el: FuelElement): boolean;
    cleanupElement(el: FuelElement): void;
    attachFuelElementToNode(node: Node, fuelElement: FuelElement): void;
    detachFuelElementFromNode(node: Node): void;
    getFuelElementFromNode(el: Node): FuelElement;
    isFuelElement(fuelElement: any): fuelElement is FuelElement;
    isDisposed(fuelElement: FuelElement): boolean;
    setDisposed(fuelElement: FuelElement): void;
    isTextNode(fuelElement: FuelElement): fuelElement is BuiltinFuelElement;
    getTextValueOf(fuelElement: FuelElement): string;
    getComponentRenderedTree(fuelElement: FuelElement): FuelElement;
    invokeDidMount(el: FuelElement): void;
    invokeDidUpdate(el: FuelElement): void;
    invokeWillUnmount(el: FuelElement): void;
    stripComponent(fuelElement: FuelElement): FuelElement;
    initFuelElementBits(type: FuelComponentType): number;
    instantiateComponent(context: any, fuelElement: FactoryFuelElement, createStem: () => Stem): [FuelElement, any];
    addEvent(rootElement: FuelElement, fuelElement: FuelElement, type: any, eventHandler: any): void;
    toStringTree(el: FuelElement, enableChecksum: boolean): string;
    createDomElement(rootElement: FuelElement, fuelElement: FuelElement, createStem: () => Stem): any;
};
export declare function cloneElement(fuelElement: FuelElement, props?: any, children?: FuelElement[]): FuelElement;
/**
 * Create text representation.
 */
export declare function createTextNode(child: string): FuelElement;
export declare function makeFuelElement(type: FuelComponentType, key: string | number, props: KeyMap<any>, children?: FuelElement[]): FuelElement;
export declare function makeFragment(children: FuelElement[]): FuelElement;
export declare const FLY_WEIGHT_ELEMENT_A: FuelElement;
export declare const FLY_WEIGHT_ELEMENT_B: FuelElement;
export declare const FLY_WEIGHT_FRAGMENT_A: FuelElement;
export declare const FLY_WEIGHT_FRAGMENT_B: FuelElement;
export declare function wrapNode(parent: FuelElement, value: any, wrapTarget: FuelElement, wrapFragment: FuelElement): FuelElement;
