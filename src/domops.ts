/**
 * @fileoverview
 * @author Taketoshi Aono
 */

import {
  NodeRecycler
} from './recycler/node';


const DOM_NODE_CACHE = {};
const {use} = NodeRecycler;
let _id = 0;

export const domOps = {
  resetId() {_id = 0;},

  updateId() {_id++},

  newElement(tagName: string) {
    let node = use(tagName);
    if (!node) {
      if (!(node = DOM_NODE_CACHE[tagName])) {
        node = DOM_NODE_CACHE[tagName] = document.createElement(tagName) as any;
      }
      node = node.cloneNode(false);
    }
    if (__DEBUG__) {
      (node as HTMLElement).setAttribute('data-id', `${_id}`);
    }
    return node;
  },


  newTextNode(text: string): Node {
    return document.createTextNode(text);
  },


  newFragment(): DocumentFragment {
    return document.createDocumentFragment();
  }
}
