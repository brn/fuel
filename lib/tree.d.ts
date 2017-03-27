/**
 * @fileoverview
 * @author Taketoshi Aono
 */
import { FuelElement, Stem, FuelDOMNode } from './type';
import { Renderer } from './renderer/renderer';
export declare function fastCreateDomTree(context: any, rootElement: FuelElement, fuelElement: FuelElement, renderer: Renderer, createStem: () => Stem): FuelDOMNode;
