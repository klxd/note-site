webpackJsonp([0x35485589dab52e00],{"./src/components/Button.js":function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var l=r("./node_modules/react/react.js"),i=o(l);r("./src/less/component/button.less");var u=function(e){function t(){return n(this,t),a(this,e.apply(this,arguments))}return s(t,e),t.prototype.render=function(){return i.default.createElement("button",{className:"button-component "+(this.props.disabled?"disabled":""),onClick:this.props.onClick,disabled:this.props.disabled},this.props.label)},t}(i.default.Component);t.default=u,u.propTypes={label:i.default.PropTypes.string,onClick:i.default.PropTypes.func,disabled:i.default.PropTypes.bool},e.exports=t.default},'./node_modules/babel-loader/lib/index.js?{"presets":["/home/peng/develop/workspace/stone-site/node_modules/babel-preset-react/lib/index.js","/home/peng/develop/workspace/stone-site/node_modules/babel-preset-es2015/lib/index.js","/home/peng/develop/workspace/stone-site/node_modules/babel-preset-stage-1/lib/index.js",["/home/peng/develop/workspace/stone-site/node_modules/babel-preset-env/lib/index.js",{"loose":true,"uglify":true,"modules":"commonjs","targets":{"browsers":["> 1%","last 2 versions","IE >= 9"]},"exclude":["transform-regenerator","transform-es2015-typeof-symbol"]}],"/home/peng/develop/workspace/stone-site/node_modules/babel-preset-stage-0/lib/index.js","/home/peng/develop/workspace/stone-site/node_modules/babel-preset-react/lib/index.js"],"plugins":["/home/peng/develop/workspace/stone-site/node_modules/gatsby/dist/utils/babel-plugin-extract-graphql.js","/home/peng/develop/workspace/stone-site/node_modules/babel-plugin-add-module-exports/lib/index.js","/home/peng/develop/workspace/stone-site/node_modules/babel-plugin-add-module-exports/lib/index.js","/home/peng/develop/workspace/stone-site/node_modules/babel-plugin-transform-object-assign/lib/index.js"],"cacheDirectory":true}!./src/components/Game2048.js':function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var l=r("./node_modules/react/react.js"),i=o(l),u=r("./src/components/Button.js"),c=o(u);r("./src/less/component/Game2048.less");var d=function(e){function t(){n(this,t);var r=a(this,e.call(this));return r.onTouchEnd=function(e){r.touchEndX=e.changedTouches[0].pageX,r.touchEndY=e.changedTouches[0].pageY;var o=r.touchEndX-r.touchStartX,n=r.touchEndY-r.touchStartY,a=void 0;a=Math.abs(o)>Math.abs(n)?o>0?t.RIGHT:t.LEFT:n>0?t.DOWN:t.UP,r.onMove(a)},r.onKeyDown=function(e){var o=void 0;switch(e.code){case"ArrowLeft":o=t.LEFT;break;case"ArrowRight":o=t.RIGHT;break;case"ArrowUp":o=t.UP;break;case"ArrowDown":o=t.DOWN;break;default:return}r.onMove(o)},r.onMove=function(e){var o=void 0,n=t.copyArray(r.arr),a=t.tryMovePanel(n,e);if(o=a[0],n=a[1],o){var s=t.setNewNum(n),l=t.isGameOver(n);r.preArr=r.arr,r.arr=n,r.setState({arr:r.arr,isGameOver:l,newCellPosition:s})}},r.onRestart=function(){r.init(),r.setState({arr:r.arr,isGameOver:!1})},r.onRevert=function(){r.arr=r.preArr,r.preArr=null,r.setState({arr:r.arr,isGameOver:!1})},r.init=function(){r.preArr=null,r.arr=[];for(var e=0;e<4;e++)r.arr.push([0,0,0,0]);t.setNewNum(r.arr),t.setNewNum(r.arr)},r.init(),r.state={arr:r.arr},r}return s(t,e),t.prototype.componentWillMount=function(){"undefined"!=typeof document&&(document.addEventListener("keydown",this.onKeyDown.bind(this)),document.addEventListener("touchstart",function(e){this.touchStartX=e.changedTouches[0].pageX,this.touchStartY=e.changedTouches[0].pageY}.bind(this)),document.addEventListener("touchend",this.onTouchEnd))},t.randomEmptyCell=function(e){for(var t=[],r=0;r<4;r++)for(var o=0;o<4;o++)0===e[r][o]&&t.push(4*r+o);return 0===t.length?-1:t[Math.floor(Math.random()*t.length)]},t.generateNewCellNumber=function(){return Math.random()>.1?2:4},t.isGameOver=function(e){for(var r=1;r<=4;r++){var o=t.tryMovePanel(e,r),n=o[0];if(n)return!1}return!0},t.prototype.render=function(){var e=this;return i.default.createElement("div",{className:"game-2048"},i.default.createElement("div",{className:"header-container"},i.default.createElement("div",{className:"header-text"},"2048"),i.default.createElement("div",{className:"button-container"},i.default.createElement(c.default,{onClick:this.onRestart,label:"New Game"}),i.default.createElement(c.default,{onClick:this.onRevert,label:"Revert",disabled:null===this.preArr}))),i.default.createElement("div",{className:"grid-container"},this.state.isGameOver?i.default.createElement("div",{className:"game-over-message"},"Game Over!"):null,this.state.arr.map(function(t,r){return i.default.createElement("div",{key:r,className:"grid-row"},t.map(function(t,o){var n=4*r+o===e.state.newCellPosition?"tile-new ":"",a="tile-"+(t>2048?"super":t);return i.default.createElement("div",{key:o,className:"grid-cell "+n+a},0===t?"":t)}))})))},t}(l.Component);d.LEFT=1,d.RIGHT=2,d.UP=3,d.DOWN=4,d.setNewNum=function(e){var t=d.randomEmptyCell(e);return t>=0&&(e[Math.floor(t/4)][t%4]=d.generateNewCellNumber()),t},d.copyArray=function(e){for(var t=[],r=0;r<e.length;r++){for(var o=[],n=0;n<e[r].length;n++)o.push(e[r][n]);t.push(o)}return t},d.tryMovePanel=function(e,t){var r=0,o=!1;switch(t){case d.LEFT:break;case d.RIGHT:r=180;break;case d.UP:r=90;break;case d.DOWN:r=270;break;default:return[o]}var n=d.rotate(e,r),a=d.merge(n);return o=a[0],n=a[1],n=d.rotate(n,360-r),[o,n]},d.merge=function(e){for(var t=!1,r=0;r<4;r++){for(var o=[],n=0;n<4;n++)0!==e[r][n]&&(o.push(e[r][n]),n>0&&0===e[r][n-1]&&(t=!0));for(var a=0;a<o.length-1;a++)o[a]===o[a+1]&&(o[a]*=2,o.splice(a+1,1),t=!0);for(;o.length<4;)o.push(0);e[r]=o}return[t,e]},d.rotate=function(e,t){for(var r=d.copyArray(e),o=0;o<t%360/90;o++)r=d.rotate90(r);return r},d.rotate90=function(e){for(var t=[],r=3;r>=0;r--){for(var o=[],n=0;n<4;n++)o.push(e[n][r]);t.push(o)}return t},t.default=d,e.exports=t.default},"./src/less/component/Game2048.less":function(e,t){},"./src/less/component/button.less":function(e,t){}});
//# sourceMappingURL=component---src-components-game-2048-js-7efafb608c8fc76fe4e6.js.map