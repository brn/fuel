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
import { FuelElement, SharedEventHandler, Stem } from './type';
export declare class FuelStem implements Stem {
    private patchOps;
    private _enabled;
    private batchCallback;
    private sharedEventHandler;
    private lock;
    private renderQueue;
    private tree;
    constructor();
    enterUnsafeUpdateZone(cb: () => void): void;
    registerOwner(owner: FuelElement): void;
    owner(): FuelElement;
    setEventHandler(handler: SharedEventHandler): void;
    getEventHandler(): SharedEventHandler;
    private renderAtAnimationFrame();
    private drainRenderQueue();
    unmountComponent(fuelElement: FuelElement, cb?: () => void): void;
    render(el: FuelElement, callback?: (el: Node) => void, context?: any, updateOwnwer?: boolean): void;
    private attach(el, updateOwner);
}
