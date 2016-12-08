var expect = require('chai').expect;
var idx = require('../lib/');

describe('Test cakejs bootstrap', function() {

  it('should run tests', function() {
    expect(idx(1, 1)).to.be.equal(2);
  });

});
