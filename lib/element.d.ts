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
import { FuelElement, Property, FuelComponentType, Stem } from './type';
import { Renderer } from './renderer/renderer';
export declare class FuelElementView {
    static allocateTextTagName(): number;
    static allocateTagName(tagName: string): number;
    static isComponent(fuelElement: FuelElement): boolean;
    static isStatelessComponent(fuelElement: FuelElement): boolean;
    static tagNameOf(fuelElement: FuelElement): string;
    static tagTypeOf(fuelElement: FuelElement): number;
    static hasChildren(el: FuelElement): boolean;
    static isFuelElement(fuelElement: FuelElement): boolean;
    static isTextNode(fuelElement: FuelElement): boolean;
    static getTextValueOf(fuelElement: FuelElement): string;
    static getComponentRenderedTree(fuelElement: FuelElement): FuelElement;
    static getProps({props, children}: FuelElement, isInsertChildren?: boolean): Object;
    static invokeDidMount(el: FuelElement): void;
    static invokeWillMount(el: FuelElement): void;
    static invokeWillUpdate(el: FuelElement): void;
    static invokeDidUpdate(el: FuelElement): void;
    static invokeWillUnmount(el: FuelElement): void;
    static instantiateComponent(context: any, fuelElement: FuelElement, oldElement?: FuelElement): any[];
    static createDomElement(rootElement: FuelElement, fuelElement: FuelElement, renderer: Renderer, createStem: () => Stem): any;
}
export declare function cloneElement(fuelElement: FuelElement, props: any, children?: (FuelElement | string | number)[]): any;
export declare function makeFuelElement(type: FuelComponentType, key: string | number, props: Property[], children?: FuelElement[]): FuelElement;
