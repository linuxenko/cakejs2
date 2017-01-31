/*
 *
 * A little bit of zefir to make cake nicer
 */

var Cream = require('./cream');
var next = require('./mixer').next;

var Zefir = Cream.extend({
  /**
   * Yeah, zefir is a most top thing on the cake
   */
  _namespace : 'zefir',

  /**
   *
   * Routes container.
   *
   *  Format:
   * {
   *   filter : /path/:id/name
   *   cream  : path.cream.location
   * }
   *
   */
  routes : [],


  /**
   * Default location
   */
  location : '/',

  _createOrigin : function(url) {
    var origin;

    if (url.match(/\#/)) {
      url = '-//-/#' + url.split('#')[1];
    }

    origin = url
      .replace(/^.+?\/\/+[^\/]+/, '')
      .split(/[/#]/).join('/').replace('//', '')
      .split(/[?]/);

    return {
      path   : origin[0].replace(/\/$/g, '') || '/',
      params : decodeURIComponent(origin[1] || '')
    };
  },

  _pathProps : function(filter, path) {
    if (path.match(new RegExp('^' + filter + '$'))) {
      return {};
    }

    var f = new RegExp('^' +
      filter.replace(/:\w+/g, '\(\\w+\)')
      .replace(/\//gi, '\\/') + '$');

    var props = path.match(f);

    if (!props) {
      return;
    }

    var propNames = {};

    filter.match(/:\w+/gi).slice().map(function(p, i) {
      p = p.replace(':', '');
      propNames[p] = props[i + 1];
    });

    return propNames;
  },

  _queryProps : function(origin) {
    var params = {};
    var tmp = origin.split(/[=&]/);

    for (var i = 0; i < tmp.length; i++) {
      params[tmp[i]] = tmp[++i];
    }

    return params;
  },

  /**
   * Insert routes
   *
   * @name addRoute
   * @function
   * @access public
   * @param {String} filter route filter string
   * @param {String} cream registered cream namespace
   */

  route : function(filter, cream) {
    var r = {
      filter : filter,
      cream  : cream
    };

    if (filter === '*') {
      this.push('routes', r);
    } else {
      this.unshift('routes', r);
    }

    this.locationWatcher(this.location);
  },

  locationWatcher : function(location) {
    var self = this;
    var origin = this._createOrigin(location);

    var route = this.get('routes').map(function(r) {
      if (r.filter === '*') {
        return {
          cream : r.cream,
          props : {},
          params : {}
        };
      }

      var props = self._pathProps(r.filter, origin.path);

      if (!props) return false;

      return {
        cream : r.cream,
        props : props,
        params : {}
      };
    }).filter(function(r) { return r; }).shift();

    if (route) {
      if (origin.params) {
        route.params = this._queryProps(origin.params);
      }
    }

    this.set('current', route);
  },

  deviceWatcher : function() {
    if (window && window.location) {
      if (this.location !== window.location.href) {
        this.location = String(window.location.href);
        this.locationWatcher(this.location);
      }
    }

    next(this.deviceWatcher.bind(this));
  }
});

module.exports = Zefir;
