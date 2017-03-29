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
var ON_REGEXP = /^on/;
var SharedEventHandlerImpl = (function () {
    function SharedEventHandlerImpl() {
        this.events = {};
        this.id = 1;
    }
    SharedEventHandlerImpl.prototype.addEvent = function (root, el, type, callback) {
        var _this = this;
        type = type.replace(ON_REGEXP, '').toLowerCase();
        if (!root['__events']) {
            root['__events'] = {};
        }
        if (el.nodeName === 'INPUT' && type === 'change') {
            type = 'keyup';
        }
        var id = String(this.id++);
        if (!root['__events'][type]) {
            root['__events'][type] = true;
            var handler = function (e) {
                var eventInfo = e.target['__fuelevent'];
                if (eventInfo && eventInfo[e.type] && eventInfo[e.type] === id) {
                    var callback_1 = _this.events[e.type][id];
                    if (callback_1) {
                        callback_1(e);
                    }
                }
            };
            this.events[type] = { count: 1, '0': handler };
            root.addEventListener(type, handler, false);
        }
        else {
            this.events[type][String(this.events[type].count++)] = callback;
        }
        this.events[type][id] = callback;
        if (!el['__fuelevent']) {
            el['__fuelevent'] = (_a = {}, _a[type] = id, _a);
        }
        else {
            el['__fuelevent'][type] = id;
        }
        var _a;
    };
    SharedEventHandlerImpl.prototype.removeEvent = function (root, el, type) {
        if (el['__fuelevent']) {
            var eventInfo = el['__fuelevent'];
            if (eventInfo[type]) {
                this.events[type][eventInfo[type]] = null;
                this.events[type].count--;
                eventInfo[type] = null;
                if (this.events[type].count === 0) {
                    root.removeEventListener(type, this.events[type]['0']);
                    root['__events'][type] = false;
                }
            }
        }
    };
    SharedEventHandlerImpl.prototype.replaceEvent = function (root, el, type, value) {
        if (el['__fuelevent']) {
            var eventInfo = el['__fuelevent'];
            if (eventInfo[type]) {
                this.events[type][eventInfo[type]] = value;
            }
        }
    };
    SharedEventHandlerImpl.prototype.removeEvents = function (root, el) {
        if (el['__fuelevent']) {
            var eventInfo = el['__fuelevent'];
            for (var type in eventInfo) {
                if (eventInfo[type] === null) {
                    continue;
                }
                this.events[type][eventInfo[type]] = null;
                this.events[type].count--;
                eventInfo[type] = null;
                if (this.events[type].count === 0) {
                    root.removeEventListener(type, this.events[type]['0']);
                }
            }
        }
    };
    return SharedEventHandlerImpl;
}());
exports.SharedEventHandlerImpl = SharedEventHandlerImpl;
