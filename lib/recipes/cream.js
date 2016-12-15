/*
 *
 * Cream is a base ingredient
 */

/**
 * Sugar function prototypes (observes, property)
 */
require('./sugar');
var Container = require('../mixer/container');

/**
 * Base ingredient of any cake
 *
 * @name Cream
 * @function
 * @access public
 */
var Cream = function() {
  this._type = 'Cream';
  this._observers = [];
  this._namespace = '';
  this._emitter;
};

Cream.prototype.set = function(name, value) {
  if (this._propNamespace(name) === this._namespace) {
    /**
     * Setup local namespace properties
     */
    this._getPropParent(name)[this._getPropName(name)] = value;
    this.notifyPropertyChange(name);
  } else {
    /**
     * Injectable properties set
     */
    var path = this._propAbsolutePath(name).split('.');

    for (var i = path.length; i >= 0; i--) {
      var nsRef = Container.inject(path.slice(0, i).join('.'), true)();

      if (nsRef instanceof Cream) {
        nsRef.set(path.slice(i).join('.'), value);
        break;
      }
    }
  }
};

Cream.prototype.get = function(name) {
  var ref = this;
  var path = name.split('.');
  for (var i = 0; i < path.length; i++) {
    /**
     * Nor propery injected
     */
    if (typeof ref[path[i]] === 'function' && ref[path[i]].isInjection) {
      ref = ref[path[i]]();
      continue;
    }

    if (!(ref = ref[path[i]])) {
      return;
    }
  }

  /**
   * It is property function
   */
  if (typeof ref === 'object' && ref.isProperty === true) {
    return ref.fn.call(this);
  }

  return ref;
};

Cream.prototype.notifyPropertyChange = function(name) {
  this._emitter('setProp', this._namespace + '.' + name);
};

Cream.prototype._propAbsolutePath = function(name) {
  var ns = this._propNamespace(name);

  if (ns) {
    if (ns !== this._namespace) {
      return ns + '.' + name.split('.').slice(1).join('.');
    }
    return ns + '.' + name;
  }

  return name;
};

Cream.prototype._getPropName = function(name) {
  return name.split('.').pop();
};

Cream.prototype._getPropParent = function(name) {
  var ref = this;
  var path = name.split('.');

  for (var i = 0; i < path.length - 1; i++) {
    if (!(ref = ref[path[i]])) {
      return;
    }
  }

  return ref;
};

Cream.prototype._propNamespace = function(name) {
  var ref = this;
  var path = name.split('.');

  for (var i = 0; i < path.length; i++) {
    if (typeof ref === 'function' && ref.isInjection) {
      return ref.namespace;
    }

    if (!(ref = ref[path[i]])) {
      return;
    }
  }

  return this._namespace;
};

Cream.prototype._addObserver = function(observer) {
  if (observer.prop.length < 1) { return; }

  var self = this;

  this._observers.push({
    cream : this,
    prop : observer.prop.map(function(p) {
      if (typeof p === 'string') {
        return self._propAbsolutePath(p);
      }
      return p;
    }),
    fn : observer.fn.bind(this)
  });
};

Cream.extend = function(obj) {
  var F = function() {};
  F.prototype = new Cream();
  F = new F();

  for (var i in obj) {
    var descr = Object.getOwnPropertyDescriptor(obj, i);

    if (descr !== undefined) {
      F[i] = typeof obj[i] === 'function' &&
        !obj[i].isInjection ? obj[i].bind(F) : obj[i];

      if (typeof F[i] === 'object' && F[i].isObserver === true) {
        F._addObserver(F[i]);
      }
    }
  }

  if ('_namespace' in obj) {
    Container.register(obj._namespace, F);
  }

  return F;
};

module.exports = Cream;
