/*
 * Function sugar
 */

Function.prototype.property = function() {
  return {
    isProperty : true,
    fn : this
  };
};

Function.prototype.observes = function(prop) {
  return {
    isProperty : true,
    isObserver : true,
    prop : prop,
    fn : this
  };
};
