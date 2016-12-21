[![CakeJs](https://raw.githubusercontent.com/linuxenko/cakejs/master/contrib/cakejs.png)](https://github.com/linuxenko/cakejs)
[![Build Status](https://img.shields.io/travis/linuxenko/cakejs.svg?style=flat-square&branch=develop)](https://travis-ci.org/linuxenko/cakejs) [![Coveralls](https://img.shields.io/coveralls/linuxenko/cakejs/develop.svg?style=flat-square)](https://coveralls.io/github/linuxenko/cakejs) [![alpha](https://img.shields.io/badge/stability-Experimental-ff69b4.svg?style=flat-square)](https://github.com/linuxenko/cakejs)

`CakeJS` is an experimental `front-end` framework for javascript with attempt to implement most awesome features of another frameworks with very small codebase.

#### Features

  * All in one
  * [Dependency management](./contrib/di.md)
  * [Live rendering](./contrib/loop.md) ( + [virtual dom](https://github.com/linuxenko/basic-virtual-dom) )
  * JSX support
  * Small error stack trace (?)
  * Small size and codebase ([about 23kb](./dist/cake.js)
  * ES5 support (Yeah!)
  * Very simple to learn

**Candle counter recipe:**

```js
create().route('/', 'counter');

Cream.extend({
  _namespace : 'counter',

  candles : 0,

  increment : function() {
    this.set('candles', this.candles + 1);
  },

  render : function() {
    return h('button', { onClick : this.increment }, 'Candles on the Cake: ' + this.candles);
  }
});
```

To enable `JSX` support, transpiler option have to be provided that names defaults with `h` (hyperscript) instead of react:

```
/** @jsx h */
```

Check out [examples](./examples) folder.

**API**

  * `h`
  * `next`
  * `register`
  * `unregister`
  * `inject`
  * `create`
  * `destroy`


#### License

GPLv3 (c) Svetlana Linuxenko
