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
import { FuelElement, KeyMap, PatchOps, MoveType } from './type';
export declare function compare(valueA: any, valueB: any): boolean;
export declare function isStateUpdated(prev: any, next: any): boolean;
export declare function compareStyle(prev: KeyMap<any>, next: KeyMap<any>): [KeyMap<string>, number];
export declare const enum TraversalOp {
    CONTINUE = 1,
    SKIP_CURRENT_CHILDREN = 2,
    SKIP_CURRENT_FORESET = 3,
}
export declare function diff(context: any, index: number, move: MoveType, parent: FuelElement, oldElement: FuelElement, newElement: FuelElement, patchOps: PatchOps): TraversalOp;
