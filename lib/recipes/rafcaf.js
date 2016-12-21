/* eslint no-undef : 0 */
var win;

try {
  win = global.window || window;
} catch (e) {
  win = {};
}

var request =
  win.requestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  win.oRequestAnimationFrame ||
  win.msRequestAnimationFrame ||
  function(callback){
    return setTimeout(function(){
      callback();
    }, 1e3 / 60);
  };

var cancel =
  win.cancelAnimationFrame ||
  win.webkitCancelAnimationFrame ||
  win.webkitCancelRequestAnimationFrame ||
  win.mozCancelAnimationFrame ||
  win.oCancelAnimationFrame ||
  win.msCancelAnimationFrame ||
  function(timeout){
    clearTimeout(timeout);
  };

var raf = function(){
  return request.apply(win, arguments);
};

var caf = function(){
  return cancel.apply(win, arguments);
};

module.exports = {
  raf : raf,
  caf : caf
};
