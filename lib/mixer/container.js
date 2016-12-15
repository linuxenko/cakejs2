/**
 * Container of the different ingredients to make a cake
 *
 */
var Caramel = require('../recipes/caramel'),
  caramel = new Caramel(),
  container = {},
  observers = [];

/**
 * Resolve property change observers
 */
caramel.on('setProp', function(name) {
  for (var i = 0; i < observers.length; i++) {
    var observer = observers[i];

    for (var j = 0; j < observer.prop.length; j++) {
      var prop = observer.prop[j];
      var longName = observer.cream._namespace + '.' + prop;

      if (longName === name || prop === name ||
        (prop instanceof RegExp && prop.test(name))) {
        observer.fn();
      }
    }
  }
});

/*
 * Newly created Cream initializer inside of the container
 */
var createCream = function(name, obj) {
  obj._namespace = name;
  observers = observers.concat(obj._observers);
  obj._emitter = caramel.emit.bind(caramel);
  obj._init();
};

/*
 * Deinitializer
 */
var removeCream = function(name, obj) {
  if (obj._observers.length > 0) {
    observers = observers.filter(function(o) {
      return obj._observers.indexOf(o) === -1;
    });
  }
  obj._destroy();
};

/**
 * DI register method
 *
 * @name register
 * @function
 * @access public
 * @param {String} name namespace register object into
 * @param {Cream} obj
 * @param {String} after namespace register object after
 */
var register = function(name, obj, after) {
  if (typeof after === 'string' && !inject(after)()) {
    caramel.once('register:' + after, function() {
      register(name, obj);
    });
    return;
  }

  var path = name.split('.');
  var ref = container;

  for (var i = 0; i < path.length - 1; i++) {
    if (!ref[path[i]]) {
      ref = ref[path[i]] = {};
    } else {
      ref = ref[path[i]];
    }
  }

  ref[path[path.length - 1]] = obj;

  createCream(name, obj);
  caramel.emit('register:' + name);
};

/**
 * DI remove method
 *
 * @name unregister
 * @function
 * @access public
 * @param {String} name namespace remove from
 */
var unregister = function(name) {
  var path = name.split('.');
  var ref = container;

  for (var i = 0; i < path.length - 1; i++) {
    if (!(ref = ref[path[i]])) {
      return;
    }
  }

  if (typeof ref[path[path.length - 1]] === 'object') {

    if (ref[path[path.length - 1]]._type === 'Cream') {
      removeCream(name, ref[path[path.length - 1]]);
    }

    delete ref[path[path.length - 1]];
  }
};

/**
 * DI inject
 *
 * @name inject
 * @function
 * @access public
 * @param {String} name namespace inject object from
 * @returns {function} injection resolver function
 */
var inject = function(name) {
  var injection;

  injection = function() {
    var path = name.split('.');
    var ref = container;

    for (var i = 0; i < path.length; i++) {
      if (!(ref = ref[path[i]])) {
        return;
      }
    }
    return ref;
  };
  injection.isInjection = true;
  injection.namespace = name;

//  if (!skipCache) {
//    caramel.once('register:' + name, function() {
//      injection();
//    });
//  }

  return injection;
};

module.exports = {
  _container : container,
  register   : register,
  unregister : unregister,
  inject     : inject
};
