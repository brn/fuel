/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import {
  FuelDOM,
  Fuel,
  React
} from 'fueldom';
import {
  Router,
  Route
} from 'fuel-router';


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
