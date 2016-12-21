**Dependency mangement engine**

Every registered object placed into `_container` with appropriate namespace.
There is ways to place `Cream` into container :

  * First is specifying `_namespace` property insode of the object.
  * With `register` function, for an instance `register('routes.home', homeCream)`.

Sometimes objects became depend on another objects inside, there is `_after` option
for cream that helps exactly specify `after` what register object as well as third 
argument for `register` function, for an instance:

```js
var Home = Cream.extend({});

register('routes.home', Home, 'mystore');

```

or simple:

```js
Cream.extend({
  _namespace : 'routes.home',
  _after : 'mystore'
});

```

**Injection**

Any registered object or its property can be easily inject with function `inject` for an instance:

```js
  Cream.extend({
    store : inject('mystore.records')
  });

```

