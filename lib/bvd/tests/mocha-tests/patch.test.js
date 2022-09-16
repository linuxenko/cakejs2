var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');

var diff = require('../../').diff;
var patch = require('../../').patch;
var h = require('../../').h;

var a = require('../fixtures/simple').a;
var b = require('../fixtures/simple').b;

var a1 = require('../fixtures/simple').a1;
var a2 = require('../fixtures/simple').a2;

var f  = require('../fixtures/simple').f;
var f1 = require('../fixtures/simple').f1;

var tree1 = require('../fixtures/basic').tree1;
var tree2 = require('../fixtures/basic').tree2;

describe('Test patch()', function() {
  jsdom();

  it('should patch simple nodes', function() {
    var dom = b.render();
    var diffs;

    expect(dom.childNodes[0]).to.be.instanceof(window.Text);
    diffs = diff(b, a);

    expect(function() {
      patch(b, diffs);
    }).not.throw();

    expect(dom.childNodes[0]).to.be.instanceof(window.HTMLDivElement);
    expect(dom.childNodes[0].childNodes[0]).to.be.instanceof(window.Text);
    expect(dom.childNodes[0].childNodes[0].textContent)
      .to.be.equal('text');
  });

  it('should patch virtual tree', function() {
    a1.render();
    var diffs;

    expect(a1.children).to.be.an('array');
    expect(a1.children[0].children).to.be.a('string');
    expect(a1.children[0].tag).to.be.equal('text');

    diffs = diff(a1, a2);
    patch(a1, diffs);

    expect(a1.children).to.be.an('array');
    expect(a1.children[0].children).to.be.an('array');
    expect(a1.children[0].tag).to.be.equal('div');
  });

  it('should patch props', function() {
    expect(a1.props.className).to.be.equal(a2.props.className);
  });

  it('should reorder nested tree', function() {
    f.render();

    expect(f.children[0].tag).to.be.equal('span');
    expect(f.children[1].tag).to.be.equal('ul');

    var diffs = diff(f, f1);
    patch(f, diffs);

    expect(f.children[1].tag).to.be.equal('span');
    expect(f.children[0].tag).to.be.equal('ul');
  });

  it('should reorder more complex tree', function() {
    tree1.render();

    expect(tree1.children[0].tag).to.be.equal('em');
    expect(tree1.children[1].tag).to.be.equal('div');
    expect(tree1.children[2].tag).to.be.equal('div');
    expect(tree1.children[3].tag).to.be.equal('span');
    expect(tree1.children[4].tag).to.be.equal('ul');

    patch(tree1, diff(tree1, tree2));

    expect(tree1.children[0].tag).to.be.equal('span');
    expect(tree1.children[1].tag).to.be.equal('strong');
    expect(tree1.children[2].tag).to.be.equal('ul');
    expect(tree1.children[3].tag).to.be.equal('div');
    expect(tree1.children[4]).to.be.a('undefined');

    /* tested reordering */
    expect(tree1.children[2].children[1].children[0].tag).to.be.equal('span');
    expect(tree1.children[2].children[1].children[1].tag).to.be.equal('div');
    expect(tree1.children[2].children[1].children[2]).to.be.a('undefined');

  });

  it('should complex tree inners be equal', function() {
    expect(tree1.el.innerHTML).to.be.equal(tree2.render().innerHTML);
  });

  it('should replace root node props and text', function() {
    var src = h('span', null, 'hello world');
    var dst = h('span', { c : 'e', d : 'z'}, 'bye bye');

    src.render();

    expect(src.el.attributes.length).to.be.equal(0);

    patch(src, diff(src, dst));

    expect(src.children[0].children).to.be.equal('bye bye');
    expect(src.el.attributes['c'].value).to.be.equal('e');
    expect(src.el.attributes['d'].value).to.be.equal('z');
  });

  it('should remove some props', function() {
    var src = h('span', { c : 'e', d : 'z'}, 'hello world');
    var dst = h('span', null, 'bye bye');

    src.render();
    expect(src.el.attributes.length).to.be.equal(2);
    patch(src, diff(src, dst));
    expect(src.el.attributes.length).to.be.equal(0);
  });

  it('should patch boolean props', function() {
    var src = h('span', { c : true, d : 'z'}, 'hello world');
    var dst = h('span', { b : true, c : false}, 'bye bye');

    src.render();
    expect(src.el.attributes.length).to.be.equal(2);
    patch(src, diff(src, dst));
    expect(src.el.attributes.length).to.be.equal(2);
    expect(src.el.getAttribute('b')).to.be.equal('true');
    expect(src.el.getAttribute('c')).to.be.equal('false');
  });

  it('should patch empty node', function() {
    var t = h('div', null, '');
    var p = h('div', { a : 'b' }, h('span', null, ''));

    t.render();
    patch(t, diff(t, p));
    p.render();

    expect(t.children.length).to.be.equal(1);
    expect(t.children[0].tag).to.be.equal('span');
    expect(t.props.a).to.be.equal('b');
    expect(t.el.getAttribute('a')).to.be.equal('b');
  });

  it('should patch complex text nodes sequence', function() {
    var src = require('../fixtures/textnodes').a;
    var dst = require('../fixtures/textnodes').b;

    src.render();
    expect(src.children.length).to.be.equal(1);
    patch(src, diff(src, dst));
    expect(src.children.length).to.be.equal(2);
    expect(src.children[1].children.length).to.be.equal(5);
  });

  it('should be able patch before render()', function() {
    var t = h('div', null, '');
    var p = h('div', { a : 'b' }, h('span', null, 'text'));

    expect(function() { patch(t, diff(t, p)); }).not.throw();

    expect(t.el).to.be.an('undefined');
    expect(t.children[0].el).to.be.an('undefined');
    expect(t.children[0].children[0].el).to.be.an('undefined');
    expect(t.children[0].children[0].children).to.be.equal('text');

    t.render();

    expect(t.el).to.be.instanceof(window.HTMLDivElement);
    expect(t.children[0].el).to.be.instanceof(window.HTMLSpanElement);
    expect(t.children[0].children[0].el).to.be.instanceof(window.Text);
    expect(t.children[0].children[0].children).to.be.equal('text');
  });
});
