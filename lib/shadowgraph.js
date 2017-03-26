// /**
//  * @fileoverview
//  * @author Taketoshi Aono
//  */
"use strict";
// import {
//   FuelElement,
//   TextTable,
//   FuelBuiltinElements,
//   AttributeSet
// } from './types';
// enum AttrState {
//   NEW = 1,
//   REMOVED,
//   REPLACED,
//   UNCHANGED
// }
// interface Difference {
//   attr: {key: string, value: string, state: AttrState}[]
//   removeChildren: boolean;
//   createChildren: boolean;
// }
// export class ShadowGraph {
//   private attached?: FuelElement;
//   public constructor(private textTable: TextTable) {
//   }
//   public attach(el: FuelElement) {
//     this.attached = el;
//     return this.traverseFirstTime(el);
//   }
//   private replaceChild(domNode: Node, newNode: Node) {
//     const {childNodes} = domNode;
//     for (let i = 0, len = childNodes.length; i < len; i++) {
//       newNode.appendChild(childNodes[i]);
//     }
//     domNode.parentNode.replaceChild(newNode, domNode);
//   }
//   private difference(oldElement: FuelElement, newElement: FuelElement): Difference {
//     const oldBuf = oldElement.fixedArray;
//     const newBuf = newElement.fixedArray;
//     const result: Difference = {
//       attr: [],
//       removeChildren: false,
//       createChildren: false
//     }
//     const bufferSet = {};
//     for (let i = 2, len = oldElement.length > newElement.length? oldElement.length: newElement.length; i < len; i += 2) {
//       if (oldBuf[i] !== undefined) {
//         bufferSet[oldBuf[i]] = {state: AttrState.REMOVED, value: oldBuf[i + 1]};
//       }
//       if (newBuf[i] !== undefined) {
//         if (!bufferSet[newBuf[i]]) {
//           bufferSet[newBuf[i]] = {state: AttrState.NEW, value: newBuf[i + 1]};
//         } else if (bufferSet[newBuf[i]].value !== newBuf[i + 1]) {
//           bufferSet[newBuf[i]] = {state: AttrState.REPLACED, value: newBuf[i + 1]};
//         } else {
//           bufferSet[newBuf[i]].state = AttrState.UNCHANGED;
//         }
//       }
//     }
//     for (const id in bufferSet) {
//       const buf = bufferSet[id];
//       switch (buf.state) {
//       case AttrState.UNCHANGED:
//         break;
//       default:
//         result.attr.push({key: this.textTable.valueAt(+id), value: this.textTable.valueAt(buf.value), state: buf.state});
//       }
//     }
//     if (newElement.hasChildren && !oldElement.hasChildren) {
//       result.removeChildren = true;
//     } else if (!newElement.hasChildren && oldElement.hasChildren) {
//       result.createChildren = true;
//     }
//     return result;
//   }
//   public patch(next: FuelElement): Node {
//     type StackType = {newElement: FuelElement, oldElement: FuelElement, newChildren: FuelElement[], oldChildren: FuelElement[], parsed: boolean, difference: Difference};
//     const stack: StackType[] = [
//       {
//         newElement: next,
//         oldElement: this.attached,
//         newChildren: null,
//         oldChildren: null,
//         parsed: false,
//         difference: null
//       }
//     ];
//     let first = true;
//     let parent: StackType = null;
//     while (stack.length) {
//       const next = stack.pop();
//       const {newElement, oldElement} = next;
//       if (!next.parsed) {
//         if (!oldElement && newElement) {
//           if (parent) {
//             parent.newElement.domNode.appendChild(this.traverseFirstTime(newElement));
//             continue;
//           }
//         } else if (!newElement && oldElement) {
//           oldElement.domNode.parentNode.removeChild(oldElement.domNode);
//           oldElement.domNode = null;
//           continue;
//         }
//         const [newNode, oldNode] = [newElement.fixedArray, oldElement.fixedArray];
//         if ((newElement.isTextNode && oldElement.isTextNode) ||
//             (newElement.isTextNode && !oldElement.isTextNode)) {
//           if (newElement.value !== oldElement.value) {
//             const parent = oldElement.domNode.parentNode;
//             parent.replaceChild(newElement.createDomElement(), oldElement.domNode);
//           }
//           continue;
//         }
//         if (newNode[0] !== oldNode[0]) {
//           if (oldElement.isTextNode) {
//             oldElement.domNode.parentNode.appendChild(this.traverseFirstTime(newElement));
//             continue;
//           } else {
//             this.replaceChild(oldElement.domNode, newElement.createDomElement());
//           }
//         } else {
//           const difference = this.difference(oldElement, newElement);
//           next.difference = difference;
//           newElement.domNode = oldElement.domNode;
//           oldElement.domNode = null;
//           if (difference.createChildren) {
//             this.traverseFirstTime(newElement);
//           }
//           if (difference.removeChildren) {
//             if (newElement.domNode.nodeType === 1) {
//               newElement.domNode['innerHTML'] = '';
//             }
//           }
//           for (let i = 0, len = difference.attr.length; i < len; i++) {
//             const {key, value, state} = difference.attr[i];
//             const domElement = newElement.domNode as HTMLElement;
//             switch (state) {
//             case AttrState.NEW:
//             case AttrState.REPLACED:
//               domElement[key] = value;
//               break;
//             case AttrState.REMOVED:
//               domElement.removeAttribute(key);
//             default:
//             }
//           }
//         }
//         next.newChildren = newElement.children.slice();
//         next.oldChildren = oldElement.children.slice();
//         next.parsed = true;
//       }
//       if ((next.newChildren.length || next.oldChildren.length) && (!next.difference || !next.difference.createChildren && !next.difference.removeChildren)) {
//         parent = next;
//         stack.push(next);
//         stack.push({
//           newElement: next.newChildren.shift(),
//           oldElement: next.oldChildren.shift(),
//           newChildren: null,
//           oldChildren: null,
//           parsed: false,
//           difference: null
//         });
//       }
//     }
//     return next.domNode;
//   }
//   private traverseFirstTime(el: FuelElement) {
//     let root: Node;
//     type StackType = {element: FuelElement, children: FuelElement[], dom: Node, parent: Node};
//     let stack: StackType[];
//     if (!el.domNode) {
//       stack = [{element: el, children: el.children.slice(), dom: null, parent: null}];
//     } else {
//       stack = [{element: el, children: el.children.slice(), dom: el.domNode, parent: null}];
//     }
//     while (stack.length) {
//       const next = stack.pop();
//       const hasChildren = !!next.children.length;
//       if (!next.dom) {
//         const dom = next.element.createDomElement();
//         next.dom = dom;
//         if (!root) {
//           root = dom;
//         }
//         if (next.parent) {
//           next.parent.appendChild(dom);
//         }
//       }
//       if (hasChildren) {
//         stack.push(next);
//         const child = next.children.shift();
//         stack.push({element: child, children: child.children.slice(), dom: null, parent: next.dom});
//       }
//     }
//     return root;
//   }
// }
