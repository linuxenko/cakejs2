var expect = require('chai').expect;
var Caramel = require('../../').recipes.caramel;

describe('Caramel for the cake', function() {
  var caramel;

  afterEach(function() {
    caramel.listeners = [];
  });

  it('should get some caramel', function() {
    expect(function() {
      caramel = new Caramel();
    }).not.to.throw();

    expect(caramel).to.be.exists;
    expect(caramel).to.be.an('object');
    expect(caramel).to.be.instanceof(Caramel);
  });

  it('should subscribe some listeners', function() {
    var listener = function() {};

    expect(function() {
      caramel.on('some-event', listener);
      caramel.on(/^some.*event$/, listener);
      caramel.on(new RegExp(/^some.*event$/), listener);
    }).not.throw();

    expect(function() {
      caramel.on([], listener);
      caramel.on({}, listener);
    }).to.throw();
  });

  it('should handle duplicate listeners', function() {
    var listener = function() { };

    caramel.on('test', listener);

    expect(function() {
      caramel.on('test', listener);
    }).to.throw();
  });

  it('should limit listeners number', function() {
    expect(function() {
      for (var i = 0; i < 257; i++) {
        caramel.once('test', function() {});
      }
    }).to.throw();

  });

  it('should emit events simple events', function() {
    var emitted = 0;

    caramel.on('test', function() { emitted++; });

    expect(function() { caramel.emit('test'); }).not.throw();
    expect(emitted).to.be.equal(1);
  });

  it('should handle wrong emitters', function() {
    expect(function() {
      caramel.emit('');
    }).to.throw();

    expect(function() {
      caramel.emit([]);
    }).to.throw();

    expect(function() {
      caramel.emit({});
    }).to.throw();
  });

  it('should remove "once" listeners', function() {
    var emitted = 0;

    caramel.once('test', function() { emitted++; });

    expect(function() { caramel.emit('test'); }).not.throw();
    expect(emitted).to.be.equal(1);
    expect(caramel.listeners.length).to.be.equal(0);
  });

  it('should unsubscribe listeners', function() {
    var listener = function() {};

    caramel.on('test', listener);

    expect(caramel.listeners.length).to.be.equal(1);
    expect(caramel.has('test', listener)).to.be.true;

    caramel.off('test', listener);

    expect(caramel.listeners.length).to.be.equal(0);
    expect(caramel.has('test', listener)).to.be.false;
  });

  it('should support regexp unsubscribers', function() {
    caramel.on('model:changed', function() {});
    caramel.on('model:inserted', function() {});
    caramel.on('model:removed', function() {});

    expect(caramel.listeners.length).to.be.equal(3);

    caramel.off(/^model/);

    expect(caramel.listeners.length).to.be.equal(0);
  });

  it('should emit regexp event', function() {
    var emitted = 0;
    caramel.on('model:changed', function() { emitted++; });
    caramel.on('model:inserted', function() { emitted++; });
    caramel.on('model:removed', function() { emitted++; });

    expect(caramel.listeners.length).to.be.equal(3);

    caramel.emit(/^model/);

    expect(emitted).to.be.equal(3);

    caramel.emit(/changed$/);
    expect(emitted).to.be.equal(4);
  });
});
