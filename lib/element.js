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
var domops_1 = require("./domops");
var DOM_LINK = util_1.Symbol('__fuel_element_link');
var SYNTHETIC_TEXT = 'SYNTHETIC_TEXT';
var SYNTHETIC_FRAGMENT = 'SYNTHETIC_FRAGMENT';
var PROTOTYPE = 'prototype';
function isFunction(maybeFn) {
    return typeof maybeFn === 'function';
}
exports.INSTANCE_ELEMENT_SYM = util_1.Symbol('__fuelelement');
exports.FuelElementView = {
    isComponent: function (fuelElement) {
        var bit = 8 /* STATELESS */ | 4 /* COMPONENT */;
        return !!fuelElement && (fuelElement._flags & bit) > 0;
    },
    isStatelessComponent: function (fuelElement) {
        return !!fuelElement && (fuelElement._flags & 8 /* STATELESS */) === 8 /* STATELESS */;
    },
    isComponentClass: function (fuelElement) {
        return !!fuelElement && (fuelElement._flags & 4 /* COMPONENT */) === 4 /* COMPONENT */;
    },
    isFragment: function (el) {
        return !!el && (el._flags & 32 /* FRAGMENT */) === 32 /* FRAGMENT */;
    },
    tagNameOf: function (fuelElement) {
        return fuelElement.type;
    },
    nameOf: function (fuelElement) {
        return !isComponent(fuelElement) ? exports.FuelElementView.tagNameOf(fuelElement) :
            fuelElement.type.name || fuelElement.type.displayName || 'Anonymouse';
    },
    hasChildren: function (el) {
        return el.children.length > 0;
    },
    cleanupElement: function (el) {
        el = exports.FuelElementView.stripComponent(el);
        if (!!el.dom) {
            if (!!el.dom['__fuelevent']) {
                el._ownerElement._stem.getEventHandler().removeEvents(el.dom);
            }
        }
        if (!!el._subscriptions) {
            el._subscriptions.forEach(function (s) { return s.unsubscribe(); });
        }
    },
    attachFuelElementToNode: function (node, fuelElement) {
        // This make circular references between DOMElement and FuelElement,
        // but all disposable FuelElement will cleanup at stem and all references will be cut off.
        // So, this circular ref does'nt make leaks.
        node[DOM_LINK] = fuelElement;
    },
    detachFuelElementFromNode: function (node) {
        node[DOM_LINK] = null;
    },
    getFuelElementFromNode: function (el) {
        if (el[DOM_LINK]) {
            return el[DOM_LINK];
        }
        return null;
    },
    isFuelElement: function (fuelElement) {
        return !!fuelElement && util_1.isDefined(fuelElement._flags) && (fuelElement._flags & 1 /* FUEL_ELEMENT */) === 1 /* FUEL_ELEMENT */;
    },
    isDisposed: function (fuelElement) {
        return (fuelElement._flags & 2 /* DISPOSED */) === 2 /* DISPOSED */;
    },
    setDisposed: function (fuelElement) {
        fuelElement._flags |= 2 /* DISPOSED */;
    },
    isTextNode: function (fuelElement) {
        return !!fuelElement && (fuelElement._flags & 64 /* TEXT */) === 64 /* TEXT */;
    },
    getTextValueOf: function (fuelElement) {
        return fuelElement.props.value;
    },
    getComponentRenderedTree: function (fuelElement) {
        return fuelElement._componentRenderedElementTreeCache;
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
        var instance;
        var result = fuelElement;
        while (isComponent(result)) {
            result = result._componentRenderedElementTreeCache;
        }
        return result;
    },
    initFuelElementBits: function (type) {
        var isFn = isFunction(type);
        return 1 /* FUEL_ELEMENT */ |
            (isFn && isFunction(type['prototype'].render) ? 4 /* COMPONENT */ : isFn ? 8 /* STATELESS */ : type === FRAGMENT_NAME ? 32 /* FRAGMENT */ : type === TEXT_NAME ? 64 /* TEXT */ : 16 /* TAG */);
    },
    instantiateComponent: function (context, fuelElement, createStem) {
        var props = fuelElement.props;
        var attrs = fuelElement.props;
        if (exports.FuelElementView.isStatelessComponent(fuelElement)) {
            return [fuelElement.type(attrs, context), context];
        }
        if (exports.FuelElementView.isComponentClass(fuelElement)) {
            var instance_1 = fuelElement._componentInstance;
            var callReceiveHook = !!instance_1;
            var oldAttrs = void 0;
            if (!instance_1) {
                // If element is component, We set stem to this FuelElement.
                fuelElement._stem = createStem();
                instance_1 = fuelElement._componentInstance = new fuelElement.type(attrs, context);
                oldAttrs = {};
            }
            else {
                if (instance_1._context) {
                    instance_1._context = context;
                }
                oldAttrs = instance_1._props;
            }
            instance_1[exports.INSTANCE_ELEMENT_SYM] = fuelElement;
            var newContext = util_1.merge(context, instance_1.getChildContext());
            if (instance_1 && fuelElement._componentRenderedElementTreeCache &&
                ((!util_1.keyList(oldAttrs).length && !util_1.keyList(attrs).length && !instance_1._state) || !instance_1.shouldComponentUpdate(attrs, oldAttrs))) {
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
    toStringTree: function (el, enableChecksum) {
        var value;
        var context = {};
        if (isTextNode(el)) {
            return getTextValueOf(el);
        }
        else {
            while (isComponent(el)) {
                _a = exports.FuelElementView.instantiateComponent(context, el, function () { return ({}); }), value = _a[0], context = _a[1];
            }
            if (!value) {
                return '';
            }
        }
        var attrs = [];
        for (var key in this) {
            var value_1 = this[key];
            if (value_1 !== null) {
                if (type_1.CONVERSATION_TABLE[key]) {
                    key = type_1.CONVERSATION_TABLE[key];
                }
                attrs.push(key + "=\"" + value_1 + "\"");
            }
        }
        if (enableChecksum) {
            attrs.unshift("data-fuelchecksum=" + el._flags);
        }
        return "<" + value.type + (attrs.length ? (' ' + attrs.join(' ')) : '') + ">" + el.children.map(function (child) { return exports.FuelElementView.toStringTree(child, enableChecksum); }).join('') + "</" + value.type + ">";
        var _a;
    },
    createDomElement: function (rootElement, fuelElement, createStem) {
        if (!!fuelElement.dom) {
            return fuelElement.dom;
        }
        else if (isTextNode(fuelElement)) {
            return fuelElement.dom = domops_1.domOps.newTextNode(getTextValueOf(fuelElement));
        }
        else if (isFragment(fuelElement)) {
            return fuelElement.dom = domops_1.domOps.newFragment();
        }
        var props = fuelElement.props, type = fuelElement.type;
        var tagName = exports.FuelElementView.tagNameOf(fuelElement);
        var dom = fuelElement.dom = domops_1.domOps.newElement(tagName);
        var isScoped = false;
        var keys = util_1.keyList(props);
        for (var i = 0, len = keys.length; i < len; ++i) {
            var name_1 = keys[i];
            if (name_1 === 'children' || name_1 === 'key') {
                continue;
            }
            var value = props[name_1];
            if (type_1.DOMEvents[name_1]) {
                exports.FuelElementView.addEvent(rootElement, fuelElement, name_1, value);
                continue;
            }
            else if (name_1 === 'checked' || name_1 === 'selected') {
                booleanAttr(dom, name_1, value);
                continue;
            }
            else if (name_1 === 'scoped') {
                isScoped = true;
            }
            else if (value && ((value.isObservable || value.subscribe)) && isScoped) {
                makeStem(fuelElement, name_1, value, createStem);
                continue;
            }
            else if (name_1 === 'style') {
                for (var style in value) {
                    node_1.setStyle(dom, style, value[style]);
                }
                continue;
            }
            else if (name_1 === 'ref') {
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
            if (name_1 === 'htmlFor') {
                name_1 = 'for';
            }
            util_1.invariant(!type_1.DOMAttributes[name_1] && name_1.indexOf('data-') === -1, name_1 + " is not a valid dom attributes.");
            dom[name_1] = value;
        }
        return dom;
    }
};
var isComponent = exports.FuelElementView.isComponent, isStatelessComponent = exports.FuelElementView.isStatelessComponent, isComponentClass = exports.FuelElementView.isComponentClass, isTextNode = exports.FuelElementView.isTextNode, isFuelElement = exports.FuelElementView.isFuelElement, isFragment = exports.FuelElementView.isFragment, getTextValueOf = exports.FuelElementView.getTextValueOf, initFuelElementBits = exports.FuelElementView.initFuelElementBits;
function booleanAttr(el, name, value) {
    if (value) {
        el[name] = name;
    }
    else {
        el.removeAttribute(name);
    }
}
function cloneElement(fuelElement, props, children) {
    if (props === void 0) { props = {}; }
    if (children === void 0) { children = fuelElement.children; }
    util_1.invariant(!exports.FuelElementView.isFuelElement(fuelElement), "cloneElement only clonable FuelElement but got = " + fuelElement);
    var el = makeFuelElement(fuelElement.type, fuelElement.key, util_1.merge(fuelElement.props, props), children);
    el._stem = fuelElement._stem;
    el._componentInstance = fuelElement._componentInstance;
    el._ownerElement = fuelElement._ownerElement;
    el._flags = fuelElement._flags;
    return el;
}
exports.cloneElement = cloneElement;
/**
 * Create text representation.
 */
function createTextNode(child) {
    return makeFuelElement(TEXT_NAME, null, { value: child });
}
exports.createTextNode = createTextNode;
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
var FRAGMENT_NAME = 'SYNTHETIC_FRAGMENT';
var TEXT_NAME = 'SYNTHETIC_TEXT';
var FuelElementImpl = (function () {
    function FuelElementImpl(type, key, props, children) {
        if (key === void 0) { key = null; }
        if (children === void 0) { children = []; }
        this.type = type;
        this.key = key;
        this.props = props;
        this.children = children;
        this.dom = null;
        this._ownerElement = null;
        this._flags = initFuelElementBits(this.type);
        this._stem = null;
        this._componentInstance = null;
        this._componentRenderedElementTreeCache = null;
        this._subscriptions = null;
    }
    return FuelElementImpl;
}());
function makeFuelElement(type, key, props, children) {
    if (key === void 0) { key = null; }
    if (children === void 0) { children = []; }
    return new FuelElementImpl(type, key, props, children);
}
exports.makeFuelElement = makeFuelElement;
function makeFragment(children) {
    var ret = makeFuelElement(FRAGMENT_NAME, null, {}, children);
    return ret;
}
exports.makeFragment = makeFragment;
exports.FLY_WEIGHT_ELEMENT_A = createTextNode('');
exports.FLY_WEIGHT_ELEMENT_B = createTextNode('');
exports.FLY_WEIGHT_FRAGMENT_A = makeFragment([]);
exports.FLY_WEIGHT_FRAGMENT_B = makeFragment([]);
function wrapNode(parent, value, wrapTarget, wrapFragment) {
    if (value === null) {
        return null;
    }
    if (!isFragment(parent) && Array.isArray(value)) {
        wrapFragment.key = null;
        wrapFragment.dom = parent ? parent.dom : null;
        wrapFragment.children = value;
        return wrapFragment;
    }
    else if (!isFuelElement(value)) {
        wrapTarget.key = null;
        wrapTarget.dom = null;
        wrapTarget.props['value'] = "" + value;
        return wrapTarget;
    }
    else
        return value;
}
exports.wrapNode = wrapNode;
