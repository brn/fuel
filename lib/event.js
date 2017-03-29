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
var util_1 = require("./util");
var FUEL_EVENT_SYM = util_1.Symbol('__fuelevent');
var ROOT_EVENT_SYM = util_1.Symbol('__root_events');
var ON_REGEXP = /^on/;
var SharedEventHandlerImpl = (function () {
    function SharedEventHandlerImpl() {
        this.events = {};
        this.id = 1;
    }
    SharedEventHandlerImpl.prototype.addEvent = function (root, el, type, callback) {
        var _this = this;
        type = type.replace(ON_REGEXP, '').toLowerCase();
        if (!root[ROOT_EVENT_SYM]) {
            root[ROOT_EVENT_SYM] = {};
        }
        if (el.nodeName === 'INPUT' && type === 'change') {
            type = 'keyup';
        }
        var id = String(this.id++);
        if (!root[ROOT_EVENT_SYM][type]) {
            root[ROOT_EVENT_SYM][type] = true;
            var handler = function (e) {
                var eventInfo = e.target[FUEL_EVENT_SYM];
                if (eventInfo && eventInfo[e.type] && eventInfo[e.type] === id) {
                    var callback_1 = _this.events[e.type][id];
                    if (callback_1) {
                        callback_1(e);
                    }
                }
            };
            this.events[type] = { count: 1, '0': handler, root: root };
            root.addEventListener(type, handler, false);
        }
        else {
            this.events[type][String(this.events[type].count++)] = callback;
        }
        this.events[type][id] = callback;
        if (!el[FUEL_EVENT_SYM]) {
            el[FUEL_EVENT_SYM] = (_a = {}, _a[type] = id, _a);
        }
        else {
            el[FUEL_EVENT_SYM][type] = id;
        }
        var _a;
    };
    SharedEventHandlerImpl.prototype.removeEvent = function (el, type) {
        if (el[FUEL_EVENT_SYM]) {
            var eventInfo = el[FUEL_EVENT_SYM];
            if (eventInfo[type]) {
                this.events[type][eventInfo[type]] = null;
                this.events[type].count--;
                eventInfo[type] = null;
                var root = this.events[type].root;
                if (this.events[type].count === 0) {
                    root.removeEventListener(type, this.events[type]['0']);
                    root[ROOT_EVENT_SYM][type] = false;
                    this.events[type].root = null;
                }
            }
        }
    };
    SharedEventHandlerImpl.prototype.replaceEvent = function (el, type, value) {
        if (el[FUEL_EVENT_SYM]) {
            var eventInfo = el[FUEL_EVENT_SYM];
            if (eventInfo[type]) {
                this.events[type][eventInfo[type]] = value;
            }
        }
    };
    SharedEventHandlerImpl.prototype.removeEvents = function (el) {
        if (el[FUEL_EVENT_SYM]) {
            var eventInfo = el[FUEL_EVENT_SYM];
            for (var type in eventInfo) {
                this.removeEvent(el, type);
            }
        }
    };
    return SharedEventHandlerImpl;
}());
exports.SharedEventHandlerImpl = SharedEventHandlerImpl;
