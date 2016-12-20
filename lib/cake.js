/*
 *
 * Cake
 */
require('./zefir');
var Cream = require('./cream');
var Container = require('./container');
var Mixer = require('./mixer');

var Cake = Cream.extend({
  _namespace : 'cake',
  zefir  : Container.inject('zefir'),
  params : Container.inject('zefir.current.params'),
  props  : Container.inject('zefir.current.props'),

  element : null,

  route : function(path, cream) {
    this.get('zefir').route(path, cream);
  },

  createElement : function(element) {
    if (!element) {
      element = document.createElement('div');
      element.setAttribute('id', 'cake-app');
      document.body.appendChild(element);
    }

    this.set('element', element);
  },

  create : function(opts) {
    opts = opts || {};
    this.createElement(opts.element);

    Mixer.run();
    this.get('zefir').deviceWatcher();
    return this;
  },

  destroy : function() {
    Mixer.stop();
  },

  unloadComponent : function() {
    if (this.get('loaded')) {
      this.get('loaded')._didTransition();
      this.set('loaded', null);
    }
  },

  loadComponent : function() {
    this.unloadComponent();
    var route = this.get('zefir.current');

    if (!route) return;

    var cream = Container.inject(route.cream)();

    if (!cream) {
      throw new Error(route.cream + ' not found');
    }

    this.set('loaded', cream);
    cream._init();
    cream._willTransition();
  }.observes('zefir.current')
});

module.exports = Cake;
