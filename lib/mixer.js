/**
 *
 * Mixer
 */

var raf = require('./recipes/rafcaf').raf,
  caf = require('./recipes/rafcaf').caf;

var frame = null;
var nextQueue = [];
var isRunning = false;

/**
 * next tick queue handler
 */
var nextTick = function() {
  var queue = nextQueue.splice(0);

  for (var i = 0; i < queue.length; i++) {
    var task = queue[i];

    if (task && typeof task === 'function') {
      task();
    }
  }
};

/**
 * Mixer loop runner
 *
 * @name run
 * @function
 * @access public
 */
var run = function() {
  if (isRunning === true) {
    throw new Error('Mixer already running');
  }

  isRunning = true;

  var loop = function() {
    nextTick();
    frame = raf(loop);
  };

  loop();
};

/**
 * Stop mixer
 *
 * @name stop
 * @function
 * @access public
 */
var stop = function() {
  caf(frame);
  nextTick();
  isRunning = false;
};

/**
 * Next tick runner
 *
 * @name next
 * @function
 * @access public
 * @param {Function} fn function to run
 */
var next = function(fn) {
  nextQueue.push(fn);
};

module.exports = {
  run  : run,
  stop : stop,
  next : next
};
