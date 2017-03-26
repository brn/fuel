/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes;
(function (Bytes) {
    Bytes[Bytes["FUEL_ELEMENT_MARK"] = (Math.random() * 10000) << 1] = "FUEL_ELEMENT_MARK";
})(Bytes = exports.Bytes || (exports.Bytes = {}));
var Type;
(function (Type) {
    Type[Type["STRING"] = 161] = "STRING";
    Type[Type["NUMBER"] = 162] = "NUMBER";
    Type[Type["BOOLEAN"] = 163] = "BOOLEAN";
    Type[Type["DATE"] = 164] = "DATE";
    Type[Type["REGEXP"] = 165] = "REGEXP";
    Type[Type["FUNCTION"] = 166] = "FUNCTION";
    Type[Type["OBJECT"] = 167] = "OBJECT";
    Type[Type["ARRAY"] = 168] = "ARRAY";
})(Type = exports.Type || (exports.Type = {}));
var Flag;
(function (Flag) {
    Flag[Flag["HAS_CHILDREN"] = 1] = "HAS_CHILDREN";
})(Flag = exports.Flag || (exports.Flag = {}));
var Mask;
(function (Mask) {
    Mask[Mask["TAG_NAME_MASK"] = 511] = "TAG_NAME_MASK";
})(Mask = exports.Mask || (exports.Mask = {}));
