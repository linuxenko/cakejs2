/*
 *
 * Cream is a base ingredient
 */

/**
 * Sugar function prototypes (observes, property)
 */
require('./recipes/fn');
var Container = require('./container');

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
  this._namespace = null;
  this._emitter;
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

    if ((ref = ref[path[i]]) === undefined) {
      return;
    }
  }

  /**
   * It is property function
   */
  if (ref && typeof ref === 'object' && ref.isProperty === true) {
    return ref.fn.call(this);
  }

  return ref;
};

Cream.prototype.set = function(name, value) {
  return this._setProp(name, 'set', value);
};

Cream.prototype.push = function(name) {
  return this._setProp(name, 'push', [].slice.call(arguments, 1));
};

Cream.prototype.splice = function(name) {
  return this._setProp(name, 'splice', [].slice.call(arguments, 1));
};

Cream.prototype.pop = function(name) {
  return this._setProp(name, 'pop', [].slice.call(arguments, 1));
};

Cream.prototype.shift = function(name) {
  return this._setProp(name, 'shift', [].slice.call(arguments, 1));
};

Cream.prototype._setProp = function(name, fnName, args) {
  /**
   * Function call results
   */
  var result;

  if (this._isValidLocalProp(name)) {
    /**
     * Setup local property
     */

    if (fnName === 'set') {
      this._getPropParent(name)[this._getPropName(name)] = args;
      result = true;
    } else {
      result = this.get(name)[fnName].apply(this.get(name), args);
    }

    this.notifyPropertyChange(name);
  } else {
    /**
     * Setup injected reference
     */
    var nsRef = this._getPropertyRef(name);

    if (nsRef) {
      result = nsRef.ref[fnName].apply(nsRef.ref, [nsRef.name].concat(args));
    }
  }

  return result;
};

Cream.prototype._init = function() {
  ('init' in this) && this.init();
};

Cream.prototype._destroy = function() {
  ('destroy' in this) && this.destroy();
};

Cream.prototype.notifyPropertyChange = function(name) {
  this._emitter('setProp', this._namespace + '.' + name);
};

Cream.prototype._isValidLocalProp = function(name) {
  if (!this._namespace) {
    throw new Error('Cream should be registered before you set something');
  }

  if (typeof name !== 'string' || name.length < 1) {
    throw new Error('Tying to set value with wrong name');
  }

  if (this._propNamespace(name) === undefined || /* new value */
    this._propNamespace(name) === this._namespace) {
    return true;
  }
};

/*
 * Reference of the namespace (injectable props)
 */
Cream.prototype._getPropertyRef = function(name) {
  var path = this._propAbsolutePath(name).split('.');
  var nsRef;

  for (var i = path.length; i >= 0; i--) {
    nsRef = Container.inject(path.slice(0, i).join('.'))();

    /*
     * Resolve parent of the namespace
     */
    if (nsRef instanceof Cream) {
      return {
        ref  : nsRef,
        name : path.slice(i).join('.')
      };
    }
  }
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
    if ((ref = ref[path[i]]) === undefined) {
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

    if ((ref = ref[path[i]]) === undefined) {
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

      if (F[i] && typeof F[i] === 'object' && F[i].isObserver === true) {
        F._addObserver(F[i]);
      }
    }
  }

  if ('_namespace' in obj) {
    if ('_after' in obj) {
      Container.register(obj._namespace, F, obj._after);
    } else {
      Container.register(obj._namespace, F);
    }
  }

  return F;
};

module.exports = Cream;
