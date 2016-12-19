/*
 *
 * A little bit of zefir to make cake nicer
 */

var Cream = require('./').Cream,
  next = require('./').next;

var createOrigin = function(url) {
  var origin = url
    .replace(/^.+?\/\/+[^\/]+/, '')
    .split(/[/#]/).join('/').replace('//', '')
    .split(/[?]/);

  return {
    path   : origin[0].replace(/\/$/g, '') || '/',
    params : origin[1]
  };
};

var pathProps = function(filter, path) {
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

  filter.match(/:\w+/).slice().map(function(p, i) {
    p = p.replace(':', '');
    propNames[p] = props[i + 1];
  });

  return propNames;
};

var queryProps = function(origin) {
  var params = {};
  var tmp = origin.split(/[=&]/);

  for (var i = 0; i < tmp.length; i++) {
    params[tmp[i]] = tmp[++i];
  }

  return params;
};

var Zefir = Cream.extend({
  /**
   * Yeah, zefir is a most top thing on the cake
   */
  _namespace : 'zefir',

  /**
   * Current device location
   */
  location : null,

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
   * Insert routes
   *
   * @name addRoute
   * @function
   * @access public
   * @param {String} filter route filter string
   * @param {String} cream registered cream namespace
   */
  route : function(filter, cream) {
    this.push('routes', {
      filter : filter,
      cream  : cream
    });
  },

  locationWatcher : function() {
    var origin = createOrigin(this.get('location'));

    var route = this.get('routes').map(function(r) {
      var props = pathProps(r.filter, origin.path);

      if (!props) return false;

      return {
        cream : r.cream,
        props : props
      };
    }).filter(function(r) { return r; }).shift();

    if (route) {
      if (origin.params) {
        route.params = queryProps(origin.params);
      }
    }

    this.set('current', route);
  }.observes('location'),

  deviceWatcher : function() {

  }
});

module.exports = Zefir;
