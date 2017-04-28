(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fuel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var benchmark = _dereq_(5);
var fueldom_1 = _dereq_(2);
var NAME = 'Fuel';
var VERSION = '0.1.2';
function renderTree(nodes) {
    var children = [];
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.children !== null) {
            children.push((fueldom_1.React.createElement("div", { key: n.key }, renderTree(n.children))));
        }
        else {
            children.push((fueldom_1.React.createElement("span", { key: n.key }, n.key)));
        }
    }
    return children;
}
function BenchmarkImpl(container, a, b) {
    this.container = container;
    this.a = a;
    this.b = b;
}
BenchmarkImpl.prototype.setUp = function () {
};
BenchmarkImpl.prototype.tearDown = function () {
    fueldom_1.Fuel.unmountComponentAtNode(this.container);
};
BenchmarkImpl.prototype.render = function () {
    fueldom_1.FuelDOM.render(fueldom_1.React.createElement("div", null, renderTree(this.a)), this.container);
};
BenchmarkImpl.prototype.update = function () {
    fueldom_1.FuelDOM.render(fueldom_1.React.createElement("div", null, renderTree(this.b)), this.container);
};
document.addEventListener('DOMContentLoaded', function (e) {
    benchmark(NAME, VERSION, BenchmarkImpl);
}, false);

},{"2":2,"5":5}],2:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Fuel=e()}}(function(){return function e(t,n,r){function o(a,u){if(!n[a]){if(!t[a]){var l="function"==typeof _dereq_&&_dereq_;if(!u&&l)return l(a,!0);if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var s=n[a]={exports:{}};t[a][0].call(s.exports,function(e){var n=t[a][1][e];return o(n?n:e)},s,s.exports,e,t,n,r)}return n[a].exports}for(var i="function"==typeof _dereq_&&_dereq_,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,t,n){"use strict";function r(e,t){if(null===e)return!t&&void 0!==t;var n=l.g(e),r=l.g(t);return"number"!==n||isFinite(e)?"date"===n&&"date"===r?e.toJSON()===t.toJSON():"regexp"===n&&"regexp"===r?e.toString()===t.toString():e===t:!isFinite(t)&&(e!==1/0||t===1/0)}function o(e,t){var n=l.g(e),o=l.g(t);if(n!==o)return!1;if(n===o)return!0;if("array"===n){for(var i=e.length>t.length?e.length:t.length,a=0;a<i;a++)if(!r(e[a],t[a]))return!1;return!1}if("object"===n){var u=l.h(e),c=l.h(t),s=u.length,f=c.length;if(s!==f)return!1;for(var i=s>f?s:f,a=0;a<i;a++){if(!r(e[u[a]],t[c[a]]))return!1}return!0}return r(e,t)}function i(e,t){var n={},o={},i=0;if(t===e)return[n,0];for(var a in t){var u=t[a];a in e&&r(e[a],u)?o[a]=1:(n[a]=u,i++)}for(var c=l.h(e),s=0,f=c.length;s<f;s++)n[c[s]]||o[c[s]]||(n[c[s]]="",i++);return[n,i]}function a(e,t,n,r,o,i,a){var u=!!r&&1===r.children.length,l=c(i),f=c(o);return 0!==n&&a.move(t,n,o),null===o&&i?l&&u?(a.i(r,i),3):u?(a.j(r),a.append(e,r,i),3):(a.k(t,e,r,i),2):null===i&&o?(a.remove(t,r,o),2):f&&l?(s(o)!==s(i)&&a.l(t,r,i),2):o.type!==i.type?(a.replace(t,r,i,o,e),2):(l||a.update(i,o),i&&i.children.length>0&&(null===o||0===o.children.length)?(a.m(e,i),2):i&&0===i.children.length&&o&&o.children.length>0?(a.j(i),2):1)}Object.defineProperty(n,"__esModule",{value:!0});var u=e(4),l=e(18);n.o=r,n.p=o,n.q=i;var c=(u.t.s,u.t.u),s=u.t.v;n.A=a},{18:18,4:4}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(15),o=e(4),i=e(18),a=o.t.B;n.FuelDOM={render:function(e,t,n){void 0===n&&(n=function(e){});var u=t.style.display;t.style.display="none",i.C(e.props.D,"Can't declare ref props outside of Component"),i.C(!t||1!==t.nodeType,"FuelDOM.render only accept HTMLElement node. but got "+t);var l=o.t.F(t);l&&(e.G=l.G),e.G||(e.G=new r.H),a(t,e),e.I=e,e.G.render(e,function(e){t.appendChild(e),t.style.display=u,n&&n(t.firstElementChild)})}},n.J=n.FuelDOM},{15:15,18:18,4:4}],3:[function(e,t,n){(function(t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(14),o={},i=(r.L.K,0);n.M={N:function(){i=0},O:function(){i++},P:function(e){var n;return(n=o[e])||(n=o[e]=document.createElement(e)),n=n.cloneNode(!1),t&&n.setAttribute("data-id",""+i),n},R:function(e){return document.createTextNode(e)},S:function(){return document.createDocumentFragment()}}}).call(this,!0)},{14:14}],4:[function(e,t,n){"use strict";function r(e){return"function"==typeof e}function o(e,t,n){n?e[t]=t:e.removeAttribute(t)}function i(e,t,r){void 0===t&&(t={}),void 0===r&&(r=e.children),d.C(!n.t.T(e),"cloneElement only clonable FuelElement but got = "+e);var o=l(e.type,e.key,d.U(e.props,t),r);return o.G=e.G,o.V=e.V,o.I=e.I,o.W=e.W,o}function a(e){return l(M,null,{value:e})}function u(e,t,n,r){n.subscribe&&(e.X||(e.X=[]),e.X.push(n.subscribe(function(n){e.props.some(function(e){return e.name===t&&(e.value=n,!0)})||e.props.push({name:t,value:n}),e.G.render(e)})),e.G=r(),e.G.Y(e))}function l(e,t,n,r){return void 0===t&&(t=null),void 0===r&&(r=[]),new P(e,t,n,r)}function c(e){return l(_,null,{},e)}function s(e,t,n,r){return null===t?null:!C(e)&&Array.isArray(t)?(r.key=null,r.Z=e?e.Z:null,r.children=t,r):g(t)?t:(n.key=null,n.Z=null,n.props.value=""+t,n)}Object.defineProperty(n,"__esModule",{value:!0});var f=e(17),p=e(9),d=e(18),h=e(5),y=e(3),v=d.Symbol("__fuel_element_link");n.$=d.Symbol("__fuelelement"),n.t={_:function(e){return!!e&&(12&e.W)>0},aa:function(e){return!!e&&8==(8&e.W)},ba:function(e){return!!e&&4==(4&e.W)},ca:function(e){return!!e&&32==(32&e.W)},da:function(e){return e.type},ea:function(e){return m(e)?e.type.name||e.type.fa||"Anonymouse":n.t.da(e)},ga:function(e){return e.children.length>0},ha:function(e){e=n.t.s(e),e.Z&&e.Z.ia&&e.I.G.ka().ja(e.Z),e.X&&e.X.forEach(function(e){return e.unsubscribe()})},B:function(e,t){e[v]=t},la:function(e){e[v]=null},F:function(e){return e[v]?e[v]:null},T:function(e){return!!e&&d.ma(e.W)&&1==(1&e.W)},na:function(e){return 2==(2&e.W)},oa:function(e){e.W|=2},u:function(e){return!!e&&64==(64&e.W)},v:function(e){return e.props.value},pa:function(e){return e.qa},ra:function(e){e.V&&e.V.componentDidMount()},sa:function(e){e.V&&e.V.componentDidUpdate()},ta:function(e){e.V&&e.V.ua()},s:function(e){for(var t=e;m(t);)t=t.qa;return t},va:function(e){var t=r(e);return 1|(t&&r(e.prototype.render)?4:t?8:e===_?32:e===M?64:16)},wa:function(e,t,r){var o=(t.props,t.props);if(n.t.aa(t))return[t.type(o,e),e];if(n.t.ba(t)){var i=t.V,a=!!i,u=void 0;i?(i.xa&&(i.xa=e),u=i.ya):(t.G=r(),i=t.V=new t.type(o,e),u={}),i[n.$]=t;var l=d.U(e,i.getChildContext());if(i&&t.qa&&(!d.h(u).length&&!d.h(o).length&&!i.za||!i.shouldComponentUpdate(o,u)))return a&&t.G.Aa(function(){i.componentWillReceiveProps(o),i.ya=o}),[t.qa,l];a&&t.G.Aa(function(){i.componentWillReceiveProps(o),i.ya=o}),t.qa?i.componentWillUpdate():i.componentWillMount();var c=t.qa=i.render();return c&&(c.I=t,n.t._(c)||(c.V=i),c.G=t.G),t.G.Y(t),[c,l]}d.C(!0,"factory element requried but got "+n.t.da(t)+".")},Ba:function(e,t,r,o){var i=e.G.ka();i||(i=new h.Ca,e.G.Da(i));var a=n.t.s(e);i.Ba(a.Z,t.Z,r,o)},Ea:function(e,t){var r,o={};if(b(e))return S(e);for(;m(e);)l=n.t.wa(o,e,function(){return{}}),r=l[0],o=l[1];if(!r)return"";var i=[];for(var a in this){var u=this[a];null!==u&&(f.Fa[a]&&(a=f.Fa[a]),i.push(a+'="'+u+'"'))}return t&&i.unshift("data-fuelchecksum="+e.W),"<"+r.type+(i.length?" "+i.join(" "):"")+">"+e.children.map(function(e){return n.t.Ea(e,t)}).join("")+"</"+r.type+">";var l},Ga:function(e,t,r){if(t.Z)return t.Z;if(b(t))return t.Z=y.M.R(S(t));if(C(t))return t.Z=y.M.S();for(var i=t.props,a=(t.type,n.t.da(t)),l=t.Z=y.M.P(a),c=!1,s=d.h(i),h=0,v=s.length;h<v;++h){var m=s[h];if("children"!==m&&"key"!==m){var g=i[m];if(f.Ha[m])n.t.Ba(e,t,m,g);else if("checked"!==m&&"selected"!==m){if("scoped"===m)c=!0;else{if(g&&(g.Ia||g.subscribe)&&c){u(t,m,g,r);continue}if("style"===m){for(var k in g)p.Ja(l,k,g[k]);continue}if("ref"===m){var _=typeof g;"string"===_?n.t._(e)&&(e.V.refs[g]=l):"function"===_&&g(l);continue}}"htmlFor"===m&&(m="for"),d.C(!f.Ka[m]&&m.indexOf("data-")===-1,m+" is not a valid dom attributes."),l[m]=g}else o(l,m,g)}}return l}};var m=n.t._,b=(n.t.aa,n.t.ba,n.t.u),g=n.t.T,C=n.t.ca,S=n.t.v,k=n.t.va;n.cloneElement=i,n.createTextNode=a;var _="SYNTHETIC_FRAGMENT",M="SYNTHETIC_TEXT",P=function(){function e(e,t,n,r){void 0===t&&(t=null),void 0===r&&(r=[]),this.type=e,this.key=t,this.props=n,this.children=r,this.Z=null,this.I=null,this.W=k(this.type),this.G=null,this.V=null,this.qa=null,this.X=null}return e}();n.La=l,n.Ma=c,n.Na=a(""),n.Oa=a(""),n.Pa=c([]),n.Qa=c([]),n.Ra=s},{17:17,18:18,3:3,5:5,9:9}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(18),o=r.Symbol("__fuelevent"),i=r.Symbol("__root_events"),a=function(){function e(){this.Sa={},this.id=1}return e.prototype.Ba=function(e,t,n,r){var a=this;n=n.replace(/^on/,"").toLowerCase(),e[i]||(e[i]={}),"INPUT"===t.nodeName&&"change"===n&&(n="keyup");var u=String(this.id++);if(e[i][n])this.Sa[n][String(this.Sa[n].count++)]=r;else{e[i][n]=!0;var l=function(e){var t=e.target[o];if(t&&t[e.type]&&t[e.type]===u){var n=a.Sa[e.type][u];n&&n(e)}};this.Sa[n]={count:1,0:l,root:e},e.addEventListener(n,l,!1)}this.Sa[n][u]=r,t[o]?t[o][n]=u:t[o]=(c={},c[n]=u,c);var c},e.prototype.Ta=function(e,t){if(e[o]){var n=e[o];if(n[t]){this.Sa[t][n[t]]=null,this.Sa[t].count--,n[t]=null;var r=this.Sa[t].root;0===this.Sa[t].count&&(r.removeEventListener(t,this.Sa[t][0]),r[i][t]=!1,this.Sa[t].root=null)}}},e.prototype.Ua=function(e,t,n){if(e[o]){var r=e[o];r[t]&&(this.Sa[t][r[t]]=n)}},e.prototype.ja=function(e){if(e[o]){var t=e[o];for(var n in t)this.Ta(e,n)}},e}();n.Ca=a},{18:18}],6:[function(e,t,n){"use strict";function r(e,t){return{parent:e,elements:t}}Object.defineProperty(n,"__esModule",{value:!0}),n.Va=r,n.Wa=Object.freeze(r(null,[]))},{}],7:[function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(n,"__esModule",{value:!0});var o=e(4),i=e(13),a=e(18),u=e(1),l={string:1,function:1},c=function(){function e(e,t){void 0===e&&(e={}),void 0===t&&(t={}),this.ya=e,this.xa=t,this.refs={},this.qa=null}return Object.defineProperty(e.prototype,"state",{get:function(){return this.za},set:function(e){this.za=e},Xa:!0,Ya:!0}),Object.defineProperty(e.prototype,"props",{get:function(){return this.ya},Xa:!0,Ya:!0}),Object.defineProperty(e.prototype,"context",{get:function(){return this.xa},Xa:!0,Ya:!0}),e.prototype.ua=function(){},e.prototype.componentWillMount=function(){},e.prototype.componentDidMount=function(){},e.prototype.componentWillUpdate=function(){},e.prototype.componentDidUpdate=function(){},e.prototype.componentWillReceiveProps=function(e){},e.prototype.shouldComponentUpdate=function(e,t){return!0},e.prototype.render=function(){return null},e.prototype.getChildContext=function(){return{}},e.prototype.setState=function(e,t){if("function"==typeof e){var n=e(this.za,this.ya);if(!u.p(this.za,n))return;this.za=n}else{if(!u.p(this.za,e))return;this.za=a.U(this.za,e)}this.forceUpdate(t)},e.prototype.forceUpdate=function(e){this.componentWillUpdate();var t=a.U(this.context||{},this.getChildContext()),n=this.render(),r=this[o.$];n.V=this,n.I=r,n.G=r.G,r.G.render(n,function(){r.qa=n,e&&e()},t,!1)},e}();n.Za=c;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return r(t,e),t.prototype.shouldComponentUpdate=function(e,t){for(var n in e){if(!(n in t))return!0;if(t[n]!==e[n])return!0}return a.h(e).length!==a.h(t).length},t}(c);n.$a=s;var f=(o.t._,i._a.K),p=function(){function e(){}return e.createElement=function(e,t){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];return a.C(!l[typeof e],"Fuel element only accept one of 'string' or 'function' but got "+e),t=t||{},t.children=n,f(e,t,n)||o.La(e,t.key,t,t.children)},e.unmountComponentAtNode=function(e){var t=o.t.F(e);t&&(e.textContent="",t.G.ab(t),o.t.la(e))},e}();p.Component=c,p.PureComponent=s,p.isValidElement=function(e){return!!e&&o.t.T(e)},p.cloneElement=o.cloneElement,p.createFactory=function(e){return function(){return p.createElement(e,{})}},p.Children={map:function(e,t){return e?e.map(t):[]},forEach:function(e,t){e&&e.forEach(t)},count:function(e){return e?e.length:0},toArray:function(e){return e?e:[]}},p.bb={},n.Fuel=p,"array bool func number object string symbol node".split(" ").forEach(function(e){return p.bb[e]={}}),"instanceOf oneOf, oneOfType, arrayOf objectOf shape".split(" ").forEach(function(e){return p.bb[e]=function(){return{}}}),n.React=p},{1:1,13:13,18:18,4:4}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(7);n.Fuel=r.Fuel,n.React=r.React,function(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}(e(2))},{2:2,7:7}],9:[function(e,t,n){"use strict";function r(e,t,r){e.style[t]="number"==typeof r&&n.cb[t]?r+"px":String(r)}Object.defineProperty(n,"__esModule",{value:!0}),n.cb={width:1,height:1,fontSize:1,lineHeight:1,strokeWidth:1,backgroundPositionX:1,borderBottomLeftRadius:1,borderBottomRightRadius:1,borderBottomWidth:1,borderImageWidth:1,borderLeftWidth:1,borderRightWidth:1,borderTopLeftRadius:1,borderTopRightRadius:1,borderTopWidth:1,borderWidth:1,columnWidth:1,columnRuleWidth:1,fontKerning:1,letterSpacing:1,margin:1,marginBottom:1,marginLeft:1,marginRight:1,marginTop:1,maxFontSize:1,maxHeight:1,maxWidth:1,minHeight:1,minWidth:1,padding:1,paddingBottom:1,paddingLeft:1,paddingRight:1,paddingTop:1,top:1,left:1,right:1,bottom:1,textHeight:1,textIndent:1},n.Ja=r},{}],10:[function(e,t,n){"use strict";function r(e,t,n,r){for(;s(t);)o=f(e,t,r),t=o[0],e=o[1];return s(n)&&(n=p(n)),[t,n,e];var o}function o(e,t,n,r){for(var o={};e<t;e++){var i=n[e],a=i.key;d(i)&&null!==a&&void 0!==a&&(r&&l.C(o[a],"Duplicate key("+a+") found on "+y(i)+"."),o[a]=e)}return o}function i(e,t,n,i,s,f){void 0===f&&(f=!1);for(var p=r(e,t,n,s),d=p[0],m=p[1],b=p[2],g=0,C=[c.Va(null,[d])],S=[c.Va(null,[m])],k=C.length,_=[],M=[],P={};C||S;){for(var w=C[g]||c.Wa,E=S[g]||c.Wa,T=w.elements,O=E.elements,Z=T.length,x=O.length,D=w.parent,W={},j=0,N=Z-1,L=0,F=x-1,G=T.length?T[0]:null,R=O.length?O[0]:null,V=T.length?T[N]:null,I=O.length?O[F]:null,q=null,A=0,U=G&&G.key?G.key:null,z=V&&V.key?V.key:null,B=R&&R.key?R.key:null,K=I&&I.key?I.key:null;N>=j&&F>=L;){var H=0,X=0;if(L in P)X=4;else if(F in P)X=8;else{var Y=G,J=R;if(U===B)A=j,X|=5;else if(z===K)Y=V,J=I,A=N,X|=10;else if(null!==U&&U===K)J=I,A=j,H=1,X|=9;else if(null!==z&&z===B)Y=V,A=N,H=2,X|=6;else if(null===U&&null!==B)J=null,X|=1;else if(null!==U&&null===B)Y=null,X|=4;else{if(q||(q=o(L,F,O,f)),null!==U){var $=q[U];void 0!==$?(P[$]=!0,J=O[$],H=1):J=null}A=j,X|=1}if(f&&Y){var Q=Y.key;l.ma(Q)&&(l.C(W[Q],"Duplicate key("+Q+") found on "+y(Y)+"."),W[Q]=1)}var ee=v(D,Y,u.Na,u.Pa),te=v(D,J,u.Oa,u.Qa);if(ee&&ee.qa&&(ee=u.cloneElement(ee),ee.qa=null),ie=r(b,ee,te,s),ee=ie[0],te=ie[1],b=ie[2],ee||te){var ne=a.A(b,A,H,D,te,ee,i);if(1===ne)ee?_.push(c.Va(h(ee)?D||null:ee,ee.children)):_.push(null),te?M.push(c.Va(h(te)?D||null:te,te.children)):M.push(null);else if(3===ne){j=N+1;break}}}1==(1&X)&&++j<=N&&(G=T[j],U=G?G.key:null),2==(2&X)&&--N>=j&&(V=T[N],z=V?V.key:null),4==(4&X)&&++L<=F&&(R=O[L],B=R?R.key:null),8==(8&X)&&--F>=L&&(I=O[F],K=I?I.key:null)}for(;L<=F;){if(!P[F]){var te=u.Ra(D,O[L],u.Na,u.Pa);i.remove(L,D,te)}++L}for(;j<=N;){var te=void 0,ee=u.Ra(D,T[j],u.Oa,u.Pa);ae=r(b,ee,null,s),ee=ae[0],te=ae[1],b=ae[2],j<Z-1?i.k(j,b,D,ee):i.append(b,D,ee),++j}if(k===++g){g=0,C=_.length?_:null,S=M.length?M:null,_=[],M=[];var re=C?C.length:0,oe=S?S.length:0;k=re>oe?re:oe}}i.eb();var ie,ae}Object.defineProperty(n,"__esModule",{value:!0});var a=e(1),u=e(4),l=e(18),c=e(6),s=u.t._,f=u.t.wa,p=(u.t.pa,u.t.s),d=u.t.T,h=u.t.ca,y=(u.t.u,u.t.ea),v=u.Ra;n.fb=i},{1:1,18:18,4:4,6:6}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(17),o=e(9),i=e(16),a=e(4),u=e(18),l=e(12),c=e(3),s=e(1),f=a.t.v,p=a.t.B,d=a.t.ra,h=a.t.sa,y=a.t.ta,v=a.t.Ga,m=a.t.u,b=a.t.s,g=a.t.oa,C=a.t.ca,S=(a.t.F,function(){function e(e){this.gb=e,this.hb=[]}return e.prototype.move=function(e,t,n){var r=n.Z.parentNode.childNodes[e];if(2===t&&!(r=r.nextElementSibling))return void n.Z.parentNode.appendChild(n.Z);n.Z.parentNode.insertBefore(n.Z,r)},e.prototype.replace=function(e,t,n,r,o){y(r);var a,u=t.Z.childNodes[e],c=m(n);if(c||!n.children.length){if(c&&3===u.nodeType)return void(u.nodeValue=f(n));a=v(t.I,n,this.gb)}else a=i.ib(o,n,this.gb);u&&!C(n)&&(t.Z.replaceChild(a,u),l.collect(r,!0),d(n))},e.prototype.update=function(e,t){e.Z=t.Z;var n=e.props,i=t.props,a=u.h(n),l=u.h(i),c=a.length,f=l.length;if(c!==f||(2!==c||"key"!==a[1])&&1!==c)for(var d=f>c?l:a,y=0,v=f>c?f:c;y<v;y++){var m=d[y];if("children"!==m&&"key"!==m)if(r.Ha[m]){var g=m.slice(2).toLowerCase(),C=b(e.I);i[m]?e.I.G.ka().Ua(t.Z,g,n[m]):e.I.G.ka().Ba(C.Z,t.Z,g,i[m])}else if("style"===m){var S=s.q(i[m]||{},n[m]||{}),k=S[0],_=S[1];if(_)for(var M in k)o.Ja(t.Z,M,k[M])}else n[m]?i[m]?s.o(n[m],i[m])||(t.Z[m]=n[m]):t.Z[m]=n[m]:t.Z.removeAttribute(m)}p(e.Z,e),h(e)},e.prototype.k=function(e,t,n,r){var o;if(o=m(r)||!r.children.length?v(n.I,r,this.gb):i.ib(t,r,this.gb),n&&n.Z&&!C(r)){var a=n.Z.childNodes[e];n.Z.insertBefore(o,a),d(r)}},e.prototype.append=function(e,t,n){var r,o=m(n),a=t&&t.Z;if(o||!n.children.length){if(o&&a&&3===t.Z.lastChild.nodeType)return void(t.Z.lastChild.nodeValue=f(n));r=v(t.I,n,this.gb)}else r=i.ib(e,n,this.gb);if(a&&!C(n)){var u=r.parentNode;u&&u!==t&&t.Z.appendChild(r),d(n)}},e.prototype.remove=function(e,t,n){if(y(n),t.Z){var r=t.Z.childNodes[e];r&&this.hb.push([n,r])}C(n)||m(n)||g(n),n.G=null},e.prototype.l=function(e,t,n){var r=t.Z.childNodes[e],o=a.t.v(n);r?3===r.nodeType?r.nodeValue=o:t.Z.replaceChild(c.M.R(o),r):t.Z.appendChild(c.M.R(o))},e.prototype.i=function(e,t){e.Z.textContent=f(t),console.log(e.Z.parentNode.parentNode.parentNode)},e.prototype.m=function(e,t){i.ib(e,t,this.gb)},e.prototype.j=function(e){e.Z.textContent=""},e.prototype.eb=function(){for(var e=0,t=this.hb.length;e<t;e++){var n=this.hb[e],r=n[0],o=n[1];o.parentNode&&(o.parentNode.removeChild(o),l.collect(r,!0))}this.hb=[]},e}());n.jb=S},{1:1,12:12,16:16,17:17,18:18,3:3,4:4,9:9}],12:[function(e,t,n){"use strict";function r(e,t,n){o(e,!1,t),n&&n()}function o(e,t,n){var r=l(null,h(e),i.Na,i.Pa),a=r.children,u=f(r);if(!s(r)){if(!r)return;t&&d(r);var m=r.Z;s(r)||!n&&!u||(m&&m.childNodes.length&&(m.textContent=""),y(r),p(r),v(r))}for(var b=a.length,g=0;b>g;){var C=a[g++];(c(C)||Array.isArray(C))&&o(C,u,n)}}Object.defineProperty(n,"__esModule",{value:!0});var i=e(4),a=e(13),u=e(14),l=i.Ra,c=i.t.T,s=(i.t.u,i.t.ca),f=i.t.na,p=i.t.ha,d=i.t.oa,h=i.t.s,y=u.L.kb,v=a._a.kb;n.collect=r},{13:13,14:14,4:4}],13:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(4),o=(r.Ra,r.t.va),i=[],a=0;n._a={kb:function(e){e&&128!=(128&e.W)&&500!==a&&(e.V=e.qa=e.G=e.X=e.I=e.children=e.props=e.key=e.Z=e.type=null,e.W=128,i[a++]=e)},K:function(e,t,n){if(a>0){var r=i[--a];return i[a]=null,r.props=t,r.key=t.key,r.children=n,r.type=e,r.W=o(e),r}return null}}},{4:4}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(18),o=0,i={};n.L={kb:function(e){if(500!==o){var t=e.Z;if(t){var n=e.type;i[n]||(i[n]={count:0,lb:[]});for(var a=i[n],u=r.h(e.props),l=0,c=u.length;l<c;++l){var s=u[l];"key"!==s&&"children"!==s&&("className"===s&&(s="class"),t.removeAttribute(s))}a.lb[a.count++]=t,++o}}},K:function(e){var t=i[e];if(t&&t.count>0){var n=t.lb[--t.count];return t.lb[t.count]=null,n.mb=0,--o,n||null}return null}}},{18:18}],15:[function(e,t,n){"use strict";function r(){return new c}Object.defineProperty(n,"__esModule",{value:!0});var o=e(16),i=e(12),a=e(10),u=e(3),l=e(11),c=function(){function e(){this.nb=!0,this.ob=null,this.lock=!1,this.pb=[],this.qb=new l.jb(r)}return e.prototype.Aa=function(e){this.nb=!1,e(),this.nb=!0},e.prototype.Y=function(e){this.rb=e},e.prototype.sb=function(){return this.rb},e.prototype.Da=function(e){this.tb=e},e.prototype.ka=function(){return this.tb},e.prototype.ub=function(){this.ob&&this.ob(),this.ob=null},e.prototype.vb=function(){var e=this.pb.shift();if(e){var t=e.wb,n=e.xb;this.render(t,n)}},e.prototype.ab=function(e,t){i.collect(e,!0,t)},e.prototype.render=function(e,t,n,o){var i=this;if(void 0===t&&(t=function(e){}),void 0===n&&(n={}),void 0===o&&(o=!0),!this.nb)return void t(this.rb.Z);if(this.lock)return void this.pb.push({wb:e,xb:t});if(u.M.O(),this.rb){this.lock=!0,a.fb(n,e,this.rb,this.qb,r);this.rb;o&&(this.rb=e),this.ob=function(){t(i.rb.Z),i.lock=!1,i.vb()},this.ub()}else t(this.yb(e,o))},e.prototype.yb=function(e,t){var n=o.ib({},e,r,u.M.S());return t&&(this.rb=e),n},e}();n.H=c},{10:10,11:11,12:12,16:16,3:3}],16:[function(e,t,n){"use strict";function r(e,t,n,f){for(void 0===f&&(f=null);a(t);)b=l(e,t,n),t=b[0],e=b[1];if(!t)return i.M.S();var p=u(t.I,t,n),d=t.children,h=d.length,y=0,v=0;for(f&&f.appendChild(p);h>v;){var m=d[v++];c(m)||Array.isArray(m)?(y=2,p.appendChild(r(e,s(null,m,o.Na,o.Pa),n))):(1&y)>0?p.lastChild.nodeValue+=""+m:0==(2&y)?(y|=1,p.textContent+=""+m):(y|=1,p.appendChild(i.M.R(""+m)))}return f||t.Z;var b}Object.defineProperty(n,"__esModule",{value:!0});var o=e(4),i=e(3),a=o.t._,u=o.t.Ga,l=o.t.wa,c=o.t.T,s=(o.t.ca,o.t.u,o.t.na,o.t.v,o.Ra);n.ib=r},{3:3,4:4}],17:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.Fa={className:"class"};!function(e){e[e.zb=1e4*Math.random()<<1]="FUEL_ELEMENT_MARK"}(n.Ab||(n.Ab={})),n.Ha=(r=["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"],r.raw=["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"],function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e[0].split(" ").reduce(function(e,t){return e["on"+t]=!0,e},{})}(r)),n.Ka=(o=["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"],o.raw=["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"],function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e[0].split(" ").reduce(function(e,t){return e[t]=!0,e},{})}(o));var r,o},{}],18:[function(e,t,n){(function(e){"use strict";function t(e,t,n){if(void 0===n&&(n=!1),e){var r="function"==typeof t?t():t;if(!n)throw new Error(r);console.warn(r)}}function r(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n}function o(e){return u.call(e).match(l)[1].toLowerCase()}function i(e){return null!==e&&void 0!==e}Object.defineProperty(n,"__esModule",{value:!0});var a="object"==typeof e?e:"object"==typeof window?window:this||{};n.Symbol="function"==typeof a.Symbol?a.Symbol:function(){function e(e){return"@@"+e}var t={};e.for=function(n){return t[n]?t[n]:t[n]=e(n)}}(),n.C=t,n.U=r;var u=Object.prototype.toString,l=/\[object ([^\]]+)\]/;n.g=o;var c="function"==typeof a.requestAnimationFrame;n.requestAnimationFrame=c?function(e){return a.requestAnimationFrame(e)}:function(e){return setTimeout(e,60)};var s="function"==typeof a.requestIdleCallback;n.requestIdleCallback=s?function(e){return a.requestIdleCallback(e)}:function(e){return e()},n.ma=i,n.h=Object.keys}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[8])(8)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
'use strict';

var Executor = _dereq_(4);

function Benchmark() {
  this.running = false;
  this.impl = null;
  this.tests = null;
  this.reportCallback = null;
  this.enableTests = false;

  this.container = document.createElement('div');

  this._runButton = document.getElementById('RunButton');
  this._iterationsElement = document.getElementById('Iterations');
  this._reportElement = document.createElement('pre');

  document.body.appendChild(this.container);
  document.body.appendChild(this._reportElement);

  var self = this;

  this._runButton.addEventListener('click', function(e) {
    e.preventDefault();

    if (!self.running) {
      var iterations = parseInt(self._iterationsElement.value);
      if (iterations <= 0) {
        iterations = 10;
      }

      self.run(iterations);
    }
  }, false);

  this.ready(true);
}

Benchmark.prototype.ready = function(v) {
  if (v) {
    this._runButton.disabled = '';
  } else {
    this._runButton.disabled = 'true';
  }
};

Benchmark.prototype.run = function(iterations) {
  var self = this;
  this.running = true;
  this.ready(false);

  new Executor(self.impl, self.container, self.tests, 1, function() { // warmup
    new Executor(self.impl, self.container, self.tests, iterations, function(samples) {
      self._reportElement.textContent = JSON.stringify(samples, null, ' ');
      self.running = false;
      self.ready(true);
      if (self.reportCallback != null) {
        self.reportCallback(samples);
      }
    }, undefined, false).start();
  }, undefined, this.enableTests).start();
};

module.exports = Benchmark;

},{"4":4}],4:[function(_dereq_,module,exports){
'use strict';

function render(nodes) {
  var children = [];
  var j;
  var c;
  var i;
  var e;
  var n;

  for (i = 0; i < nodes.length; i++) {
    n = nodes[i];
    if (n.children !== null) {
      e = document.createElement('div');
      c = render(n.children);
      for (j = 0; j < c.length; j++) {
        e.appendChild(c[j]);
      }
      children.push(e);
    } else {
      e = document.createElement('span');
      e.textContent = n.key.toString();
      children.push(e);
    }
  }

  return children;
}

function testInnerHtml(testName, nodes, container) {
  var c = document.createElement('div');
  var e = document.createElement('div');
  var children = render(nodes);
  for (var i = 0; i < children.length; i++) {
    e.appendChild(children[i]);
  }
  c.appendChild(e);
  if (c.innerHTML !== container.innerHTML) {
    console.log('error in test: ' + testName);
    console.log('container.innerHTML:');
    console.log(container.innerHTML);
    console.log('should be:');
    console.log(c.innerHTML);
  }
}


function Executor(impl, container, tests, iterations, cb, iterCb, enableTests) {
  if (iterCb === void 0) iterCb = null;

  this.impl = impl;
  this.container = container;
  this.tests = tests;
  this.iterations = iterations;
  this.cb = cb;
  this.iterCb = iterCb;
  this.enableTests = enableTests;

  this._currentTest = 0;
  this._currentIter = 0;
  this._renderSamples = [];
  this._updateSamples = [];
  this._result = [];

  this._tasksCount = tests.length * iterations;

  this._iter = this.iter.bind(this);
}

Executor.prototype.start = function() {
  this._iter();
};

Executor.prototype.finished = function() {
  this.cb(this._result);
};

Executor.prototype.progress = function() {
  if (this._currentTest === 0 && this._currentIter === 0) {
    return 0;
  }

  var tests = this.tests;
  return (this._currentTest * tests.length + this._currentIter) / (tests.length * this.iterataions);
};

Executor.prototype.iter = function() {
  if (this.iterCb != null) {
    this.iterCb(this);
  }

  var tests = this.tests;

  if (this._currentTest < tests.length) {
    var test = tests[this._currentTest];

    if (this._currentIter < this.iterations) {
      var e, t;
      var renderTime, updateTime;

      e = new this.impl(this.container, test.data.a, test.data.b);
      e.setUp();

      t = window.performance.now();
      e.render();
      renderTime = window.performance.now() - t;

      if (this.enableTests) {
        testInnerHtml(test.name + 'render()', test.data.a, this.container);
      }

      t = window.performance.now();
      e.update();
      updateTime = window.performance.now() - t;

      if (this.enableTests) {
        testInnerHtml(test.name + 'update()', test.data.b, this.container);
      }

      e.tearDown();

      this._renderSamples.push(renderTime);
      this._updateSamples.push(updateTime);

      this._currentIter++;
    } else {
      this._result.push({
        name: test.name + ' ' + 'render()',
        data: this._renderSamples.slice(0)
      });

      this._result.push({
        name: test.name + ' ' + 'update()',
        data: this._updateSamples.slice(0)
      });

      this._currentTest++;

      this._currentIter = 0;
      this._renderSamples = [];
      this._updateSamples = [];
    }

    setTimeout(this._iter, 0);
  } else {
    this.finished();
  }
};

module.exports = Executor;

},{}],5:[function(_dereq_,module,exports){
'use strict';

var Benchmark = _dereq_(3);
var benchmark = new Benchmark();

function initFromScript(scriptUrl, impl) {
  var e = document.createElement('script');
  e.src = scriptUrl;

  e.onload = function() {
    benchmark.tests = window.generateBenchmarkData().units;
    benchmark.ready(true);
  };

  document.head.appendChild(e);
}

function initFromParentWindow(parent, name, version, id) {
  window.addEventListener('message', function(e) {
    var data = e.data;
    var type = data.type;

    if (type === 'tests') {
      benchmark.tests = data.data;
      benchmark.reportCallback = function(samples) {
        parent.postMessage({
          type: 'report',
          data: {
            name: name,
            version: version,
            samples: samples
          },
          id: id
        }, '*');
      };
      benchmark.ready(true);

      parent.postMessage({
        type: 'ready',
        data: null,
        id: id
      }, '*');
    } else if (type === 'run') {
      benchmark.run(data.data.iterations);
    }
  }, false);

  parent.postMessage({
    type: 'init',
    data: null,
    id: id
  }, '*');
}

function init(name, version, impl) {
  // Parse Query String.
  var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p=a[i].split('=', 2);
      if (p.length == 1) {
        b[p[0]] = "";
      } else {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  if (qs['name'] !== void 0) {
    name = qs['name'];
  }

  if (qs['version'] !== void 0) {
    version = qs['version'];
  }

  var type = qs['type'];

  if (qs['test'] !== void 0) {
    benchmark.enableTests = true;
    console.log('tests enabled');
  }

  var id;
  if (type === 'iframe') {
    id = qs['id'];
    if (id === void 0) id = null;
    initFromParentWindow(window.parent, name, version, id);
  } else if (type === 'window') {
    if (window.opener != null) {
      id = qs['id'];
      if (id === void 0) id = null;
      initFromParentWindow(window.opener, name, version, id);
    } else {
      console.log('Failed to initialize: opener window is NULL');
    }
  } else {
    var testsUrl = qs['data']; // url to the script generating test data
    if (testsUrl !== void 0) {
      initFromScript(testsUrl);
    } else {
      console.log('Failed to initialize: cannot load tests data');
    }
  }

  benchmark.impl = impl;
}

// performance.now() polyfill
// https://gist.github.com/paulirish/5438650
// prepare base perf object
if (typeof window.performance === 'undefined') {
  window.performance = {};
}
if (!window.performance.now){
  var nowOffset = Date.now();
  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }
  window.performance.now = function now(){
    return Date.now() - nowOffset;
  };
}

module.exports = init;

},{"3":3}]},{},[1])(1)
});