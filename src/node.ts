/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  FuelDOMNode
} from './type';


export function setStyle(el: FuelDOMNode, name: string, value: any): void {
  el.style[name] = typeof value === 'number'? `${value}px`: String(value);
}
