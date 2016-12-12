/*
 * Caramel for cake.
 */

var TYPE_ONCE   = 0;
var TYPE_MANY   = 1;
var TYPE_REGEXP = 2;
var TYPE_STRING = 3;

var MAX_LISTENERS = 256;

var isValidEventName = function(eventName) {
  return (eventName &&
    (typeof eventName === 'string' ||
    (eventName instanceof RegExp)));
};

var isValidProps = function(eventName, listener) {
  return (isValidEventName(eventName) && typeof listener === 'function');
};

var caramel = function() {
  this.listeners = [];
};

caramel.prototype.on = function(eventName, listener) {
  this._subscribe(eventName, TYPE_MANY, listener);
};

caramel.prototype.once = function(eventName, listener) {
  this._subscribe(eventName, TYPE_ONCE, listener);
};

caramel.prototype.emit = function(eventName, data) {
  this._fireEvent(eventName, data);
};

caramel.prototype.has = function(eventName, listener) {
  return this._listenerFor(eventName, listener) ? true : false;
};

caramel.prototype.off = function(eventName, listener) {
  this._unsubscribe(eventName, listener);
};

caramel.prototype._fireEvent = function(eventName, data) {
  if ((typeof eventName !== 'string' || eventName.length < 1) &&
  !(eventName instanceof RegExp)) {
    throw new Error('Wrong arguments ' + eventName);
  }

  for (var i = 0; i < this.listeners.length; i++) {
    var event = this.listeners[i];

    if (event.eventType === TYPE_REGEXP && event.eventName.test(eventName) ||
      event.eventType === TYPE_STRING && event.eventName === eventName ||
      event.eventType === TYPE_STRING && (eventName instanceof RegExp) &&
      eventName.test(event.eventName)
    ) {

      event.listener(data);

      if (event.runType === TYPE_ONCE) {
        this._unsubscribe(event.eventName, event.listener);
      }
    }
  }
};

caramel.prototype._unsubscribe = function(eventName, listener) {
  var toRemove = [], i;

  for (i = 0; i < this.listeners.length; i++) {
    var l = this.listeners[i], remove = false;

    if (l.eventName === eventName) {
      remove = true;
    } else if (eventName instanceof RegExp && eventName.test(l.eventName)) {
      remove = true;
    }

    if (remove === true) {
      if (typeof listener === 'undefined') {
        toRemove.push(i);
      } else if (this.listeners[i].listener === listener) {
        toRemove.push(i);
      }
    }
  }

  for (i = toRemove.length -1; i >= 0; i--) {
    this.listeners.splice(toRemove[i], 1);
  }
};

caramel.prototype._subscribe = function(eventName, type, listener) {
  if (!isValidProps(eventName, listener)) {
    throw new Error('Wrong arguments ' + eventName + ' ' + listener);
  }

  if (this.has(eventName, listener)) {
    throw new Error('Such listener already exists');
  }

  if (this.listeners.length >= MAX_LISTENERS) {
    throw new Error('Limit of the listeners exceed MAX_LISTENERS = ' + MAX_LISTENERS);
  }

  var event = {
    eventName : eventName,
    listener : listener,
    runType : type,
    eventType : (eventName instanceof RegExp) ? TYPE_REGEXP : TYPE_STRING
  };

  this.listeners.push(event);
};

caramel.prototype._listenerFor = function(eventName, listener) {
  for (var i = 0; i < this.listeners.length; i++) {
    if (this.listeners[i].eventName === eventName &&
      this.listeners[i].listener === listener) {
      return this.listeners[i];
    }
  }
};

module.exports = caramel;