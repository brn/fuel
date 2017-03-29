/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  FuelDOM,
  Fuel,
  React
} from 'fueldom';


const PATH_REGEXP = /^\:(.+)$/;


function parseURL(url?: string) {
  let path = url || location.hash.slice(1);

  if (!path) {
    path = '/';
  }

  if (path.charAt(0) !== '/') {
    path = `/${path}`;
  }

  if (path.length > 1 && path.charAt(path.length - 1) === '/') {
    path = path.slice(0, path.length - 1);
  }

  return path;
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
  private matchs;

  private params = {};

  private parent;

  public render() {
    const Component = this.props.component;
    const location = this.props.location;
    const parent = this.parent;
    if (this.matchs && this.matchs.length > 0) {
      const children = Fuel.Children.map(this.props.children, child => Fuel.cloneElement(child, {location, parent, params: this.params}));
      if (Component) {
        return <Component params={this.params}>{children}</Component>;
      }
      return <div>{children}</div>;
    } else if (Fuel.Children.toArray(this.props.children).filter(child => child.type === Route).length) {
      return <div>{Fuel.Children.map(this.props.children, child => Fuel.cloneElement(child, {location, parent}))}</div>;
    }
    return null;
  }


  public componentWillMount() {
    const {location} = this.props;
    this.parent = `${this.props.parent? this.props.parent: ''}${parseURL(this.props.path)}`;
    let match
    const ids = [];
    const replaced = this.parent.replace(/\:[^\/]+/g, id => {
      ids.push(id.slice(1));
      return '([^/]+)';
    });
    const regexp = new RegExp(`^${replaced}$`);
    this.matchs = location.match(regexp);
    if (this.matchs && this.matchs.length > 0) {
      this.matchs.slice(1).forEach((match, index) => this.params[ids[index]] = match);
    }
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
      <Route path="bar">
        <Route path=":id" component={HandleId}/>
      </Route>
    </Route>
  </Router>
), document.getElementById('app') as any);
