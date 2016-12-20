var expect = require('chai').expect;
var sinon  = require('sinon');
var cake = require('../');
var c;

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


describe('Cake', function() {
  before(function() {
    c = cake.create();
  });

  after(function() {
    c.get('zefir').set('routes', []);
    c.destroy();
    cake.unregister('cake');
  });

  beforeEach(function() {
    c.get('zefir').set('routes', []);
  });

  it('should bake some cake', function() {
    var r = cake.Cream.extend({
      _namespace : 'routes.hello',
    });

    c.route('/home/:id', 'routes.hello');
    c.route('/posts/:name/post/', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/home/123?test=321');
    c.get('zefir').deviceWatcher();

    expect(c.get('loaded._namespace')).to.be.equal(r._namespace);

    jsdom.changeURL(window, 'http://localhost/ll');
    c.get('zefir').deviceWatcher();

    expect(c.get('loaded')).to.be.null;
  });

  it('should call transition events', function() {
    var didTransition = sinon.spy();
    var willTransition = sinon.spy();

    cake.Cream.extend({
      _namespace : 'routes.hello',
      didTransition : didTransition,
      willTransition : willTransition 
    });

    c.route('/home/:id', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/home/123?test=321');
    c.get('zefir').deviceWatcher();

    expect(willTransition.calledOnce).to.be.true;
    expect(didTransition.calledOnce).to.be.false;

    jsdom.changeURL(window, 'http://localhost/home/12?test=321');
    c.get('zefir').deviceWatcher();

    expect(didTransition.calledOnce).to.be.true;
    expect(didTransition.calledOnce).to.be.true;
  });
});
