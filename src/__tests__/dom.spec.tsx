/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  FuelDOM
} from '../dom';
import {
  React,
  Fuel
} from '../fuel';
import {
  expect
} from 'chai';
import {
  domOps
} from '../domops';


describe('FuelDOM', () => {
  let dom;

  beforeEach(() => {
    domOps.resetId();
    dom = document.body.appendChild(document.createElement('div'));
  });

  afterEach(() => {
    domOps.resetId();
    dom && dom.parentNode.removeChild(dom);
  });
  
  describe('@render()', () => {
    it('should throw if non html element is passed', () => {
      expect(() => FuelDOM.render(<div />, {} as any)).throw(Error);
    });

    it('should throw if text node is passed', () => {
      expect(() => FuelDOM.render(<div />, document.createTextNode('test'))).throw(Error);
    });

    it('should throw if external element has ref', () => {
      expect(() => FuelDOM.render(<div ref="foo"/>, dom)).throw(Error);
    });

    it('should render first dom node', done => {
      FuelDOM.render(<div><span>foobarbaz</span></div>, dom, (tree: HTMLElement) => {
        expect(tree.tagName).to.be.eq('DIV');
        expect(tree.firstElementChild.tagName).to.be.eq('SPAN');
        expect(tree.firstElementChild.textContent).to.be.eq('foobarbaz');
        done();
      });
    });

    it('should set style 1', done => {
      FuelDOM.render(<div style={{width: 100, height: 100, backgroundColor: '#0099FF'}}></div>, dom, (tree: HTMLElement) => {
        const {style} = tree;
        expect(style.width).to.be.eq('100px');
        expect(style.height).to.be.eq('100px');
        expect(style.backgroundColor).to.be.eq('rgb(0, 153, 255)');
        done();
      });
    });

    it('should set style 2.', done => {
      FuelDOM.render(<div style={{display: 'flex', flexGrow: 3, flexShrink: 2, flexDirection: 'column', flexWrap: 'nowrap'}}></div>, dom, (tree: HTMLElement) => {
        const {style} = tree;
        expect(style.display).to.be.eq('flex');
        expect(style.flexGrow).to.be.eq('3');
        expect(style.flexShrink).to.be.eq('2');
        expect(style.flexDirection).to.be.eq('column');
        expect(style.flexWrap).to.be.eq('nowrap');
        done();
      });
    });

    it('should update style', done => {
      class Component extends Fuel.Component<any, any> {
        public state = {width: 100, height: 100};
        render() {
          return <div ref="div" onClick={e => this.handleClick(e)} style={this.state}></div>
        }
        handleClick(e: Event) {
          this.setState({width: 200, height: 200, color: '#FFF'}, () => {
            const style = this.refs['div']['style'];
            expect(style.width).to.be.eq('200px');
            expect(style.height).to.be.eq('200px');
            expect(style.color).to.be.eq('rgb(255, 255, 255)');
            done();
          });
        }
      }
      FuelDOM.render(<Component />, dom, (tree: HTMLElement) => {
        tree.click();
      });
    });

    it('should update context', done => {
      class ContextComponent extends Fuel.Component<any, any> {
        state = {className: 'context-class-name'}
        render() {
          return (
            <div className="target" onClick={e => this.handleClick()}>
              {this.props.children}
            </div>
          );
        }
        getChildContext() {return this.state}
        handleClick() {
          this.setState({className: 'context-updated-class-name'});
        }
      }

      class InnerComponent extends Fuel.Component<any, any> {
        public context: any;
        render() {
          return (
            <span ref="span" className={this.context.className}>
            </span>
          );
        }
        componentDidUpdate() {
          expect(this.refs['span']['className']).to.be.eq('context-updated-class-name');
          done();
        }
      }

      FuelDOM.render(<ContextComponent><InnerComponent/></ContextComponent>, dom, (tree: HTMLElement) => {
        tree.click();
      });
    });

    it('should render only internal component', done => {
      class Component extends Fuel.Component<any, any> {
        public state = {value: 2};

        public render() {
          return (
            <div className={'foo-bar'} onClick={e => this.handleClick(e)}>
              {
                this.state.value % 2 === 0? <span>foo-bar-baz</span>: <div></div>
              }
            </div>
          )
        }

        private handleClick(e: Event) {
          this.setState({value: this.state.value + 1});
        }
      }
      FuelDOM.render(<div><Component /></div>, dom, () => {
        dom.querySelector('.foo-bar').click();
        setTimeout(() => {
          dom.querySelector('.foo-bar').click();
          setTimeout(() => {
            done();
          }, 100);
        }, 100);
      });
    });

    it('should handle change event on input/textarea', () => {
      class A extends Fuel.Component<any, any> {
        state = {text: ''}
        render() {
          return <input type="text" onChange={e => this.handleChange(e)} value={this.state.text}/>;
        }
        handleChange(e) {
          this.setState({text: e.target.value});
        }
      }
    });

    it('should skip rendering null', done => {
      FuelDOM.render(<div><span>foo</span><span>bar</span></div>, dom, () => {
        FuelDOM.render(<div><span>foo</span>{null}</div>, dom, (tree: HTMLElement) => {
          const found = tree.querySelectorAll('div>span');
          expect(found.length).to.be.eq(1);
          expect(found[0].textContent).to.be.eq('foo');
          done();
        });
      });
    });
  });
})
