var expect = require('chai').expect;
var mixer = require('../')._mixer;

describe('Mixer for mixing it all together', function() {
  before(function() {
    mixer.stop();
  });

  it('should choose most appropriate mixer mode', function(done) {
    expect(mixer).to.be.exists;
    mixer.next(function() { done(); });
    mixer.run();
    mixer.stop();
  });

  it('should run next tick only once', function(done) {
    var ticks = 0;

    mixer.next(function() { ticks++; });
    mixer.run();

    setTimeout(function() {
      mixer.stop();
      expect(ticks).to.be.equal(1);
      done();
    }, 16.7 * 2);
  });

  it('should run tasks multiple times', function(done) {
    var ticks = 0;

    mixer.run();

    var runner = function() {
      ticks++;
      mixer.next(runner);
    };

    runner();

    setTimeout(function() {
      expect(ticks).to.be.least(2);
      mixer.stop();
      done();
    }, 16.7 * 2);

  });

  it('should prevent run mixer multiple times', function() {
    mixer.run();
    expect(function() { mixer.run(); }).to.throw();
    mixer.stop();
  });
});
