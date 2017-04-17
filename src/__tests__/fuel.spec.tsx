/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  Fuel,
  React
} from '../fuel';
import {
  FuelElementView
} from '../element';
import * as sourceMap from 'source-map-support';
import {
  FuelStem
} from '../stem';
import {
  expect
} from 'chai';


class Component extends Fuel.Component<any, any> {
  public render() {
    return (
      <ul className="foobar-baz">
        <li>
          <span className="foobar-baz">
            <a href="javascript:void(0)">bar</a>
          </span>
        </li>
        <li>
          <span className="foobar-baz">
            <a href="javascript:void(0)">baz</a>
          </span>
        </li>
      </ul>
    )
  }
}

sourceMap.install();
describe('Fuel', () => {
  describe('createElement', () => {
    it('create element', () => {
      const ret = (
        <div className="foobar">
          <span className="foobar-baz">
            <a href="javascript:void(0)">This is A tag.</a>
          </span>
          <Component />
        </div>
      );
    })
  });

  describe('isValidElement', () => {
    it('return element is valid or not', () => {
      expect(Fuel.isValidElement({})).to.be.false;
      expect(Fuel.isValidElement(<div></div>)).to.be.true;
    });
  });

  describe('createFactory', () => {
    it('create element factory function', () => {
      const el = Fuel.createFactory('div');
      expect(Fuel.isValidElement(el())).to.be.true;
    });
  });
});
