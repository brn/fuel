/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var utils_1 = require("./utils");
var FUEL_ELEMENT_MARK = utils_1.Symbol('__fuel_element');
function typeOf(obj) {
    return Object.prototype.toString.call(obj).match(/\[object ([^\]]+)\]/)[1].toLowerCase();
}
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
var FuelElementView = (function () {
    function FuelElementView() {
    }
    FuelElementView.isComponent = function (fuelElement) {
        return typeof fuelElement.type !== 'number';
    };
    FuelElementView.isStatelessComponent = function (fuelElement) {
        return typeof fuelElement.type === 'function' && typeof fuelElement.type.prototype.render !== 'function';
    };
    FuelElementView.tagNameOf = function (fuelElement) {
        return types_1.FuelBuiltinElements[fuelElement.type].toLowerCase();
    };
    FuelElementView.tagTypeOf = function (fuelElement) {
        return fuelElement.type;
    };
    FuelElementView.hasChildren = function (el) {
        return el.children.length > 0;
    };
    FuelElementView.isFuelElement = function (fuelElement) {
        return fuelElement && fuelElement[FUEL_ELEMENT_MARK] === types_1.Bytes.FUEL_ELEMENT_MARK;
    };
    FuelElementView.isTextNode = function (fuelElement) {
        return this.tagTypeOf(fuelElement) === types_1.FuelBuiltinElements.SYNTHETIC_TEXT;
    };
    FuelElementView.getTextValueOf = function (fuelElement) {
        return fuelElement.props[0].value;
    };
    FuelElementView.getComponentRenderedTree = function (fuelElement) {
        return fuelElement['__rendered'];
    };
    FuelElementView.getProps = function (_a) {
        var props = _a.props;
        var attrs = {};
        for (var i = 0, len = props.length; i < len; i++) {
            var _b = props[i], name_1 = _b.name, value = _b.value;
            attrs[name_1] = value;
        }
        return attrs;
    };
    FuelElementView.instantiateComponent = function (fuelElement, oldElement, mountCallbacks) {
        var props = fuelElement.props, type = fuelElement.type;
        var attrs = this.getProps(fuelElement);
        var oldAttrs = oldElement ? this.getProps(oldElement) : null;
        if (this.isStatelessComponent(fuelElement)) {
            return type(attrs);
        }
        var instance = fuelElement['__instance'];
        if (!instance) {
            instance = fuelElement['__instance'] = new type(attrs);
        }
        instance.componentWillMount();
        if (mountCallbacks) {
            mountCallbacks.push(instance);
        }
        if (fuelElement['__rendered'] && !instance.shouldComponentUpdate(attrs, oldAttrs)) {
            return fuelElement['__rendered'];
        }
        return fuelElement['__rendered'] = instance.render();
    };
    FuelElementView.createDomElement = function (fuelElement, renderer) {
        if (this.tagTypeOf(fuelElement) === types_1.FuelBuiltinElements.SYNTHETIC_TEXT) {
            return fuelElement.dom = renderer.createTextNode(this.getTextValueOf(fuelElement));
        }
        var props = fuelElement.props, type = fuelElement.type;
        var attrs = [];
        var tagName = this.tagNameOf(fuelElement);
        var dom = renderer.createElement(tagName);
        for (var i = 0, len = props.length; i < len; i++) {
            var _a = props[i], name_2 = _a.name, value = _a.value;
            if (types_1.CONVERSATION_TABLE[name_2]) {
                name_2 = types_1.CONVERSATION_TABLE[name_2];
            }
            dom.setAttribute(name_2.toLowerCase(), value);
        }
        fuelElement.dom = dom;
        return dom;
    };
    FuelElementView.createDomTree = function (fuelElement, renderer) {
        var root;
        var stack;
        var mountCallbacks = [];
        if (this.isComponent(fuelElement)) {
            fuelElement = this.instantiateComponent(fuelElement, null);
            if (!fuelElement) {
                return null;
            }
        }
        if (!fuelElement.dom) {
            stack = [{ element: fuelElement, parentElement: null, children: fuelElement.children.slice(), dom: null, parent: null }];
        }
        else {
            stack = [{ element: fuelElement, parentElement: null, children: fuelElement.children.slice(), dom: fuelElement.dom, parent: null }];
        }
        while (stack.length) {
            var next = stack.pop();
            var hasChildren = !!next.children.length;
            if (next.element.key && next.parentElement) {
                if (!next.parentElement['__keyMap']) {
                    next.parentElement['__keyMap'] = {};
                }
                next.parentElement['__keyMap'][next.element.key] = next.element;
            }
            if (!next.dom) {
                next.dom = this.createDomElement(next.element, renderer);
                if (!root) {
                    root = next.dom;
                }
                if (next.parent) {
                    next.parent.appendChild(next.dom);
                }
            }
            if (hasChildren) {
                stack.push(next);
                var child = next.children.shift();
                if (this.isComponent(child)) {
                    child = this.instantiateComponent(child, null);
                    if (!child) {
                        stack.pop();
                        continue;
                    }
                }
                stack.push({ element: child, children: child.children.slice(), dom: null, parent: next.dom, parentElement: next.element });
            }
        }
        return root;
    };
    FuelElementView.difference = function (oldElement, newElement) {
        var oldProps = oldElement ? oldElement.props : null;
        var newProps = newElement ? newElement.props : null;
        var result = {
            attr: [],
            flags: 0
        };
        var bufferSet = {};
        if (!oldElement && newElement) {
            result.flags |= 4 /* NEW_ELEMENT */;
            return result;
        }
        else if (!newElement && oldElement) {
            result.flags |= 8 /* REMOVE_ELEMENT */;
            return result;
        }
        else if ((this.isTextNode(oldElement) && newElement) || (this.tagTypeOf(oldElement) !== this.tagTypeOf(newElement))) {
            result.flags |= 16 /* REPLACE_ELEMENT */;
            return result;
        }
        for (var i = 0, len = oldProps.length > newProps.length ? oldProps.length : newProps.length; i < len; i++) {
            if (oldProps[i] !== undefined) {
                var _a = oldProps[i], name_3 = _a.name, value = _a.value;
                bufferSet[name_3] = { state: 2 /* REMOVED */, value: value };
            }
            if (newProps[i] !== undefined) {
                var _b = newProps[i], name_4 = _b.name, value = _b.value;
                if (!bufferSet[name_4]) {
                    bufferSet[name_4] = { state: 1 /* NEW */, value: value };
                }
                else if (!compare(bufferSet[name_4].value, value)) {
                    bufferSet[name_4] = { state: 3 /* REPLACED */, value: value };
                }
                else {
                    bufferSet[name_4].state = 4 /* UNCHANGED */;
                }
            }
        }
        for (var id in bufferSet) {
            var buf = bufferSet[id];
            switch (buf.state) {
                case 4 /* UNCHANGED */:
                    break;
                default:
                    result.attr.push({ key: id, value: buf.value, state: buf.state });
            }
        }
        if (this.hasChildren(newElement) && !this.hasChildren(oldElement)) {
            result.flags |= 2 /* REMOVE_CHILDREN */;
        }
        else if (!this.hasChildren(newElement) && this.hasChildren(oldElement)) {
            result.flags |= 1 /* CREATE_CHILDREN */;
        }
        return result;
    };
    return FuelElementView;
}());
exports.FuelElementView = FuelElementView;
function makeFuelElement(type, key, props, children) {
    if (children === void 0) { children = []; }
    return _a = {},
        _a[FUEL_ELEMENT_MARK] = types_1.Bytes.FUEL_ELEMENT_MARK,
        _a['__instance'] = null,
        _a.type = type,
        _a.key = key,
        _a.props = props,
        _a.children = children,
        _a.dom = null,
        _a;
    var _a;
}
exports.makeFuelElement = makeFuelElement;
