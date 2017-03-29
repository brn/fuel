/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fueldom_1 = require("fueldom");
var PATH_REGEXP = /^:(.+)$/;
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
        var Component = this.props.component;
        var location = this.props.location.slice();
        var length = location.length;
        var params = tslib_1.__assign({}, this.props.params || {});
        var match = paths.every(function (path, i) {
            if (PATH_REGEXP.test(path)) {
                params[path.match(PATH_REGEXP)[1]] = location.shift();
                return true;
            }
            else if (path === location[0]) {
                location.shift();
                return true;
            }
            return false;
        });
        if ((length !== location.length && fueldom_1.Fuel.Children.toArray(this.props.children).filter(function (t) { return t.type === Route; }).length) || (match && !location.length)) {
            var children = fueldom_1.Fuel.Children.map(this.props.children, function (child) { return fueldom_1.Fuel.cloneElement(child, { location: location, params: params }); });
            console.log(children);
            if (Component) {
                return fueldom_1.React.createElement(Component, null, children);
            }
            return fueldom_1.React.createElement("div", null, children);
        }
        return null;
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
var HandleId = (function (_super) {
    tslib_1.__extends(HandleId, _super);
    function HandleId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HandleId.prototype.render = function () {
        return fueldom_1.React.createElement("span", null,
            "ID: ",
            this.props.params.id);
    };
    return HandleId;
}(fueldom_1.Fuel.Component));
fueldom_1.FuelDOM.render((fueldom_1.React.createElement(Router, null,
    fueldom_1.React.createElement(Route, { path: "/", component: Counter }),
    fueldom_1.React.createElement(Route, { path: "/test" },
        fueldom_1.React.createElement(Route, { path: "foo", component: Test }),
        fueldom_1.React.createElement(Route, { path: ":id", component: HandleId })))), document.getElementById('app'));
