var expect = require('chai').expect;
var cake = require('../');
var c;

var jsdom = require('jsdom');

// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>',{ url: 'http://test/'});
// get the window object out of the document
var win = doc.defaultView;
// set globals for mocha that make access to document and window feel 
// natural in the test environment
global.document = doc;
global.window = win;
// take all properties of the window object and also attach it to the 
// mocha global object
propagateToGlobal(win);
// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}


describe('Cake', function() {
  before(function() {
    c = cake.create();
  });

  after(function() {
    cake.destroy();
    cake.unregister('cake');
  });

  it.only('should bake some cake', function() {
    var r = cake.Cream.extend({
      _namespace : 'routes.hello',
    });

    c.route('/:id', 'routes.hello');
    c.route('/posts/:name/post/', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/123?test=321');
    c.get('zefir').deviceWatcher();
    jsdom.changeURL(window, 'http://localhost/');
    c.get('zefir').deviceWatcher();
  });
});
