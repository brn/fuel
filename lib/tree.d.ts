/**
 * @fileoverview
 * @author Taketoshi Aono
 */
import { FuelElement, FuelComponent, Stem, FuelDOMNode } from './type';
import { Renderer } from './renderer/renderer';
export declare function fastCreateDomTree(rootElement: FuelElement, fuelElement: FuelElement, renderer: Renderer, createStem: () => Stem, mountCallbacks: FuelComponent<any, any>[]): FuelDOMNode;
