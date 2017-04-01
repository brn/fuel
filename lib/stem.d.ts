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
import { FuelElement, FuelDOMNode, SharedEventHandler, Stem } from './type';
import { Renderer } from './renderer/renderer';
export declare class FuelStem implements Stem {
    private tree;
    static renderer: Renderer;
    private _enabled;
    private batchs;
    private batchCallback;
    private sharedEventHandler;
    private lock;
    private renderQueue;
    constructor(tree?: FuelElement);
    enterUnsafeUpdateZone(cb: () => void): void;
    registerOwner(owner: FuelElement): void;
    owner(): FuelElement;
    setEventHandler(handler: SharedEventHandler): void;
    getEventHandler(): SharedEventHandler;
    private renderAtAnimationFrame();
    private drainRenderQueue();
    unmountComponent(fuelElement: FuelElement, cb: () => void): void;
    render(el: FuelElement, callback?: (el: FuelDOMNode) => void, context?: any, updateOwnwer?: boolean): void;
    private attach(el, updateOwner);
    private patch(newTree, context);
}
