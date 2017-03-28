/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fueldom_1 = require("fueldom");
function parseURL(url) {
    var paths = url ? url.split('/') : location.hash.slice(1).split('/');
    if (!paths[0]) {
        paths[0] = '/';
    }
    if (paths.length && paths[paths.length - 1] === '') {
        paths.splice(paths.length - 1, 1);
    }
    return paths;
}
var EmptyRoot = function (_a) {
    var children = _a.children;
    return ({ children: children });
};
var Router = (function (_super) {
    tslib_1.__extends(Router, _super);
    function Router(p, c) {
        var _this = _super.call(this, p, c) || this;
        _this.state = { url: parseURL() };
        window.addEventListener('hashchange', function (event) {
            var url = event.newURL.match(/#(.+)/);
            _this.setState({ url: parseURL(url ? url[1] : '/') });
        }, false);
        return _this;
    }
    Router.prototype.render = function () {
        var _this = this;
        return fueldom_1.React.createElement("div", null, fueldom_1.Fuel.Children.map(this.props.children, function (child) { return fueldom_1.Fuel.cloneElement(child, { location: _this.state.url }); }));
    };
    return Router;
}(fueldom_1.Fuel.Component));
var Route = (function (_super) {
    tslib_1.__extends(Route, _super);
    function Route() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Route.prototype.render = function () {
        var paths = parseURL(this.props.path);
        var length = paths.length;
        var Component = this.props.component;
        var match = this.props.location.every(function (path, i) {
            if (path === paths[0]) {
                paths.shift();
                return true;
            }
            return false;
        });
        return (length !== paths.length && fueldom_1.Fuel.Children.count(this.props.children)) || match ?
            fueldom_1.React.createElement(Component, null, fueldom_1.Fuel.Children.map(this.props.children, function (child) { return fueldom_1.Fuel.cloneElement(child, { location: location }); })) : null;
    };
    return Route;
}(fueldom_1.Fuel.Component));
var Counter = (function (_super) {
    tslib_1.__extends(Counter, _super);
    function Counter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { count: 0, text: '' };
        return _this;
    }
    Counter.prototype.render = function () {
        var _this = this;
        return (fueldom_1.React.createElement("div", null,
            fueldom_1.React.createElement("a", { href: "javascript:void(0)", onClick: function (e) { return _this.handleClick(e); } }, "count"),
            fueldom_1.React.createElement("input", { type: "text", onChange: function (e) { return _this.handleText(e); }, value: this.state.text }),
            fueldom_1.React.createElement("p", null,
                this.state.count,
                ":",
                this.state.text)));
    };
    Counter.prototype.handleClick = function (e) {
        this['setState']({ count: this.state.count + 1 });
    };
    Counter.prototype.handleText = function (e) {
        this.setState({ text: e.target.value });
    };
    return Counter;
}(fueldom_1.Fuel.Component));
var Test = (function (_super) {
    tslib_1.__extends(Test, _super);
    function Test() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Test.prototype.render = function () {
        return fueldom_1.React.createElement("h1", null, "NEXT PAGE");
    };
    return Test;
}(fueldom_1.Fuel.Component));
fueldom_1.FuelDOM.render((fueldom_1.React.createElement(Router, null,
    fueldom_1.React.createElement(Route, { path: "/", component: Counter }),
    fueldom_1.React.createElement(Route, { path: "/test", component: Test }))), document.getElementById('app'));
