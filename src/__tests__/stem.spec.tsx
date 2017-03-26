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
  FuelStem
} from '../stem';
import {
  StringRenderer
} from '../renderer/string-renderer';
import {
  Fuel,
  React
} from '../fuel';

describe('stem', () => {
  beforeEach(() => {
    FuelStem.renderer = new StringRenderer();
  });

  afterEach(() => {
    FuelStem.renderer = null;
  });

  describe('render', () => {
    it('create real dom element', done => {
      const tree = (
        <div>
          <span className="foo-bar">
            <a href="javascript:void(0)">text</a>
          </span>
          <span className="foo-bar-baz-qux">
            text2
          </span>
        </div>
      );
      const s = new FuelStem();
      s.render(tree, dom => {
        expect(dom.toString()).to.be.eq('<div data-id="1"><span data-id="1" class="foo-bar"><a data-id="1" href="javascript:void(0)">text</a></span><span data-id="1" class="foo-bar-baz-qux">text2</span></div>');
        done();
      });
    })

    it('update real dom element', done => {
      const tree = (
        <div>
          <span className="foo-bar">
            <a href="javascript:void(0)">text</a>
          </span>
          <span className="foo-bar-baz-qux">
            text2
          </span>
        </div>
      );
      const s = new FuelStem();
      s.render(tree, () => {
        const newTree = (
          <div className="foo-bar-baz-0">
            <span className="foo-bar-baz-1">
              <a href="javascript:void(0)">text</a>
            </span>
            <span className="foo-bar-baz-qux-2">
              text2
            </span>
          </div>
        );
        s.render(newTree, dom => {
          expect(dom.toString()).to.be.eq('<div data-id="1" class="foo-bar-baz-0"><span data-id="1" class="foo-bar-baz-1"><a data-id="1" href="javascript:void(0)">text</a></span><span data-id="1" class="foo-bar-baz-qux-2">text2</span></div>');
          done();
        });
      });
    });

    it('update real dom element2', done => {
      const tree = (
        <div>
          <span className="foo-bar">
            <a href="javascript:void(0)">text</a>
          </span>
          <span className="foo-bar-baz-qux">
            text2
          </span>
        </div>
      );
      const s = new FuelStem();
      s.render(tree, () => {
        const newTree = (
          <div className="foo-bar-baz-0">
            <ul>
              <li>
                <span>text1</span>
              </li>
              <li>
                <span>text2</span>
              </li>
              <li>
                <span>text3</span>
              </li>
            </ul>
            <span className="foo-bar-baz-2">text</span>
          </div>
        );
        
        s.render(newTree, dom => {
          try {
            expect(dom.toString()).to.be.eq('<div data-id="1" class="foo-bar-baz-0"><ul data-id="2"><li data-id="2"><span data-id="2">text1</span></li><li data-id="2"><span data-id="2">text2</span></li><li data-id="2"><span data-id="2">text3</span></li></ul><span data-id="1" class="foo-bar-baz-2">text</span></div>');
          } catch(e) {
            return done(e);
          }
          done();
        });
      });
    })

    it('update with component', done => {
      let flag = true;
      let called = 0;
      class Component extends Fuel.FuelComponent<any, any> {
        constructor() {
          super();
          called++;
        }
        public render() {
          return (
            <ul className="foobar-baz">
              <li>
                <span className={`foobar-baz-${flag}`}>
                  <a href="javascript:void(0)">bar</a>
                </span>
              </li>
              {
                flag? <li>
                <span className="foobar-baz">
                  <a href="javascript:void(0)">baz</a>
                </span>
                </li>: <li>Changed!</li>
              }
            </ul>
          )
        }
      }
      let ret = (
        <div className="foobar">
          <span className="foobar-baz">
            <a href="javascript:void(0)">This is A tag.</a>
          </span>
          <Component />
        </div>
      );
      const s = new FuelStem();

      s.render(ret, n => {
        expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-true"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">baz</a></span></li></ul></div>');
        flag = false;
        ret = (
          <div className="foobar">
            <span className="foobar-baz">
              <a href="javascript:void(0)">This is A tag.</a>
            </span>
            <Component />
          </div>
        );
        s.render(ret, n => {
          try {
            expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-false"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1">Changed!</li></ul></div>');
          } catch(e) {
            return done(e)
          }
          done();
        });
      });
    });


    class Component extends Fuel.FuelComponent<any, any> {
      constructor(props) {
        super(props);
      }
      public render() {
        return (
          <ul className="foobar-baz">
            <li>
              <span className={`foobar-baz-${this.props.flag.value}`}>
                <a href="javascript:void(0)">bar</a>
              </span>
            </li>
            {
              this.props.flag.value? <li>
              <span className="foobar-baz">
                <a href="javascript:void(0)">baz</a>
              </span>
              </li>: <li>Changed!</li>
            }
          </ul>
        )
      }
    }

    class IDComponent extends Fuel.FuelComponent<any, any> {
      render() {
        return <Component {...this.props}/>;
      }
    }

    class NestedComponent extends Fuel.FuelComponent<any, any> {
      render() {
        return (
          <div>
            <Component {...this.props}/>
          </div>
        )
      }
    }

    it('update with nested component', done => {
      const props = {value: true};
      let ret = (
            <div className="foobar">
              <span className="foobar-baz">
                <a href="javascript:void(0)">This is A tag.</a>
              </span>
              <IDComponent flag={props}/>
            </div>
            );
      const s = new FuelStem();

      s.render(ret, n => {
        expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-true"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">baz</a></span></li></ul></div>');
        props.value = false;
        ret = (
          <div className="foobar">
            <span className="foobar-baz">
              <a href="javascript:void(0)">This is A tag.</a>
            </span>
            <IDComponent flag={props}/>
          </div>
        );
        s.render(ret, n => {
          try {
            expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-false"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1">Changed!</li></ul></div>');
          } catch(e) {
            return done(e)
          }
          done();
        });
      });
    });

    it('update with nested component 2', done => {
      const props = {value: true};
      let ret = (
        <div className="foobar">
          <span className="foobar-baz">
            <a href="javascript:void(0)">This is A tag.</a>
          </span>
          <NestedComponent flag={props}/>
        </div>
      );
      const s = new FuelStem();

      s.render(ret, n => {
        expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><div data-id="1"><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-true"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">baz</a></span></li></ul></div></div>');
        props.value = false;
        ret = (
          <div className="foobar">
            <span className="foobar-baz">
              <a href="javascript:void(0)">This is A tag.</a>
            </span>
            <NestedComponent flag={props}/>
          </div>
        );
        s.render(ret, n => {
          try {
            expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><div data-id="1"><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-false"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1">Changed!</li></ul></div></div>');
          } catch(e) {
            return done(e)
          }
          done();
        });
      });
    });

    it('update keyed item', done => {
      let flag = true;
      let called = 0;
      class Component extends Fuel.FuelComponent<any, any> {
        constructor() {
          super();
          called++;
        }
        public render() {
          return (
            <ul className="foobar-baz">
              {
                flag? [
                  <li key="1">
                    <span className={`foobar-baz-1`}>
                      <a href="javascript:void(0)">bar</a>
                    </span>
                  </li>,
                  <li key="2">
                    <span className="foobar-baz-2">
                      <a href="javascript:void(0)">baz</a>
                    </span>
                  </li>
                ]: [
                  <li key="2">
                    <span className="foobar-baz-2">
                      <a href="javascript:void(0)">baz</a>
                    </span>
                  </li>,
                  <li key="1">
                    <span className={`foobar-baz-1`}>
                      <a href="javascript:void(0)">bar</a>
                    </span>
                  </li>
                ]
              }
            </ul>
          );
        }
      }
      const tree = () => (
        <div className="foobar">
          <span className="foobar-baz">
            <a href="javascript:void(0)">This is A tag.</a>
          </span>
          <Component />
        </div>
      );
      const s = new FuelStem();
      s.render(tree(), n => {
        expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-1"><a data-id="1" href="javascript:void(0)">bar</a></span></li><li data-id="1"><span data-id="1" class="foobar-baz-2"><a data-id="1" href="javascript:void(0)">baz</a></span></li></ul></div>');
        flag = false;
        s.render(tree(), n => {
          try {
            expect(n.toString()).to.be.eq('<div data-id="1" class="foobar"><span data-id="1" class="foobar-baz"><a data-id="1" href="javascript:void(0)">This is A tag.</a></span><ul data-id="1" class="foobar-baz"><li data-id="1"><span data-id="1" class="foobar-baz-2"><a data-id="1" href="javascript:void(0)">baz</a></span></li><li data-id="1"><span data-id="1" class="foobar-baz-1"><a data-id="1" href="javascript:void(0)">bar</a></span></li></ul></div>');
          } catch(e) {
            return done(e)
          }
          done();
        });
      });
    })
  });
});
