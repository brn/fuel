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


export const PX_CONVERTIONS = {
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
}


export function setStyle(el: Node, name: string, value: any): void {
  (el as HTMLElement).style[name] = typeof value === 'number' && PX_CONVERTIONS[name]? `${value}px`: String(value);
}
