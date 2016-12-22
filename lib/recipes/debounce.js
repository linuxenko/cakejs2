/**
 *
 * Simple debounce recipe
 */

var debounce = function(fn, time) {
  var timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  };
};

module.exports = debounce;
