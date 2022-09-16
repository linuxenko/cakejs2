var expect = require('chai').expect;
var sinon = require('sinon');
var jsdom = require('mocha-jsdom');

var a = require('../fixtures/svg').a;
var d = require('../fixtures/svg').d;
var h = require('../../').h;

describe('Test <svg>', function() {
  jsdom();

  it('should create svg tree', function() {
    expect(a).to.be.exists;
    expect(a).to.be.an('object');
    expect(a.tag).to.be.equal('svg');
    expect(a.children).to.be.an('array');
  });

  it('should create empty svg node', function() {
    var empty = h('svg', null, '');
    expect(empty.tag).to.be.equal('svg');
  });

});
