**Dependency Management**

Every registered object has its own `_container` and namespace.
How to place `Cream` into `container`:

  * By specifying `_namespace` property inside of an object.
  * Using `register` function, for example: `register('routes.home', homeCream)`.

To manage dependencies priority, the `_after` option could be used:

Using an appropriate argument list for `register()` function:

```js
var Home = Cream.extend({});

register('routes.home', Home, 'mystore');

```

or just explicitly specifying using the `_after` keyword inside of a `Cream`:

```js
Cream.extend({
  _namespace : 'routes.home',
  _after : 'mystore'
});

```

**Dependency Injection**

Any registered object or its property can be easily injected using `inject` function:

```js
  Cream.extend({
    store : inject('mystore.records')
  });

```

