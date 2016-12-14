/*
 *
 * Cream is a base ingredient
 */

require('./sugar');
var Container = require('../mixer/container');

var Cream = function() {
  this._type = 'Cream';
  this._observers = [];
  this._namespace = '';
  this._emitter;
};

Cream.prototype._init = function() {

};

Cream.prototype._destroy = function() {

};

Cream.prototype.set = function(name, value) {
  if (this.get(name)) {
    this[name] = value;

    this._emitter('setProp', {
      name : this._namespace + '.' + name,
      value : value
    });
  }
};

Cream.prototype.get = function(name) {
  var ref = this;
  var path = name.split('.');

  for (var i = 0; i < path.length; i++) {
    if (typeof ref[path[i]] === 'function' && ref[path[i]].isInjection) {
      ref = ref[path[i]]();
      continue;
    }

    if (!(ref = ref[path[i]])) {
      return;
    }
  }

  if (typeof ref === 'object' && ref.isProperty === true) {
    return ref.fn.call(this);
  }

  return ref;
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

      if (typeof F[i] === 'object' && F[i].isObserver === true && F[i].prop) {
        F._observers.push({
          cream : F,
          prop : F[i].prop,
          fn : F[i].fn.bind(F)
        });
      }
    }
  }

  if ('_namespace' in obj) {
    Container.register(obj._namespace, F);
  }

  return F;
};

module.exports = Cream;
