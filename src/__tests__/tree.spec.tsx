/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  fastCreateDomTree
} from '../tree';
import {
  StringRenderer
} from '../renderer/string-renderer';
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


describe('tree', () => {
  describe('fastCreateDomTree', () => {
    let renderer;
    beforeEach(() => {
      renderer = new StringRenderer(false);
    });

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
      fastCreateDomTree(el, el, renderer, () => new FuelStem(), []);
      expect(el.dom.toString()).to.be.eq('<div><ul><li><span>text</span></li><li><span>text2</span></li><li><span><a href="javascript:void(0)">text3</a></span></li><li><table><thead><tr><th>header1</th><th>header2</th><th>header3</th></tr></thead><tbody><tr><td>body1</td><td>body2</td><td>boy3</td></tr></tbody></table></li></ul></div>');
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
      fastCreateDomTree(el, el, renderer, () => new FuelStem(), []);
      expect(el.dom.toString()).to.be.eq('<div><ul><li><span>text</span></li><li><span>text2</span></li><li><span><a href="javascript:void(0)">text3</a></span></li><li><table><thead><tr><th>header1</th><th>header2</th><th>header3</th></tr></thead><tbody><tr><td>body1</td><td>body2</td><td>boy3</td></tr></tbody></table></li></ul></div>');
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
      fastCreateDomTree(el, el, renderer, () => new FuelStem(), []);
      expect(el.dom.toString()).to.be.eq('<div><ul><li><span>text</span></li><li><span>text2</span></li><li><span><a href="javascript:void(0)">text3</a></span></li><li><table><thead><tr><th>header1</th><th>header2</th><th>header3</th></tr></thead><tbody><tr><td>body1</td><td>body2</td><td>boy3</td></tr></tbody></table></li></ul></div>');
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
      fastCreateDomTree(el, el, renderer, () => new FuelStem(), []);
      expect(el.dom.toString()).to.be.eq('<div><ul><li><span>text</span></li><li><span>text2</span></li><li><span><a href="javascript:void(0)">text3</a></span></li><li><div><table><thead><tr><th>header1</th><th>header2</th><th>header3</th></tr></thead><tbody><tr><td>body1</td><td>body2</td><td>boy3</td></tr></tbody></table></div></li></ul></div>');
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
      fastCreateDomTree(el, el, renderer, () => new FuelStem(), []);
      expect(el.dom.toString()).to.be.eq('<div><div><span>foo-bar-baz</span></div></div>');
    });
  });
});
