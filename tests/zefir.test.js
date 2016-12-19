var expect = require('chai').expect;

var Bakery = require('../');
var zefir;

describe('Zefir on top of the cake', function() {
  before(function() {
    zefir = require('../lib/zefir');
  });

  after(function() {
    Bakery.unregister('zefir');
  });

  it('should hanlde route props', function() {
    expect(zefir).to.be.exists;
    zefir.route('/', 'routes.home');
    zefir.route('/posts/:tt/post', 'routes.post');
    zefir.set('location', 'http://a.b/posts/123/post');

    expect(zefir.current.cream).to.be.equal('routes.post');
    expect(zefir.current.props.tt).to.be.equal('123');

    zefir.set('location', 'https://n.a/');
    expect(zefir.current.cream).to.be.equal('routes.home');
    zefir.set('location', 'https://f.x/s/1/post');
    expect(zefir.current).to.be.an('undefined');

    zefir.set('location', '/dfds');
    expect(zefir.current).to.be.an('undefined');
    zefir.set('location', '/');
    expect(zefir.current.cream).to.be.equal('routes.home');
    zefir.set('location', '/posts/123/post');
    expect(zefir.current.cream).to.be.equal('routes.post');
    expect(zefir.current.props.tt).to.be.equal('123');
  });
});
