var expect = require('chai').expect;

var zefir = require('../lib/zefir');

describe('Zefir on top of the cake', function() {
  after(function() {
    zefir.set('routes', []);
  });
  it('should hanlde route props', function() {
    expect(zefir).to.be.exists;
    zefir.route('/', 'routes.home');
    zefir.route('/posts/:tt/post', 'routes.post');
    zefir.locationWatcher('http://a.b/posts/123/post');

    expect(zefir.current.cream).to.be.equal('routes.post');
    expect(zefir.current.props.tt).to.be.equal('123');

    zefir.locationWatcher('https://n.a/');
    expect(zefir.current.cream).to.be.equal('routes.home');
    zefir.locationWatcher('https://f.x/s/1/post');
    expect(zefir.current).to.be.an('undefined');

    zefir.locationWatcher('/dfds');
    expect(zefir.current).to.be.an('undefined');
    zefir.locationWatcher( '/');
    expect(zefir.current.cream).to.be.equal('routes.home');
    zefir.locationWatcher('/posts/123/post');
    expect(zefir.current.cream).to.be.equal('routes.post');
    expect(zefir.current.props.tt).to.be.equal('123');
  });

  it('should hanlde provided query params', function() {
    expect(zefir).to.be.exists;
    zefir.route('/', 'routes.home');
    zefir.route('/posts/:tt/post', 'routes.post');
    zefir.locationWatcher('http://a.b/posts/123/post?test=123');

    expect(zefir.current.params).to.be.deep.equal({ test : '123' });

    zefir.locationWatcher('/?t=a&b=');
    expect(zefir.current.params.t).to.be.equal('a');
    expect(zefir.current.params.b).to.be.equal('');
    zefir.locationWatcher('/?t=a&b');
    expect(zefir.current.params.b).to.be.an('undefined');
  });
});
