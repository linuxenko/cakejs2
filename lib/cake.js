/*
 *
 * Cake is an application constructor.
 */

require('./zefir');
var Cream = require('./cream');
var Container = require('./container');
var Mixer = require('./mixer');

var bvd = require('./dom');

var Cake = Cream.extend({
  _namespace : 'cake',

  zefir : Container.inject('zefir'),

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
    this._namespaceWatcher();
    this._updateWatcher();
    this.get('zefir').deviceWatcher();
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
    this.set('zefir.current', null);
    this.set('zefir.routes', []);
    this._removeTree();
  },

  render : function() {
    var cream = this.get('loaded');

    if (cream && typeof cream.render === 'function') {
      if (!this.tree && this.opts.createRoot === false) {
        this.set('tree', cream.render());
        this.element.appendChild(this.tree.render());
      } else if (this.tree && this.opts.createRoot !== false) {
        bvd.patch(this.tree, bvd.diff(this.tree, this._createRoot(cream.render())));
      } else {
        bvd.patch(this.tree, bvd.diff(this.tree, cream.render()));
      }
      cream._didMount(this.tree);
    }
  },

  _updateWatcher : function() {
    if (this.loaded && this.loaded._updated === true) {
      this.render();
      this.set('loaded._updated', false);
    }

    Mixer.next(this._updateWatcher);
  },

  _namespaceWatcher : function() {
    var self = this;
    var zefirRe = new RegExp(/^zefir.*/), cakeRe = new RegExp(/^cake.*/);

    this._emitter.on('setProp', function(name) {
      if (self.loaded && self.loaded._updated !== true) {
        if (name.match(zefirRe) || name.match(cakeRe)) {
          return;
        }
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
      element = document.getElementById('cake');

      if (element) {
        document.body.removeChild(element);
      }

      element = document.body;
    }

    if (this.get('opts.createRoot') !== false) {
      this.set('tree', this._createRoot(''));
      element.appendChild(this.tree.render());
    }

    this.set('element', element);
  },

  _createRoot : function(children) {
    return bvd.h('div', {
      className : this.opts.elementClass || 'cake',
      id : this.opts.elementId || 'cake'}, children);
  },

  _removeTree : function() {
    if (this.tree) {
      this.tree.el.parentNode.removeChild(this.tree.el);
      this.set('tree', null);
    }
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
      route.props === this.get('loaded.props') &&
      route.params === this.get('loaded.params')) {

      this.get('loaded')._didTransition();
      this.set('loaded._updated', true);
      return;
    }

    this._unloadComponent();

    this.set('loaded', cream);

    cream.props = Container.inject('zefir.current.props');
    cream.params = Container.inject('zefir.current.params');
    cream._init();
    cream._willTransition();

    this.set('loaded._updated', true);

  }.observes('zefir.current')
});

module.exports = Cake;
