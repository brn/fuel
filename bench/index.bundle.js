(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fuel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
var benchmark = _dereq_(5);
var fueldom_1 = _dereq_(2);
var NAME = 'Fuel';
var VERSION = '0.1.2';
function renderTree(nodes) {
    var children = [];
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.children !== null) {
            children.push((fueldom_1.React.createElement("div", { key: n.key }, renderTree(n.children))));
        }
        else {
            children.push((fueldom_1.React.createElement("span", { key: n.key }, n.key)));
        }
    }
    return children;
}
function BenchmarkImpl(container, a, b) {
    this.container = container;
    this.a = a;
    this.b = b;
}
BenchmarkImpl.prototype.setUp = function () {
};
BenchmarkImpl.prototype.tearDown = function () {
    fueldom_1.Fuel.unmountComponentAtNode(this.container);
};
BenchmarkImpl.prototype.render = function () {
    fueldom_1.FuelDOM.render(fueldom_1.React.createElement("div", null, renderTree(this.a)), this.container);
};
BenchmarkImpl.prototype.update = function () {
    fueldom_1.FuelDOM.render(fueldom_1.React.createElement("div", null, renderTree(this.b)), this.container);
};
document.addEventListener('DOMContentLoaded', function (e) {
    benchmark(NAME, VERSION, BenchmarkImpl);
}, false);

},{"2":2,"5":5}],2:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fuel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
var element_1 = _dereq_(4);
var util_1 = _dereq_(18);
function compare(valueA, valueB) {
    if (valueA === null) {
        if (valueB || valueB === undefined) {
            return false;
        }
        return true;
    }
    var typeA = util_1.typeOf(valueA);
    var typeB = util_1.typeOf(valueB);
    if (typeA === 'number' && !isFinite(valueA)) {
        if (isFinite(valueB)) {
            return false;
        }
        if (valueA === Infinity) {
            if (valueB !== Infinity) {
                return false;
            }
        }
        return true;
    }
    if (typeA === 'date' && typeB === 'date') {
        return valueA.toJSON() === valueB.toJSON();
    }
    else if (typeA === 'regexp' && typeB === 'regexp') {
        return valueA.toString() === valueB.toString();
    }
    return valueA === valueB;
}
exports.compare = compare;
function isStateUpdated(prev, next) {
    var prevType = util_1.typeOf(prev);
    var nextType = util_1.typeOf(next);
    if (prevType !== nextType) {
        return false;
    }
    if (prevType === nextType) {
        return true;
    }
    if (prevType === 'array') {
        var len = prev.length > next.length ? prev.length : next.length;
        for (var i = 0; i < len; i++) {
            if (!compare(prev[i], next[i])) {
                return false;
            }
        }
        return false;
    }
    else if (prevType === 'object') {
        var prevKeys = util_1.keyList(prev);
        var nextKeys = util_1.keyList(next);
        var prevLen = prevKeys.length;
        var nextLen = nextKeys.length;
        if (prevLen !== nextLen) {
            return false;
        }
        var len = prevLen > nextLen ? prevLen : nextLen;
        for (var i = 0; i < len; i++) {
            var pv = prev[prevKeys[i]];
            var nv = next[nextKeys[i]];
            if (!compare(pv, nv)) {
                return false;
            }
        }
        return true;
    }
    return compare(prev, next);
}
exports.isStateUpdated = isStateUpdated;
function compareStyle(prev, next) {
    var diff = {};
    var unchanged = {};
    var count = 0;
    if (next === prev) {
        return [diff, 0];
    }
    for (var name_1 in next) {
        var value = next[name_1];
        if (!(name_1 in prev) || !compare(prev[name_1], value)) {
            diff[name_1] = value;
            count++;
        }
        else {
            unchanged[name_1] = 1;
        }
    }
    var oldStyles = util_1.keyList(prev);
    for (var i = 0, len = oldStyles.length; i < len; i++) {
        if (!diff[oldStyles[i]] && !unchanged[oldStyles[i]]) {
            diff[oldStyles[i]] = '';
            count++;
        }
    }
    return [diff, count];
}
exports.compareStyle = compareStyle;
var stripComponent = element_1.FuelElementView.stripComponent, isTextNode = element_1.FuelElementView.isTextNode, getTextValueOf = element_1.FuelElementView.getTextValueOf;
function diff(context, index, move, parent, oldElement, newElement, patchOps) {
    var isOnlyOneChild = parent ? parent.children.length === 1 : false;
    var isNewElementTextNode = isTextNode(newElement);
    var isOldElementTextNode = isTextNode(oldElement);
    if (move !== 0 /* NONE */) {
        patchOps.move(index, move, oldElement);
    }
    if (oldElement === null && newElement) {
        if (isNewElementTextNode && isOnlyOneChild) {
            patchOps.setText(parent, newElement);
            return 3 /* SKIP_CURRENT_FORESET */;
        }
        else if (isOnlyOneChild) {
            patchOps.removeChildren(parent);
            patchOps.append(context, parent, newElement);
            return 3 /* SKIP_CURRENT_FORESET */;
        }
        else {
            patchOps.insert(index, context, parent, newElement);
        }
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (newElement === null && oldElement) {
        patchOps.remove(index, parent, oldElement);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (isOldElementTextNode && isNewElementTextNode) {
        if (getTextValueOf(oldElement) !== getTextValueOf(newElement)) {
            patchOps.updateText(index, parent, newElement);
        }
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (oldElement.type !== newElement.type) {
        patchOps.replace(index, parent, newElement, oldElement, context);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (!isNewElementTextNode) {
        patchOps.update(newElement, oldElement);
    }
    if ((newElement && newElement.children.length > 0) && (oldElement === null || oldElement.children.length === 0)) {
        patchOps.createChildren(context, newElement);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    else if (newElement && newElement.children.length === 0 && oldElement && oldElement.children.length > 0) {
        patchOps.removeChildren(newElement);
        return 2 /* SKIP_CURRENT_CHILDREN */;
    }
    return 1 /* CONTINUE */;
}
exports.diff = diff;

},{"18":18,"4":4}],2:[function(_dereq_,module,exports){
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
var stem_1 = _dereq_(15);
var element_1 = _dereq_(4);
var util_1 = _dereq_(18);
var attachFuelElementToNode = element_1.FuelElementView.attachFuelElementToNode;
exports.FuelDOM = {
    render: function (element, firstNode, cb) {
        if (cb === void 0) { cb = function (dom) { }; }
        var display = firstNode['style'].display;
        firstNode['style'].display = 'none';
        util_1.invariant(element.props.ref, 'Can\'t declare ref props outside of Component');
        util_1.invariant(!firstNode || firstNode.nodeType !== 1, "FuelDOM.render only accept HTMLElement node. but got " + firstNode);
        var oldElement = element_1.FuelElementView.getFuelElementFromNode(firstNode);
        if (oldElement) {
            element._stem = oldElement._stem;
        }
        if (!element._stem) {
            element._stem = new stem_1.FuelStem();
        }
        attachFuelElementToNode(firstNode, element);
        element._ownerElement = element;
        element._stem.render(element, function (root) {
            firstNode.appendChild(root);
            firstNode['style'].display = display;
            cb && cb(firstNode['firstElementChild']);
        });
    }
};
exports.ReactDOM = exports.FuelDOM;

},{"15":15,"18":18,"4":4}],3:[function(_dereq_,module,exports){
(function (__DEBUG__){
/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = _dereq_(14);
var DOM_NODE_CACHE = {};
var use = node_1.NodeRecycler.use;
var _id = 0;
exports.domOps = {
    resetId: function () { _id = 0; },
    updateId: function () { _id++; },
    newElement: function (tagName) {
        var node = use(tagName);
        if (!node) {
            if (!(node = DOM_NODE_CACHE[tagName])) {
                node = DOM_NODE_CACHE[tagName] = document.createElement(tagName);
            }
            node = node.cloneNode(false);
        }
        if (__DEBUG__) {
            node.setAttribute('data-id', "" + _id);
        }
        return node;
    },
    newTextNode: function (text) {
        return document.createTextNode(text);
    },
    newFragment: function () {
        return document.createDocumentFragment();
    }
};

}).call(this,true)

},{"14":14}],4:[function(_dereq_,module,exports){
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
var type_1 = _dereq_(17);
var node_1 = _dereq_(9);
var util_1 = _dereq_(18);
var event_1 = _dereq_(5);
var domops_1 = _dereq_(3);
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
function makeFuelElement(type, key, props, children) {
    if (key === void 0) { key = null; }
    if (children === void 0) { children = []; }
    var isFn = isFunction(type);
    return {
        type: type,
        key: key,
        props: props,
        children: children,
        dom: null,
        _ownerElement: null,
        _flags: initFuelElementBits(type),
        _stem: null,
        _componentInstance: null,
        _componentRenderedElementTreeCache: null,
        _subscriptions: null
    };
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

},{"17":17,"18":18,"3":3,"5":5,"9":9}],5:[function(_dereq_,module,exports){
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
var util_1 = _dereq_(18);
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

},{"18":18}],6:[function(_dereq_,module,exports){
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
function makeForest(parent, elements) {
    return {
        parent: parent,
        elements: elements
    };
}
exports.makeForest = makeForest;
exports.FORESET_SENTINEL = Object.freeze(makeForest(null, []));

},{}],7:[function(_dereq_,module,exports){
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = _dereq_(4);
var element_2 = _dereq_(13);
var util_1 = _dereq_(18);
var difference_1 = _dereq_(1);
var VALID_TYPES = { 'string': 1, 'function': 1 };
var ComponentImpl = (function () {
    function ComponentImpl(_props, _context) {
        if (_props === void 0) { _props = {}; }
        if (_context === void 0) { _context = {}; }
        this._props = _props;
        this._context = _context;
        this.refs = {};
        this['_componentRenderedElementTreeCache'] = null;
    }
    Object.defineProperty(ComponentImpl.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentImpl.prototype, "props", {
        get: function () { return this._props; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentImpl.prototype, "context", {
        get: function () { return this._context; },
        enumerable: true,
        configurable: true
    });
    ComponentImpl.prototype.componentWillUnmount = function () { };
    ComponentImpl.prototype.componentWillMount = function () { };
    ComponentImpl.prototype.componentDidMount = function () { };
    ComponentImpl.prototype.componentWillUpdate = function () { };
    ComponentImpl.prototype.componentDidUpdate = function () { };
    ComponentImpl.prototype.componentWillReceiveProps = function (props) { };
    ComponentImpl.prototype.shouldComponentUpdate = function (nextProps, prevProps) { return true; };
    ComponentImpl.prototype.render = function () { return null; };
    ComponentImpl.prototype.getChildContext = function () { return {}; };
    ;
    /**
     * Will be rewrited after.
     */
    ComponentImpl.prototype.setState = function (state, cb) {
        if (typeof state === 'function') {
            var nextState = state(this._state, this._props);
            if (!difference_1.isStateUpdated(this._state, nextState)) {
                return;
            }
            this._state = nextState;
        }
        else {
            if (!difference_1.isStateUpdated(this._state, state)) {
                return;
            }
            this._state = util_1.merge(this._state, state);
        }
        this.forceUpdate(cb);
    };
    ComponentImpl.prototype.forceUpdate = function (cb) {
        this.componentWillUpdate();
        var newContext = util_1.merge(this.context || {}, this.getChildContext());
        var tree = this.render();
        var fuelElement = this[element_1.INSTANCE_ELEMENT_SYM];
        tree._componentInstance = this;
        tree._ownerElement = fuelElement;
        tree._stem = fuelElement._stem;
        fuelElement._stem.render(tree, function () {
            fuelElement._componentRenderedElementTreeCache = tree;
            cb && cb();
        }, newContext, false);
    };
    return ComponentImpl;
}());
exports.ComponentImpl = ComponentImpl;
var PureComponentImpl = (function (_super) {
    __extends(PureComponentImpl, _super);
    function PureComponentImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PureComponentImpl.prototype['shouldComponentUpdate'] = function (nextProps, prevProps) {
        for (var prop in nextProps) {
            if (!(prop in prevProps)) {
                return true;
            }
            if (prevProps[prop] !== nextProps[prop]) {
                return true;
            }
        }
        if (util_1.keyList(nextProps).length !== util_1.keyList(prevProps).length) {
            return true;
        }
        return false;
    };
    return PureComponentImpl;
}(ComponentImpl));
exports.PureComponentImpl = PureComponentImpl;
var isComponent = element_1.FuelElementView.isComponent;
var use = element_2.ElementRecycler.use;
var Fuel = (function () {
    function Fuel() {
    }
    Fuel.createElement = function (type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        util_1.invariant(!VALID_TYPES[typeof type], "Fuel element only accept one of 'string' or 'function' but got " + type);
        props = props || {};
        props.children = children;
        return use(type, props, children) || element_1.makeFuelElement(type, props.key, props, props.children);
    };
    Fuel.unmountComponentAtNode = function (el) {
        var fuelElement = element_1.FuelElementView.getFuelElementFromNode(el);
        if (fuelElement) {
            el.textContent = '';
            fuelElement._stem.unmountComponent(fuelElement);
            element_1.FuelElementView.detachFuelElementFromNode(el);
        }
    };
    return Fuel;
}());
/**
 * Base class of FuelComponent.
 */
Fuel.Component = ComponentImpl;
// React compatibility layer.
Fuel.PureComponent = PureComponentImpl;
Fuel.isValidElement = function (el) { return el ? element_1.FuelElementView.isFuelElement(el) : false; };
Fuel.cloneElement = element_1.cloneElement;
Fuel.createFactory = function (tag) { return function () { return Fuel.createElement(tag, {}); }; };
Fuel.Children = {
    map: function (children, cb) {
        return children ? children.map(cb) : [];
    },
    forEach: function (children, cb) {
        children && children.forEach(cb);
    },
    count: function (children) { return children ? children.length : 0; },
    toArray: function (children) { return children ? children : []; }
};
// Compatible with react.
Fuel.PropTypes = {};
exports.Fuel = Fuel;
'array bool func number object string symbol node'.split(' ').forEach(function (a) { return Fuel.PropTypes[a] = {}; });
'instanceOf oneOf, oneOfType, arrayOf objectOf shape'.split(' ').forEach(function (a) { return Fuel.PropTypes[a] = function () { return ({}); }; });
/**
 * Reactjs compatible definitions.
 * If you use typescript with tsx, import React namespace required.
 */
exports.React = Fuel;

},{"1":1,"13":13,"18":18,"4":4}],8:[function(_dereq_,module,exports){
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var fuel_1 = _dereq_(7);
exports.Fuel = fuel_1.Fuel;
exports.React = fuel_1.React;
__export(_dereq_(2));

},{"2":2,"7":7}],9:[function(_dereq_,module,exports){
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
exports.PX_CONVERTIONS = {
    'width': 1,
    'height': 1,
    'fontSize': 1,
    'lineHeight': 1,
    'strokeWidth': 1,
    'backgroundPositionX': 1,
    'borderBottomLeftRadius': 1,
    'borderBottomRightRadius': 1,
    'borderBottomWidth': 1,
    'borderImageWidth': 1,
    'borderLeftWidth': 1,
    'borderRightWidth': 1,
    'borderTopLeftRadius': 1,
    'borderTopRightRadius': 1,
    'borderTopWidth': 1,
    'borderWidth': 1,
    'columnWidth': 1,
    'columnRuleWidth': 1,
    'fontKerning': 1,
    'letterSpacing': 1,
    'margin': 1,
    'marginBottom': 1,
    'marginLeft': 1,
    'marginRight': 1,
    'marginTop': 1,
    'maxFontSize': 1,
    'maxHeight': 1,
    'maxWidth': 1,
    'minHeight': 1,
    'minWidth': 1,
    'padding': 1,
    'paddingBottom': 1,
    'paddingLeft': 1,
    'paddingRight': 1,
    'paddingTop': 1,
    'top': 1,
    'left': 1,
    'right': 1,
    'bottom': 1,
    'textHeight': 1,
    'textIndent': 1
};
function setStyle(el, name, value) {
    el.style[name] = typeof value === 'number' && exports.PX_CONVERTIONS[name] ? value + "px" : String(value);
}
exports.setStyle = setStyle;

},{}],10:[function(_dereq_,module,exports){
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
var difference_1 = _dereq_(1);
var element_1 = _dereq_(4);
var util_1 = _dereq_(18);
var forest_1 = _dereq_(6);
var isComponent = element_1.FuelElementView.isComponent, instantiateComponent = element_1.FuelElementView.instantiateComponent, getComponentRenderedTree = element_1.FuelElementView.getComponentRenderedTree, stripComponent = element_1.FuelElementView.stripComponent, isFuelElement = element_1.FuelElementView.isFuelElement, isFragment = element_1.FuelElementView.isFragment, isTextNode = element_1.FuelElementView.isTextNode, nameOf = element_1.FuelElementView.nameOf;
var wrap = element_1.wrapNode;
/**
 * Render Component of new tree and strip old tree component.
 * @param context Context object.
 * @param leftElement New vdom tree.
 * @param rightElement old vdom tree.
 * @param createStem Stem factory function.
 * @returns Array of [new-rendered-vdom-tree, old-rendered-vdom-tree, updated-context]
 */
function renderComponent(context, leftElement, rightElement, createStem) {
    while (isComponent(leftElement)) {
        _a = instantiateComponent(context, leftElement, createStem), leftElement = _a[0], context = _a[1];
    }
    if (isComponent(rightElement)) {
        rightElement = stripComponent(rightElement);
    }
    return [leftElement, rightElement, context];
    var _a;
}
/**
 * Create indices of key.
 * @param start Start index.
 * @param end End index.
 * @param elementList List of FuelElement.
 * @param isCheckKeyDuplication Whether check key duplication or not.
 * @returns Map of key and position.
 */
function makeKeyIndices(start, end, elementList, isCheckKeyDuplication) {
    var keyIndices = {};
    for (; start < end; start++) {
        var el = elementList[start];
        var key = el.key;
        if (isFuelElement(el) && key !== null && key !== undefined) {
            if (isCheckKeyDuplication) {
                util_1.invariant(keyIndices[key], "Duplicate key(" + key + ") found on " + nameOf(el) + ".");
            }
            keyIndices[key] = start;
        }
    }
    return keyIndices;
}
/**
 * Compare and patch two vdom tree.
 * Logic inspired by https://github.com/dfilatov/vidom
 * @param rootContext Context
 * @param nextElement New vdom tree.
 * @param prevElement Old vdom tree.
 * @param patchOps Patch operations.
 * @param createStem Stem factory function.
 * @param runtimeKeyCheck Whether check key duplication or not.
 */
function patch(rootContext, nextElement, prevElement, patchOps, createStem, runtimeKeyCheck) {
    if (runtimeKeyCheck === void 0) { runtimeKeyCheck = false; }
    var _a = renderComponent(rootContext, nextElement, prevElement, createStem), revealedNextElement = _a[0], revealedPrevElement = _a[1], context = _a[2];
    var cursor = 0;
    var currentNewTree = [forest_1.makeForest(null, [revealedNextElement])];
    var currentOldTree = [forest_1.makeForest(null, [revealedPrevElement])];
    var end = currentNewTree.length;
    var newRoot = [];
    var oldRoot = [];
    var rightIndicesToSkip = {};
    while (currentNewTree || currentOldTree) {
        var newItem = currentNewTree[cursor] || forest_1.FORESET_SENTINEL;
        var oldItem = currentOldTree[cursor] || forest_1.FORESET_SENTINEL;
        var leftElementList = newItem.elements;
        var rightElementList = oldItem.elements;
        var newTreeLen = leftElementList.length;
        var oldTreeLen = rightElementList.length;
        var parent_1 = newItem.parent;
        var keychecks = {};
        var leftLeftCursor = 0;
        var leftRightCursor = newTreeLen - 1;
        var rightLeftCursor = 0;
        var rightRightCursor = oldTreeLen - 1;
        var leftElement = leftElementList.length ? leftElementList[0] : null;
        var rightElement = rightElementList.length ? rightElementList[0] : null;
        var leftRightElement = leftElementList.length ? leftElementList[leftRightCursor] : null;
        var rightRightElement = rightElementList.length ? rightElementList[rightRightCursor] : null;
        var move = 0 /* NONE */;
        var keyIndices = null;
        var index = 0;
        var leftLeftElementKey = leftElement && leftElement.key ? leftElement.key : null;
        var leftRightElementKey = leftRightElement && leftRightElement.key ? leftRightElement.key : null;
        var rightLeftElementKey = rightElement && rightElement.key ? rightElement.key : null;
        var rightRightElementKey = rightRightElement && rightRightElement.key ? rightRightElement.key : null;
        while (leftRightCursor >= leftLeftCursor && rightRightCursor >= rightLeftCursor) {
            var move_1 = 0 /* NONE */;
            var matchType = 0;
            if (rightLeftCursor in rightIndicesToSkip) {
                matchType = 4 /* UPDATE_RIGHT_LEFT */;
            }
            else if (rightRightCursor in rightIndicesToSkip) {
                matchType = 8 /* UPDATE_RIGHT_RIGHT */;
            }
            else {
                var chosenNewElement = leftElement;
                var chosenOldElement = rightElement;
                if (leftLeftElementKey === rightLeftElementKey) {
                    // []...
                    // []...
                    index = leftLeftCursor;
                    matchType |= (1 /* UPDATE_LEFT_LEFT */ | 4 /* UPDATE_RIGHT_LEFT */);
                }
                else if (leftRightElementKey === rightRightElementKey) {
                    // ...[]
                    // ...[]
                    chosenNewElement = leftRightElement;
                    chosenOldElement = rightRightElement;
                    index = leftRightCursor;
                    matchType |= (2 /* UPDATE_LEFT_RIGHT */ | 8 /* UPDATE_RIGHT_RIGHT */);
                }
                else if (leftLeftElementKey !== null && leftLeftElementKey === rightRightElementKey) {
                    // []...
                    // ...[]
                    chosenOldElement = rightRightElement;
                    index = leftLeftCursor;
                    move_1 = 1 /* BEFORE */;
                    matchType |= (1 /* UPDATE_LEFT_LEFT */ | 8 /* UPDATE_RIGHT_RIGHT */);
                }
                else if (leftRightElementKey !== null && leftRightElementKey === rightLeftElementKey) {
                    //  ...[]
                    //  []...
                    chosenNewElement = leftRightElement;
                    index = leftRightCursor;
                    move_1 = 2 /* AFTER */;
                    matchType |= (2 /* UPDATE_LEFT_RIGHT */ | 4 /* UPDATE_RIGHT_LEFT */);
                }
                else if (leftLeftElementKey === null && rightLeftElementKey !== null) {
                    chosenOldElement = null;
                    matchType |= 1 /* UPDATE_LEFT_LEFT */;
                }
                else if (leftLeftElementKey !== null && rightLeftElementKey === null) {
                    chosenNewElement = null;
                    matchType |= 4 /* UPDATE_RIGHT_LEFT */;
                }
                else {
                    if (!keyIndices) {
                        keyIndices = makeKeyIndices(rightLeftCursor, rightRightCursor, rightElementList, runtimeKeyCheck);
                    }
                    if (leftLeftElementKey !== null) {
                        var index_1 = keyIndices[leftLeftElementKey];
                        if (index_1 !== undefined) {
                            rightIndicesToSkip[index_1] = true;
                            chosenOldElement = rightElementList[index_1];
                            move_1 = 1 /* BEFORE */;
                        }
                        else {
                            chosenOldElement = null;
                        }
                    }
                    index = leftLeftCursor;
                    matchType |= 1 /* UPDATE_LEFT_LEFT */;
                }
                if (runtimeKeyCheck) {
                    if (chosenNewElement) {
                        var newKey = chosenNewElement.key;
                        if (util_1.isDefined(newKey)) {
                            util_1.invariant(keychecks[newKey], "Duplicate key(" + newKey + ") found on " + nameOf(chosenNewElement) + ".");
                            keychecks[newKey] = 1;
                        }
                    }
                }
                var newElement = wrap(parent_1, chosenNewElement, element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A);
                var oldElement = wrap(parent_1, chosenOldElement, element_1.FLY_WEIGHT_ELEMENT_B, element_1.FLY_WEIGHT_FRAGMENT_B);
                // Clone old element.
                // If passed element was same as old tree (ex, this.props.children),
                // clone old element and clear _componentRenderedElementTreeCache to recall render method.
                if (!!newElement && !!newElement._componentRenderedElementTreeCache) {
                    newElement = element_1.cloneElement(newElement);
                    newElement._componentRenderedElementTreeCache = null;
                }
                _b = renderComponent(context, newElement, oldElement, createStem), newElement = _b[0], oldElement = _b[1], context = _b[2];
                if (newElement || oldElement) {
                    var nextOp = difference_1.diff(context, index, move_1, parent_1, oldElement, newElement, patchOps);
                    if (nextOp === 1 /* CONTINUE */) {
                        if (newElement) {
                            newRoot.push(forest_1.makeForest(!isFragment(newElement) ? newElement : parent_1 || null, newElement.children));
                        }
                        else {
                            newRoot.push(null);
                        }
                        if (oldElement) {
                            oldRoot.push(forest_1.makeForest(!isFragment(oldElement) ? oldElement : parent_1 || null, oldElement.children));
                        }
                        else {
                            oldRoot.push(null);
                        }
                    }
                    else if (nextOp === 3 /* SKIP_CURRENT_FORESET */) {
                        // Break loop because,
                        // new children length = 1,
                        // text node is newly created.
                        // If break loop, we need to set leftLeftCursor to right most index plus one,
                        // so in order not to operate insert or append after breaking loop.
                        // But rightLeftCursor will not change,
                        // because old element was cleand inenrText or innerHTML,
                        // this mean cleanup process is skipped,
                        // so we cleanup each elements.
                        leftLeftCursor = leftRightCursor + 1;
                        break;
                    }
                }
            }
            if ((matchType & 1 /* UPDATE_LEFT_LEFT */) === 1 /* UPDATE_LEFT_LEFT */) {
                if (++leftLeftCursor <= leftRightCursor) {
                    leftElement = leftElementList[leftLeftCursor];
                    leftLeftElementKey = leftElement ? leftElement.key : null;
                }
            }
            if ((matchType & 2 /* UPDATE_LEFT_RIGHT */) === 2 /* UPDATE_LEFT_RIGHT */) {
                if (--leftRightCursor >= leftLeftCursor) {
                    leftRightElement = leftElementList[leftRightCursor];
                    leftRightElementKey = leftRightElement ? leftRightElement.key : null;
                }
            }
            if ((matchType & 4 /* UPDATE_RIGHT_LEFT */) === 4 /* UPDATE_RIGHT_LEFT */) {
                if (++rightLeftCursor <= rightRightCursor) {
                    rightElement = rightElementList[rightLeftCursor];
                    rightLeftElementKey = rightElement ? rightElement.key : null;
                }
            }
            if ((matchType & 8 /* UPDATE_RIGHT_RIGHT */) === 8 /* UPDATE_RIGHT_RIGHT */) {
                if (--rightRightCursor >= rightLeftCursor) {
                    rightRightElement = rightElementList[rightRightCursor];
                    rightRightElementKey = rightRightElement ? rightRightElement.key : null;
                }
            }
        }
        while (rightLeftCursor <= rightRightCursor) {
            if (!rightIndicesToSkip[rightRightCursor]) {
                var oldElement = element_1.wrapNode(parent_1, rightElementList[rightLeftCursor], element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A);
                patchOps.remove(rightLeftCursor, parent_1, oldElement);
            }
            ++rightLeftCursor;
        }
        while (leftLeftCursor <= leftRightCursor) {
            var oldElement = void 0;
            var newElement = element_1.wrapNode(parent_1, leftElementList[leftLeftCursor], element_1.FLY_WEIGHT_ELEMENT_B, element_1.FLY_WEIGHT_FRAGMENT_A);
            _c = renderComponent(context, newElement, null, createStem), newElement = _c[0], oldElement = _c[1], context = _c[2];
            leftLeftCursor < newTreeLen - 1 ?
                patchOps.insert(leftLeftCursor, context, parent_1, newElement) :
                patchOps.append(context, parent_1, newElement);
            ++leftLeftCursor;
        }
        if (end === ++cursor) {
            cursor = 0;
            currentNewTree = newRoot.length ? newRoot : null;
            currentOldTree = oldRoot.length ? oldRoot : null;
            newRoot = [];
            oldRoot = [];
            var newLength = currentNewTree ? currentNewTree.length : 0;
            var oldLength = currentOldTree ? currentOldTree.length : 0;
            end = newLength > oldLength ? newLength : oldLength;
        }
    }
    patchOps.executeRemove();
    var _b, _c;
}
exports.patch = patch;

},{"1":1,"18":18,"4":4,"6":6}],11:[function(_dereq_,module,exports){
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
var type_1 = _dereq_(17);
var node_1 = _dereq_(9);
var tree_1 = _dereq_(16);
var element_1 = _dereq_(4);
var util_1 = _dereq_(18);
var collect_1 = _dereq_(12);
var domops_1 = _dereq_(3);
var difference_1 = _dereq_(1);
var getTextValueOf = element_1.FuelElementView.getTextValueOf, attachFuelElementToNode = element_1.FuelElementView.attachFuelElementToNode, invokeDidMount = element_1.FuelElementView.invokeDidMount, invokeDidUpdate = element_1.FuelElementView.invokeDidUpdate, invokeWillUnmount = element_1.FuelElementView.invokeWillUnmount, createDomElement = element_1.FuelElementView.createDomElement, isTextNode = element_1.FuelElementView.isTextNode, stripComponent = element_1.FuelElementView.stripComponent, setDisposed = element_1.FuelElementView.setDisposed, isFragment = element_1.FuelElementView.isFragment, getFuelElementFromNode = element_1.FuelElementView.getFuelElementFromNode;
var PatchOpsImpl = (function () {
    function PatchOpsImpl(createStem) {
        this.createStem = createStem;
        this.removes = [];
    }
    PatchOpsImpl.prototype.move = function (moveTo, moveType, oldElement) {
        var target = oldElement.dom.parentNode.childNodes[moveTo];
        if (moveType === 2 /* AFTER */) {
            target = target.nextElementSibling;
            if (!target) {
                oldElement.dom.parentNode.appendChild(oldElement.dom);
                return;
            }
        }
        oldElement.dom.parentNode.insertBefore(oldElement.dom, target);
    };
    PatchOpsImpl.prototype.replace = function (index, parent, newElement, oldElement, context) {
        invokeWillUnmount(oldElement);
        var target = parent.dom.childNodes[index];
        var isText = isTextNode(newElement);
        var tree;
        if (isText || !newElement.children.length) {
            if (isText && target.nodeType === 3) {
                target.nodeValue = getTextValueOf(newElement);
                return;
            }
            tree = createDomElement(parent._ownerElement, newElement, this.createStem);
        }
        else {
            tree = tree_1.fastCreateDomTree(context, newElement, this.createStem);
        }
        if (target && !isFragment(newElement)) {
            parent.dom.replaceChild(tree, target);
            collect_1.collect(oldElement, true);
            invokeDidMount(newElement);
        }
    };
    PatchOpsImpl.prototype.update = function (newElement, oldElement) {
        newElement.dom = oldElement.dom;
        var newProps = newElement.props;
        var oldProps = oldElement.props;
        var newPropsKeys = util_1.keyList(newProps);
        var oldPropsKeys = util_1.keyList(oldProps);
        var newPropsLength = newPropsKeys.length;
        var oldPropsLength = oldPropsKeys.length;
        var isSkip = newPropsLength === oldPropsLength && ((newPropsLength === 2 && newPropsKeys[1] === 'key') || newPropsLength === 1);
        if (!isSkip) {
            var keys = oldPropsLength > newPropsLength ? oldPropsKeys : newPropsKeys;
            for (var i = 0, len = oldPropsLength > newPropsLength ? oldPropsLength : newPropsLength; i < len; i++) {
                var key = keys[i];
                if (key === 'children' || key === 'key') {
                    continue;
                }
                if (type_1.DOMEvents[key]) {
                    var lowerKey = key.slice(2).toLowerCase();
                    var rootElement = stripComponent(newElement._ownerElement);
                    if (oldProps[key]) {
                        newElement._ownerElement._stem.getEventHandler().replaceEvent(oldElement.dom, lowerKey, newProps[key]);
                    }
                    else {
                        newElement._ownerElement._stem.getEventHandler().addEvent(rootElement.dom, oldElement.dom, lowerKey, oldProps[key]);
                    }
                }
                else if (key === 'style') {
                    var _a = difference_1.compareStyle(oldProps[key] || {}, newProps[key] || {}), styleDiff = _a[0], count = _a[1];
                    if (count) {
                        for (var style in styleDiff) {
                            node_1.setStyle(oldElement.dom, style, styleDiff[style]);
                        }
                    }
                }
                else if (!newProps[key]) {
                    oldElement.dom.removeAttribute(key);
                }
                else if (!oldProps[key]) {
                    oldElement.dom[key] = newProps[key];
                }
                else {
                    if (!difference_1.compare(newProps[key], oldProps[key])) {
                        oldElement.dom[key] = newProps[key];
                    }
                }
            }
        }
        attachFuelElementToNode(newElement.dom, newElement);
        invokeDidUpdate(newElement);
    };
    PatchOpsImpl.prototype.insert = function (index, context, parent, newElement) {
        var tree;
        if (isTextNode(newElement) || !newElement.children.length) {
            tree = createDomElement(parent._ownerElement, newElement, this.createStem);
        }
        else {
            tree = tree_1.fastCreateDomTree(context, newElement, this.createStem);
        }
        if (parent && parent.dom && !isFragment(newElement)) {
            var target = parent.dom.childNodes[index];
            parent.dom.insertBefore(tree, target);
            invokeDidMount(newElement);
        }
    };
    PatchOpsImpl.prototype.append = function (context, parent, newElement) {
        var tree;
        var isText = isTextNode(newElement);
        var hasParentDom = parent && parent.dom;
        if (isText || !newElement.children.length) {
            if (isText && hasParentDom && parent.dom.lastChild.nodeType === 3) {
                parent.dom.lastChild.nodeValue = getTextValueOf(newElement);
                return;
            }
            tree = createDomElement(parent._ownerElement, newElement, this.createStem);
        }
        else {
            tree = tree_1.fastCreateDomTree(context, newElement, this.createStem);
        }
        if (hasParentDom && !isFragment(newElement)) {
            var parentNode = tree.parentNode;
            if (parentNode && parentNode !== parent) {
                parent.dom.appendChild(tree);
            }
            invokeDidMount(newElement);
        }
    };
    PatchOpsImpl.prototype.remove = function (index, parent, oldElement) {
        invokeWillUnmount(oldElement);
        if (parent.dom) {
            var el = parent.dom.childNodes[index];
            if (el) {
                this.removes.push([oldElement, el]);
            }
        }
        if (!isFragment(oldElement) && !isTextNode(oldElement)) {
            setDisposed(oldElement);
        }
        oldElement._stem = null;
    };
    PatchOpsImpl.prototype.updateText = function (index, parent, newElement) {
        var node = parent.dom.childNodes[index];
        var value = element_1.FuelElementView.getTextValueOf(newElement);
        if (node) {
            if (node.nodeType === 3) {
                node.nodeValue = value;
            }
            else {
                parent.dom.replaceChild(domops_1.domOps.newTextNode(value), node);
            }
        }
        else {
            parent.dom.appendChild(domops_1.domOps.newTextNode(value));
        }
    };
    PatchOpsImpl.prototype.setText = function (parent, newElement) {
        parent.dom.textContent = getTextValueOf(newElement);
        console.log(parent.dom.parentNode.parentNode.parentNode);
    };
    PatchOpsImpl.prototype.createChildren = function (context, newElement) {
        tree_1.fastCreateDomTree(context, newElement, this.createStem);
    };
    PatchOpsImpl.prototype.removeChildren = function (el) {
        el.dom.textContent = '';
    };
    PatchOpsImpl.prototype.executeRemove = function () {
        for (var i = 0, len = this.removes.length; i < len; i++) {
            var _a = this.removes[i], el = _a[0], dom = _a[1];
            if (dom.parentNode) {
                dom.parentNode.removeChild(dom);
                collect_1.collect(el, true);
            }
        }
        this.removes = [];
    };
    return PatchOpsImpl;
}());
exports.PatchOpsImpl = PatchOpsImpl;

},{"1":1,"12":12,"16":16,"17":17,"18":18,"3":3,"4":4,"9":9}],12:[function(_dereq_,module,exports){
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
var element_1 = _dereq_(4);
var element_2 = _dereq_(13);
var node_1 = _dereq_(14);
var wrap = element_1.wrapNode;
var isTextNode = element_1.FuelElementView.isTextNode, isFragment = element_1.FuelElementView.isFragment, isDisposed = element_1.FuelElementView.isDisposed, cleanupElement = element_1.FuelElementView.cleanupElement, setDisposed = element_1.FuelElementView.setDisposed, stripComponent = element_1.FuelElementView.stripComponent;
var recycleNode = node_1.NodeRecycler.recycle;
var recycleElement = element_2.ElementRecycler.recycle;
function collect(fuelElement, all, cb) {
    doCollect(fuelElement, false, all);
    cb && cb();
}
exports.collect = collect;
/**
 * Collect and cleanup element.
 */
function doCollect(fuelElement, isParentDisposed, all) {
    var element = wrap(null, stripComponent(fuelElement), element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A);
    if (!element || isTextNode(element)) {
        return;
    }
    if (isParentDisposed) {
        setDisposed(element);
    }
    var children = element.children;
    var isDisp = isDisposed(element);
    var dom = element.dom;
    if (!isFragment(element) && (all || isDisp)) {
        if (dom && dom.childNodes.length) {
            dom.textContent = '';
        }
        recycleNode(element);
        cleanupElement(element);
        recycleElement(element);
    }
    var length = children.length;
    var cursor = 0;
    while (length > cursor) {
        doCollect(children[cursor++], isDisp, all);
    }
}

},{"13":13,"14":14,"4":4}],13:[function(_dereq_,module,exports){
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
var element_1 = _dereq_(4);
var wrap = element_1.wrapNode;
var initFuelElementBits = element_1.FuelElementView.initFuelElementBits;
var RECYCLED_ELEMENT = [];
var recycledElementCount = 0;
exports.ElementRecycler = {
    recycle: function (el) {
        if (!el || (el._flags & 128 /* RECYCLED */) === 128 /* RECYCLED */) {
            return;
        }
        if (recycledElementCount === 500) {
            return;
        }
        el._componentInstance =
            el._componentRenderedElementTreeCache =
                el._stem =
                    el._subscriptions =
                        el._ownerElement =
                            el.children =
                                el.props =
                                    el.key =
                                        el.dom =
                                            el.type = null;
        el._flags = 128 /* RECYCLED */;
        RECYCLED_ELEMENT[recycledElementCount++] = el;
    },
    use: function (type, props, children) {
        if (recycledElementCount > 0) {
            var el = RECYCLED_ELEMENT[--recycledElementCount];
            RECYCLED_ELEMENT[recycledElementCount] = null;
            el.props = props;
            el.key = props.key;
            el.children = children;
            el.type = type;
            el._flags = initFuelElementBits(type);
            return el;
        }
        return null;
    }
};

},{"4":4}],14:[function(_dereq_,module,exports){
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
var util_1 = _dereq_(18);
var recycled = 0;
var NODE_RECYCLE_INDICES = {};
exports.NodeRecycler = {
    recycle: function (element) {
        if (recycled === 500) {
            return;
        }
        var dom = element.dom;
        if (dom) {
            var nodeName = element.type;
            if (!NODE_RECYCLE_INDICES[nodeName]) {
                NODE_RECYCLE_INDICES[nodeName] = { count: 0, nodes: [] };
            }
            var item = NODE_RECYCLE_INDICES[nodeName];
            var keys = util_1.keyList(element.props);
            for (var i = 0, len = keys.length; i < len; ++i) {
                var key = keys[i];
                if (key !== 'key' && key !== 'children') {
                    if (key === 'className') {
                        key = 'class';
                    }
                    dom.removeAttribute(key);
                }
            }
            item.nodes[item.count++] = dom;
            ++recycled;
        }
    },
    use: function (name) {
        var item = NODE_RECYCLE_INDICES[name];
        if (item && item.count > 0) {
            var node = item.nodes[--item.count];
            item.nodes[item.count] = null;
            node['__recycled'] = 0;
            --recycled;
            return node || null;
        }
        return null;
    }
};

},{"18":18}],15:[function(_dereq_,module,exports){
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
var tree_1 = _dereq_(16);
var collect_1 = _dereq_(12);
var patch_1 = _dereq_(10);
var domops_1 = _dereq_(3);
var patchops_1 = _dereq_(11);
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

},{"10":10,"11":11,"12":12,"16":16,"3":3}],16:[function(_dereq_,module,exports){
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
var element_1 = _dereq_(4);
var domops_1 = _dereq_(3);
var isComponent = element_1.FuelElementView.isComponent, createDomElement = element_1.FuelElementView.createDomElement, instantiateComponent = element_1.FuelElementView.instantiateComponent, isFuelElement = element_1.FuelElementView.isFuelElement, isFragment = element_1.FuelElementView.isFragment, isTextNode = element_1.FuelElementView.isTextNode, isDisposed = element_1.FuelElementView.isDisposed, getTextValueOf = element_1.FuelElementView.getTextValueOf;
var wrap = element_1.wrapNode;
function fastCreateDomTree(context, element, createStem, fragment) {
    if (fragment === void 0) { fragment = null; }
    while (isComponent(element)) {
        _a = instantiateComponent(context, element, createStem), element = _a[0], context = _a[1];
    }
    if (element) {
        var dom = createDomElement(element._ownerElement, element, createStem);
        var children = element.children;
        var length_1 = children.length;
        var flags = 0 | 0;
        var cursor = 0;
        if (fragment) {
            fragment.appendChild(dom);
        }
        while (length_1 > cursor) {
            var el = children[cursor++];
            if (isFuelElement(el) || Array.isArray(el)) {
                flags = 2 /* ELEMENT_INSERTED */;
                dom.appendChild(fastCreateDomTree(context, wrap(null, el, element_1.FLY_WEIGHT_ELEMENT_A, element_1.FLY_WEIGHT_FRAGMENT_A), createStem));
            }
            else if ((flags & 1 /* LAST_NODE_IS_TEXT */) > 0) {
                dom.lastChild.nodeValue += "" + el;
            }
            else if ((flags & 2 /* ELEMENT_INSERTED */) === 0) {
                flags |= 1 /* LAST_NODE_IS_TEXT */;
                dom.textContent += "" + el;
            }
            else {
                flags |= 1 /* LAST_NODE_IS_TEXT */;
                dom.appendChild(domops_1.domOps.newTextNode("" + el));
            }
        }
    }
    else {
        return domops_1.domOps.newFragment();
    }
    return fragment || element.dom;
    var _a;
}
exports.fastCreateDomTree = fastCreateDomTree;

},{"3":3,"4":4}],17:[function(_dereq_,module,exports){
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
exports.CONVERSATION_TABLE = {
    'className': 'class'
};
var Bytes;
(function (Bytes) {
    Bytes[Bytes["FUEL_ELEMENT_MARK"] = (Math.random() * 10000) << 1] = "FUEL_ELEMENT_MARK";
})(Bytes = exports.Bytes || (exports.Bytes = {}));
function eventmap(str) {
    var _ = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _[_i - 1] = arguments[_i];
    }
    return str[0].split(' ').reduce(function (prev, next) {
        var key = "on" + next;
        prev[key] = true;
        return prev;
    }, {});
}
function attrmap(str) {
    var _ = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _[_i - 1] = arguments[_i];
    }
    return str[0].split(' ').reduce(function (prev, next) {
        prev[next] = true;
        return prev;
    }, {});
}
exports.DOMEvents = (_a = ["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"], _a.raw = ["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"], eventmap(_a));
exports.DOMAttributes = (_b = ["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"], _b.raw = ["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"], attrmap(_b));
var _a, _b;

},{}],18:[function(_dereq_,module,exports){
(function (global){
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
var g = typeof global === 'object' ? global : typeof window === 'object' ? window : this || {};
exports.Symbol = typeof g.Symbol === 'function' ? g.Symbol : (function () {
    var map = {};
    function Symbol(sym) {
        return "@@" + sym;
    }
    Symbol['for'] = function (sym) {
        if (map[sym]) {
            return map[sym];
        }
        return map[sym] = Symbol(sym);
    };
})();
function invariant(condition, message, warn) {
    if (warn === void 0) { warn = false; }
    if (condition) {
        var m = typeof message === 'function' ? message() : message;
        if (!warn) {
            throw new Error(m);
        }
        else {
            console.warn(m);
        }
    }
}
exports.invariant = invariant;
function merge(a, b) {
    var ret = {};
    for (var key in a) {
        ret[key] = a[key];
    }
    for (var key in b) {
        ret[key] = b[key];
    }
    return ret;
}
exports.merge = merge;
var toString = Object.prototype.toString;
var oReg = /\[object ([^\]]+)\]/;
function typeOf(a) {
    return toString.call(a).match(oReg)[1].toLowerCase();
}
exports.typeOf = typeOf;
var HAS_REQUEST_ANIMATION_FRAME = typeof g.requestAnimationFrame === 'function';
exports.requestAnimationFrame = HAS_REQUEST_ANIMATION_FRAME ? function (cb) { return g.requestAnimationFrame(cb); } : function (cb) { return setTimeout(cb, 60); };
var HAS_REQUEST_IDLE_CALLBACK = typeof g['requestIdleCallback'] === 'function';
exports.requestIdleCallback = HAS_REQUEST_IDLE_CALLBACK ? function (cb) { return g['requestIdleCallback'](cb); } : function (cb) { return cb(); };
function isDefined(a) {
    return a !== null && a !== undefined;
}
exports.isDefined = isDefined;
exports.keyList = Object.keys;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[8])(8)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
'use strict';

var Executor = _dereq_(4);

function Benchmark() {
  this.running = false;
  this.impl = null;
  this.tests = null;
  this.reportCallback = null;
  this.enableTests = false;

  this.container = document.createElement('div');

  this._runButton = document.getElementById('RunButton');
  this._iterationsElement = document.getElementById('Iterations');
  this._reportElement = document.createElement('pre');

  document.body.appendChild(this.container);
  document.body.appendChild(this._reportElement);

  var self = this;

  this._runButton.addEventListener('click', function(e) {
    e.preventDefault();

    if (!self.running) {
      var iterations = parseInt(self._iterationsElement.value);
      if (iterations <= 0) {
        iterations = 10;
      }

      self.run(iterations);
    }
  }, false);

  this.ready(true);
}

Benchmark.prototype.ready = function(v) {
  if (v) {
    this._runButton.disabled = '';
  } else {
    this._runButton.disabled = 'true';
  }
};

Benchmark.prototype.run = function(iterations) {
  var self = this;
  this.running = true;
  this.ready(false);

  new Executor(self.impl, self.container, self.tests, 1, function() { // warmup
    new Executor(self.impl, self.container, self.tests, iterations, function(samples) {
      self._reportElement.textContent = JSON.stringify(samples, null, ' ');
      self.running = false;
      self.ready(true);
      if (self.reportCallback != null) {
        self.reportCallback(samples);
      }
    }, undefined, false).start();
  }, undefined, this.enableTests).start();
};

module.exports = Benchmark;

},{"4":4}],4:[function(_dereq_,module,exports){
'use strict';

function render(nodes) {
  var children = [];
  var j;
  var c;
  var i;
  var e;
  var n;

  for (i = 0; i < nodes.length; i++) {
    n = nodes[i];
    if (n.children !== null) {
      e = document.createElement('div');
      c = render(n.children);
      for (j = 0; j < c.length; j++) {
        e.appendChild(c[j]);
      }
      children.push(e);
    } else {
      e = document.createElement('span');
      e.textContent = n.key.toString();
      children.push(e);
    }
  }

  return children;
}

function testInnerHtml(testName, nodes, container) {
  var c = document.createElement('div');
  var e = document.createElement('div');
  var children = render(nodes);
  for (var i = 0; i < children.length; i++) {
    e.appendChild(children[i]);
  }
  c.appendChild(e);
  if (c.innerHTML !== container.innerHTML) {
    console.log('error in test: ' + testName);
    console.log('container.innerHTML:');
    console.log(container.innerHTML);
    console.log('should be:');
    console.log(c.innerHTML);
  }
}


function Executor(impl, container, tests, iterations, cb, iterCb, enableTests) {
  if (iterCb === void 0) iterCb = null;

  this.impl = impl;
  this.container = container;
  this.tests = tests;
  this.iterations = iterations;
  this.cb = cb;
  this.iterCb = iterCb;
  this.enableTests = enableTests;

  this._currentTest = 0;
  this._currentIter = 0;
  this._renderSamples = [];
  this._updateSamples = [];
  this._result = [];

  this._tasksCount = tests.length * iterations;

  this._iter = this.iter.bind(this);
}

Executor.prototype.start = function() {
  this._iter();
};

Executor.prototype.finished = function() {
  this.cb(this._result);
};

Executor.prototype.progress = function() {
  if (this._currentTest === 0 && this._currentIter === 0) {
    return 0;
  }

  var tests = this.tests;
  return (this._currentTest * tests.length + this._currentIter) / (tests.length * this.iterataions);
};

Executor.prototype.iter = function() {
  if (this.iterCb != null) {
    this.iterCb(this);
  }

  var tests = this.tests;

  if (this._currentTest < tests.length) {
    var test = tests[this._currentTest];

    if (this._currentIter < this.iterations) {
      var e, t;
      var renderTime, updateTime;

      e = new this.impl(this.container, test.data.a, test.data.b);
      e.setUp();

      t = window.performance.now();
      e.render();
      renderTime = window.performance.now() - t;

      if (this.enableTests) {
        testInnerHtml(test.name + 'render()', test.data.a, this.container);
      }

      t = window.performance.now();
      e.update();
      updateTime = window.performance.now() - t;

      if (this.enableTests) {
        testInnerHtml(test.name + 'update()', test.data.b, this.container);
      }

      e.tearDown();

      this._renderSamples.push(renderTime);
      this._updateSamples.push(updateTime);

      this._currentIter++;
    } else {
      this._result.push({
        name: test.name + ' ' + 'render()',
        data: this._renderSamples.slice(0)
      });

      this._result.push({
        name: test.name + ' ' + 'update()',
        data: this._updateSamples.slice(0)
      });

      this._currentTest++;

      this._currentIter = 0;
      this._renderSamples = [];
      this._updateSamples = [];
    }

    setTimeout(this._iter, 0);
  } else {
    this.finished();
  }
};

module.exports = Executor;

},{}],5:[function(_dereq_,module,exports){
'use strict';

var Benchmark = _dereq_(3);
var benchmark = new Benchmark();

function initFromScript(scriptUrl, impl) {
  var e = document.createElement('script');
  e.src = scriptUrl;

  e.onload = function() {
    benchmark.tests = window.generateBenchmarkData().units;
    benchmark.ready(true);
  };

  document.head.appendChild(e);
}

function initFromParentWindow(parent, name, version, id) {
  window.addEventListener('message', function(e) {
    var data = e.data;
    var type = data.type;

    if (type === 'tests') {
      benchmark.tests = data.data;
      benchmark.reportCallback = function(samples) {
        parent.postMessage({
          type: 'report',
          data: {
            name: name,
            version: version,
            samples: samples
          },
          id: id
        }, '*');
      };
      benchmark.ready(true);

      parent.postMessage({
        type: 'ready',
        data: null,
        id: id
      }, '*');
    } else if (type === 'run') {
      benchmark.run(data.data.iterations);
    }
  }, false);

  parent.postMessage({
    type: 'init',
    data: null,
    id: id
  }, '*');
}

function init(name, version, impl) {
  // Parse Query String.
  var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p=a[i].split('=', 2);
      if (p.length == 1) {
        b[p[0]] = "";
      } else {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  if (qs['name'] !== void 0) {
    name = qs['name'];
  }

  if (qs['version'] !== void 0) {
    version = qs['version'];
  }

  var type = qs['type'];

  if (qs['test'] !== void 0) {
    benchmark.enableTests = true;
    console.log('tests enabled');
  }

  var id;
  if (type === 'iframe') {
    id = qs['id'];
    if (id === void 0) id = null;
    initFromParentWindow(window.parent, name, version, id);
  } else if (type === 'window') {
    if (window.opener != null) {
      id = qs['id'];
      if (id === void 0) id = null;
      initFromParentWindow(window.opener, name, version, id);
    } else {
      console.log('Failed to initialize: opener window is NULL');
    }
  } else {
    var testsUrl = qs['data']; // url to the script generating test data
    if (testsUrl !== void 0) {
      initFromScript(testsUrl);
    } else {
      console.log('Failed to initialize: cannot load tests data');
    }
  }

  benchmark.impl = impl;
}

// performance.now() polyfill
// https://gist.github.com/paulirish/5438650
// prepare base perf object
if (typeof window.performance === 'undefined') {
  window.performance = {};
}
if (!window.performance.now){
  var nowOffset = Date.now();
  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }
  window.performance.now = function now(){
    return Date.now() - nowOffset;
  };
}

module.exports = init;

},{"3":3}]},{},[1])(1)
});