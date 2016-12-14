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
    var b = Cream.extend({
      _namespace : 'creams.b',
      test : 'hello'
    });

    var c = Cream.extend({
      _namespace : 'creams.c',
      btest : Bakery.inject('creams.b'),
      watch : function() { console.log('aaa'); }.observes('btest')
    });

    b.set('test', 'world');

  });
});
