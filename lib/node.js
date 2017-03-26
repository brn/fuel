/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setStyle(el, name, value) {
    el.style[name] = typeof value === 'number' ? value + "px" : String(value);
}
exports.setStyle = setStyle;
