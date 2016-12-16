/*
 * Function sugar
 */

Function.prototype.property = function() {
  return {
    isProperty : true,
    fn : this
  };
};

Function.prototype.observes = function() {
  return {
    isProperty : true,
    isObserver : true,
    prop : [].slice.call(arguments),
    fn : this
  };
};
