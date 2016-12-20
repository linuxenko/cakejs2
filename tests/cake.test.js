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
    cake.unregister('cake');
    cake.unregister('routes');
    cake.unregister('zefir');
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
    expect(didTransition.calledOnce).to.be.true;
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
    c.get('zefir').deviceWatcher();

    expect(rndrSpy.calledOnce).to.be.true;
    expect(document.body.innerHTML)
      .to.be.equal('<div class="cake" id="cake"><div>hello</div></div>');
    r.set('helloText', 'world');
    c._updateWatcher();
    expect(document.body.innerHTML)
      .to.be.equal('<div class="cake" id="cake"><div>world</div></div>');
  });

  it('shoud render nested namespace', function() {
    var b = cake.Cream.extend({
      _namespace : 'routes.hello.nested',
      helloText : 'hello'
    });

    var r = cake.Cream.extend({
      _namespace : 'routes.hello',
      hello : cake.inject('routes.hello.nested.helloText'),

      render : function() {
        console.log(this.get('hello'));
        return h('div', { id : 'rtest'}, this.get('hello'));
      }
    });

    c.route('/home/:id', 'routes.hello');
    jsdom.changeURL(window, 'http://localhost/home/23?test=321');
    c.get('zefir').deviceWatcher();
    c._updateWatcher();

    var element = document.getElementById('rtest');

    expect(element.textContent).to.be.equal('hello');

    r.set('hello', 'world');
    console.log(r.hello);
    console.log(r.get('hello'));
    c._updateWatcher();
    expect(element.textContent).to.be.equal('world');

//    b.set('helloText', 'hello123');
//    console.log(r.hello);
//    c._updateWatcher();
//    expect(element.textContent).to.be.equal('hello123');
  });
});
