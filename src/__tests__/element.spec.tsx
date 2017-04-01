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
  FuelElementView,
  makeFuelElement,
  cloneElement
} from '../element';
import {
  FuelStem
} from '../stem';
import {
  Fuel,
  React
} from '../fuel';
import {
  expect
} from 'chai';


const enum Flags {
  DID_MOUNT = 0x00000002,
  DID_UPDATE = 0x00000008,
  WILL_UNMOUNT = 0x00000010
}

function createStem() {return new FuelStem()}

class Component extends Fuel.Component<any, any> {
  public flags = 0;
  public static constructed = 0;
  constructor(p, c) {super(p, c);Component.constructed++;}
  render() {return <div className="rendered-tree"></div>}
  componentDidMount() {this.flags |= Flags.DID_MOUNT}
  componentDidUpdate() {this.flags |= Flags.DID_UPDATE}
  componentWillUnmount() {this.flags |= Flags.WILL_UNMOUNT}
}


class Component2 extends Fuel.Component<any, any> {
  render() {return <div className={this.props.className}></div>}
}


describe.skip('element', () => {
  beforeEach(() => {
    Component.constructed = 0;
  });
  describe('FuelElementView', () => {
    describe('@isComponent', () => {
      it('check whether element is component or not', () => {
        const componentEl = makeFuelElement(Component, null, [])
        const el          = makeFuelElement('div', null, [])
        componentEl._stem = new FuelStem();
        expect(FuelElementView.isComponent(componentEl)).to.be.true;
        expect(FuelElementView.isComponent(el)).to.be.false;
      })
    });

    describe('@isStatelessComponent', () => {
      it('check whether element is statelessComponent or not', () => {
        const componentEl = makeFuelElement(Component, null, [])
        const stlessEl    = makeFuelElement(() => null, null, [])
        const el          = makeFuelElement('div', null, [])
        componentEl._stem = new FuelStem();
        expect(FuelElementView.isStatelessComponent(componentEl)).to.be.false;
        expect(FuelElementView.isStatelessComponent(stlessEl)).to.be.true;
        expect(FuelElementView.isStatelessComponent(el)).to.be.false;
      })
    });

    describe('@tagNameOf', () => {
      it('get tag name of element', () => {
        const div    = makeFuelElement('div', null, []);
        const span   = makeFuelElement('span', null, []);
        expect(FuelElementView.tagNameOf(div)).to.be.eq('div');
        expect(FuelElementView.tagNameOf(span)).to.be.eq('span');
      })
    });

    describe('@hasChildren', () => {
      it('return whether element has children or not', () => {
        const el            = makeFuelElement('div', null, [], []);
        const hasChildrenEl = makeFuelElement('div', null, [], [
          makeFuelElement('div', null, [], [])
        ]);
        expect(FuelElementView.hasChildren(el)).to.be.false;
        expect(FuelElementView.hasChildren(hasChildrenEl)).to.be.true;
      })
    });

    describe('@isTextNode', () => {
      it('return whether element is text node or not.', () => {
        const el     = makeFuelElement('div', null, [], []);
        const textEl = makeFuelElement('SYNTHETIC_TEXT', null, [{name: 'text', value: 'text'}]);
        expect(FuelElementView.isTextNode(el)).to.be.false;
        expect(FuelElementView.isTextNode(textEl)).to.be.true;
      });
    });

    describe('@getTextValueOf', () => {
      it('return text element value.', () => {
        const textEl = makeFuelElement('SYNTHETIC_TEXT', null, [{name: 'text', value: 'textValue'}]);
        expect(FuelElementView.getTextValueOf(textEl)).to.be.eq('textValue');
      });
    });

    describe('@getComponentRenderedTree', () => {
      it('return rendered tree of component.', () => {
        const el = makeFuelElement(Component, null, []);
        el._stem = new FuelStem();
        FuelElementView.instantiateComponent({}, el, createStem);
        const tree = FuelElementView.getComponentRenderedTree(el);
        expect(tree).to.be.deep.equal({
          type                               : 'div',
          key                                : null,
          props                              : [{name: 'className', value: 'rendered-tree'}],
          dom                                : null,
          _stem                              : el._stem,
          _componentInstance                 : el._componentInstance,
          _componentRenderedElementTreeCache : null,
          _keymap                            : null,
          _subscriptions                     : null,
          children                           : []
        });
      });
    });

    describe('@invoke*', () => {
      it('invoke component lifecycle hook', () => {
        const el = makeFuelElement(Component, null, []);
        el._stem = new FuelStem();
        FuelElementView.instantiateComponent({}, el, createStem);
        const instance: Component = el._componentInstance as any;
        FuelElementView.invokeDidMount(el);
        expect(instance.flags & Flags.DID_MOUNT).to.be.eq(Flags.DID_MOUNT);
        FuelElementView.invokeDidUpdate(el);
        expect(instance.flags & Flags.DID_UPDATE).to.be.eq(Flags.DID_UPDATE);
        FuelElementView.invokeWillUnmount(el);
        expect(instance.flags & Flags.WILL_UNMOUNT).to.be.eq(Flags.WILL_UNMOUNT);
      });
    });

    describe('@instantiateComponent', () => {
      it('instantiate FuelComponent', () => {
        const el = makeFuelElement(Component2, null, [{name: 'className', value: 'test'}]);
        el._stem = new FuelStem();
        const [rendered] = FuelElementView.instantiateComponent({}, el, createStem);

        expect(el).to.be.deep.eq({
          type                               : Component2,
          key                                : null,
          props                              : [{name: 'className', value: 'test'}],
          dom                                : null,
          _stem                              : el._stem,
          _componentInstance                 : el._componentInstance,
          _componentRenderedElementTreeCache : rendered,
          _keymap                            : null,
          _subscriptions                     : null,
          children                           : []
        });

        expect(rendered).to.be.deep.eq({
          type                               : 'div',
          key                                : null,
          props                              : [{name: 'className', value: 'test'}],
          dom                                : null,
          _stem                              : el._stem,
          _componentInstance                 : el._componentInstance,
          _componentRenderedElementTreeCache : null,
          _keymap                            : null,
          _subscriptions                     : null,
          children                           : []
        });
      });


      it('instantiate FuelComponent once', () => {
        const el = makeFuelElement(Component, null, [{name: 'className', value: 'test'}]);
        el._stem = new FuelStem();
        expect(Component.constructed).to.be.eq(0);
        FuelElementView.instantiateComponent({}, el, createStem);
        FuelElementView.instantiateComponent({}, el, createStem);
        FuelElementView.instantiateComponent({}, el, createStem);
        expect(Component.constructed).to.be.eq(1);
      });


      it('instantiate StatelessComponent', () => {
        const fn = ({className}) => {return <div className={className}></div>};
        const el = makeFuelElement(fn, null, [{name: 'className', value: 'test'}]);
        const [rendered] = FuelElementView.instantiateComponent({}, el, createStem);

        expect(el).to.be.deep.eq({
          type                               : fn,
          key                                : null,
          props                              : [{name: 'className', value: 'test'}],
          dom                                : null,
          _stem                              : el._stem,
          _componentInstance                 : null,
          _componentRenderedElementTreeCache : null,
          _keymap                            : null,
          _subscriptions                     : null,
          children                           : []
        });

        expect(rendered).to.be.deep.eq({
          type                               : 'div',
          key                                : null,
          props                              : [{name: 'className', value: 'test'}],
          dom                                : null,
          _stem                              : null,
          _componentInstance                 : null,
          _componentRenderedElementTreeCache : null,
          _keymap                            : null,
          _subscriptions                     : null,
          children                           : []
        });
      });
    });
  });


  describe('makeFuelElement', () => {
    it('create element', () => {
      const el = makeFuelElement('div', 'key', [{name: 'prop', value: 'test'}], [
        makeFuelElement(1, 'key', [])
      ]);
      expect(el).to.be.deep.equal({
        type                               : 'div',
        key                                : 'key',
        props                              : [{name: 'prop', value: 'test'}],
        dom                                : null,
        _stem                              : null,
        _componentInstance                 : null,
        _componentRenderedElementTreeCache : null,
        _keymap                            : null,
        _subscriptions                     : null,
        children                           : [
          {
            type                               : 1,
            key                                : 'key',
            props                              : [],
            dom                                : null,
            _stem                              : null,
            _componentInstance                 : null,
            _componentRenderedElementTreeCache : null,
            _keymap                            : null,
            _subscriptions                     : null,
            children                           : []
          }
        ]
      })
    });
  });


  describe('cloneElement', () => {
    it('clone element', () => {
      const el = makeFuelElement('div', 'key', [{name: 'prop', value: 'test'}], [
        makeFuelElement(1, 'key', [])
      ]);
      expect(cloneElement(el, {className: 'test'})).to.be.deep.equal({
        type                               : 'div',
        key                                : 'key',
        props                              : [{name: 'prop', value: 'test'}, {name: 'className', value: 'test'}],
        dom                                : null,
        _stem                              : null,
        _componentInstance                 : null,
        _componentRenderedElementTreeCache : null,
        _keymap                            : null,
        _subscriptions                     : null,
        children                           : [
          {
            type                               : 1,
            key                                : 'key',
            props                              : [],
            children                           : [],
            dom                                : null,
            _stem                              : null,
            _componentInstance                 : null,
            _componentRenderedElementTreeCache : null,
            _keymap                            : null,
            _subscriptions                     : null,
          }
        ]
      })
    });
  });
});
