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
var element_1 = _dereq_(3);
function isCreateChildren(diff) {
    return (diff.flags & 1 /* CREATE_CHILDREN */) === 1 /* CREATE_CHILDREN */;
}
exports.isCreateChildren = isCreateChildren;
function isNewElement(diff) {
    return (diff.flags & 2 /* NEW_ELEMENT */) === 2 /* NEW_ELEMENT */;
}
exports.isNewElement = isNewElement;
function isRemoveElement(diff) {
    return (diff.flags & 4 /* REMOVE_ELEMENT */) === 4 /* REMOVE_ELEMENT */;
}
exports.isRemoveElement = isRemoveElement;
function isReplaceElement(diff) {
    return (diff.flags & 8 /* REPLACE_ELEMENT */) === 8 /* REPLACE_ELEMENT */;
}
exports.isReplaceElement = isReplaceElement;
function isTextChanged(diff) {
    return (diff.flags & 16 /* TEXT_CHANGED */) === 16 /* TEXT_CHANGED */;
}
exports.isTextChanged = isTextChanged;
function compare(valueA, valueB) {
    if (valueA === null) {
        if (valueB || valueB === undefined) {
            return false;
        }
        return true;
    }
    var typeA = typeof valueA;
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
    if (typeA !== 'object' && typeof valueB !== 'object') {
        return valueA === valueB;
    }
    return false;
}
function compareStyle(prev, next) {
    var diff = {};
    var unchanged = {};
    var count = 0;
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
    var oldStyles = Object.keys(prev);
    for (var i = 0, len = oldStyles.length; i < len; i++) {
        if (!diff[oldStyles[i]] && !unchanged[oldStyles[i]]) {
            diff[oldStyles[i]] = '';
            count++;
        }
    }
    return [diff, count];
}
function checkProps(bufferSet, prop, isOldProps) {
    var name = prop.name, value = prop.value;
    if (!bufferSet[name]) {
        bufferSet[name] = { state: isOldProps ? 2 /* REMOVED */ : 1 /* NEW */, value: value };
    }
    else if (name === 'style') {
        var _a = compareStyle(bufferSet[name].value, value), diff_1 = _a[0], count = _a[1];
        if (count) {
            bufferSet[name] = { state: 3 /* REPLACED */, value: diff_1 };
        }
    }
    else if (!compare(bufferSet[name].value, value)) {
        bufferSet[name] = { state: 3 /* REPLACED */, value: value };
    }
    else {
        bufferSet[name].state = 4 /* UNCHANGED */;
    }
}
function diff(oldElement, newElement) {
    var oldProps = oldElement ? oldElement.props : null;
    var newProps = newElement ? newElement.props : null;
    var result = {
        attr: [],
        flags: 0
    };
    var bufferSet = {};
    if (!oldElement && newElement) {
        result.flags |= 2 /* NEW_ELEMENT */;
        return result;
    }
    else if (!newElement && oldElement) {
        result.flags |= 4 /* REMOVE_ELEMENT */;
        return result;
    }
    else if (element_1.FuelElementView.isTextNode(oldElement) && element_1.FuelElementView.isTextNode(newElement)) {
        if (element_1.FuelElementView.getTextValueOf(oldElement) !== element_1.FuelElementView.getTextValueOf(newElement)) {
            result.flags |= 16 /* TEXT_CHANGED */;
        }
        return result;
    }
    else if (oldElement.type !== newElement.type) {
        result.flags |= 8 /* REPLACE_ELEMENT */;
    }
    else {
        var newPropsLength = newProps.length;
        var oldPropsLength = oldProps.length;
        for (var i = 0, len = oldPropsLength > newPropsLength ? oldPropsLength : newPropsLength; i < len; i++) {
            if (oldProps[i] !== undefined) {
                checkProps(bufferSet, oldProps[i], true);
            }
            if (newProps[i] !== undefined) {
                checkProps(bufferSet, newProps[i], false);
            }
        }
        for (var id in bufferSet) {
            var buf = bufferSet[id];
            switch (buf.state) {
                case 4 /* UNCHANGED */:
                    break;
                default:
                    if (buf.state === 3 /* REPLACED */) {
                        if (id === 'style') {
                            buf.state = 5 /* STYLE_CHANGED */;
                        }
                    }
                    result.attr.push({ key: id, value: buf.value, state: buf.state });
            }
        }
    }
    var isNewElementHasChildren = element_1.FuelElementView.hasChildren(newElement);
    var isOldElementHasChildren = element_1.FuelElementView.hasChildren(oldElement);
    if (isNewElementHasChildren && !isOldElementHasChildren) {
        result.flags |= 1 /* CREATE_CHILDREN */;
    }
    return result;
}
exports.diff = diff;

},{"3":3}],2:[function(_dereq_,module,exports){
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
var stem_1 = _dereq_(9);
var element_1 = _dereq_(3);
var dom_renderer_1 = _dereq_(8);
exports.FuelDOM = {
    render: function (element, firstNode, cb) {
        if (cb === void 0) { cb = function (dom) { }; }
        var oldElement = element_1.FuelElementView.getFuelElementFromNode(firstNode);
        if (!stem_1.FuelStem.renderer) {
            stem_1.FuelStem.renderer = new dom_renderer_1.DomRenderer();
        }
        if (oldElement) {
            element._stem = oldElement._stem;
        }
        if (!element._stem) {
            element._stem = new stem_1.FuelStem();
        }
        if (oldElement && !oldElement.dom)
            debugger;
        element_1.FuelElementView.attachFuelElementToNode(firstNode, element);
        element._stem.render(element, function (root) {
            firstNode.appendChild(root);
            cb && cb(root);
        });
    }
};
exports.ReactDOM = exports.FuelDOM;

},{"3":3,"8":8,"9":9}],3:[function(_dereq_,module,exports){
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
var type_1 = _dereq_(11);
var node_1 = _dereq_(7);
var util_1 = _dereq_(12);
var event_1 = _dereq_(4);
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
    attachFuelElementToNode: function (node, fuelElement) {
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
        // This make circular references between DOMElement and FuelElement,
        // but all disposable FuelElement will cleanup at stem and all references will be cut off.
        // So, this circular ref does'nt make leaks.
        dom[DOM_LINK] = fuelElement;
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

},{"11":11,"12":12,"4":4,"7":7}],4:[function(_dereq_,module,exports){
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
var util_1 = _dereq_(12);
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

},{"12":12}],5:[function(_dereq_,module,exports){
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
var tslib_1 = _dereq_(13);
var stem_1 = _dereq_(9);
var element_1 = _dereq_(3);
var util_1 = _dereq_(12);
/**
 * Iterate over all children and if array is exists, flatten that and
 * if text is exists, convert it to FuelElement.
 * @param arr Children elements.
 * @param skipArray Skip checking array type.
 * @returns Flattened array of FuelElement.
 */
function checkChildren(arr, skipArray) {
    if (skipArray === void 0) { skipArray = false; }
    var ret = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var v = arr[i];
        if (v === null) {
            continue;
        }
        util_1.invariant(v === undefined, 'Undefined passed as element, it\'s seem to misstakes.');
        if (element_1.FuelElementView.isFuelElement(v)) {
            ret.push(v);
        }
        else if (!skipArray && Array.isArray(v)) {
            // We do not check inside children array.
            // So if array exists in children array,
            // that treated as text.
            ret = checkChildren(v, true).concat(ret);
        }
        else {
            var textNode = createTextNode(v.toString());
            ret.push(textNode);
        }
    }
    return ret;
}
/**
 * Create text representation.
 */
function createTextNode(child) {
    return element_1.makeFuelElement(element_1.FuelElementView.allocateTextTagName(), null, [{ name: 'value', value: child }]);
}
var VALID_TYPES = { 'string': 1, 'function': 1 };
var ComponentImpl = (function () {
    function ComponentImpl(_props, _context) {
        if (_props === void 0) { _props = {}; }
        if (_context === void 0) { _context = {}; }
        this._props = _props;
        this._context = _context;
        this.refs = {};
    }
    Object.defineProperty(ComponentImpl.prototype, 'props', {
        get: function () { return this._props; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentImpl.prototype, 'context', {
        get: function () { return this._context; },
        enumerable: true,
        configurable: true
    });
    ComponentImpl.prototype['componentWillUnmount'] = function () { };
    ComponentImpl.prototype['componentWillMount'] = function () { };
    ComponentImpl.prototype['componentDidMount'] = function () { };
    ComponentImpl.prototype['componentWillUpdate'] = function () { };
    ComponentImpl.prototype['componentDidUpdate'] = function () { };
    ComponentImpl.prototype['componentWillReceiveProps'] = function (props) { };
    ComponentImpl.prototype['shouldComponentUpdate'] = function (nextProps, prevProps) { return true; };
    ComponentImpl.prototype['render'] = function () { return null; };
    ComponentImpl.prototype['getChildContext'] = function () { return {}; };
    ;
    /**
     * Will be rewrited after.
     */
    ComponentImpl.prototype['setState'] = function (state, cb) {
        this.state = util_1.merge(this.state, state);
        this.componentWillUpdate();
        var newContext = util_1.merge(this.context || {}, this.getChildContext());
        var tree = this.render();
        var fuelElement = this[element_1.INSTANCE_ELEMENT_SYM];
        tree._componentInstance = this;
        fuelElement._stem.render(tree, function () {
            fuelElement._componentRenderedElementTreeCache = tree;
            cb && cb();
        }, newContext, false);
    };
    return ComponentImpl;
}());
exports.ComponentImpl = ComponentImpl;
var PureComponentImpl = (function (_super) {
    tslib_1.__extends(PureComponentImpl, _super);
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
        if (Object.keys(nextProps).length !== Object.keys(prevProps).length) {
            return true;
        }
        return false;
    };
    return PureComponentImpl;
}(ComponentImpl));
exports.PureComponentImpl = PureComponentImpl;
var Fuel = (function () {
    function Fuel() {
    }
    Fuel.createElement = function (type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        util_1.invariant(!VALID_TYPES[typeof type], "Fuel element only accept one of 'string' or 'function' but got " + type);
        if (!props) {
            props = {};
        }
        if (children.length) {
            children = checkChildren(children);
        }
        // Convert props object to array.
        // Because for in loop is too slow and props will iterate many times.
        var attributes = [];
        for (var name_1 in props) {
            if (name_1 !== 'key') {
                var value = props[name_1];
                attributes.push({ name: name_1, value: value });
            }
        }
        var el = element_1.makeFuelElement(typeof type === 'string' ? element_1.FuelElementView.allocateTagName(type) : type, props.key, attributes, children);
        // If element is component, We set stem to this FuelElement.
        if (element_1.FuelElementView.isComponent(el) || props.scoped) {
            el._stem = new stem_1.FuelStem();
        }
        return el;
    };
    Fuel.unmountComponentAtNode = function (el) {
        var fuelElement = element_1.FuelElementView.getFuelElementFromNode(el);
        if (fuelElement) {
            fuelElement._stem.unmountComponent(fuelElement, function () {
                el['innerHTML'] = '';
            });
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

},{"12":12,"13":13,"3":3,"9":9}],6:[function(_dereq_,module,exports){
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
var fuel_1 = _dereq_(5);
exports.Fuel = fuel_1.Fuel;
exports.React = fuel_1.React;
__export(_dereq_(2));

},{"2":2,"5":5}],7:[function(_dereq_,module,exports){
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

},{}],8:[function(_dereq_,module,exports){
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
var DomRenderer = (function () {
    function DomRenderer() {
        this.id = 0;
    }
    DomRenderer.prototype.updateId = function () { this.id++; };
    DomRenderer.prototype.createElement = function (tagName) {
        var ret = document.createElement(tagName);
        ret.setAttribute('data-id', "" + this.id);
        return ret;
    };
    DomRenderer.prototype.createTextNode = function (text) {
        return document.createTextNode(text);
    };
    return DomRenderer;
}());
exports.DomRenderer = DomRenderer;

},{}],9:[function(_dereq_,module,exports){
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
var type_1 = _dereq_(11);
var node_1 = _dereq_(7);
var tree_1 = _dereq_(10);
var element_1 = _dereq_(3);
var difference_1 = _dereq_(1);
var util_1 = _dereq_(12);
function createStem() {
    return new FuelStem();
}
function replaceElement(root, parent, oldElement, newElement, isKeyedItems, renderer) {
    var newDom = element_1.FuelElementView.createDomElement(root, newElement, renderer, createStem);
    var oldDom = oldElement.dom;
    if (oldDom.nodeType === 1 && newDom.nodeType === 1) {
        var children = oldDom.children;
        while (children.length) {
            newDom.appendChild(children[0]);
        }
    }
    var parentDom = parent.dom;
    if (!isKeyedItems) {
        parentDom.replaceChild(newDom, oldDom);
    }
    else {
        parentDom.removeChild(oldDom);
        parentDom.appendChild(newDom);
    }
}
function copyElementRef(root, oldElement, newElement, isKeyedItem) {
    newElement.dom = oldElement.dom;
    element_1.FuelElementView.attachFuelElementToNode(newElement.dom, newElement);
    if (isKeyedItem) {
        newElement.dom.parentNode.appendChild(newElement.dom);
    }
}
function updateElement(diff, rootElement, newElement) {
    var domElement = newElement.dom;
    var strippedRoot = element_1.FuelElementView.stripComponent(rootElement);
    for (var i = 0, len = diff.attr.length; i < len; i++) {
        var _a = diff.attr[i], key = _a.key, value = _a.value, state = _a.state;
        switch (state) {
            case 1 /* NEW */:
            case 3 /* REPLACED */:
                if (type_1.DOMEvents[key]) {
                    var lowerKey = key.slice(2).toLowerCase();
                    strippedRoot._stem.getEventHandler().replaceEvent(newElement.dom, lowerKey, value);
                }
                else {
                    domElement[key] = value;
                }
                break;
            case 5 /* STYLE_CHANGED */:
                for (var style in value) {
                    var val = value[style];
                    node_1.setStyle(domElement, style, val);
                }
                break;
            case 2 /* REMOVED */:
                if (type_1.DOMEvents[key]) {
                    var lowerKey = key.slice(2).toLowerCase();
                    strippedRoot._stem.getEventHandler().removeEvent(newElement.dom, lowerKey);
                }
                else {
                    domElement.removeAttribute(key);
                }
            default:
        }
    }
}
function update(batches) {
    var renderer = FuelStem.renderer;
    for (var i = 0, len = batches.length; i < len; i++) {
        var _a = batches[i], parent_1 = _a.parent, newElement = _a.newElement, oldElement = _a.oldElement, isKeyedItem = _a.isKeyedItem, difference = _a.difference, root = _a.root, context_1 = _a.context;
        if (difference_1.isNewElement(difference)) {
            if (parent_1) {
                parent_1.dom.appendChild(tree_1.fastCreateDomTree(context_1, root, newElement, renderer, createStem));
                element_1.FuelElementView.invokeDidMount(newElement);
            }
            else {
                var tree = tree_1.fastCreateDomTree(context_1, root, newElement, renderer, createStem);
                if (oldElement) {
                    parent_1.dom.appendChild(tree);
                    element_1.FuelElementView.invokeDidMount(newElement);
                    element_1.FuelElementView.invokeWillUnmount(oldElement);
                }
            }
        }
        else if (difference_1.isRemoveElement(difference)) {
            element_1.FuelElementView.invokeWillUnmount(oldElement);
            oldElement.dom.parentNode.removeChild(oldElement.dom);
            oldElement._stem = null;
        }
        else if (difference_1.isReplaceElement(difference)) {
            element_1.FuelElementView.invokeWillUnmount(oldElement);
            replaceElement(root, parent_1, oldElement, newElement, isKeyedItem, renderer);
            element_1.FuelElementView.invokeDidMount(newElement);
        }
        else if (difference_1.isTextChanged(difference)) {
            newElement.dom = oldElement.dom;
            element_1.FuelElementView.attachFuelElementToNode(newElement.dom, newElement);
            newElement.dom.textContent = element_1.FuelElementView.getTextValueOf(newElement);
            element_1.FuelElementView.invokeDidUpdate(newElement);
        }
        else {
            copyElementRef(root, oldElement, newElement, isKeyedItem);
            updateElement(difference, root, newElement);
            element_1.FuelElementView.invokeDidUpdate(newElement);
        }
        if (difference_1.isCreateChildren(difference)) {
            tree_1.fastCreateDomTree(context_1, root, newElement, renderer, createStem);
        }
    }
}
function makeInitialStackState(context, newElement, oldElement) {
    return [
        {
            newElement: newElement,
            oldElement: oldElement,
            newChildren: null,
            oldChildren: null,
            parsed: false,
            difference: null,
            context: context,
            root: newElement,
            isKeyedItem: false
        }
    ];
}
function createNextStackState(context, parentState, prev, oldElement) {
    var newChild = prev.newChildren.shift();
    var oldChild;
    var isKeyedItem = false;
    if (parentState) {
        var parentNewElement = parentState.newElement, parentOldElement = parentState.oldElement;
        if (parentOldElement && parentOldElement._keymap && newChild && parentOldElement._keymap[newChild.key]) {
            oldChild = parentOldElement._keymap[newChild.key];
            if (parentNewElement && !parentNewElement._keymap) {
                parentNewElement._keymap = {};
                parentNewElement._keymap[newChild.key] = newChild;
            }
            var index = prev.oldChildren.indexOf(oldChild);
            if (index !== -1) {
                prev.oldChildren.splice(index, 1);
                isKeyedItem = true;
            }
            else {
                oldChild = prev.oldChildren.shift();
                isKeyedItem = false;
            }
        }
        else {
            oldChild = prev.oldChildren.shift();
            isKeyedItem = false;
        }
    }
    else {
        oldChild = prev.oldChildren.shift();
        isKeyedItem = false;
    }
    var root = prev.root;
    if (newChild) {
        if (newChild._unmounted) {
            newChild = null;
        }
        else if (newChild._stem) {
            root = newChild;
        }
    }
    if (newChild && !newChild._ownerElement) {
        newChild._ownerElement = prev.newElement._ownerElement;
    }
    return {
        newElement: newChild,
        oldElement: oldChild,
        newChildren: null,
        oldChildren: null,
        parsed: false,
        difference: null,
        root: root,
        context: context,
        isKeyedItem: isKeyedItem
    };
}
function patchComponent(context, newElement, oldElement) {
    if (newElement && element_1.FuelElementView.isComponent(newElement)) {
        if (oldElement && oldElement.type !== newElement.type) {
            while (newElement && element_1.FuelElementView.isComponent(newElement)) {
                _a = element_1.FuelElementView.instantiateComponent(context, newElement), newElement = _a[0], context = _a[1];
            }
        }
        else {
            while (newElement && element_1.FuelElementView.isComponent(newElement)) {
                if (newElement && oldElement && newElement.type === oldElement.type) {
                    newElement._componentInstance = oldElement._componentInstance;
                }
                var revealedOldElement = oldElement;
                if (oldElement && element_1.FuelElementView.isComponent(oldElement)) {
                    revealedOldElement = element_1.FuelElementView.getComponentRenderedTree(oldElement);
                }
                var _b = element_1.FuelElementView.instantiateComponent(context, newElement, oldElement), stripedNewTree = _b[0], newContext = _b[1];
                context = newContext;
                oldElement = revealedOldElement;
                newElement = stripedNewTree;
            }
        }
    }
    if (oldElement && element_1.FuelElementView.isComponent(oldElement)) {
        oldElement = element_1.FuelElementView.stripComponent(oldElement);
    }
    return [context, newElement, oldElement];
    var _a;
}
var FuelStem = (function () {
    function FuelStem(tree) {
        if (tree === void 0) { tree = null; }
        this.tree = tree;
        this._enabled = true;
        this.batchs = [];
        this.batchCallback = null;
        this.lock = false;
        this.renderQueue = [];
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
        //    requestAnimationFrame(() => {
        if (this.batchs.length) {
            update(this.batchs);
            this.batchs.length = 0;
            this.batchCallback && this.batchCallback();
            this.batchCallback = null;
        }
        //    });
    };
    FuelStem.prototype.drainRenderQueue = function () {
        var next = this.renderQueue.shift();
        if (next) {
            var element = next.element, cb = next.cb;
            this.render(element, cb);
        }
    };
    FuelStem.prototype.unmountComponent = function (fuelElement, cb) {
        tree_1.cleanupTree(fuelElement, cb);
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
        FuelStem.renderer.updateId();
        if (this.tree) {
            this.lock = true;
            this.patch(el, context);
            var old_1 = this.tree;
            if (updateOwnwer) {
                this.tree = el;
            }
            this.batchCallback = function () {
                tree_1.cleanupTree(old_1);
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
        var domTree = tree_1.fastCreateDomTree({}, el, el, FuelStem.renderer, createStem);
        if (updateOwner) {
            this.tree = el;
        }
        return domTree;
    };
    FuelStem.prototype.patch = function (newTree, context) {
        if (this.batchs.length) {
            this.batchs.length = 0;
        }
        var stack = makeInitialStackState(context, newTree, this.tree);
        var parent = null;
        while (stack.length) {
            var next = stack.pop();
            var newElement = next.newElement, oldElement = next.oldElement, context_2 = next.context, isKeyedItem = next.isKeyedItem;
            var difference = void 0;
            var currentRoot = next.root;
            if (!next.parsed) {
                _a = patchComponent(context_2, newElement, oldElement), context_2 = _a[0], newElement = _a[1], oldElement = _a[2];
                if (!newElement && !oldElement) {
                    continue;
                }
                if (newElement && oldElement) {
                    newElement._stem = oldElement._stem;
                }
                next.newElement = newElement;
                next.oldElement = oldElement;
                next.context = context_2;
                if (newElement && newElement._stem) {
                    currentRoot = next.newElement;
                }
                difference = difference_1.diff(oldElement, newElement);
                next.difference = difference;
                if (oldElement) {
                    util_1.invariant(!oldElement.dom, 'Dom element was accidentally removed.');
                }
                this.batchs.push({
                    root: currentRoot,
                    parent: parent ? parent.newElement : null,
                    newElement: newElement,
                    oldElement: oldElement,
                    isKeyedItem: isKeyedItem,
                    difference: difference,
                    context: next.context
                });
                next.newChildren = newElement ? newElement.children.slice() : [];
                next.oldChildren = oldElement ? oldElement.children.slice() : [];
                next.parsed = true;
            }
            if ((next.newChildren.length || next.oldChildren.length) &&
                (!next.difference ||
                    next.difference.flags === 0 ||
                    next.difference.flags === 8 /* REPLACE_ELEMENT */)) {
                stack.push(next);
                stack.push(createNextStackState(context_2, parent, next, oldElement));
                parent = next;
            }
        }
        var _a;
    };
    return FuelStem;
}());
exports.FuelStem = FuelStem;

},{"1":1,"10":10,"11":11,"12":12,"3":3,"7":7}],10:[function(_dereq_,module,exports){
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
var element_1 = _dereq_(3);
var util_1 = _dereq_(12);
function makeInitialDomTreeStack(context, rootElement, fuelElement) {
    return [
        {
            element: fuelElement,
            parentElement: null,
            children: fuelElement.children.slice(),
            dom: fuelElement.dom,
            parent: null,
            root: rootElement,
            context: context
        }
    ];
}
function fastCreateDomTree(context, rootElement, fuelElement, renderer, createStem) {
    var createdDomTreeRoot;
    while (fuelElement && element_1.FuelElementView.isComponent(fuelElement)) {
        _a = renderComponent(context, fuelElement, createStem), fuelElement = _a[0], context = _a[1];
    }
    if (!fuelElement) {
        return;
    }
    var stack = makeInitialDomTreeStack(context || {}, rootElement, fuelElement);
    LOOP: while (stack.length) {
        var next = stack.pop();
        var hasChildren = !!next.children.length;
        if (!next.dom) {
            var element = next.element, parentElement = next.parentElement, parent_1 = next.parent;
            if (element.key && next.parentElement) {
                if (!parentElement._keymap) {
                    parentElement._keymap = {};
                }
                util_1.invariant(parentElement._keymap[element.key], "Duplicate key found: key = " + element.key);
                parentElement._keymap[element.key] = element;
            }
            next.dom = element_1.FuelElementView.createDomElement(next.root, element, renderer, createStem);
            if (!createdDomTreeRoot) {
                createdDomTreeRoot = next.dom;
            }
            if (parent_1) {
                parent_1.appendChild(next.dom);
                element_1.FuelElementView.invokeDidMount(next.element);
            }
        }
        var root = next.root;
        if (hasChildren) {
            stack.push(next);
            var child = next.children.shift();
            if (child._stem) {
                root = child;
            }
            var context_1 = next.context;
            while (element_1.FuelElementView.isComponent(child)) {
                root = child;
                child._ownerElement = next.element._ownerElement;
                _b = renderComponent(context_1, child, createStem), child = _b[0], context_1 = _b[1];
                if (!child) {
                    continue LOOP;
                }
            }
            if (!child._ownerElement) {
                child._ownerElement = next.element._ownerElement;
            }
            stack.push({ element: child, children: child.children.slice(), dom: null, parent: next.dom, parentElement: next.element, root: root, context: context_1 });
        }
    }
    return createdDomTreeRoot;
    var _a, _b;
}
exports.fastCreateDomTree = fastCreateDomTree;
function renderComponent(oldContext, fuelElement, createStem) {
    var _a = element_1.FuelElementView.instantiateComponent(oldContext, fuelElement, null), nodes = _a[0], context = _a[1];
    if (nodes) {
        fuelElement._stem.registerOwner(fuelElement);
    }
    return [nodes, context];
}
function cleanupTree(fuelElement, cb) {
    doClean(fuelElement, cb);
    //  requestIdleCallback(() => doClean(fuelElement, cb));
}
exports.cleanupTree = cleanupTree;
function doClean(fuelElement, cb) {
    var stack = [
        {
            element: fuelElement,
            children: fuelElement.children.slice()
        }
    ];
    while (stack.length) {
        var next = stack.pop();
        if (!next.element._unmounted) {
            element_1.FuelElementView.cleanupElement(next.element);
        }
        if (next.children.length) {
            stack.push(next);
            var child = next.children.shift();
            if (child) {
                stack.push({ element: child, children: child.children.slice() });
            }
        }
    }
    cb && cb();
}

},{"12":12,"3":3}],11:[function(_dereq_,module,exports){
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
var BuiltinElementValue;
(function (BuiltinElementValue) {
    BuiltinElementValue[BuiltinElementValue["CHILDREN"] = 2] = "CHILDREN";
})(BuiltinElementValue = exports.BuiltinElementValue || (exports.BuiltinElementValue = {}));
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

},{}],12:[function(_dereq_,module,exports){
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
        if (!warn) {
            throw new Error(message);
        }
        else {
            console.warn(message);
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
var HAS_REQUEST_ANIMATION_FRAME = typeof g.requestAnimationFrame === 'function';
exports.requestAnimationFrame = HAS_REQUEST_ANIMATION_FRAME ? function (cb) { return g.requestAnimationFrame(cb); } : function (cb) { return setTimeout(cb, 60); };
var HAS_REQUEST_IDLE_CALLBACK = typeof g['requestIdleCallback'] === 'function';
exports.requestIdleCallback = HAS_REQUEST_IDLE_CALLBACK ? function (cb) { return g['requestIdleCallback'](cb); } : function (cb) { return cb(); };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(_dereq_,module,exports){
(function (global){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), q = [], c, i;
        return i = { next: verb("next"), "throw": verb("throw"), "return": verb("return") }, i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { return function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]), next(); }); }; }
        function next() { if (!c && q.length) resume((c = q.shift())[0], c[1]); }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(c[3], e); } }
        function step(r) { r.done ? settle(c[2], r) : r.value[0] === "yield" ? settle(c[2], { value: r.value[1], done: false }) : Promise.resolve(r.value[1]).then(r.value[0] === "delegate" ? delegate : fulfill, reject); }
        function delegate(r) { step(r.done ? r : { value: ["yield", r.value], done: false }); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { c = void 0, f(v), next(); }
    };

    __asyncDelegator = function (o) {
        var i = { next: verb("next"), "throw": verb("throw", function (e) { throw e; }), "return": verb("return", function (v) { return { value: v, done: true }; }) };
        return o = __asyncValues(o), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { return function (v) { return { value: ["delegate", (o[n] || f).call(o, v)], done: false }; }; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[6])(6)
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