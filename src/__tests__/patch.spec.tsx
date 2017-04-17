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


import {
  expect
} from 'chai';
import {
  PatchOpsImpl
} from '../patchops';
import {
  patch
} from '../patch';
import {
  FuelStem
} from '../stem';
import {
  fastCreateDomTree
} from '../tree';
import {
  Fuel,
  React
} from '../fuel';
import {
  FuelElement,
  PatchOps,
  MoveType
} from '../type';
import {
  FuelElementView
} from '../element';

const {tagNameOf, isFragment, getTextValueOf} = FuelElementView;

const EXECUTE_REMOVE = 'EXECUTE_REMOVE';

class PatchOpsMock implements PatchOps {
  private _operations = [];

  move(moveTo: number, moveType: MoveType, oldElement: FuelElement): void {
    this.stamp(`${tagNameOf(oldElement)} move to ${moveTo}`);
  }

  replace(index: number, parent: FuelElement, newElement: FuelElement, oldElement: FuelElement, context: any): void {
    this.stamp(`replace ${tagNameOf(oldElement)}:${index} to ${tagNameOf(newElement)}:${index}`);
  }

  update(newElement: FuelElement, oldElement: FuelElement): void {
    this.stamp(`update ${tagNameOf(newElement)} with ${tagNameOf(oldElement)}`);
  }

  insert(index: number, context: any, parent: FuelElement, newElement: FuelElement): void {
    this.stamp(`insert ${tagNameOf(newElement)} to ${index} of ${parent? tagNameOf(parent): 'null'}`);
  }

  append(context: any, parent: FuelElement, el: FuelElement): void {
    this.stamp(`append ${tagNameOf(el)} to ${tagNameOf(parent)}`);
  }

  remove(index: number, parent: FuelElement, oldElement: FuelElement): void {
    this.stamp(`remove ${tagNameOf(oldElement)}:${index} from ${tagNameOf(parent)}`);
  }

  updateText(index: number, parent: FuelElement, newElement: FuelElement): void {
    this.stamp(`update text value of ${tagNameOf(parent)}:${index} to ${getTextValueOf(newElement)}`);
  }

  setText(parent: FuelElement, newElement: FuelElement): void {
    this.stamp(`set text ${getTextValueOf(newElement)} to ${tagNameOf(parent)}`);
  }

  createChildren(context: any, newElement: FuelElement) {
    this.stamp(`create all children of ${tagNameOf(newElement)}`);
  }

  removeChildren(el: FuelElement): void {
    this.stamp('remove all children of ${tagNameOf(el)}');
  }

  executeRemove(): void {
    this.stamp(EXECUTE_REMOVE);
  }

  public get operations() {
    return this._operations;
  }

  private stamp(value: string) {
    this._operations.push(value);
  }
}


function createStem() {return new FuelStem()}

