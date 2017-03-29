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
import { FuelElement } from './type';
export declare const enum DifferenceBits {
    CREATE_CHILDREN = 1,
    NEW_ELEMENT = 2,
    REMOVE_ELEMENT = 4,
    REPLACE_ELEMENT = 8,
    TEXT_CHANGED = 16,
}
export declare const enum AttrState {
    NEW = 1,
    REMOVED = 2,
    REPLACED = 3,
    UNCHANGED = 4,
    STYLE_CHANGED = 5,
}
export interface PropsDiff {
    value: any;
    state: AttrState;
}
export interface AttrDiff {
    key: string;
    value: string;
    state: AttrState;
}
export interface StyleDiff {
    key: 'style';
    value: {
        [key: string]: string | number;
    };
    state: AttrState;
}
export interface Difference {
    attr: (AttrDiff | StyleDiff)[];
    flags: number;
}
export declare function isCreateChildren(diff: Difference): boolean;
export declare function isNewElement(diff: Difference): boolean;
export declare function isRemoveElement(diff: Difference): boolean;
export declare function isReplaceElement(diff: Difference): boolean;
export declare function isTextChanged(diff: Difference): boolean;
export declare function diff(oldElement: FuelElement, newElement: FuelElement): Difference;
