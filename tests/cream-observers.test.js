var expect = require('chai').expect;
var Bakery = require('../');
var Cream = Bakery.Cream;

describe('Cream observers', function() {
  afterEach(function() {
    try {
      var creams = Object.keys(Bakery._container.creams);

      for (var i = 0; i < creams.length; i++) {
        Bakery.unregister('creams.' + creams[i]);
      }

      Bakery.unregister('creams');
    } catch(e) { /* not found */ }
  });

  it('should observe multiple props', function() {
    var runcount = 0;
    var b = Cream.extend({
      _namespace : 'creams.c',
      test : {
        bool : false,
        undef : undefined,
        nil : null,
        reg : /^$/
      },
      watch : function() { runcount++; }.observes('test.bool', 'test.undef', 'test.nil', 'test.reg')
    });

    b.set('test.bool', true);
    b.set('test.undef', new Object());
    b.set('test.nil', false);
    b.set('test.reg', /^test/);

    expect(runcount).to.be.equal(4);
  });

  it('should observe multiple props by regex', function() {
    var runcount = 0;
    var b = Cream.extend({
      _namespace : 'creams.c',
      test : {
        bool : false,
        undef : undefined,
        nil : null,
        reg : /^$/
      },
      complete : false,
      watch : function() { runcount++; }.observes(/^creams.c.test/, 'complete')
    });

    b.set('test.bool', true);
    b.set('test.undef', new Object());
    b.set('test.nil', false);
    b.set('test.reg', /^test/);
    b.set('complete', true);

    expect(runcount).to.be.equal(5);
  });

  it('should handle deep nesting', function() {
    var runcount = 0;
    var b = Cream.extend({
      _namespace : 'creams.c',
      test : {
        nested : [ 0, { a : 'b' } ]
      },
      watch : function() { runcount++; }.observes('test.nested.1.a')
    });

    b.set('test.nested.1.a', 'c');
    expect(runcount).to.be.equal(1);
  });

  it('should handle injectable deep nesting', function() {
    var b = Cream.extend({
      _namespace : 'creams.b',
      test : {
        nested : [ 0, { a : 'b' } ]
      }
    });

    var c = Cream.extend({
      _namespace : 'creams.c',
      test : Bakery.inject('creams.b.test'),
      watch : function() { this.set('deeprop', this.get('test.nested.1.a')); }.observes('test.nested.1.a')
    });

    b.set('test.nested.1.a', 'c');
    expect(c.get('deeprop')).to.be.equal('c');
  });

});
