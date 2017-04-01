/**
 * @fileoverview
 * @author Taketoshi Aono
 */

import "./type";
import {
  fastCreateDomTree
} from '../tree';
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
import {
  domOps
} from '../domops';
import * as serialize from 'dom-serialize';

describe('tree', () => {
  describe('fastCreateDomTree', () => {
    beforeEach(() => {
      domOps.resetId();
    })
    afterEach(() => {
      domOps.resetId();
    })

    class Component extends Fuel.Component<any, any> {
      render() {
        return (
          <table>
            <thead>
              <tr>
                <th>header1</th>
                <th>header2</th>
                <th>header3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>body1</td>
                <td>body2</td>
                <td>boy3</td>
              </tr>
            </tbody>
          </table>
        );
      }
    }

    class IDComponent extends Fuel.Component<any, any> {
      render() {return <Component />}
    }

    class NestedComponent extends Fuel.Component<any, any> {
      render() {
        return (
          <div>
            <Component />
          </div>
        );
      }
    }

    it('create dom tree fast', () => {
      const el = (
        <div>
          <ul>
            <li><span>text</span></li>
            <li><span>text2</span></li>
            <li><span><a href="javascript:void(0)">text3</a></span></li>
            <li>
              <table>
                <thead>
                  <tr>
                    <th>header1</th>
                    <th>header2</th>
                    <th>header3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>body1</td>
                    <td>body2</td>
                    <td>boy3</td>
                  </tr>
                </tbody>
              </table>
            </li>
          </ul>
        </div>
      );
      fastCreateDomTree({}, el, () => new FuelStem());
      expect(serialize(el.dom)).to.be.eq('<div data-id="0"><ul data-id="0"><li data-id="0"><span data-id="0">text</span></li><li data-id="0"><span data-id="0">text2</span></li><li data-id="0"><span data-id="0"><a data-id="0" href="javascript:void(0)">text3</a></span></li><li data-id="0"><table data-id="0"><thead data-id="0"><tr data-id="0"><th data-id="0">header1</th><th data-id="0">header2</th><th data-id="0">header3</th></tr></thead><tbody data-id="0"><tr data-id="0"><td data-id="0">body1</td><td data-id="0">body2</td><td data-id="0">boy3</td></tr></tbody></table></li></ul></div>');
    });

    it('create dom tree contains component', () => {
      const el = (
        <div>
          <ul>
            <li><span>text</span></li>
            <li><span>text2</span></li>
            <li><span><a href="javascript:void(0)">text3</a></span></li>
            <li>
              <Component />
            </li>
          </ul>
        </div>
      );
      fastCreateDomTree({}, el, () => new FuelStem());
      expect(serialize(el.dom)).to.be.eq('<div data-id="0"><ul data-id="0"><li data-id="0"><span data-id="0">text</span></li><li data-id="0"><span data-id="0">text2</span></li><li data-id="0"><span data-id="0"><a data-id="0" href="javascript:void(0)">text3</a></span></li><li data-id="0"><table data-id="0"><thead data-id="0"><tr data-id="0"><th data-id="0">header1</th><th data-id="0">header2</th><th data-id="0">header3</th></tr></thead><tbody data-id="0"><tr data-id="0"><td data-id="0">body1</td><td data-id="0">body2</td><td data-id="0">boy3</td></tr></tbody></table></li></ul></div>');
    });

    it('create dom tree contains nested component', () => {
      const el = (
        <div>
          <ul>
            <li><span>text</span></li>
            <li><span>text2</span></li>
            <li><span><a href="javascript:void(0)">text3</a></span></li>
            <li>
              <IDComponent />
            </li>
          </ul>
        </div>
      );
      fastCreateDomTree({}, el, () => new FuelStem());
      expect(serialize(el.dom)).to.be.eq('<div data-id="0"><ul data-id="0"><li data-id="0"><span data-id="0">text</span></li><li data-id="0"><span data-id="0">text2</span></li><li data-id="0"><span data-id="0"><a data-id="0" href="javascript:void(0)">text3</a></span></li><li data-id="0"><table data-id="0"><thead data-id="0"><tr data-id="0"><th data-id="0">header1</th><th data-id="0">header2</th><th data-id="0">header3</th></tr></thead><tbody data-id="0"><tr data-id="0"><td data-id="0">body1</td><td data-id="0">body2</td><td data-id="0">boy3</td></tr></tbody></table></li></ul></div>');
    });

    it('create dom tree contains nested component 2', () => {
      const el = (
        <div>
          <ul>
            <li><span>text</span></li>
            <li><span>text2</span></li>
            <li><span><a href="javascript:void(0)">text3</a></span></li>
            <li>
              <NestedComponent />
            </li>
          </ul>
        </div>
      );
      fastCreateDomTree({}, el, () => new FuelStem());
      expect(serialize(el.dom)).to.be.eq('<div data-id="0"><ul data-id="0"><li data-id="0"><span data-id="0">text</span></li><li data-id="0"><span data-id="0">text2</span></li><li data-id="0"><span data-id="0"><a data-id="0" href="javascript:void(0)">text3</a></span></li><li data-id="0"><div data-id="0"><table data-id="0"><thead data-id="0"><tr data-id="0"><th data-id="0">header1</th><th data-id="0">header2</th><th data-id="0">header3</th></tr></thead><tbody data-id="0"><tr data-id="0"><td data-id="0">body1</td><td data-id="0">body2</td><td data-id="0">boy3</td></tr></tbody></table></div></li></ul></div>');
    });

    class ChildrenComponent extends Fuel.Component<any ,any> {
      render() {
        return <div>
          {this.props.children}
        </div>
      }
    }

    it('create dom tree contains children', () => {
      const el = <div><ChildrenComponent><span>foo-bar-baz</span></ChildrenComponent></div>;
      fastCreateDomTree({}, el, () => new FuelStem());
      expect(serialize(el.dom)).to.be.eq('<div data-id="0"><div data-id="0"><span data-id="0">foo-bar-baz</span></div></div>');
    });


    class ContextComponent extends Fuel.Component<any, any> {
      render() {
        return <div>
          {this.props.children}
        </div>
      }

      getChildContext() {
        return {contextValue: 'context-class-name'};
      }
    }

    class ChildComponent extends Fuel.Component<any, any> {
      public context: any;
      render() {
        return <span className={this.context.contextValue}></span>
      }
    }


    it('create context.', () => {
      const el = <div><ContextComponent><div><ChildComponent/></div></ContextComponent></div>;
      fastCreateDomTree({}, el, () => new FuelStem());
      expect(serialize(el.dom)).to.be.eq('<div data-id="0"><div data-id="0"><div data-id="0"><span data-id="0" class="context-class-name"></span></div></div></div>');
    });
  });
});
