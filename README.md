[![CakeJs](https://notabug.org/hofuku/cakejs2/raw/master/contrib/cakejs.png)](https://notabug.org/hofuku/cakejs2/raw/master/contrib/cakejs.png)

`CakeJS2` is a lightweight front-end framework which borrows most awesome features from others.

###  New features

  * Virtual-dom merged into a source tree
  * No dependencies
  * SVG support (partial)

### Features

  * All in one
  * [Dependency management](./contrib/di.md)
  * [Live rendering](./contrib/loop.md) (+ [virtual dom](https://github.com/linuxenko/basic-virtual-dom))
  * Good [performance](https://15lyfromsaturn.github.io/js-repaint-perfs/cakejs/index.html)
  * JSX support
  * Small error stack trace (?)
  * Small size and codebase ([about 23kb](https://unpkg.com/cakejs2@latest/dist/cake.min.js))
  * ES5 support (Yeah!)
  * Extremely easy to learn

**For example: a candle counter recipe:**

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

Hyperscript is an requirement:

```
/** @jsx h */
```

**More examples**

Live demos:

  * [todomvc](http://codepen.io/linuxenko/pen/jVRwLL)
  * [js-repaint-perf](https://15lyfromsaturn.github.io/js-repaint-perfs/cakejs/index.html)

Check out [examples](./examples) folder.

**Installation**

To install latest version, the repository archive could be used:

```
https://notabug.org/hofuku/cakejs2/archive/master.zip
```

CDN

None yet

Deprecated:
```
https://unpkg.com/cakejs2@latest/dist/cake.min.js
```

**API**

  * `h`
  * [next](/contrib/loop.md)
  * [register](/contrib/di.md)
  * [unregister](/contrib/di.md)
  * [inject](/contrib/di.md)
  * `create`
  * `Cream`

`create` options:

```js
create({
  element      : document.body // by default
  elementClass : cake
  elementId    : cake
  createRoot   : false        // do not create root node, use render's

```

`route`:

```js
create().route(
 '/posts/:id/post',  // URL pattern, also available "*" pattern
 'home'             // Namespace of the component
 );

```

**Namespaces**

[![Namespaces](https://raw.githubusercontent.com/linuxenko/cakejs2/master/contrib/namespaces.png)](http://i.imgur.com/USVdVuM.gifv)

*Cream* is a base component of a cake.

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

  * [2022] Forked to became a general development version for now. [notabug](https://notabug.org/hofuku/cakejs2)
  * [2016] `Cakejs2` is a second generation of the `cakejs` framework [origin](https://githubg.com/linuxenko/cakejs2)
  * [2012] First version of `cakejs` were made and [published](https://github.com/linuxenko/cakejs2/tree/outdated-v1) in 2014th.

#### License

MIT License

Copyright (c) 2016 Svetlana Linuxenko

