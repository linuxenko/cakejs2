var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');

var h = require('../../').h;
var diff = require('../../').diff;
var patch = require('../../').patch;

describe('Test attributes', function() {
  jsdom();

  it('should setup style attribute', function() {
    var a = h('div', { style: { backgroundColor: '#fff', left: '20px' } },
      h('div', { style: 'right:20px;' })
    );

    var dom = a.render();

    expect(a.props['style']).to.be.exists;
    expect(a.props['style']).to.be.deep.equal({ backgroundColor: '#fff', left: '20px' });
    expect(dom.getAttribute('style')).to.be.a('string');
    expect(dom.getAttribute('style')).to.be.equal('background-color:#fff;left:20px;');
    expect(a.children[0].props['style']).to.be.equal('right:20px;');
  });

  it('should diff and patch style attribute', function() {
    var a = h('div', { style: { left: '21px' }}, '');
    var b = h('div', { style: { backgroundColor: '#fff', left: '20px' } },
      h('div', { style: 'right:20px;' })
    );

    var dom = a.render();
    patch(a, diff(a, b));

    expect(a.props['style']).to.be.exists;
    expect(a.props['style']).to.be.deep.equal({ backgroundColor: '#fff', left: '20px' });
    expect(dom.getAttribute('style')).to.be.a('string');
    expect(dom.getAttribute('style')).to.be.equal('background-color:#fff;left:20px;');
    expect(a.children[0].props['style']).to.be.equal('right:20px;');
  });

  it('should patch attrs modified via dom node', function () {
    var a = h('div', null, '');
    var b = h('div', null, '');

    var dom = a.render();

    dom.classList.add('active');
    patch(a, diff(a, b));

    expect(dom.attributes.length).to.be.equal(0);
    expect(dom.props).to.be.an('undefined');
  });

  it('should patch attrs created via dom node', function () {
    var a = h('div', { onClick: function () {}}, '');
    var b = h('div', { ref: function () {}, onClick: function () {}} , '');

    var dom = a.render();

    dom.classList.add('active');

    expect(dom.attributes.length).to.be.equal(1);
    patch(a, diff(a, b));

    expect(dom.attributes.length).to.be.equal(0);
    expect(Object.keys(a.props).length).to.be.equal(2);
  });

  it('should patch attrs created via dom node #2', function () {
    var a = h('div', { onClick: function () {}}, '');
    var b = h('div', { onClick: function () {}, tabindex: 0} , '');

    var dom = a.render();

    dom.classList.add('active');

    expect(dom.attributes.length).to.be.equal(1);
    patch(a, diff(a, b));

    expect(dom.attributes.length).to.be.equal(1);
    expect(dom.attributes[0].name).to.be.equal('tabindex');
    expect(Object.keys(a.props).length).to.be.equal(2);
  });

  it('should patch listeners #1', function () {
    var listener1 = function() { return 1; };
    var a = h('div', { onClick: listener1}, '');
    var b = h('div', { onClick: function () { return 2; }, tabindex: 0} , '');

    a.render();

    expect(a.props.onClick()).to.be.equal(1);
    patch(a, diff(a, b));
    expect(a.props.onClick()).to.be.equal(2);
  });

  it('should patch replace listeners #2', function () {
    var fail = false;
    var listener1 = function() { fail = true; };
    var a = h('div', { onClick: listener1}, '');
    var b = h('div', { tabindex: 0} , '');

    var dom = a.render();
    patch(a, diff(a, b));

    dom.click();
    expect(fail).to.be.false;
  });
});