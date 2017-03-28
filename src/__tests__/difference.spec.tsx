/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  diff,
  AttrState,
  isReplaceElement,
  isNewElement,
  isCreateChildren,
  isRemoveElement,
  isTextChanged
} from '../difference';
import {
  Fuel,
  React
} from '../fuel';
import {
  expect
} from 'chai';


describe('diff', () => {
  it('no difference', () => {
    const a = <div></div>;
    const b = <div></div>;
    const difference = diff(a, b);
    expect(difference.flags).to.be.eq(0);
  });

  it('change tag name', () => {
    const a = <div></div>;
    const b = <span></span>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(true);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
  });

  it('create new tag', () => {
    const a = null;
    const b = <span><span></span></span>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(true);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
  });

  it('remove tag', () => {
    const a = <div><span></span></div>;
    const b = null;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(true);
  });

  it('change text', () => {
    const a = <div>text</div>;
    const b = <div>text2</div>;
    const difference = diff(a.children[0], b.children[0]);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(true);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
  });

  it('create children', () => {
    const a = <div></div>;
    const b = <div><span/></div>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(true);
    expect(isRemoveElement(difference)).to.be.eq(false);
  });

  it('create children', () => {
    const a = <div></div>;
    const b = <div><span/></div>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(true);
    expect(isRemoveElement(difference)).to.be.eq(false);
  });

  it('update props', () => {
    const a = <a href="javascript:void(0)" target="_blank"></a>;
    const b = <a href="https://www.test.com" target="_blank"></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'href', value: 'https://www.test.com', state: AttrState.REPLACED}]);
  });

  it('remove props', () => {
    const a = <a href="javascript:void(0)" target="_blank"></a>;
    const b = <a href="javascript:void(0)"></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'target', value: '_blank', state: AttrState.REMOVED}]);
  });

  it('new props', () => {
    const a = <a href="javascript:void(0)"></a>;
    const b = <a href="javascript:void(0)" target="_blank"></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'target', value: '_blank', state: AttrState.NEW}]);
  });

  it('update style', () => {
    const a = <a href="javascript:void(0)" style={{width: 100, height: 100}}></a>;
    const b = <a href="javascript:void(0)" style={{width: 200, height: 100}}></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'style', value: {width: 200}, state: AttrState.STYLE_CHANGED}]);
  });

  it('new style', () => {
    const a = <a href="javascript:void(0)" style={{width: 100}}></a>;
    const b = <a href="javascript:void(0)" style={{width: 100, height: 100}}></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'style', value: {height: 100}, state: AttrState.STYLE_CHANGED}]);
  });

  it('new + update style', () => {
    const a = <a href="javascript:void(0)" style={{width: 100}}></a>;
    const b = <a href="javascript:void(0)" style={{width: 200, height: 100}}></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'style', value: {width: 200, height: 100}, state: AttrState.STYLE_CHANGED}]);
  });

  it('remove style', () => {
    const a = <a href="javascript:void(0)" style={{width: 100, height: 100}}></a>;
    const b = <a href="javascript:void(0)" style={{width: 200}}></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'style', value: {width: 200, height: ''}, state: AttrState.STYLE_CHANGED}]);
  });

  it('new + remove style', () => {
    const a = <a href="javascript:void(0)" style={{width: 100, height: 100}}></a>;
    const b = <a href="javascript:void(0)" style={{width: 200, color: '#FFCC00'}}></a>;
    const difference = diff(a, b);
    expect(isReplaceElement(difference)).to.be.eq(false);
    expect(isTextChanged(difference)).to.be.eq(false);
    expect(isNewElement(difference)).to.be.eq(false);
    expect(isCreateChildren(difference)).to.be.eq(false);
    expect(isRemoveElement(difference)).to.be.eq(false);
    expect(difference.attr).to.be.deep.equal([{key: 'style', value: {width: 200, height: '', color: '#FFCC00'}, state: AttrState.STYLE_CHANGED}]);
  });
});
