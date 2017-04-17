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
var util_1 = require("../util");
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
