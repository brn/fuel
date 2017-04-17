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
var element_1 = require("./element");
var element_2 = require("./recycler/element");
var util_1 = require("./util");
var difference_1 = require("./difference");
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
