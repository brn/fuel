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
var TAG_NAMES = { map: {}, count: 1 };
var SYNTHETIC_TEXT = 'SYNTHETIC_TEXT';
TAG_NAMES.map[String(TAG_NAMES.map[SYNTHETIC_TEXT] = 0)] = SYNTHETIC_TEXT;
var FuelElementView = (function () {
    function FuelElementView() {
    }
    FuelElementView.allocateTextTagName = function () { return 0; };
    FuelElementView.allocateTagName = function (tagName) {
        var id = TAG_NAMES.map[tagName.toLowerCase()];
        if (id) {
            return id;
        }
        TAG_NAMES.map[String(TAG_NAMES.map[tagName] = TAG_NAMES.count)] = tagName;
        return TAG_NAMES.count++;
    };
    FuelElementView.isComponent = function (fuelElement) {
        return typeof fuelElement.type !== 'number';
    };
    FuelElementView.isStatelessComponent = function (fuelElement) {
        return typeof fuelElement.type === 'function' && typeof fuelElement.type.prototype.render !== 'function';
    };
    FuelElementView.isComponentClass = function (fuelElement) {
        return typeof fuelElement.type === 'function' && typeof fuelElement.type.prototype.render === 'function';
    };
    FuelElementView.tagNameOf = function (fuelElement) {
        return TAG_NAMES.map[String(fuelElement.type)];
    };
    FuelElementView.hasChildren = function (el) {
        return el.children.length > 0;
    };
    FuelElementView.isFuelElement = function (fuelElement) {
        return fuelElement && fuelElement[FUEL_ELEMENT_MARK] === type_1.Bytes.FUEL_ELEMENT_MARK;
    };
    FuelElementView.isTextNode = function (fuelElement) {
        return fuelElement.type === 0;
    };
    FuelElementView.getTextValueOf = function (fuelElement) {
        return fuelElement.props[0].value;
    };
    FuelElementView.getComponentRenderedTree = function (fuelElement) {
        return fuelElement._componentRenderedElementTreeCache;
    };
    FuelElementView.getProps = function (_a, isInsertChildren) {
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
    };
    FuelElementView.invokeDidMount = function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentDidMount();
        }
    };
    FuelElementView.invokeWillMount = function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentWillMount();
        }
    };
    FuelElementView.invokeWillUpdate = function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentWillUpdate();
        }
    };
    FuelElementView.invokeDidUpdate = function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentDidUpdate();
        }
    };
    FuelElementView.invokeWillUnmount = function (el) {
        if (el._componentInstance) {
            el._componentInstance.componentWillUnmount();
        }
    };
    FuelElementView.stripComponent = function (fuelElement) {
        while (fuelElement && this.isComponent(fuelElement)) {
            fuelElement = fuelElement._componentRenderedElementTreeCache;
        }
        return fuelElement;
    };
    FuelElementView.instantiateComponent = function (context, fuelElement, oldElement) {
        var props = fuelElement.props;
        var attrs = this.getProps(fuelElement, true);
        var oldAttrs = oldElement ? this.getProps(oldElement) : null;
        if (this.isStatelessComponent(fuelElement)) {
            return [fuelElement.type(attrs, context), context];
        }
        if (this.isComponentClass(fuelElement)) {
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
            instance_1.setState = function (state, cb) {
                this.state = util_1.merge(this.state, state);
                this[type_1.ExportProperites.componentWillUpdate]();
                var tree = this.render();
                fuelElement._stem.render(tree, function () {
                    fuelElement._componentRenderedElementTreeCache = tree;
                    cb && cb();
                }, false);
            };
            var newContext = util_1.merge(context, instance_1.getChildContext());
            if (fuelElement._componentRenderedElementTreeCache && !instance_1[type_1.ExportProperites.shouldComponentUpdate](attrs, oldAttrs)) {
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
            var rendered = fuelElement._componentRenderedElementTreeCache = instance_1[type_1.ExportProperites.render]();
            // If rendered component was FuelComponent,
            // _componentInstance must not to be setted.
            if (rendered) {
                if (!this.isComponent(rendered)) {
                    rendered._componentInstance = instance_1;
                }
                rendered._stem = fuelElement._stem;
            }
            fuelElement._stem.registerOwner(fuelElement);
            return [rendered, newContext];
        }
        util_1.invariant(true, "factory element requried but got " + this.tagNameOf(fuelElement) + ".");
    };
    FuelElementView.removeEvent = function (rootElement, fuelElement, type) {
        var handler = rootElement._stem.getEventHandler();
        util_1.invariant(!handler, 'SharedEventHandler must be exists');
        var root = this.stripComponent(rootElement);
        handler.removeEvent(root.dom, fuelElement.dom, type);
    };
    FuelElementView.replaceEvent = function (rootElement, fuelElement, type, fn) {
        var handler = rootElement._stem.getEventHandler();
        util_1.invariant(!handler, 'SharedEventHandler must be exists');
        var root = this.stripComponent(rootElement);
        handler.replaceEvent(root.dom, fuelElement.dom, type, fn);
    };
    FuelElementView.addEvent = function (rootElement, fuelElement, type, eventHandler) {
        var handler = rootElement._stem.getEventHandler();
        if (!handler) {
            handler = new event_1.SharedEventHandlerImpl();
            rootElement._stem.setEventHandler(handler);
        }
        var root = this.stripComponent(rootElement);
        handler.addEvent(root.dom, fuelElement.dom, type, eventHandler);
    };
    FuelElementView.createDomElement = function (rootElement, fuelElement, renderer, createStem) {
        if (fuelElement.type === 0) {
            return fuelElement.dom = renderer.createTextNode(this.getTextValueOf(fuelElement));
        }
        var props = fuelElement.props, type = fuelElement.type;
        var attrs = [];
        var tagName = this.tagNameOf(fuelElement);
        var dom = renderer.createElement(tagName);
        fuelElement.dom = dom;
        var isScoped = false;
        for (var i = 0, len = props.length; i < len; i++) {
            var _a = props[i], name_2 = _a.name, value = _a.value;
            if (type_1.DOMEvents[name_2]) {
                this.addEvent(rootElement, fuelElement, name_2, value);
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
                    if (this.isComponent(rootElement)) {
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
            if (type_1.DOMAttributes[name_2] || name_2.indexOf('data-') === 0) {
                dom[name_2] = value;
            }
        }
        return dom;
    };
    return FuelElementView;
}());
exports.FuelElementView = FuelElementView;
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
    util_1.invariant(!FuelElementView.isFuelElement(fuelElement), "cloneElement only clonable FuelElement but got = " + fuelElement);
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
        _a._stem = null,
        _a._componentInstance = null,
        _a._componentRenderedElementTreeCache = null,
        _a._keymap = null,
        _a._subscriptions = null,
        _a;
    var _a;
}
exports.makeFuelElement = makeFuelElement;
