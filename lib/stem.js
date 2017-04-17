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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tree_1 = require("./tree");
var collect_1 = require("./recycler/collect");
var patch_1 = require("./patch");
var domops_1 = require("./domops");
var patchops_1 = require("./patchops");
function createStem() { return new FuelStem(); }
var FuelStem = (function () {
    function FuelStem() {
        this._enabled = true;
        this.batchCallback = null;
        this.lock = false;
        this.renderQueue = [];
        this.patchOps = new patchops_1.PatchOpsImpl(createStem);
    }
    FuelStem.prototype.enterUnsafeUpdateZone = function (cb) {
        this._enabled = false;
        cb();
        this._enabled = true;
    };
    FuelStem.prototype.registerOwner = function (owner) {
        this.tree = owner;
    };
    FuelStem.prototype.owner = function () {
        return this.tree;
    };
    FuelStem.prototype.setEventHandler = function (handler) {
        this.sharedEventHandler = handler;
    };
    FuelStem.prototype.getEventHandler = function () {
        return this.sharedEventHandler;
    };
    FuelStem.prototype.renderAtAnimationFrame = function () {
        this.batchCallback && this.batchCallback();
        this.batchCallback = null;
    };
    FuelStem.prototype.drainRenderQueue = function () {
        var next = this.renderQueue.shift();
        if (next) {
            var element = next.element, cb = next.cb;
            this.render(element, cb);
        }
    };
    FuelStem.prototype.unmountComponent = function (fuelElement, cb) {
        collect_1.collect(fuelElement, true, cb);
    };
    FuelStem.prototype.render = function (el, callback, context, updateOwnwer) {
        var _this = this;
        if (callback === void 0) { callback = (function (el) { }); }
        if (context === void 0) { context = {}; }
        if (updateOwnwer === void 0) { updateOwnwer = true; }
        if (!this._enabled) {
            callback(this.tree.dom);
            return;
        }
        if (this.lock) {
            this.renderQueue.push({ element: el, cb: callback });
            return;
        }
        domops_1.domOps.updateId();
        if (this.tree) {
            this.lock = true;
            patch_1.patch(context, el, this.tree, this.patchOps, createStem);
            var old = this.tree;
            if (updateOwnwer) {
                this.tree = el;
            }
            this.batchCallback = function () {
                callback(_this.tree.dom);
                _this.lock = false;
                _this.drainRenderQueue();
            };
            this.renderAtAnimationFrame();
        }
        else {
            callback(this.attach(el, updateOwnwer));
        }
    };
    FuelStem.prototype.attach = function (el, updateOwner) {
        var domTree = tree_1.fastCreateDomTree({}, el, createStem, domops_1.domOps.newFragment());
        if (updateOwner) {
            this.tree = el;
        }
        return domTree;
    };
    return FuelStem;
}());
exports.FuelStem = FuelStem;
