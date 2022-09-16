var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');

var h = require('../../').h;
var diff = require('../../').diff;
var patch = require('../../').patch;

describe('Test events', function() {
  jsdom();

  it('should handle very simple click event', function(done) {
    var tree = h('div', { onClick : function() { done(); } }, '');

    expect(tree.props.onClick).to.be.a('function');
    tree.render();
    tree.el.click();
  });

  it('should repatch event handlers', function(done) {
    var counter = 0;
    var a = h('div', { onClick : function() { counter++; } }, '');
    var b = h('div', { onClick : function() {
      expect(counter).to.be.equal(1);
      done();
    } }, '');

    a.render();
    a.el.click();

    expect(counter).to.be.equal(1);
    expect(Object.keys(a.listeners).length).to.be.equal(1);

    patch(a, diff(a, b));
    expect(Object.keys(a.listeners).length).to.be.equal(1);
    a.el.click();
  });

  it('should work with refs', function() {
    var elRef;
    var a = h('div', { ref : function(ref) { elRef = ref; } }, '');

    expect(elRef).to.be.an('undefined');
    a.render();
    expect(elRef).to.be.equal(a.el);
  });

  it('should replace refs by patch', function() {
    var elRef1;
    var elRef2;
    var a = h('div', { ref : function(ref) { elRef1 = ref; } }, '');
    var b = h('div', { ref : function(ref) { elRef2 = ref; } }, '');

    a.render();
    var diffs = diff(a, b);
    patch(a, diffs);

    expect(elRef1).to.be.equal(a.el);
    expect(elRef2).to.be.equal(a.el);
  });
});

