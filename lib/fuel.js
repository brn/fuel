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
        util_1.invariant(v === undefined, 'Undefined passed as element, it\'s seem to mistakes.');
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
            ret.push(createTextNode(v.toString()));
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
var Fuel = (function () {
    function Fuel() {
    }
    Fuel['createElement'] = function (type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        util_1.invariant(!VALID_TYPES[typeof type], "Fuel element only accept one of 'string' or 'function' but got " + type);
        if (children.length) {
            children = checkChildren(children);
        }
        if (!props) {
            props = {};
        }
        // Convert props object to array.
        // Because for in loop is too slow and props will iterate many times.
        var attributes = [];
        for (var name_1 in props) {
            var value = props[name_1];
            attributes.push({ name: name_1, value: value });
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
Fuel.FuelComponent = (function () {
    function FuelComponentImpl(_props) {
        if (_props === void 0) { _props = {}; }
        this._props = _props;
    }
    Object.defineProperty(FuelComponentImpl.prototype, 'props', {
        get: function () { return this._props; },
        enumerable: true,
        configurable: true
    });
    FuelComponentImpl.prototype['componentWillMount'] = function () { };
    FuelComponentImpl.prototype['componentDidMount'] = function () { };
    FuelComponentImpl.prototype['componentWillUpdate'] = function () { };
    FuelComponentImpl.prototype['componentDidUpdate'] = function () { };
    FuelComponentImpl.prototype['componentWillReceiveProps'] = function (props) {
        this._props = props;
    };
    FuelComponentImpl.prototype['shouldComponentUpdate'] = function (nextProps, prevProps) { return true; };
    FuelComponentImpl.prototype['render'] = function () { return null; };
    FuelComponentImpl.prototype['getChildContext'] = function () { return {}; };
    ;
    /**
     * Will be rewrited after.
     */
    FuelComponentImpl.prototype['setState'] = function (state, cb) { };
    return FuelComponentImpl;
}());
exports.Fuel = Fuel;
/**
 * Reactjs compatible definitions.
 * If you use typescript with tsx, import React namespace required.
 */
exports.React = {
    'createElement': Fuel['createElement']
};
