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
  it('should replace existen element', function() {
    var el = document.createElement('div');
    el.setAttribute('id', 'cake');
    document.body.appendChild(el);

    cake.create();

    expect(document.getElementById('cake')).not.be.equal(el);

    cake.destroy();
  });

  it('should start clean after destroying', function() {
    expect(document.getElementById('cake')).not.exists;
    cake.create();
    expect(document.getElementById('cake')).to.be.exists;
    cake.destroy();
    expect(document.getElementById('cake')).not.exists;
  });

  it.only('should handle createRoot opts', function() {
    expect(document.getElementById('cake')).not.exists;
    cake.create({ createRoot : false });
    expect(document.getElementById('cake')).not.exists;
    cake.destroy();
    expect(document.getElementById('cake')).not.exists;

    var c = cake.create({ createRoot : false });

    c.set('zefir.aaa', []);
    c.route('/', 'home');

    cake.Cream.extend({
      _namespace : 'home',
      render : function() {
        return cake.h('div', { className : 'test' });
      }
    });

    jsdom.changeURL(window, 'https://localhost/');
    c.get('zefir').deviceWatcher();

  });
});
