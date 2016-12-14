var expect = require('chai').expect;
var Bakery = require('../../');
var Cream = Bakery.Cream;

describe('Cream for the cake', function() {
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
});
