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
var BuiltinElementValue;
(function (BuiltinElementValue) {
    BuiltinElementValue[BuiltinElementValue["CHILDREN"] = 2] = "CHILDREN";
})(BuiltinElementValue = exports.BuiltinElementValue || (exports.BuiltinElementValue = {}));
exports.CONVERSATION_TABLE = {
    'className': 'class'
};
var Bytes;
(function (Bytes) {
    Bytes[Bytes["FUEL_ELEMENT_MARK"] = (Math.random() * 10000) << 1] = "FUEL_ELEMENT_MARK";
})(Bytes = exports.Bytes || (exports.Bytes = {}));
function eventmap(str) {
    var _ = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _[_i - 1] = arguments[_i];
    }
    return str[0].split(' ').reduce(function (prev, next) {
        var key = "on" + next;
        prev[key] = true;
        return prev;
    }, {});
}
function attrmap(str) {
    var _ = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _[_i - 1] = arguments[_i];
    }
    return str[0].split(' ').reduce(function (prev, next) {
        prev[next] = true;
        return prev;
    }, {});
}
exports.DOMEvents = (_a = ["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"], _a.raw = ["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"], eventmap(_a));
exports.DOMAttributes = (_b = ["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"], _b.raw = ["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"], attrmap(_b));
var _a, _b;
