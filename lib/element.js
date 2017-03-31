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
var type_1 = require("./type");
var node_1 = require("./node");
var util_1 = require("./util");
var event_1 = require("./event");
var FUEL_ELEMENT_MARK = util_1.Symbol('__fuel_element');
var DOM_LINK = util_1.Symbol('__fuel_element_link');
var TAG_NAMES = { map: {}, count: 1 };
var SYNTHETIC_TEXT = 'SYNTHETIC_TEXT';
var PROTOTYPE = 'prototype';
TAG_NAMES.map[String(TAG_NAMES.map[SYNTHETIC_TEXT] = 0)] = SYNTHETIC_TEXT;
function isFunction(maybeFn) {
    return typeof maybeFn === 'function';
}
exports.INSTANCE_ELEMENT_SYM = util_1.Symbol('__fuelelement');
exports.FuelElementView = {
    allocateTextTagName: function () { return 0; },
    allocateTagName: function (tagName) {
        var id = TAG_NAMES.map[tagName.toLowerCase()];
        if (id) {
            return id;
        }
        TAG_NAMES.map[String(TAG_NAMES.map[tagName] = TAG_NAMES.count)] = tagName;
        return TAG_NAMES.count++;
    },
    isComponent: function (fuelElement) {
        return typeof fuelElement.type !== 'number';
    },
    isStatelessComponent: function (fuelElement) {
        return isFunction(fuelElement.type) && !isFunction(fuelElement.type[PROTOTYPE].render);
    },
    isComponentClass: function (fuelElement) {
        return isFunction(fuelElement.type) && isFunction(fuelElement.type[PROTOTYPE].render);
    },
    tagNameOf: function (fuelElement) {
        return TAG_NAMES.map[String(fuelElement.type)];
    },
    hasChildren: function (el) {
        return el.children.length > 0;
    },
    cleanupElement: function (el) {
        el = exports.FuelElementView.stripComponent(el);
        if (el.dom) {
            el.dom[DOM_LINK] = null;
            if (el.dom['__fuelevent']) {
                el._ownerElement._stem.getEventHandler().removeEvents(el.dom);
            }
            el.dom = null;
        }
        if (el._subscriptions) {
            el._subscriptions.forEach(function (s) { return s.unsubscribe(); });
        }
    },
    getFuelElementFromNode: function (el) {
        if (!el[DOM_LINK]) {
            return el[DOM_LINK];
        }
        return null;
    },
    isFuelElement: function (fuelElement) {
        return fuelElement && fuelElement[FUEL_ELEMENT_MARK] === type_1.Bytes.FUEL_ELEMENT_MARK;
    },
    isTextNode: function (fuelElement) {
        return fuelElement.type === 0;
    },
    getTextValueOf: function (fuelElement) {
        return fuelElement.props[0].value;
    },
    getComponentRenderedTree: function (fuelElement) {
        return fuelElement._componentRenderedElementTreeCache;
    },
    getProps: function (_a, isInsertChildren) {
        var props = _a.props, children = _a.children;
        if (isInsertChildren === void 0) { isInsertChildren = false; }
        var attrs = {};
        for (var i = 0, len = props.length; i < len; i++) {
            var _b = props[i], name_1 = _b.name, value = _b.value;
            attrs[name_1] = value;
        }
        if (isInsertChildren) {
            attrs['children'] = children.length ? children : null;
        }
        return attrs;
    },
    invokeDidMount: function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentDidMount();
        }
    },
    invokeDidUpdate: function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentDidUpdate();
        }
    },
    invokeWillUnmount: function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentWillUnmount();
        }
    },
    stripComponent: function (fuelElement) {
        while (fuelElement && exports.FuelElementView.isComponent(fuelElement)) {
            fuelElement = fuelElement._componentRenderedElementTreeCache;
        }
        return fuelElement;
    },
    instantiateComponent: function (context, fuelElement, oldElement) {
        var props = fuelElement.props;
        var attrs = exports.FuelElementView.getProps(fuelElement, true);
        var oldAttrs = oldElement ? exports.FuelElementView.getProps(oldElement) : null;
        if (exports.FuelElementView.isStatelessComponent(fuelElement)) {
            return [fuelElement.type(attrs, context), context];
        }
        if (exports.FuelElementView.isComponentClass(fuelElement)) {
            var instance_1 = fuelElement._componentInstance;
            var callReceiveHook = !!instance_1;
            if (!instance_1) {
                instance_1 = fuelElement._componentInstance = new fuelElement.type(attrs, context);
            }
            else {
                if (instance_1._context) {
                    instance_1._context = context;
                }
            }
            instance_1[exports.INSTANCE_ELEMENT_SYM] = fuelElement;
            var newContext = util_1.merge(context, instance_1.getChildContext());
            if (fuelElement._componentRenderedElementTreeCache && !instance_1.shouldComponentUpdate(attrs, oldAttrs)) {
                if (callReceiveHook) {
                    fuelElement._stem.enterUnsafeUpdateZone(function () {
                        instance_1.componentWillReceiveProps(attrs);
                        instance_1._props = attrs;
                    });
                }
                return [fuelElement._componentRenderedElementTreeCache, newContext];
            }
            if (callReceiveHook) {
                fuelElement._stem.enterUnsafeUpdateZone(function () {
                    instance_1.componentWillReceiveProps(attrs);
                    instance_1._props = attrs;
                });
            }
            if (fuelElement._componentRenderedElementTreeCache) {
                instance_1.componentWillUpdate();
            }
            else {
                instance_1.componentWillMount();
            }
            var rendered = fuelElement._componentRenderedElementTreeCache = instance_1.render();
            // If rendered component was FuelComponent,
            // _componentInstance must not to be setted.
            if (rendered) {
                rendered._ownerElement = fuelElement;
                if (!exports.FuelElementView.isComponent(rendered)) {
                    rendered._componentInstance = instance_1;
                }
                rendered._stem = fuelElement._stem;
            }
            fuelElement._stem.registerOwner(fuelElement);
            return [rendered, newContext];
        }
        util_1.invariant(true, "factory element requried but got " + exports.FuelElementView.tagNameOf(fuelElement) + ".");
    },
    addEvent: function (rootElement, fuelElement, type, eventHandler) {
        var handler = rootElement._stem.getEventHandler();
        if (!handler) {
            handler = new event_1.SharedEventHandlerImpl();
            rootElement._stem.setEventHandler(handler);
        }
        var root = exports.FuelElementView.stripComponent(rootElement);
        handler.addEvent(root.dom, fuelElement.dom, type, eventHandler);
    },
    createDomElement: function (rootElement, fuelElement, renderer, createStem) {
        if (fuelElement.type === 0) {
            return fuelElement.dom = renderer.createTextNode(exports.FuelElementView.getTextValueOf(fuelElement));
        }
        var props = fuelElement.props, type = fuelElement.type;
        var attrs = [];
        var tagName = exports.FuelElementView.tagNameOf(fuelElement);
        var dom = renderer.createElement(tagName);
        fuelElement.dom = dom;
        var isScoped = false;
        for (var i = 0, len = props.length; i < len; i++) {
            var _a = props[i], name_2 = _a.name, value = _a.value;
            if (type_1.DOMEvents[name_2]) {
                exports.FuelElementView.addEvent(rootElement, fuelElement, name_2, value);
                continue;
            }
            else if (name_2 === 'checked' || name_2 === 'selected') {
                booleanAttr(dom, name_2, value);
                continue;
            }
            else if (name_2 === 'scoped') {
                isScoped = true;
            }
            else if (((value.isObservable || value.subscribe)) && isScoped) {
                makeStem(fuelElement, name_2, value, createStem);
                continue;
            }
            else if (name_2 === 'style') {
                for (var style in value) {
                    node_1.setStyle(dom, style, value[style]);
                }
                continue;
            }
            else if (name_2 === 'ref') {
                var refType = typeof value;
                if (refType === 'string') {
                    if (exports.FuelElementView.isComponent(rootElement)) {
                        rootElement._componentInstance.refs[value] = dom;
                    }
                }
                else if (refType === 'function') {
                    value(dom);
                }
                continue;
            }
            if (name_2 === 'htmlFor') {
                name_2 = 'for';
            }
            util_1.invariant(!type_1.DOMAttributes[name_2] && name_2.indexOf('data-') === -1, name_2 + " is not a valid dom attributes.");
            dom[name_2] = value;
        }
        // This make circular references between DOMElement and FuelElement,
        // but all disposable FuelElement will cleanup at stem and all references will be cut off.
        // So, this circular ref does'nt make leaks.
        dom[DOM_LINK] = fuelElement;
        return dom;
    }
};
function booleanAttr(el, name, value) {
    if (value) {
        el[name] = name;
    }
    else {
        el.removeAttribute(name);
    }
}
function mergeProps(oldP, p) {
    var buf = {};
    for (var i = 0, len = oldP.length; i < len; i++) {
        buf[oldP[i].name] = i;
    }
    for (var key in p) {
        if (buf[key]) {
            oldP[buf[key]].value = p[key];
        }
        else {
            oldP.push({ name: key, value: p[key] });
        }
    }
    return oldP;
}
function cloneElement(fuelElement, props, children) {
    if (props === void 0) { props = {}; }
    if (children === void 0) { children = fuelElement.children; }
    util_1.invariant(!exports.FuelElementView.isFuelElement(fuelElement), "cloneElement only clonable FuelElement but got = " + fuelElement);
    var el = makeFuelElement(fuelElement.type, fuelElement.key, mergeProps(fuelElement.props.slice(), props), children);
    el._stem = fuelElement._stem;
    el._componentInstance = fuelElement._componentInstance;
    el._componentRenderedElementTreeCache = fuelElement._componentRenderedElementTreeCache;
    el._subscriptions = fuelElement._subscriptions;
    return el;
}
exports.cloneElement = cloneElement;
function makeStem(fuelElement, name, value, createStem) {
    if (value.subscribe) {
        if (!fuelElement._subscriptions) {
            fuelElement._subscriptions = [];
        }
        fuelElement._subscriptions.push(value.subscribe(function (value) {
            var updated = fuelElement.props.some(function (p) {
                if (p.name === name) {
                    p.value = value;
                    return true;
                }
                return false;
            });
            if (!updated) {
                fuelElement.props.push({ name: name, value: value });
            }
            fuelElement._stem.render(fuelElement);
        }));
        fuelElement._stem = createStem();
        fuelElement._stem.registerOwner(fuelElement);
    }
}
function makeFuelElement(type, key, props, children) {
    if (key === void 0) { key = null; }
    if (children === void 0) { children = []; }
    return _a = {},
        _a[FUEL_ELEMENT_MARK] = type_1.Bytes.FUEL_ELEMENT_MARK,
        _a.type = type,
        _a.key = key,
        _a.props = props,
        _a.children = children,
        _a.dom = null,
        _a._ownerElement = null,
        _a._unmounted = false,
        _a._stem = null,
        _a._componentInstance = null,
        _a._componentRenderedElementTreeCache = null,
        _a._keymap = null,
        _a._subscriptions = null,
        _a;
    var _a;
}
exports.makeFuelElement = makeFuelElement;
