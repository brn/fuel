/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = require("./element");
var util_1 = require("./util");
function makeInitialDomTreeStack(rootElement, fuelElement) {
    return [
        {
            element: fuelElement,
            parentElement: null,
            children: fuelElement.children.slice(),
            dom: fuelElement.dom,
            parent: null,
            root: rootElement
        }
    ];
}
function fastCreateDomTree(rootElement, fuelElement, renderer, createStem, mountCallbacks) {
    var createdDomTreeRoot;
    if (element_1.FuelElementView.isComponent(fuelElement)) {
        fuelElement = renderComponent(fuelElement, createStem, mountCallbacks);
        if (!fuelElement) {
            return null;
        }
    }
    var stack = makeInitialDomTreeStack(rootElement, fuelElement);
    while (stack.length) {
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
            }
        }
        var root = next.root;
        if (hasChildren) {
            stack.push(next);
            var child = next.children.shift();
            if (child._stem) {
                root = child;
            }
            while (element_1.FuelElementView.isComponent(child)) {
                root = child;
                child = renderComponent(child, createStem, mountCallbacks);
                if (!child) {
                    continue;
                }
            }
            stack.push({ element: child, children: child.children.slice(), dom: null, parent: next.dom, parentElement: next.element, root: root });
        }
    }
    return createdDomTreeRoot;
}
exports.fastCreateDomTree = fastCreateDomTree;
function renderComponent(fuelElement, createStem, mountCallbacks) {
    var nodes = element_1.FuelElementView.instantiateComponent(fuelElement, null, mountCallbacks);
    fuelElement._stem.registerOwner(nodes);
    return nodes;
}
