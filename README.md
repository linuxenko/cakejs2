[![CakeJs](https://raw.githubusercontent.com/linuxenko/cakejs/master/contrib/cakejs.png)](https://github.com/linuxenko/cakejs)
[![Build Status](https://img.shields.io/travis/linuxenko/cakejs.svg?style=flat-square)](https://travis-ci.org/linuxenko/cakejs) [![Coveralls](https://img.shields.io/coveralls/linuxenko/cakejs/master.svg?style=flat-square)](https://coveralls.io/github/linuxenko/cakejs) [![npm version](https://img.shields.io/npm/v/cakejs2.svg?style=flat-square)](https://www.npmjs.com/package/cakejs2) [![alpha](https://img.shields.io/badge/stability-Experimental-ff69b4.svg?style=flat-square)](https://github.com/linuxenko/cakejs)

`CakeJS2` is an experimental `front-end` framework for javascript with attempt to implement most awesome features of another frameworks with very small codebase.

#### Features

  * All in one
  * [Dependency management](./contrib/di.md)
  * [Live rendering](./contrib/loop.md) ( + [virtual dom](https://unpkg.com/cakejs2@latest/dist/cake.min.js) )
  * JSX support
  * Small error stack trace (?)
  * Small size and codebase ([about 23kb](./dist/cake.min.js))
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

**Installation**

```
npm install cakejs2
```

CDN

```
https://unpkg.com/cakejs2@latest/dist/cake.min.js
```

**API**

  * `h`
  * `next`
  * `register`
  * `unregister`
  * `inject`
  * `create`
  * `destroy`

`create` options:

```js
create({
  element      : document.body // by default
  elementClass : cake
  elementId    : cake

```

#### History

`Cakejs2` is a second generation of the `cakejs` framework.

First version of `cakejs` were made in 2012th and [published](https://github.com/linuxenko/cakejs/commit/ade98e2e84f56ca5b3f99b69fa30101172d30e6c) in 2014th.

#### License

GPLv3 (c) Svetlana Linuxenko
