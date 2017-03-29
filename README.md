# What's this?

**NOW THIS PRODUCT IS BETA**

The FuelDOM is React compatible virtual-dom implementation.

* File size is samller than Reactjs **8.79 KB gzipped(raw 24.92 KB)**
* No dependencies.
* Change vdom patch function as using requestAnimationFrame and requestIdleCallback.
* Compatible with jsx.

## Installation

```shell
npm install fueldom --save
```

## Now compatible with

* JSX
* React Component feature like `setState`.
* React Component hooks like `componentWillMount`
* Element Props.
* DOM Event handler.
* DOM Style props.
* Component Context
* Style
* Element ref

## Omitted

* React.PropTypes.xxx runtime type checks(React.PropTypes is exists, but ignored).
* Style Property name check.
* Some error checks(maybe implemented in future).

## Usage

### Simple rendering

```javascript
import {
  Fuel,
  React,
  FuelDOM
} from 'fueldom';

class Component extends Fuel.Component {
  render() {
    return (
      <div>
        <span>Hello World</span>
      </div>
    )
  }
}

FuelDOM.render(<Component/>, document.getElementById('app'));
```

## Future

### WE WON'T DO

* 100% compatiblity with React.
* React fiber.

### WE WILL DO

* Improve code size to make it more samll.
* Improve vdom patch method to make it more fast.
* Original functionarity or api.
* Partial vdom update system(get rid of shouldComponentUpdate) like [react-mvi](https://github.com/brn/react-mvi).

## Eco Systems

Now router is available [fuel-router](https://github.com/brn/fuel-router).

## Contribute

Fork!

```
yarn install
yarn run ut+ct
yarn run minify
```
Send PR!
