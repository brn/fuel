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
import { FuelDOMNode } from './type';
export declare const PX_CONVERTIONS: {
    'width': number;
    'height': number;
    'fontSize': number;
    'lineHeight': number;
    'strokeWidth': number;
    'backgroundPositionX': number;
    'borderBottomLeftRadius': number;
    'borderBottomRightRadius': number;
    'borderBottomWidth': number;
    'borderImageWidth': number;
    'borderLeftWidth': number;
    'borderRightWidth': number;
    'borderTopLeftRadius': number;
    'borderTopRightRadius': number;
    'borderTopWidth': number;
    'borderWidth': number;
    'columnWidth': number;
    'columnRuleWidth': number;
    'fontKerning': number;
    'letterSpacing': number;
    'margin': number;
    'marginBottom': number;
    'marginLeft': number;
    'marginRight': number;
    'marginTop': number;
    'maxFontSize': number;
    'maxHeight': number;
    'maxWidth': number;
    'minHeight': number;
    'minWidth': number;
    'padding': number;
    'paddingBottom': number;
    'paddingLeft': number;
    'paddingRight': number;
    'paddingTop': number;
    'top': number;
    'left': number;
    'right': number;
    'bottom': number;
    'textHeight': number;
    'textIndent': number;
};
export declare function setStyle(el: FuelDOMNode, name: string, value: any): void;
