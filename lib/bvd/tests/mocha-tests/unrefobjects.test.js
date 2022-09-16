var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');

var h = require('../../').h;
var diff = require('../../').diff;
var patch = require('../../').patch;

describe('Test extended h { }', function() {
  jsdom();

  it('should clone h { } object', function() {
    var a = h('div', {test : '123'}, 'test');
    var b = a.clone();

    expect(b).not.equal(a);
    expect(b).to.be.instanceof(h);
    expect(b.props).not.be.equal(a.props);
    expect(b.props).not.be.equal(a.props);
    expect(b.children).not.be.equal(a.children);

    b.render();

    expect(a.el).to.be.an('undefined');
    expect(a.children[0].el).to.be.an('undefined');
  });

  it('should clone references ->', function() {
    var refFn = function() {};
    var a = h('div', { onClick : refFn, test : '123' }, 'test');
    var b = a.clone();

    expect(a).not.equal(b);
    expect(a.props).not.equal(b.props);
    expect(a.props.onClick).to.equal(b.props.onClick);
  });

  it('should not affect cloned node', function() {
    var a = require('../fixtures/nested').a1;
    var b = require('../fixtures/nested').b1;

    var c = a.clone();

    c.render();

    patch(c, diff(c, b));

    expect(function() {

      var nextTree = function(a) {
        if (typeof a === 'object' && a.el) throw new Error('Element found');

        if (Array.isArray(a.children))
          for(var i = 0; i < a.children.length; i++) {
            nextTree(a.children[i]);
          }
      };

      nextTree(a);
      nextTree(b);
      nextTree(c.clone());
    }).not.throw();

  });
});

