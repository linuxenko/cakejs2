var expect = require('chai').expect;
var Bakery = require('../');

describe('Container for ingredients', function() {
  afterEach(function() {
    try {
      var creams = Object.keys(Bakery._container.creams);

      for (var i = 0; i < creams.length; i++) {
        Bakery.unregister('creams.' + creams[i]);
      }

      Bakery.unregister('creams');
    } catch(e) { /* not found */ }
  });

  it('should be empty container', function() {
    expect(Bakery._container).to.be.exists;
//    expect(Bakery._container).to.be.deep.equal({});
  });

  it('should register objects in container', function() {
    var c1 = new Bakery.Cream.extend({});
    var c2 = new Bakery.Cream.extend({});
    var c3 = new Bakery.Cream.extend({});
    var c4 = new Bakery.Cream.extend({});

    Bakery.register('creams.cream_0', c1);
    Bakery.register('creams.cream_1', c2);
    Bakery.register('creams.cream_2', c3);
    Bakery.register('creams.cream_3', c4);

    expect(Object.keys(Bakery._container.creams).length).to.be.equal(4);
    expect(Bakery._container.creams.cream_0).to.be.equal(c1);
    expect(Bakery._container.creams.cream_1).to.be.equal(c2);
    expect(Bakery._container.creams.cream_2).to.be.equal(c3);
    expect(Bakery._container.creams.cream_3).to.be.equal(c4);
  });

  it('should unregister container objects', function() {
    var c1 = new Bakery.Cream.extend({});
    var c2 = new Bakery.Cream.extend({});

    expect(Bakery._container.creams).to.be.an('undefined');

    Bakery.register('creams.cream_0', c1);
    Bakery.register('creams.cream_1', c2);

    expect(Bakery._container.creams.cream_0).to.be.equal(c1);
    expect(Bakery._container.creams.cream_1).to.be.equal(c2);

    Bakery.unregister('creams.cream_0');
    Bakery.unregister('creams.cream_1');

    expect(Bakery._container.creams.cream_0).to.be.an('undefined');
    expect(Bakery._container.creams.cream_1).to.be.an('undefined');
  });

  it('should hanlde unregistering invalid objects', function() {
    expect(Bakery.unregister('crms.ctrst')).to.be.an('undefined');
    expect(Bakery.unregister('crms')).to.be.an('undefined');
  });

  it('should inject objects', function() {
    var c1 = Bakery.Cream.extend({ hello : 'world' });
    Bakery.register('creams.injectable', c1);

    var c2 = Bakery.Cream.extend({
      c1 : Bakery.inject('creams.injectable'),
      hello : Bakery.inject('creams.injectable.hello')
    });

    expect(c2.get('c1')).to.be.equal(c1);
    expect(c2.get('hello')).to.be.equal('world');
  });

  it('should register object after', function() {
    var c1 = Bakery.Cream.extend({ hello : 'world' });
    var c2 = Bakery.Cream.extend({ world : 'hello' });

    Bakery.register('creams.cream_1', c2, 'creams.cream_0');
    expect(Bakery._container.creams).to.be.an('undefined');
    Bakery.register('creams.cream_0', c1);
    expect(Bakery._container.creams.cream_1).to.be.equal(c2);
  });

  it('should register after with any order', function() {
    var c1 = Bakery.Cream.extend({ hello : 'world' });
    var c2 = Bakery.Cream.extend({ world : 'hello' });

    Bakery.register('creams.cream_0', c1);
    Bakery.register('creams.cream_1', c2, 'creams.cream_0');

    expect(Bakery.inject('creams.cream_1')()).to.be.equal(c2);
  });

  it('should inject even before object registered', function() {
    var c1 = Bakery.Cream.extend({ hello : Bakery.inject('creams.injectable2'),
      test: 'test',
      testFn : function() { }
    });
    var c2 = Bakery.Cream.extend({ world : 'texthello' });

    Bakery.register('creams.cream_0', c1);
    Bakery.register('creams.injectable2', c2);

    expect(c1.get('hello.world')).to.be.equal('texthello');
    expect(c1.get('testFn')).to.be.a('function');
    expect(c1.get('testFn.test')).to.be.an('undefined');
  });

  it('should register object\'s namespace', function() {
    var c = Bakery.Cream.extend({});

    Bakery.register('creams.cream_0', c);
    expect(c._namespace).to.be.equal('creams.cream_0');
  });

  it('should register selfnamespaced creams', function() {
    var c = Bakery.Cream.extend({
      _namespace : 'creams.selfreg'
    });

    expect(Bakery._container.creams.selfreg).to.be.equal(c);
    expect(c._namespace).to.be.equal(c.get('_namespace'));
  });

  it('should register/unregister observers', function() {
    var c = Bakery.Cream.extend({
      _namespace : 'creams.observable_cream',
      hello : 'world',
      test : function() { return this.get('hello'); }.observes('hello')
    });

    expect(c).to.be.instanceof(Bakery.Cream);
    expect(c.get('test')).to.be.equal('world');

    Bakery.unregister('creams.observable_creams');
  });

  it('should register component with builtin _after prop', function() {
    var b = Bakery.Cream.extend({
      _namespace : 'creams.a',
      _after     : 'creams.c',
      init : function() {
        expect(Bakery._container.creams.b).to.be.exists;
        expect(Bakery._container.creams.c).to.be.exists;
      }
    });
    var c = Bakery.Cream.extend({
      _namespace : 'creams.c',
      _after     : 'creams.b',
      init : function() {
        expect(Bakery._container.creams.b).to.be.exists;
        expect(Bakery._container.creams.a).not.to.be.exists;
      }
    });
    Bakery.Cream.extend({
      _namespace : 'creams.b'
    });

    c.init();
    b.init();
  });
});
