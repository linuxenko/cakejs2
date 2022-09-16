/*
 * Element
 */

/**
 * General tree
 *
 * /** @jsx h * /
 *
 * @name h
 * @function
 * @access public
 */

var xmlns = "http://www.w3.org/2000/svg";

var H = function (argv) {
  if (!(this instanceof H)) {
    if (!(argv instanceof H)) {
      if (typeof argv === 'function') {
        return argv.apply(argv, [].slice.call(arguments, 1, arguments.length));
      }

      if (typeof argv === 'object' && typeof argv.render === 'function') {
        if ('props' in argv) {
          for (var i in arguments[1]) {
            argv.props[i] = arguments[1][i];
          }
        } else {
          argv.props = arguments[1] || [];
        }
        argv.props.children = [].slice.call(arguments, 2, arguments.length);
        return argv.render(argv.props);
      }
    }
    return new H(arguments);
  }

  if (argv[0] instanceof H) {
    return argv[0];
  }

  this.tag = argv[0].toLowerCase();
  this.props = argv[1] || {};

  if (this.tag === 'text') {
      this.tag = 'svgtext';
  }

  if (argv[2] === null || argv[2] === undefined) {
    return;
  }

  if (argv.length > 2) {
    if (typeof argv[2] !== 'object' && argv.length === 3) {
      this.children = [_createTextNode(argv[2])];
    } else if (Array.isArray(argv[2])) {
      this.children = argv[2];
    } else {
      this.children = [].concat.apply([], [].slice.call(argv, 2, argv.length))
        .filter(function (n) {
          return n !== null && n !== undefined && n !== false;
        })
        .map(function (n) {
          if (!(n instanceof H)) {
            return _createTextNode(n);
          } else {
            return n;
          }
        });
    }
  }
};

/**
 * Tree renderer
 *
 * @name render
 * @function
 * @access public
 * @param {Boolean} fasle - do not save DOM into tree
 */
H.prototype.render = function (node, parent) {
  node = node || this;

  node.el = createElement(node.tag ? node : this, parent);

  var children = node.children;

  if (typeof children === 'object') {
    for (var i = 0; i < children.length; i++) {
      node.el.appendChild(this.render(children[i], node.el));
    }
  }

  return node.el;
};

H.prototype.setAttribute = function(name, value) {
  try {
    if (this.el instanceof window.SVGElement) {
      this.el.setAttributeNS(null, name, value);
    } else {
      this.el.setAttribute(name, value);
    }
  } catch(e) {
    this.el.setAttribute(name, value);
  }
};

H.prototype.setProp = function (name, value) {
  if (typeof this.el !== 'undefined') {
    if (name === 'className') {
      this.setAttribute('class', value);
    } else if (name === 'style' && typeof value !== 'string') {
      this.setAttribute('style', _stylePropToString(value));
    } else if (name.match(/^on/)) {
      this.addEvent(name, value);
    } else if (name === 'ref') {
      if (typeof value === 'function') {
        value(this.el);
      }
    } else if (typeof value === 'boolean' || value === 'true') {
      this.setAttribute(name, value);
      this.el[name] = Boolean(value);
    } else {
      this.setAttribute(name, value);
    }
  }

  this.props[name] = value;
};

H.prototype.setProps = function (props) {
  var propNames = Object.keys(props);

  for (var i = 0; i < propNames.length; i++) {
    var prop = propNames[i];
    this.setProp(prop, props[prop]);
  }
};

H.prototype.rmProp = function (name) {
  if (typeof this.el !== 'undefined') {
    if (name === 'className') {
      this.el.removeAttribute('class');
    } else if (name.match(/^on/)) {
      this.removeEvent(name);
    } else if (name === 'ref') {
      /* Nothing to do */
    } else if (typeof value === 'boolean') {
      this.el.removeAttribute(name);
      delete this.el[name];
    } else {
      this.el.removeAttribute(name);
    }
  }

  delete this.props[name];
};

H.prototype.addEvent = function (name, listener) {
  name = name.slice(2).toLowerCase();

  this.listeners = this.listeners || {};

  if (name in this.listeners) {
    this.removeEvent(name);
  }

  this.listeners[name] = listener;
  this.el.addEventListener(name, listener);
};

H.prototype.removeEvent = function (name) {
  name = name.replace(/^on/, '').toLowerCase();
  if (name in this.listeners) {
    this.el.removeEventListener(name, this.listeners[name]);
    delete this.listeners[name];
  }
};

H.prototype.clone = function () {
  var node = {
    tag: String(this.tag),
    props: _cloneProps(this.props)
  };

  if (typeof this.children !== 'undefined') {
    node.children = this.tag === 'text'
      ? String(this.children)
      : this.children.map(function (child) {
        return child.tag === 'text' ? _createTextNode(child.children) : child.clone();
      });
  }

  return H(node.tag, node.props, node.children);
};

var _cloneProps = function (props, keepRefs) {
  if (typeof keepRefs === 'undefined') {
    keepRefs = true;
  }

  var attrs = Object.keys(props);
  var i;
  var name;
  var cloned = {};

  for (i = 0; i < attrs.length; i++) {
    name = attrs[i];

    if (typeof props[name] === 'string') {
      cloned[name] = String(props[name]);
    } else if (typeof props[name] === 'function' && keepRefs === true) {
      cloned[name] = props[name];
    } else if (typeof props[name] === 'boolean') {
      cloned[name] = Boolean(props[name]);
    } else if (typeof props[name] === 'object') {
      cloned[name] = _cloneProps(props[name]);
    }
  }

  return cloned;
};

var _stylePropToString = function (props) {
  var out = '';
  var attrs = Object.keys(props);

  for (var i = 0; i < attrs.length; i++) {
    out += attrs[i].replace(/([A-Z])/g, '-$1').toLowerCase();
    out += ':';
    out += props[attrs[i]];
    out += ';';
  }

  return out;
};

var _createTextNode = function (text) {
  return {
    tag: 'text',
    children: String(text)
  };
};

var createElement = function (node, parent) {
//  node.el = node.tag === 'text'
//    ? document.createTextNode(node.children)
//    : document.createElement(node.tag);


  switch (node.tag) {
    case 'text':
      node.el = document.createTextNode(node.children);
      break;
    case 'svgtext':
      node.el = document.createElementNS(xmlns, 'text');
      break;
    case 'lineargradient':
      node.el = document.createElementNS(xmlns, 'linearGradient');
      break;
    case 'radialgradient':
      node.el = document.createElementNS(xmlns, 'radialGradient');
      break;
    case 'fegaussianblur':
      node.el = document.createElementNS(xmlns, 'feGaussianBlur');
      break;
    case 'feoffset':
      node.el = document.createElementNS(xmlns, 'feOffset');
      break;
    case 'feblend':
      node.el = document.createElementNS(xmlns, 'feBlend');
      break;
    case 'svg':
    case 'g':
    case 'circle':
    case 'ellipse':
    case 'line':
    case 'path':
    case 'polygon':
    case 'polyline':
    case 'rect':
    case 'defs':
    case 'stop':
    case 'filter':
      node.el = document.createElementNS(xmlns, node.tag);
      break;
    default:
      node.el = document.createElement(node.tag);
      break;
  }

  if (typeof node.props !== 'undefined') {
    node.setProps(node.props);
  }

  if (typeof parent !== 'undefined') {
    parent.appendChild(node.el);
  }

  return node.el;
};

exports.h = H;
exports.createElement = createElement;
