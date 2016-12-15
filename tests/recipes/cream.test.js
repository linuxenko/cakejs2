var expect = require('chai').expect;
var Bakery = require('../../');
var Cream = Bakery.Cream;

describe('Cream for the cake', function() {
  afterEach(function() {
    try {
      var creams = Object.keys(Bakery._container.creams);

      for (var i = 0; i < creams.length; i++) {
        Bakery.unregister('creams.' + creams[i]);
      }

      Bakery.unregister('creams');
    } catch(e) { /* not found */ }
  });

  it('should create some cream', function() {
    var c = Cream.extend({ str : 'str', init : true });

    expect(c).to.be.instanceof(Cream);
    expect(c.init).to.be.true;
    expect(c.str).to.be.a('string');
    expect(c.str).to.be.equal('str');
    expect(c.get).to.be.a('function');
    expect(c.set).to.be.a('function');

    var d = Cream.extend({ opt : false });

    expect(c.opt).to.be.an('undefined');
    expect(Cream.opt).to.be.an('undefined');
    expect(Cream.str).to.be.an('undefined');
    expect(d.str).to.be.an('undefined');
    expect(d.opt).to.be.false;
  });

  it('should handle different getters', function() {
    var c = Cream.extend({
      hello : 'world',
      nested : {
        test : 'text'
      }
    });

    expect(c.get('hello')).to.be.equal('world');
    expect(c.get('nested.test')).to.be.equal('text');
  });

  it('should handle embedded function bindings', function() {
    var c = Cream.extend({
      hname : 'hello',
      test : function() { return this.get('hname'); }
    });

    expect(c.get('test')()).to.be.equal('hello');
    expect(c.test()).to.be.equal('hello');
  });

  it('should create property functions', function() {
    var c = Cream.extend({
      hello : 'hello',
      test : function() { return this.get('hello') + 'world'; }.property()
    });

    expect(c.get('test')).to.be.equal('helloworld');
  });

  it('should create observer function', function() {
    var up = null;
    var c = Cream.extend({
      _namespace : 'creams.observable_cream',
      hello : 'hello',
      test : function() { up = this.get('hello'); }.observes('hello')
    });

    expect(c.get('hello')).to.be.equal('hello');
    expect(up).to.be.null;

    c.set('hello', 'world');
    expect(c.get('hello')).to.be.equal('world');
    expect(up).to.be.equal('world');
  });

  it('should cream objects communicate with observers', function() {
    var up = null;
    var b = Cream.extend({
      _namespace : 'creams.b',
      test : 'hello'
    });

    Cream.extend({
      _namespace : 'creams.c',
      btest : Bakery.inject('creams.b'),
      watch : function() { up = this.get('btest.test'); }.observes('btest.test')
    });

    expect(up).to.be.null;
    b.set('test', 'world');

    expect(up).to.be.equal('world');

  });

  it('should change injectable props', function() {
    var up;
    var b = Cream.extend({
      _namespace : 'creams.b',
      test : 'hello'
    });

    var c = Cream.extend({
      _namespace : 'creams.c',
      btest : Bakery.inject('creams.b'),
      watch : function() { up = this.get('btest.test'); }.observes('btest.test')
    });

    expect(b.get('test')).to.be.equal('hello');
    c.set('btest.test', 'world');
    expect(b.get('test')).to.be.equal('world');
    expect(up).to.be.equal('world');
  });

  it('should change nested props', function() {
    var b = Cream.extend({
      _namespace : 'creams.b',
      test : { a : 'b'}
    });

    var c = Cream.extend({
      _namespace : 'creams.c',
      btest : Bakery.inject('creams.b.test'),
    });

    expect(b.get('test.a')).to.be.equal('b');
    expect(c.get('btest.a')).to.be.equal('b');
    c.set('btest.a', 'c');
    expect(b.get('test.a')).to.be.equal('c');
    expect(c.get('btest.a')).to.be.equal('c');
  });

  it('should observer nested props', function(done) {
    var up;
    var b = Cream.extend({
      _namespace : 'creams.b',
      test : { a : 'hello' },
      complete : false,
      v : Bakery.inject('creams.c.vvar')
    });

    var c = Cream.extend({
      _namespace : 'creams.c',
      vvar : {sss : 1},
      btest : Bakery.inject('creams.b.test'),
      watch : function() { up = this.get('btest.a'); }.observes('btest.a'),
      done : function() { done(); }.observes('creams.b.complete')
    });

    b.set('test.a', 'world');
    expect(up).to.be.equal('world');
    c.set('btest.a', 'kkk');
    expect(up).to.be.equal('kkk');
    expect(b.get('v.sss')).to.be.equal(1);
    expect(b.set('v.sss', 2)).to.be.exists;
    expect(c.get('vvar.sss')).to.be.equal(2);
    b.set('complete', true);
  });

  it('should set/get different types of properties', function() {
    var b = Cream.extend({
      test : { a : 'hello' },
      bool : false,
      undef : undefined,
      nil : null,
      reg : /^$/
    });

    expect(b.get('bool')).to.be.equal(false);
    expect(b.get('undef')).to.be.equal(undefined);
    expect(b.get('nil')).to.be.equal(null);
    expect(b.get('reg')).to.be.instanceof(RegExp);

    b.set('bool', true);
    b.set('undef', new Object());
    b.set('nil', false);
    b.set('reg', /^test/);

    expect(b.get('bool')).to.be.equal(true);
    expect(b.get('undef')).to.be.instanceof(Object);
    expect(b.get('nil')).to.be.equal(false);
    expect(b.get('reg')).to.be.instanceof(RegExp);

    b.set('bool', false);
    b.set('undef', undefined);
    b.set('nil', null);
    b.set('reg', /^/);

    expect(b.get('bool')).to.be.equal(false);
    expect(b.get('undef')).to.be.equal(undefined);
    expect(b.get('nil')).to.be.equal(null);
    expect(b.get('reg')).to.be.instanceof(RegExp);
  });

  it('should hanlde deep set/get different types', function() {
    var b = Cream.extend({
      test : {
        bool : false,
        undef : undefined,
        nil : null,
        reg : /^$/
      }
    });

    expect(b.get('test.bool')).to.be.equal(false);
    expect(b.get('test.undef')).to.be.equal(undefined);
    expect(b.get('test.nil')).to.be.equal(null);
    expect(b.get('test.reg')).to.be.instanceof(RegExp);

    b.set('test.bool', true);
    b.set('test.undef', new Object());
    b.set('test.nil', false);
    b.set('test.reg', /^test/);

    expect(b.get('test.bool')).to.be.equal(true);
    expect(b.get('test.undef')).to.be.instanceof(Object);
    expect(b.get('test.nil')).to.be.equal(false);
    expect(b.get('test.reg')).to.be.instanceof(RegExp);
  });

  it('should handle deep set/get injected with diff types', function() {
    Cream.extend({
      _namespace : 'creams.c',
      test : {
        bool : false,
        undef : undefined,
        nil : null,
        reg : /^$/
      }
    });

    var b = Cream.extend({
      test : Bakery.inject('creams.c.test')
    });

    expect(b.get('test.bool')).to.be.equal(false);
    expect(b.get('test.undef')).to.be.equal(undefined);
    expect(b.get('test.nil')).to.be.equal(null);
    expect(b.get('test.reg')).to.be.instanceof(RegExp);

    b.set('test.bool', true);
    b.set('test.undef', new Object());
    b.set('test.nil', false);
    b.set('test.reg', /^test/);

    expect(b.get('test.bool')).to.be.equal(true);
    expect(b.get('test.undef')).to.be.instanceof(Object);
    expect(b.get('test.nil')).to.be.equal(false);
    expect(b.get('test.reg')).to.be.instanceof(RegExp);
  });
});