describe('patch', () => {
  let patchOps: PatchOpsMock;

  beforeEach(() => {
    patchOps = new PatchOpsMock();
  });


  it('should patch normal vdom tree', () => {
    const context = {};
    const treeA = <div><span/><span/></div>;
    const treeB = <div><p/><p/></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'replace p:0 to span:0',
      'replace p:1 to span:1',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch text', () => {
    const context = {};
    const treeA = <div><span>foo-bar-baz</span></div>;
    const treeB = <div><span>foo-bar-baz-qux</span></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update span with span',
      'update text value of span:0 to foo-bar-baz',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch keyed item', () => {
    const context = {};
    const treeA = <div><span key="2">foo-bar-baz</span><span key="1">foo-bar</span></div>;
    const treeB = <div><span key="1">foo-bar-baz-qux</span><span key="2">foo-bar-baz</span></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'span move to 0',
      'update span with span',
      'update span with span',
      'update text value of span:0 to foo-bar',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch new item', () => {
    const context = {};
    const treeA = <div><ul><li/><li/><li/></ul></div>;
    const treeB = <div><ul><li/></ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update li with li',
      'insert li to 1 of ul',
      'append li to ul',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch removed item', () => {
    const context = {};
    const treeA = <div><ul><li/></ul></div>;
    const treeB = <div><ul><li/><li/><li/></ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update li with li',
      'remove li:1 from ul',
      'remove li:2 from ul',
      EXECUTE_REMOVE
    ]);
  });


  it('should skip null and insert new item', () => {
    const context = {};
    const treeA = <div><ul><li/><li/><li/></ul></div>;
    const treeB = <div><ul><li/>{null}</ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update li with li',
      'insert li to 1 of ul',
      'append li to ul',
      EXECUTE_REMOVE
    ]);
  });


  it('should skip null and remove item', () => {
    const context = {};
    const treeA = <div><ul><li/>{null}</ul></div>;
    const treeB = <div><ul><li/><li/><li/></ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update li with li',
      'remove li:1 from ul',
      'remove li:2 from ul',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch fragment', () => {
    const context = {};
    const treeA = <div><ul>{[<li/>,<li/>,<li/>]}</ul></div>;
    const treeB = <div><ul>{[<li/>]}</ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update SYNTHETIC_FRAGMENT with SYNTHETIC_FRAGMENT',
      'update li with li',
      'insert li to 1 of ul',
      'append li to ul',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch new fragment', () => {
    const context = {};
    const treeA = <div><ul>{[<li/>,<li/>,<li/>]}</ul></div>;
    const treeB = <div><ul><li/></ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'replace li:0 to SYNTHETIC_FRAGMENT:0',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch keyed reversed fragment', () => {
    const context = {};
    const treeA = <div><ul>{[<li key="3"/>,<li key="2"/>,<li key="1"/>]}</ul></div>;
    const treeB = <div><ul>{[<li key="1"/>,<li key="2"/>,<li key="3"/>]}</ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update SYNTHETIC_FRAGMENT with SYNTHETIC_FRAGMENT',
      'li move to 0',
      'update li with li',
      'li move to 1',
      'update li with li',
      'update li with li',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch keyed shuffle fragment', () => {
    const context = {};
    const treeA = <div><ul>{[<li key="2"/>,<li key="4"/>,<li key="1"/>,<li key="3"/>]}</ul></div>;
    const treeB = <div><ul>{[<li key="1"/>,<li key="2"/>,<li key="3"/>,<li key="4"/>]}</ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update SYNTHETIC_FRAGMENT with SYNTHETIC_FRAGMENT',
      'li move to 0',
      'update li with li',
      'li move to 1',
      'update li with li',
      'update li with li',
      'update li with li',
      EXECUTE_REMOVE
    ]);
  });


  it('should patch keyed shuffle fragment', () => {
    const context = {};
    const treeA = <div><ul>{[<li key="2"/>,<li key="4"/>,<li key="1"/>,<li key="3"/>]}</ul></div>;
    const treeB = <div><ul>{[<li key="1"/>,<li key="2"/>,<li key="3"/>,<li key="4"/>]}</ul></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update ul with ul',
      'update SYNTHETIC_FRAGMENT with SYNTHETIC_FRAGMENT',
      'li move to 0',
      'update li with li',
      'li move to 1',
      'update li with li',
      'update li with li',
      'update li with li',
      EXECUTE_REMOVE
    ]);
  });


  it('should throw if duplicate key found.', () => {
    const context = {};
    const treeA = <div><ul><li key="1"/><li key="1"/></ul></div>;
    const treeB = <div><ul><li key="1"/><li key="1"/></ul></div>;
    expect(() => patch(context, treeA, treeB, patchOps, createStem, true)).throw(Error);
  });


  it('should create new element if keyed item not matched', () => {
    const context = {};
    const treeA = <div><div>{[<p key="1"/>,<p/>,<p key="2"/>,<span key="3"/>,<span key="4"/>]}</div></div>;
    const treeB = <div><div>{[<span key="1"/>,<span key="2"/>,<span key="3"/>,<span key="4"/>]}</div></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update div with div',
      'update SYNTHETIC_FRAGMENT with SYNTHETIC_FRAGMENT',
      'replace span:0 to p:0',
      'update span with span',
      'update span with span',
      'replace span:2 to p:2',
      'insert p to 1 of div',
      EXECUTE_REMOVE
    ]);
  });


  it('should create new text if keyed item not matched', () => {
    const context = {};
    const treeA = <div><div>{[<p key="1"/>,'foo-bar-baz',<p key="2"/>,<span key="3"/>,<span key="4"/>]}</div></div>;
    const treeB = <div><div>{[<span key="1"/>,<span key="2"/>,<span key="3"/>,<span key="4"/>]}</div></div>;
    patch(context, treeA, treeB, patchOps, createStem);
    expect(patchOps.operations).to.be.deep.eq([
      'update div with div',
      'update div with div',
      'update SYNTHETIC_FRAGMENT with SYNTHETIC_FRAGMENT',
      'replace span:0 to p:0',
      'update span with span',
      'update span with span',
      'replace span:2 to p:2',
      'insert SYNTHETIC_TEXT to 1 of div',
      EXECUTE_REMOVE
    ]);
  });
});
