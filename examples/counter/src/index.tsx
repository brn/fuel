/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  FuelDOM,
  Fuel,
  React
} from 'fueldom';


const PATH_REGEXP = /^:(.+)$/;


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
    const Component = this.props.component;
    const location = this.props.location.slice();
    const length = location.length;
    const params = {...this.props.params || {}};
    const match = paths.every((path, i) => {
      if (PATH_REGEXP.test(path)) {
        params[path.match(PATH_REGEXP)[1]] = location.shift();
        return true;
      } else if (path === location[0]) {
        location.shift();
        return true;
      }
      return false;
    });

    if ((length !== location.length && Fuel.Children.toArray(this.props.children).filter(t => t.type === Route).length) || (match && !location.length)) {
      const children = Fuel.Children.map(this.props.children, child => Fuel.cloneElement(child, {location: location, params}));
      if (Component) {
        return <Component>{children}</Component>;
      }
      return <div>{children}</div>
    }
    return null;
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


class HandleId extends Fuel.Component<any, any> {
  render() {
    return <span>ID: {this.props.params.id}</span>;
  }
}

FuelDOM.render((
  <Router>
    <Route path="/" component={Counter}/>
    <Route path="/test">
      <Route path="foo" component={Test}/>
      <Route path=":id" component={HandleId}/>
    </Route>
  </Router>
), document.getElementById('app') as any);
