var Cream = function() {};

Cream.prototype._init = function() {

};

Cream.prototype.set = function() {

};

Cream.prototype.get = function() {

};

Cream.extend = function(obj) {
  var F = function() {};
  F.prototype = new Cream();
  F = new F();

  for (var i in obj) {
    var descr = Object.getOwnPropertyDescriptor(obj, i);

    if (descr !== undefined) {
      F[i] = obj[i];
    }
  }

  return F;
};

module.exports = Cream;
