/**
 * Container of the different ingredients to make a cake
 *
 */
var container = {};

var register = function(name, obj) {
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
};

var unregister = function(name) {
  var path = name.split('.');
  var ref = container;

  for (var i = 0; i < path.length - 1; i++) {
    if (!(ref = ref[path[i]])) {
      throw new Error('Not found ', + name);
    }
  }

  if (typeof ref[path[path.length - 1]] === 'object') {
    delete ref[path[path.length - 1]];
  } else {
    throw new Error('Not found ', + name);
  }
};

var inject = function(name) {
  var path = name.split('.');
  var ref = container;

  for (var i = 0; i < path.length; i++) {
    if (!(ref = ref[path[i]])) {
      throw new Error('Not found ', + name);
    }
  }

  return ref;
};

module.exports = {
  _container : container,
  register   : register,
  unregister : unregister,
  inject     : inject
};
