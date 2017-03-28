/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  FuelDOM,
  Fuel,
  React
} from 'fueldom';


function parseURL(url?: string) {
  const paths = url? url.split('/'): location.hash.slice(1).split('/');

  if (!paths[0]) {
    paths[0] = '/'
  }

  if (paths.length && paths[paths.length - 1] === '') {
    paths.splice(paths.length - 1, 1);
  }

  return paths;
}


const EmptyRoot = ({children}) => ({children});


class Router extends Fuel.Component<any, any> {
  public state = {url: parseURL()}

  constructor(p, c) {
    super(p, c)
    window.addEventListener('hashchange', event => {
      const url = event.newURL.match(/#(.+)/);
      this.setState({url: parseURL(url? url[1]: '/')});
    }, false);
  }

  public render() {
    return <div>{Fuel.Children.map(this.props.children, child => Fuel.cloneElement(child, {location: this.state.url}))}</div>
  }
}


class Route extends Fuel.Component<any, any> {
  public render() {
    const paths = parseURL(this.props.path);
    const length = paths.length;
    const Component = this.props.component;
    const match = this.props.location.every((path, i) => {
      if (path === paths[0]) {
        paths.shift();
        return true
      }
      return false;
    });

    return (length !==  paths.length && Fuel.Children.count(this.props.children)) || match?
           <Component>{Fuel.Children.map(this.props.children, child => Fuel.cloneElement(child, {location: location}))}</Component>: null;
  }
}


class Counter extends Fuel.Component<any, any> {
  public state = {count: 0, text: ''}

  render() {
    return (
      <div>
        <a href="javascript:void(0)" onClick={e => this.handleClick(e)}>count</a>
        <input type="text" onChange={e => this.handleText(e)} value={this.state.text}/>
        <p>{this.state.count}:{this.state.text}</p>
      </div>
    );
  }

  private handleClick(e) {
    this['setState']({count: this.state.count + 1});
  }

  private handleText(e) {
    this.setState({text: e.target.value});
  }
}


class Test extends Fuel.Component<any, any> {
  render() {
    return <h1>NEXT PAGE</h1>
  }
}

FuelDOM.render((
  <Router>
    <Route path="/" component={Counter}/>
    <Route path="/test" component={Test}/>
  </Router>
), document.getElementById('app') as any);
