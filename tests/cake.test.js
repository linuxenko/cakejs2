var expect = require('chai').expect;
var sinon  = require('sinon');
var h = require('basic-virtual-dom').h;
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
    cake.unregister('routes');
  });

  beforeEach(function() {
    c.get('zefir').set('routes', []);
  });

  afterEach(function() {
    cake.unregister('routes');
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
    expect(willTransition.calledOnce).to.be.true;
  });

  it('should provide props and params', function() {
    var r = cake.Cream.extend({
      _namespace : 'routes.hello'
    });

    c.route('/home/:id', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/home/123?test=321');
    c.get('zefir').deviceWatcher();

    expect(r.get('props.id')).to.be.equal('123');
    expect(r.get('params.test')).to.be.equal('321');

    jsdom.changeURL(window, 'http://localhost/home/2?test=21');
    c.get('zefir').deviceWatcher();

    expect(r.get('props.id')).to.be.equal('2');
    expect(r.get('params.test')).to.be.equal('21');
  });

  it('should render from provided namespace', function() {
    var rndrSpy = sinon.spy();

    var r = cake.Cream.extend({
      _namespace : 'routes.hello',
      helloText : 'hello',

      render : function() {
        rndrSpy();
        return h('div', null, this.get('helloText'));
      }
    });

    c.route('/home/:id', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/home/123?test=321');

    expect(rndrSpy.calledOnce).to.be.true;
    expect(document.body.innerHTML)
      .to.be.equal('<div class="cake" id="cake"><div>hello</div></div>');
    r.set('helloText', 'world');
    c._updateWatcher();
    expect(document.body.innerHTML)
      .to.be.equal('<div class="cake" id="cake"><div>world</div></div>');
  });

  it('shoud render nested namespace', function() {
    var renderSpy = sinon.spy();
    var b = cake.Cream.extend({
      _namespace : 'routes.hello.nested',
      helloText : 'hello'
    });

    var r = cake.Cream.extend({
      _namespace : 'routes.hello',
      hello : cake.inject('routes.hello.nested.helloText'),

      render : function() {
        renderSpy();
        return h('div', { id : 'rtest'}, this.get('hello'));
      }
    });

    c.route('/home/:id', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/home/23?test=321');
//    c.get('zefir').deviceWatcher();
//    c._updateWatcher();
    var element = document.getElementById('rtest');

    expect(element.textContent).to.be.equal('hello');

    r.set('hello', 'world');
    c._updateWatcher();
    expect(element.textContent).to.be.equal('world');

    b.set('helloText', 'hello123');
    c._updateWatcher();
    expect(element.textContent).to.be.equal('hello123');
    expect(renderSpy.callCount).to.be.equal(3);
  });

  it('should handle before initializers', function() {
    jsdom.changeURL(window, 'http://localhost:80');

    c.route('/', 'routes.home');
    var initSpy = sinon.spy();
    cake.Cream.extend({
      _namespace : 'routes.home',
      init : initSpy
    });

    expect(initSpy.calledOnce).to.be.true;
  });

  it('should handle after initializers', function() {
    jsdom.changeURL(window, 'http://localhost:80');

    var initSpy = sinon.spy();
    cake.Cream.extend({
      _namespace : 'routes.home',
      init : initSpy
    });

    c.route('/', 'routes.home');

    expect(initSpy.calledOnce).to.be.true;
  });

  it('should handle any-route pattern', function() {
    jsdom.changeURL(window, 'http://localhost:80/not-foun/d/123');

    var initSpy = sinon.spy();
    cake.Cream.extend({
      _namespace : 'routes.home',
      init : initSpy
    });

    c.route('*', 'routes.home');

    expect(initSpy.calledOnce).to.be.true;
  });

  it('should not override routes by any-route', function() {
    jsdom.changeURL(window, 'http://localhost:80/');

    var anySpy = sinon.spy();
    var homeSpy = sinon.spy();

    c.route('/', 'routes.home');
    c.route('*', 'routes.anyroute');

    cake.Cream.extend({
      _namespace : 'routes.home',
      init : homeSpy
    });

    cake.Cream.extend({
      _namespace : 'routes.anyroute',
      init : anySpy
    });

    expect(anySpy.callCount).to.be.equal(0);
    expect(homeSpy.calledOnce).to.be.true;
  });

  it('should ignore empty render', function() {
    c.route('*', 'routes.home');

    var initSpy = sinon.spy();

    cake.Cream.extend({
      _namespace : 'routes.home',
      init : initSpy,
      render : function() { }
    });

    expect(initSpy.calledOnce).to.be.true;
  });
});
