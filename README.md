[![CakeJs](https://raw.githubusercontent.com/linuxenko/cakejs/master/contrib/cakejs.png)](https://github.com/linuxenko/cakejs)

[![Build Status](https://img.shields.io/travis/linuxenko/cakejs.svg?style=flat-square)](https://travis-ci.org/linuxenko/cakejs) [![Coveralls](https://img.shields.io/coveralls/linuxenko/cakejs/master.svg?style=flat-square)](https://coveralls.io/github/linuxenko/cakejs) [![npm version](https://img.shields.io/npm/v/cakejs2.svg?style=flat-square)](https://www.npmjs.com/package/cakejs2) [![alpha](https://img.shields.io/badge/stability-Experimental-ff69b4.svg?style=flat-square)](https://github.com/linuxenko/cakejs)

`CakeJS2` lightweight front-end framework with only best parts and features of most awesome frameworks.

#### Features

  * All in one
  * [Dependency management](./contrib/di.md)
  * [Live rendering](./contrib/loop.md) (+ [virtual dom](https://github.com/linuxenko/basic-virtual-dom))
  * Good [performance](https://15lyfromsaturn.github.io/js-repaint-perfs/cakejs/index.html)
  * JSX support
  * Small error stack trace (?)
  * Small size and codebase ([about 23kb](https://unpkg.com/cakejs2@latest/dist/cake.min.js))
  * ES5 support (Yeah!)
  * Very easy to learn

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

**Examples**

Live demos:

  * [todomvc](http://codepen.io/linuxenko/pen/jVRwLL)
  * [js-repaint-perf](https://15lyfromsaturn.github.io/js-repaint-perfs/cakejs/index.html)

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
  * [next](https://github.com/linuxenko/cakejs/blob/master/contrib/loop.md)
  * `debounce`
  * [register](https://github.com/linuxenko/cakejs/blob/master/contrib/di.md)
  * [unregister](https://github.com/linuxenko/cakejs/blob/master/contrib/di.md)
  * [inject](https://github.com/linuxenko/cakejs/blob/master/contrib/di.md)
  * `create`
  * `destroy`
  * `Cream`

`create` options:

```js
create({
  element      : document.body // by default
  elementClass : cake
  elementId    : cake

```

`route`:

```js
create().route(
 '/posts/:id/post',  // URL pattern, also available "*" pattern
 'home'             // Namespace of the component
 );

```

**Namespaces**

[![Namespaces](https://raw.githubusercontent.com/linuxenko/cakejs/master/contrib/namespaces.png)](http://i.imgur.com/USVdVuM.gifv)

**Cream**

Base component of any cake.

Functions:

  * `init`
  * `willTransition`
  * `didTransition`
  * `render`

Options:

  * `_namespsace` - object's namespace
  * `_after` - DI after

Zefir:

  * `props` - routing options ( `/:id/` for an instance became `props.id` )
  * `params` - params eg `?iam=param` bacame `params.iam`

Sugar:

  * `observes`
  * `property` - computed property

`observes` creates observer function

```js
  dataWatcher : function() { .... }.observes('posts', /^store/)
```

#### History

`Cakejs2` is a second generation of the `cakejs` framework.

First version of `cakejs` were made in 2012th and [published](https://github.com/linuxenko/cakejs/commit/ade98e2e84f56ca5b3f99b69fa30101172d30e6c) in 2014th.

#### License

MIT License

Copyright (c) 2016 Svetlana Linuxenko
