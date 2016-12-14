var expect = require('chai').expect;
var Bakery = require('../../');

describe('Container for ingredients', function() {
  afterEach(function() {
    try {
      Bakery.unregister('creams');
    } catch(e) { /* not found */ }
  });

  it('should be empty container', function() {
    expect(Bakery._container).to.be.exists;
    expect(Bakery._container).to.be.deep.equal({});
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
    expect(function() { Bakery.unregister('crms.ctrst'); }).to.throw();
    expect(function() { Bakery.unregister('crms'); }).to.throw();
  });

  it('should inject objects', function() {
    var c1 = Bakery.Cream.extend({ hello : 'world' });
    Bakery.register('creams.injectable', c1);

    var c2 = Bakery.Cream.extend({
      c1 : Bakery.inject('creams.injectable'),
      hello : Bakery.inject('creams.injectable.hello')
    });

    expect(c2.c1).to.be.equal(c1);
    expect(c2.hello).to.be.equal('world');
  });
});
