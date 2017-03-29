(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Fuel=e()}}(function(){var e;return function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var l="function"==typeof require&&require;if(!u&&l)return l(i,!0);if(a)return a(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[i]={exports:{}};t[i][0].call(f.exports,function(e){var n=t[i][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){"use strict";function r(e){return 1==(1&e.g)}function o(e){return 2==(2&e.g)}function a(e){return 4==(4&e.g)}function i(e){return 8==(8&e.g)}function u(e){return 16==(16&e.g)}function l(e,t){if(null===e)return!t&&void 0!==t;var n=typeof e;return"number"!==n||isFinite(e)?"object"!==n&&"object"!=typeof t&&e===t:!isFinite(t)&&(e!==1/0||t===1/0)}function c(e,t){var n={},r={},o=0;for(var a in t){var i=t[a];a in e&&l(e[a],i)?r[a]=1:(n[a]=i,o++)}for(var u=Object.keys(e),c=0,f=u.length;c<f;c++)n[u[c]]||r[u[c]]||(n[u[c]]="",o++);return[n,o]}function f(e,t,n){var r=t.name,o=t.value;if(e[r])if("style"===r){var a=c(e[r].value,o),i=a[0],u=a[1];u&&(e[r]={state:3,value:i})}else l(e[r].value,o)?e[r].state=4:e[r]={state:3,value:o};else e[r]={state:n?2:1,value:o}}function s(e,t){var n=e?e.props:null,r=t?t.props:null,o={h:[],g:0},a={};if(!e&&t)return o.g|=2,o;if(!t&&e)return o.g|=4,o;if(p.j.i(e)&&p.j.i(t))return p.j.k(e)!==p.j.k(t)&&(o.g|=16),o;if(e.type!==t.type)o.g|=8;else{for(var i=r.length,u=n.length,l=0,c=u>i?u:i;l<c;l++)void 0!==n[l]&&f(a,n[l],!0),void 0!==r[l]&&f(a,r[l],!1);for(var s in a){var d=a[s];switch(d.state){case 4:break;default:3===d.state&&"style"===s&&(d.state=5),o.h.push({key:s,value:d.value,state:d.state})}}}var h=p.j.l(t),y=p.j.l(e);return h&&!y&&(o.g|=1),o}Object.defineProperty(n,"__esModule",{value:!0});var p=e("./element");n.m=r,n.o=o,n.p=a,n.q=i,n.s=u,n.t=s},{"./element":3}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./stem"),o=e("./renderer/dom-renderer");n.FuelDOM={render:function(e,t,n){void 0===n&&(n=function(e){}),r.v.u||(r.v.u=new o.A),e.B||(e.B=new r.v),e.B.render(e,function(e){t.appendChild(e),n&&n(e)})}},n.C=n.FuelDOM},{"./renderer/dom-renderer":8,"./stem":9}],3:[function(e,t,n){"use strict";function r(e){return"function"==typeof e}function o(e,t,n){n?e[t]=t:e.removeAttribute(t)}function a(e,t){for(var n={},r=0,o=e.length;r<o;r++)n[e[r].name]=r;for(var a in t)n[a]?e[n[a]].value=t[a]:e.push({name:a,value:t[a]});return e}function i(e,t,n){void 0===t&&(t={}),void 0===n&&(n=e.children),s.D(!y.F(e),"cloneElement only clonable FuelElement but got = "+e);var r=l(e.type,e.key,a(e.props.slice(),t),n);return r.B=e.B,r.G=e.G,r.H=e.H,r.I=e.I,r}function u(e,t,n,r){n.subscribe&&(e.I||(e.I=[]),e.I.push(n.subscribe(function(n){e.props.some(function(e){return e.name===t&&(e.value=n,!0)})||e.props.push({name:t,value:n}),e.B.render(e)})),e.B=r(),e.B.J(e))}function l(e,t,n,r){return void 0===t&&(t=null),void 0===r&&(r=[]),o={},o[d]=c.L.K,o.type=e,o.key=t,o.props=n,o.children=r,o.M=null,o.B=null,o.G=null,o.H=null,o.N=null,o.I=null,o;var o}Object.defineProperty(n,"__esModule",{value:!0});var c=e("./type"),f=e("./node"),s=e("./util"),p=e("./event"),d=s.Symbol("__fuel_element"),h={map:{},count:1};h.map[String(h.map.O=0)]="SYNTHETIC_TEXT",n.P=s.Symbol("__fuelelement");var y=function(){function e(){}return e.R=function(){return 0},e.S=function(e){var t=h.map[e.toLowerCase()];return t?t:(h.map[String(h.map[e]=h.count)]=e,h.count++)},e.T=function(e){return"number"!=typeof e.type},e.U=function(e){return r(e.type)&&!r(e.type.prototype.render)},e.V=function(e){return r(e.type)&&r(e.type.prototype.render)},e.W=function(e){return h.map[String(e.type)]},e.l=function(e){return e.children.length>0},e.F=function(e){return e&&e[d]===c.L.K},e.i=function(e){return 0===e.type},e.k=function(e){return e.props[0].value},e.X=function(e){return e.H},e.Y=function(e,t){var n=e.props,r=e.children;void 0===t&&(t=!1);for(var o={},a=0,i=n.length;a<i;a++){var u=n[a],l=u.name,c=u.value;o[l]=c}return t&&(o.children=r.length?r:null),o},e.Z=function(e){e.G&&e.G.componentDidMount()},e.$=function(e){e.G&&e.G.componentDidUpdate()},e._=function(e){e.G&&e.G.aa()},e.ba=function(e){for(;e&&this.T(e);)e=e.H;return e},e.ca=function(e,t,r){var o=(t.props,this.Y(t,!0)),a=r?this.Y(r):null;if(this.U(t))return[t.type(o,e),e];if(this.V(t)){var i=t.G,u=!!i;i?i.da&&(i.da=e):i=t.G=new t.type(o,e),i[n.P]=t;var l=s.ea(e,i.getChildContext());if(t.H&&!i.shouldComponentUpdate(o,a))return u&&t.B.fa(function(){i.componentWillReceiveProps(o),i.ga=o}),[t.H,l];u&&t.B.fa(function(){i.componentWillReceiveProps(o),i.ga=o}),t.H?i.componentWillUpdate():i.componentWillMount();var c=t.H=i.render();return c&&(this.T(c)||(c.G=i),c.B=t.B),t.B.J(t),[c,l]}s.D(!0,"factory element requried but got "+this.W(t)+".")},e.ha=function(e,t,n,r){var o=e.B.ia();o||(o=new p.ja,e.B.ka(o));var a=this.ba(e);o.ha(a.M,t.M,n,r)},e.la=function(e,t,n,r){if(0===t.type)return t.M=n.createTextNode(this.k(t));var a=t.props,i=(t.type,this.W(t)),l=n.createElement(i);t.M=l;for(var s=!1,p=0,d=a.length;p<d;p++){var h=a[p],y=h.name,v=h.value;if(c.ma[y])this.ha(e,t,y,v);else if("checked"!==y&&"selected"!==y){if("scoped"===y)s=!0;else{if((v.na||v.subscribe)&&s){u(t,y,v,r);continue}if("style"===y){for(var m in v)f.oa(l,m,v[m]);continue}if("ref"===y){var g=typeof v;"string"===g?this.T(e)&&(e.G.refs[v]=l):"function"===g&&v(l);continue}}"htmlFor"===y&&(y="for"),(c.pa[y]||0===y.indexOf("data-"))&&(l[y]=v)}else o(l,y,v)}return l},e}();n.j=y,n.cloneElement=i,n.qa=l},{"./event":4,"./node":7,"./type":11,"./util":12}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./util"),o=r.Symbol("__fuelevent"),a=r.Symbol("__root_events"),i=function(){function e(){this.ra={},this.id=1}return e.prototype.ha=function(e,t,n,r){var i=this;n=n.replace(/^on/,"").toLowerCase(),e[a]||(e[a]={}),"INPUT"===t.nodeName&&"change"===n&&(n="keyup");var u=String(this.id++);if(e[a][n])this.ra[n][String(this.ra[n].count++)]=r;else{e[a][n]=!0;var l=function(e){var t=e.target[o];if(t&&t[e.type]&&t[e.type]===u){var n=i.ra[e.type][u];n&&n(e)}};this.ra[n]={count:1,0:l,root:e},e.addEventListener(n,l,!1)}this.ra[n][u]=r,t[o]?t[o][n]=u:t[o]=(c={},c[n]=u,c);var c},e.prototype.sa=function(e,t){if(e[o]){var n=e[o];if(n[t]){this.ra[t][n[t]]=null,this.ra[t].count--,n[t]=null;var r=this.ra[t].root;0===this.ra[t].count&&(r.removeEventListener(t,this.ra[t][0]),r[a][t]=!1,this.ra[t].root=null)}}},e.prototype.ta=function(e,t,n){if(e[o]){var r=e[o];r[t]&&(this.ra[t][r[t]]=n)}},e.prototype.ua=function(e){if(e[o]){var t=e[o];for(var n in t)this.sa(e,n)}},e}();n.ja=i},{"./util":12}],5:[function(e,t,n){"use strict";function r(e,t){void 0===t&&(t=!1);for(var n=[],a=0,i=e.length;a<i;a++){var c=e[a];if(null!==c)if(l.D(void 0===c,"Undefined passed as element, it's seem to misstakes."),u.j.F(c))n.push(c);else if(!t&&Array.isArray(c))n=r(c,!0).concat(n);else{var f=o(c.toString());n.push(f)}}return n}function o(e){return u.qa(u.j.R(),null,[{name:"value",value:e}])}Object.defineProperty(n,"__esModule",{value:!0});var a=e("tslib"),i=e("./stem"),u=e("./element"),l=e("./util"),c={string:1,function:1},f=function(){function e(e,t){void 0===e&&(e={}),void 0===t&&(t={}),this.ga=e,this.da=t,this.refs={}}return Object.defineProperty(e.prototype,"props",{get:function(){return this.ga},va:!0,wa:!0}),Object.defineProperty(e.prototype,"context",{get:function(){return this.da},va:!0,wa:!0}),e.prototype.aa=function(){},e.prototype.componentWillMount=function(){},e.prototype.componentDidMount=function(){},e.prototype.componentWillUpdate=function(){},e.prototype.componentDidUpdate=function(){},e.prototype.componentWillReceiveProps=function(e){},e.prototype.shouldComponentUpdate=function(e,t){return!0},e.prototype.render=function(){return null},e.prototype.getChildContext=function(){return{}},e.prototype.setState=function(e,t){this.state=l.ea(this.state,e),this.componentWillUpdate();var n=this.render(),r=this[u.P];r.B.render(n,function(){r.H=n,t&&t()},!1)},e}();n.xa=f;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return a.__extends(t,e),t.prototype.shouldComponentUpdate=function(e,t){for(var n in e){if(!(n in t))return!0;if(t[n]!==e[n])return!0}return Object.keys(e).length!==Object.keys(t).length},t}(f);n.ya=s;var p=function(){function e(){}return e.createElement=function(e,t){for(var n=[],o=2;o<arguments.length;o++)n[o-2]=arguments[o];l.D(!c[typeof e],"Fuel element only accept one of 'string' or 'function' but got "+e),t||(t={}),n.length&&(n=r(n));var a=[];for(var f in t)if("key"!==f){var s=t[f];a.push({name:f,value:s})}var p=u.qa("string"==typeof e?u.j.S(e):e,t.key,a,n);return(u.j.T(p)||t.scoped)&&(p.B=new i.v),p},e}();p.Component=f,p.PureComponent=s,p.isValidElement=function(e){return!!e&&u.j.F(e)},p.cloneElement=u.cloneElement,p.createFactory=function(e){return function(){return p.createElement(e,{})}},p.Children={map:function(e,t){return e?e.map(t):[]},forEach:function(e,t){e&&e.forEach(t)},count:function(e){return e?e.length:0},toArray:function(e){return e?e:[]}},p.za={},n.Fuel=p,"array bool func number object string symbol node".split(" ").forEach(function(e){return p.za[e]={}}),"instanceOf oneOf, oneOfType, arrayOf objectOf shape".split(" ").forEach(function(e){return p.za[e]=function(){return{}}}),n.React=p},{"./element":3,"./stem":9,"./util":12,tslib:13}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./fuel");n.Fuel=r.Fuel,n.React=r.React,function(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}(e("./dom"))},{"./dom":2,"./fuel":5}],7:[function(e,t,n){"use strict";function r(e,t,n){e.style[t]="number"==typeof n?n+"px":String(n)}Object.defineProperty(n,"__esModule",{value:!0}),n.oa=r},{}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(){this.id=0}return e.prototype.Aa=function(){this.id++},e.prototype.createElement=function(e){var t=document.createElement(e);return t.setAttribute("data-id",""+this.id),t},e.prototype.createTextNode=function(e){return document.createTextNode(e)},e}();n.A=r},{}],9:[function(e,t,n){"use strict";function r(){return new b}function o(e,t,n,o,a,i){var l=v.j.la(e,o,i,r),c=n.M;if(1===c.nodeType&&1===l.nodeType)for(var f=0,s=c.children.length;f<s;f++)o.M.appendChild(c.children[f]);var p=t.M;a?(p.removeChild(c),p.appendChild(l)):(p.replaceChild(l,c),u(e,n)),n.M=null}function a(e,t,n,r){n.M=t.M,t.M=null,r&&n.M.parentNode.appendChild(n.M)}function i(e,t,n){for(var r=n.M,o=v.j.ba(t),a=0,i=e.h.length;a<i;a++){var u=e.h[a],l=u.key,c=u.value;switch(u.state){case 1:case 3:if(d.ma[l]){var f=l.slice(2).toLowerCase();o.B.ia().ta(n.M,f,c)}else r[l]=c;break;case 5:for(var s in c){var p=c[s];h.oa(r,s,p)}break;case 2:if(d.ma[l]){var f=l.slice(2).toLowerCase();o.B.ia().sa(n.M,f)}else r.removeAttribute(l)}}}function u(e,t){g.requestIdleCallback(function(){return l(e,t)})}function l(e,t){for(var n=[{Ba:t,children:t.children.slice(),M:t.M,Ca:e.B}];n.length;){var r=n.pop();if(r.M&&(r.M.Da&&r.Ca.ia().ua(r.M),r.Ba.I&&r.Ba.I.forEach(function(e){return e.unsubscribe()}),r.M=null),r.children.length){var o=r.children.shift(),a=v.j.ba(o);n.push(r),a&&n.push({Ba:o,children:o.children.slice(),M:a.M,Ca:o.B?o.B:r.Ca})}}}function c(e){var t=e.parent,n=e.Ea,l=e.Fa,c=e.Ga,f=e.Ha,s=e.root,p=e.context,d=b.u;if(m.o(f))if(t)t.M.appendChild(y.Ia(p,s,n,d,r)),v.j.Z(n);else{var h=y.Ia(p,s,n,d,r);l&&(t.M.appendChild(h),v.j.Z(n),v.j._(l),u(s,l))}else m.p(f)?(v.j._(l),l.M.parentNode.removeChild(l.M),l.B=null,u(s,l)):m.q(f)?(v.j._(l),o(s,t,l,n,c,d),v.j.Z(n)):m.s(f)?(n.M=l.M,n.M.textContent=v.j.k(n),v.j.$(n)):(a(s,l,n,c),i(f,s,n),v.j.$(n));m.m(f)&&y.Ia(p,s,n,d,r)}function f(e,t){return[{Ea:e,Fa:t,Ja:null,Ka:null,La:!1,Ha:null,context:{},root:e,Ga:!1}]}function s(e,t,n,r){var o,a=t.Ja.shift(),i=!1;if(r&&r.N&&a&&r.N[a.key]){o=r.N[a.key],a.N||(a.N={}),a.N[a.key]=a;var u=t.Ka.indexOf(o);t.Ka.splice(u,1),i=!0}else o=t.Ka.shift(),i=!1;var l=t.root;return a.B&&(l=a),{Ea:a,Fa:o,Ja:null,Ka:null,La:!1,Ha:null,root:l,context:e,Ga:i}}function p(e,t,n){if(t&&v.j.T(t))if(n&&n.type!==t.type)for(;t&&v.j.T(t);)i=v.j.ca(e,t),t=i[0],e=i[1];else for(;t&&v.j.T(t);){t&&n&&t.type===n.type&&(t.G=n.G);var r=v.j.ca(e,t,n),o=r[0],a=r[1];e=a,n&&v.j.T(n)&&(n=v.j.X(n)),t=o}return n&&v.j.T(n)&&(n=v.j.ba(n)),[e,t,n];var i}Object.defineProperty(n,"__esModule",{value:!0});var d=e("./type"),h=e("./node"),y=e("./tree"),v=e("./element"),m=e("./difference"),g=e("./util"),b=function(){function e(e){void 0===e&&(e=null),this.Ma=e,this.Na=!0,this.Oa=[],this.Pa=null}return e.prototype.fa=function(e){this.Na=!1,e(),this.Na=!0},e.prototype.J=function(e){this.Ma=e},e.prototype.Qa=function(){return this.Ma},e.prototype.ka=function(e){this.Ra=e},e.prototype.ia=function(){return this.Ra},e.prototype.Sa=function(){var e=this;g.requestAnimationFrame(function(){e.Oa.length&&(e.Oa.forEach(function(e){return c(e)}),e.Oa.length=0,e.Pa&&e.Pa(),e.Pa=null)})},e.prototype.render=function(t,n,r){var o=this;if(void 0===n&&(n=function(e){}),void 0===r&&(r=!0),!this.Na)return void n(this.Ma.M);e.u.Aa(),this.Ma?(this.Ta(t),this.Pa=function(){r&&(o.Ma=t),n(o.Ma.M)},this.Sa()):n(this.Ua(t,r))},e.prototype.Ua=function(t,n){var o=y.Ia({},t,t,e.u,r);return n&&(this.Ma=t),o},e.prototype.Ta=function(e){this.Oa.length&&(this.Oa.length=0);for(var t=f(e,this.Ma),n=null;t.length;){var r=t.pop(),o=r.Ea,a=r.Fa,i=r.context,u=r.Ga,l=void 0,c=r.root;if(!r.La){if(d=p(i,o,a),i=d[0],o=d[1],a=d[2],!o&&!a)continue;o&&a&&(o.B=a.B),r.Ea=o,r.Fa=a,r.context=i,o&&o.B&&(c=r.Ea),l=m.t(a,o),r.Ha=l,this.Oa.push({root:c,parent:n?n.Ea:null,Ea:o,Fa:a,Ga:u,Ha:l,context:r.context}),r.Ja=o?o.children.slice():[],r.Ka=a?a.children.slice():[],r.La=!0}!r.Ja.length&&!r.Ka.length||r.Ha&&0!==r.Ha.g&&8!==r.Ha.g||(n=r,t.push(r),t.push(s(i,r,o,a)))}var d},e}();n.v=b},{"./difference":1,"./element":3,"./node":7,"./tree":10,"./type":11,"./util":12}],10:[function(e,t,n){"use strict";function r(e,t,n){return[{Ba:n,parentElement:null,children:n.children.slice(),M:n.M,parent:null,root:t,context:e}]}function o(e,t,n,o,l){for(var c;n&&i.j.T(n);)b=a(e,n,l),n=b[0],e=b[1];if(n){var f=r(e||{},t,n);e:for(;f.length;){var s=f.pop(),p=!!s.children.length;if(!s.M){var d=s.Ba,h=s.parentElement,y=s.parent;d.key&&s.parentElement&&(h.N||(h.N={}),u.D(h.N[d.key],"Duplicate key found: key = "+d.key),h.N[d.key]=d),s.M=i.j.la(s.root,d,o,l),c||(c=s.M),y&&(y.appendChild(s.M),i.j.Z(s.Ba))}var v=s.root;if(p){f.push(s);var m=s.children.shift();m.B&&(v=m);for(var g=s.context;i.j.T(m);)if(v=m,M=a(g,m,l),m=M[0],g=M[1],!m)continue e;f.push({Ba:m,children:m.children.slice(),M:null,parent:s.M,parentElement:s.Ba,root:v,context:g})}}return c;var b,M}}function a(e,t,n){var r=i.j.ca(e,t,null),o=r[0],a=r[1];return o&&t.B.J(t),[o,a]}Object.defineProperty(n,"__esModule",{value:!0});var i=e("./element"),u=e("./util");n.Ia=o},{"./element":3,"./util":12}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});!function(e){e[e.Va=2]="CHILDREN"}(n.Wa||(n.Wa={})),n.Xa={className:"class"};!function(e){e[e.K=1e4*Math.random()<<1]="FUEL_ELEMENT_MARK"}(n.L||(n.L={})),n.ma=(r=["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"],r.raw=["Copy Cut Paste CompositionEnd CompositionStart CompositionUpdate Focus Blur Change Input Submit Load Error KeyDown KeyPress KeyUp Abort CanPlay CanPlayThrough DurationChange Emptied Encrypted Ended LoadedData LoadedMetadata LoadStart Pause Play Playing Progress RateChange Seeked Seeking Stalled Suspend TimeUpdate VolumeChange Waiting Click ContextMenu DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Select TouchCancel TouchEnd TouchMove TouchStart Scroll Wheel"],function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e[0].split(" ").reduce(function(e,t){return e["on"+t]=!0,e},{})}(r)),n.pa=(o=["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"],o.raw=["defaultChecked defaultValue accept acceptCharset accessKey action allowFullScreen allowTransparency alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet challenge checked classID className cols colSpan content contentEditable contextMenu controls coords crossOrigin data dateTime default defer dir disabled download draggable encType form formAction formEncType formMethod formNoValidate formTarget frameBorder headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media mediaGroup method min minLength multiple muted name noValidate open optimum pattern placeholder poster preload radioGroup readOnly rel required role rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step style summary tabIndex target title type useMap value width wmode wrap about datatype inlist prefix property resource typeof vocab autoCapitalize autoCorrect autoSave color itemProp itemScope itemType itemID itemRef results security unselectable"],function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e[0].split(" ").reduce(function(e,t){return e[t]=!0,e},{})}(o));var r,o},{}],12:[function(e,t,n){(function(e){"use strict";function t(e,t,n){if(void 0===n&&(n=!1),e){if(!n)throw new Error(t);console.warn(t)}}function r(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n}Object.defineProperty(n,"__esModule",{value:!0});var o="object"==typeof e?e:"object"==typeof window?window:this||{};n.Symbol="function"==typeof o.Symbol?o.Symbol:function(){function e(e){return"@@"+e}var t={};e.for=function(n){return t[n]?t[n]:t[n]=e(n)}}(),n.D=t,n.ea=r;var a="function"==typeof o.requestAnimationFrame;n.requestAnimationFrame=a?function(e){return o.requestAnimationFrame(e)}:function(e){return setTimeout(e,60)};var i="function"==typeof o.requestIdleCallback;n.requestIdleCallback=i?function(e){return o.requestIdleCallback(e)}:function(e){return e()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],13:[function(t,n,r){(function(t){var r,o,a,i,u,l,c,f,s,p,d,h,y,v,m;!function(r){function o(e,t){return function(n,r){return e[n]=t?t(n,r):r}}var a="object"==typeof t?t:"object"==typeof self?self:"object"==typeof this?this:{};"function"==typeof e&&e.amd?e("tslib",["exports"],function(e){r(o(a,o(e)))}):r("object"==typeof n&&"object"==typeof n.exports?o(a,o(n.exports)):o(a))}(function(e){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};r=function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)},o=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++){t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},a=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&(n[r[o]]=e[r[o]]);return n},i=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.Ya)i=Reflect.Ya(e,t,n,r);else for(var u=e.length-1;u>=0;u--)(o=e[u])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i},u=function(e,t){return function(n,r){t(n,r,e)}},l=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.Za)return Reflect.Za(e,t)},c=function(e,t,n,r){return new(n||(n=Promise))(function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function u(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){e.done?o(e.value):new n(function(t){t(e.value)}).then(i,u)}l((r=r.apply(e,t||[])).next())})},f=function(e,t){function n(e){return function(t){return r([e,t])}}function r(n){if(o)throw new TypeError("Generator is already executing.");for(;l;)try{if(o=1,a&&(i=a[2&n[0]?"return":n[0]?"throw":"next"])&&!(i=i.call(a,n[1])).done)return i;switch(a=0,i&&(n=[0,i.value]),n[0]){case 0:case 1:i=n;break;case 4:return l.label++,{value:n[1],done:!1};case 5:l.label++,a=n[1],n=[0];continue;case 7:n=l.$a.pop(),l._a.pop();continue;default:if(i=l._a,!(i=i.length>0&&i[i.length-1])&&(6===n[0]||2===n[0])){l=0;continue}if(3===n[0]&&(!i||n[1]>i[0]&&n[1]<i[3])){l.label=n[1];break}if(6===n[0]&&l.label<i[1]){l.label=i[1],i=n;break}if(i&&l.label<i[2]){l.label=i[2],l.$a.push(n);break}i[2]&&l.$a.pop(),l._a.pop();continue}n=t.call(e,l)}catch(e){n=[6,e],a=0}finally{o=i=0}if(5&n[0])throw n[1];return{value:n[0]?n[1]:void 0,done:!0}}var o,a,i,u,l={label:0,ab:function(){if(1&i[0])throw i[1];return i[1]},_a:[],$a:[]};return u={next:n(0),throw:n(1),return:n(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u},s=function(e,t){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])},p=function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}},d=function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),i=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)i.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return i},h=function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(d(arguments[t]));return e},y=function(e,t,n){function r(e){return function(t){return new Promise(function(n,r){h.push([e,t,n,r]),o()})}}function o(){!s&&h.length&&a((s=h.shift())[0],s[1])}function a(e,t){try{i(d[e](t))}catch(e){f(s[3],e)}}function i(e){e.done?f(s[2],e):"yield"===e.value[0]?f(s[2],{value:e.value[1],done:!1}):Promise.resolve(e.value[1]).then("delegate"===e.value[0]?u:l,c)}function u(e){i(e.done?e:{value:["yield",e.value],done:!1})}function l(e){a("next",e)}function c(e){a("throw",e)}function f(e,t){s=void 0,e(t),o()}if(!Symbol.bb)throw new TypeError("Symbol.asyncIterator is not defined.");var s,p,d=n.apply(e,t||[]),h=[];return p={next:r("next"),throw:r("throw"),return:r("return")},p[Symbol.bb]=function(){return this},p},v=function(e){function t(t,n){return function(r){return{value:["delegate",(e[t]||n).call(e,r)],done:!1}}}var n={next:t("next"),throw:t("throw",function(e){throw e}),return:t("return",function(e){return{value:e,done:!0}})};return e=m(e),n[Symbol.iterator]=function(){return this},n},m=function(e){if(!Symbol.bb)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.bb];return t?t.call(e):"function"==typeof p?p(e):e[Symbol.iterator]()},e("__extends",r),e("__assign",o),e("__rest",a),e("__decorate",i),e("__param",u),e("__metadata",l),e("__awaiter",c),e("__generator",f),e("__exportStar",s),e("__values",p),e("__read",d),e("__spread",h),e("__asyncGenerator",y),e("__asyncDelegator",v),e("__asyncValues",m)})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[6])(6)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/**
 * @fileoverview
 * @author Taketoshi Aono
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fueldom_1 = require("fueldom");
var PATH_REGEXP = /^\:(.+)$/;
function parseURL(url) {
    var path = url || location.hash.slice(1);
    if (!path) {
        path = '/';
    }
    if (path.charAt(0) !== '/') {
        path = "/" + path;
    }
    if (path.length > 1 && path.charAt(path.length - 1) === '/') {
        path = path.slice(0, path.length - 1);
    }
    return path;
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.params = {};
        return _this;
    }
    Route.prototype.render = function () {
        var _this = this;
        var Component = this.props.component;
        var location = this.props.location;
        var parent = this.parent;
        if (this.matchs && this.matchs.length > 0) {
            var children = fueldom_1.Fuel.Children.map(this.props.children, function (child) { return fueldom_1.Fuel.cloneElement(child, { location: location, parent: parent, params: _this.params }); });
            if (Component) {
                return fueldom_1.React.createElement(Component, { params: this.params }, children);
            }
            return fueldom_1.React.createElement("div", null, children);
        }
        else if (fueldom_1.Fuel.Children.toArray(this.props.children).filter(function (child) { return child.type === Route; }).length) {
            return fueldom_1.React.createElement("div", null, fueldom_1.Fuel.Children.map(this.props.children, function (child) { return fueldom_1.Fuel.cloneElement(child, { location: location, parent: parent }); }));
        }
        return null;
    };
    Route.prototype.componentWillMount = function () {
        var _this = this;
        var location = this.props.location;
        this.parent = "" + (this.props.parent ? this.props.parent : '') + parseURL(this.props.path);
        var match;
        var ids = [];
        var replaced = this.parent.replace(/\:[^\/]+/g, function (id) {
            ids.push(id.slice(1));
            return '([^/]+)';
        });
        var regexp = new RegExp("^" + replaced + "$");
        this.matchs = location.match(regexp);
        if (this.matchs && this.matchs.length > 0) {
            this.matchs.slice(1).forEach(function (match, index) { return _this.params[ids[index]] = match; });
        }
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
        fueldom_1.React.createElement(Route, { path: "bar" },
            fueldom_1.React.createElement(Route, { path: ":id", component: HandleId }))))), document.getElementById('app'));

},{"fueldom":1,"tslib":3}],3:[function(require,module,exports){
(function (global){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), q = [], c, i;
        return i = { next: verb("next"), "throw": verb("throw"), "return": verb("return") }, i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { return function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]), next(); }); }; }
        function next() { if (!c && q.length) resume((c = q.shift())[0], c[1]); }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(c[3], e); } }
        function step(r) { r.done ? settle(c[2], r) : r.value[0] === "yield" ? settle(c[2], { value: r.value[1], done: false }) : Promise.resolve(r.value[1]).then(r.value[0] === "delegate" ? delegate : fulfill, reject); }
        function delegate(r) { step(r.done ? r : { value: ["yield", r.value], done: false }); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { c = void 0, f(v), next(); }
    };

    __asyncDelegator = function (o) {
        var i = { next: verb("next"), "throw": verb("throw", function (e) { throw e; }), "return": verb("return", function (v) { return { value: v, done: true }; }) };
        return o = __asyncValues(o), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { return function (v) { return { value: ["delegate", (o[n] || f).call(o, v)], done: false }; }; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
