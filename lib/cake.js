/*
 *
 * Cake is an application constructor.
 */

require('./zefir');
var Cream = require('./cream');
var Container = require('./container');
var Mixer = require('./mixer');

var bvd = require('basic-virtual-dom');

var Cake = Cream.extend({
  _namespace : 'cake',

  zefir  : Container.inject('zefir'),

  tree : null,

  /**
   * Routes shortcut
   *
   * @name route
   * @function
   * @access public
   * @param {String} path url pattern
   * @param {String} cream Cream namsespace
   */
  route : function(path, cream) {
    this.get('zefir').route(path, cream);
    return this;
  },

  /**
   * Cake initializetion function
   *
   * @name create
   * @function
   * @access public
   * @param {Object} opts Application options
   */
  create : function(opts) {
    opts = opts || {};
    this.set('opts', opts);
    this._createElement(opts.element);

    Mixer.run();
    this.get('zefir').deviceWatcher();
    this._namespaceWatcher();
    this._updateWatcher();
    return this;
  },

  /**
   * Application destroyer
   *
   * @name destroy
   * @function
   * @access public
   */
  destroy : function() {
    Mixer.stop();
  },

  render : function() {
    var cream = this.get('loaded');

    if (cream && typeof cream.render === 'function') {
      var tree = this._createRoot(cream.render());

      bvd.patch(this.tree, bvd.diff(this.tree, tree));
    }
  },

  _updateWatcher : function() {
    if (this.get('loaded') && this.get('loaded._updated') === true) {
      this.render();
      this.set('loaded._updated', false);
    }

    Mixer.next(this._updateWatcher);
  },

  _namespaceWatcher : function() {
    var self = this;

    this._emitter.on('setProp', function(name) {
      var creamName = self.get('loaded') && self.get('loaded._namespace');

      if (!creamName || self.get('loaded._updated') === true) return;

      var f = new RegExp('^' + creamName + '.');

      if (name.match(f)) {
        self.set('loaded._updated', true);
      }
    });

    /**
     * Post load initializer
     */
    this._emitter.on(/^register/, function() {
      if (self.get('zefir')) {
        self.get('zefir').deviceWatcher();
        self.get('zefir').locationWatcher(self.get('zefir.location'));
      }
    });
  },

  _createElement : function(element) {
    if (!element) {
      element = document.getElementById('cake-app');

      if (element) {
        document.body.removeChild(element);
      }

      element = document.body;
    }

    this.set('tree', this._createRoot(''));
    element.appendChild(this.tree.render());
  },

  _createRoot : function(children) {
    return bvd.h('div', { 
      className : this.opts.elementClass || 'cake',
      id : this.opts.elementId || 'cake'}, children);
  },

  _unloadComponent : function() {
    if (this.get('loaded')) {
      var cream = this.get('loaded');
      cream._didTransition();

      delete cream.props;
      delete cream.params;

      this.set('loaded', null);
    }
  },

  _loadComponent : function() {
    var route = this.get('zefir.current');

    if (!route) {
      this._unloadComponent();
      return;
    }

    var cream = Container.inject(route.cream)();

    /**
     * No cream were registered, maybe later
     */
    if (!cream) {
      this._unloadComponent();
      return;
    }

    if (this.loaded === cream &&
      route.props === this.loaded.get('props') &&
      route.params === this.loaded.get('params')) {

      this.loaded._didTransition();
      return;
    }

    this._unloadComponent();

    this.set('loaded', cream);

    cream.props = Container.inject('zefir.current.props');
    cream.params = Container.inject('zefir.current.params');
    cream._init();
    cream._willTransition();

    this.render();
  }.observes('zefir.current')
});

module.exports = Cake;
