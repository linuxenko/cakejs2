var expect = require('chai').expect;
var cake = require('../');

var jsdom = require('jsdom');
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>',{ url: 'http://test/'});
var win = doc.defaultView;
global.document = doc;
global.window = win;
propagateToGlobal(win);

function propagateToGlobal (window) {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}

describe('Some kitchen tests', function() {

  after(function() {
    document.body.removeChild(document.getElementById('cake'));
  });

  it('should replace existen element', function() {
    var el = document.createElement('div');
    el.setAttribute('id', 'cake');
    document.body.appendChild(el);

    cake.create();

    expect(document.getElementById('cake')).not.be.equal(el);

    cake.destroy();
  });
});
