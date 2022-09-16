var expect = require('chai').expect;
var sinon = require('sinon');
var jsdom = require('mocha-jsdom');

var a = require('../fixtures/simple').a;
var d = require('../fixtures/simple').d;

var h = require('../../').h;

describe('Test h()', function() {
  jsdom();
  it('should create object tree', function() {
    expect(a).to.be.exists;
    expect(a).to.be.an('object');
    expect(a.tag).to.be.equal('div');
    expect(a.children).to.be.an('array');
  });

  it('should create object with props', function() {
    expect(a.props.className).to.be.a('string');
    expect(a.props.className).to.be.equal('test-class test-class2');
  });

  it('should create object with childs', function() {
    expect(a.children[0].props).to.be.an('object');
    expect(a.children[0].tag).to.be.a('string');
    expect(a.children[0].tag).to.be.equal('div');
    expect(a.children[0].children[0].tag).to.be.a('string');
    expect(a.children[0].children[0].tag).to.be.equal('text');
    expect(a.children[0].children[0].children).to.be.a('string');
  });

  it('should create childrem props', function() {
    expect(d.children[0].tag).to.be.equal('span');
    expect(d.children[0].children[0].children).to.be.equal('node-text');
    expect(d.children[0].props.className).to.be.equal('text-node');
    expect(d.children[0].props.id).to.be.equal('text-node');
  });

  it('should create more compex trees', function() {
    var nested;

    expect(function() {
      nested = require('../fixtures/nested').a;
    }).not.to.throw();

    expect(nested.tag).to.be.equal('div');
    expect(nested.children).to.be.an('array');
  });

  it('should create empty text nodes', function() {
    var empty = h('div', null, '');

    expect(empty.tag).to.be.equal('div');
    expect(empty.children[0].tag).to.be.equal('text');
    expect(empty.children[0].children).to.be.equal('');
    expect(empty.children[0].children).to.be.a('string');
  });

  it('should create nested node text', function() {
    var node;

    expect(function() {
      node = h('div', null, h('strong', null, ''), 'L', h('strong', null, 'test'));
    }).not.throw();

    expect(node.children.length).to.be.equal(3);
    expect(node.children[1].tag).to.be.equal('text');
    expect(node.children[1].children).to.be.equal('L');
  });

  it('should create nested with text first tree', function() {
    var node;

    expect(function() {
      node = h('div', null, '', h('strong', null, 'rrr'), h('strong', null, 'test'));
    }).not.throw();

    expect(node.children.length).to.be.equal(3);
    expect(node.children[0].tag).to.be.equal('text');
    expect(node.children[0].children).to.be.equal('');
  });

  it('should handle react like nesting', function() {
    var Test = h('div', null, 'text');
    var Result = h('div', null, h(Test, null));

    expect(Result.children[0].tag).to.be.equal('div');
    expect(Result.children[0].children[0].children).to.be.equal('text');
  });

  it('should render h with falsy childs', function() {
    expect(function() {
      h('div', null, null).render();
      h('div', null, 0).render();
      h('div', null, '').render();
      h('div', null, undefined).render();
    }).not.throw();

    var p = h('div', null, null);
    expect(p.children).to.be.an('undefined');
    p = h('div', null, undefined);
    expect(p.children).to.be.an('undefined');
    p = h('div', null, '');
    expect(p.children[0].children).to.be.equal('');
    p = h('div', null, 0);
    expect(p.children[0].children).to.be.equal('0');
  });

  it('should render h with nested mixed types', function() {
    var p = h('button', null, 'Clicked ', 1, null);
    expect(p.children.length).to.be.equal(2);
    expect(function() { p.render(); }).not.throw();
  });

  it('should create boolean props', function() {
    var p = h('div', null, h('input', { type: 'checkbox', checked: 'true' })).render();
    expect(p.children[0].getAttribute('checked')).to.be.equal('true');
    var checkbox = p.childNodes[0];
    expect(checkbox.checked).to.be.true;
  });

  it('should create from arrays of childs', function() {
    var p = h('div', null ,
      h('span', null,'child1'),
      'child2',
      h('span', null, 'child3'),
      [ h('div', null, '1'), h('div', null, '2') ]
    );

    expect(p.children[3].tag).to.be.equal('div');
  });

  it('should handle nesting functions', function() {
    var rendered = sinon.spy();
    var Nested = {
      render: function() {
        rendered();
        return h('div', null, this.props.name, this.props.children);
      }
    };

    var cl = h('div', null, h(Nested, {name: 'hello'}, 'world'));

    expect(rendered.calledOnce).to.be.true;
    expect(cl.children[0].children.length).to.be.equal(2);
    expect(cl.children[0].children[0].children).to.be.equal('hello');
    expect(cl.children[0].children[1].children).to.be.equal('world');
  });

  it('should only update props', function() {
    var Nested = {
      props: { ownProp: 'keepme' },
      render: function() {
        return h('div', null, this.props.name, this.props.children, this.props.ownProp);
      }
    };

    var cl = h('div', null, h(Nested, {name: 'hello'}, 'world'));

    expect(cl.children[0].children.length).to.be.equal(3);
    expect(cl.children[0].children[0].children).to.be.equal('hello');
    expect(cl.children[0].children[1].children).to.be.equal('world');
    expect(cl.children[0].children[2].children).to.be.equal('keepme');
  });
});
