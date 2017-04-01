/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./recycler/node");
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
