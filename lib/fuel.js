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
var tslib_1 = require("tslib");
var stem_1 = require("./stem");
var element_1 = require("./element");
var util_1 = require("./util");
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
