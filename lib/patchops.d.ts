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
import { FuelElement, Stem, PatchOps, MoveType } from './type';
export declare class PatchOpsImpl implements PatchOps {
    private createStem;
    private removes;
    constructor(createStem: () => Stem);
    move(moveTo: number, moveType: MoveType, oldElement: FuelElement): void;
    replace(index: number, parent: FuelElement, newElement: FuelElement, oldElement: FuelElement, context: any): void;
    update(newElement: FuelElement, oldElement: FuelElement): void;
    insert(index: number, context: any, parent: FuelElement, newElement: FuelElement): void;
    append(context: any, parent: FuelElement, newElement: FuelElement): void;
    remove(index: number, parent: FuelElement, oldElement: FuelElement): void;
    updateText(index: number, parent: FuelElement, newElement: FuelElement): void;
    setText(parent: FuelElement, newElement: FuelElement): void;
    createChildren(context: any, newElement: FuelElement): void;
    removeChildren(el: FuelElement): void;
    executeRemove(): void;
}
