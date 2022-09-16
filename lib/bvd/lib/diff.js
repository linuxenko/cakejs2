/*
 * Diff
 */

var PATCH_CREATE = 0;
var PATCH_REMOVE = 1;
var PATCH_REPLACE = 2;
var PATCH_REORDER = 3;
var PATCH_PROPS = 4;

/**
 * Diff two virtual dom trees
 *
 * @name diff
 * @function
 * @access public
 * @param {Object} oldNode virtual tree to compare
 * @param {Object} newNode virtual tree to compare with
 */
var diff = function (oldNode, newNode) {
  if (typeof oldNode === 'undefined' || typeof newNode === 'undefined') {
    throw new Error('cannot diff undefined nodes');
  }

  if (!_isNodeSame(oldNode, newNode)) {
    throw new Error('unable create diff replace for root node');
  }

  return _diffTree(oldNode, newNode, []);
};

/**
 * Tree walker function
 *
 * @name _diffTree
 * @function
 * @access private
 * @param {} a
 * @param {} b
 * @param {} patches
 */
var _diffTree = function (a, b, patches) {
  _diffProps(a, b, patches);

  if (b.tag === 'text') {
    if (b.children !== a.children) {
      patches.push({ t: PATCH_REPLACE, node: a, with: b });
    }
    return;
  }

  if (Array.isArray(b.children)) {
    _diffChild(a.children, b.children, a, patches);
  } else if (Array.isArray(a.children)) {
    for (var i = 0; i < a.children.length; i++) {
      patches.push({ t: PATCH_REMOVE, from: i, node: _nodeId(a), item: _nodeId(a.children[i]) });
    }
  }

  return patches;
};

/**
 * Tree children diffings
 *
 * @name _diffChild
 * @function
 * @access private
 * @param {} a
 * @param {} b
 * @param {} pn
 * @param {} patches
 */
var _diffChild = function (a, b, pn, patches) {
  var reorderMap = [];
  var i;
  var j;
  var found;

  for (i = 0; i < b.length; i++) {
    found = false;

    if (!a) {
      if (!pn.children) {
        pn.children = [];
      }

      if (b[i].tag === 'text') {
        patches.push({ t: PATCH_CREATE, to: i, node: _nodeId(pn), item: _nodeId(b[i]) });
      } else {
        patches.push({ t: PATCH_CREATE, to: i, node: _nodeId(pn), item: _nodeId(b[i].clone()) });
      }
      continue;
    }

    for (j = 0; j < a.length; j++) {
      if (_isNodeSame(a[j], b[i]) && reorderMap.indexOf(a[j]) === -1) {
        if (j !== i) {
          patches.push({ t: PATCH_REORDER, from: j, to: i, node: _nodeId(pn), item: _nodeId(a[j]) });
        }
        reorderMap.push(a[j]);

        _diffTree(a[j], b[i], patches);
        found = true;
        break;
      }
    }

    if (found === false) {
      reorderMap.push(null);
      patches.push({ t: PATCH_CREATE, to: i, node: _nodeId(pn), item: b[i].tag === 'text' ? _nodeId(b[i]) : _nodeId(b[i].clone()) });
    }
  }

  if (!a) return;

  for (i = 0; i < a.length; i++) {
    if (reorderMap.indexOf(a[i]) === -1) {
      patches.push({ t: PATCH_REMOVE, from: i, node: _nodeId(pn), item: _nodeId(a[i]) });
    }
  }
};

/**
 * Props diffings
 *
 * @name _diffProps
 * @function
 * @access private
 * @param {} a
 * @param {} b
 * @param {} patches
 * @param {} type
 */
var _diffProps = function (a, b, patches) {
  if (!a || !b || !a.props && !b.props) {
    return;
  }

  var toChange = [];
  var toRemove = [];
  var battrs = Object.keys(b.props);
  var aattrs = Object.keys(a.props);
  var aattrsLen = aattrs.filter(function(attr) {
    return (attr !== 'ref' && !(attr.match(/^on/)));
  }).length;
  var i;

  if (a.el && a.el.attributes.length !==  aattrsLen) {
    for (i = 0; i < a.el.attributes.length; i++) {
      var attr = a.el.attributes[i];
      var name = attr.name;

      if (name === 'class') {
        name = 'className';
      }

      if (!(name in aattrs)) {
        a.props[name] = attr.value;
      }

      if (attr.value !== a.props[name]) {
        a.props[name] = attr.value;
      }
    }
    aattrs = Object.keys(a.props);
  }

  for (i = 0; i < battrs.length || i < aattrs.length; i++) {
    if (i < battrs.length) {
      if (!(battrs[i] in a.props) || b.props[battrs[i]] !== a.props[battrs[i]]) {
        toChange.push({ name: battrs[i], value: b.props[battrs[i]] });
      }
    }

    if (i < aattrs.length) {
      if (!(aattrs[i] in b.props)) {
        toRemove.push({ name: aattrs[i] });
      }
    }
  }

  if (toRemove.length > 0) {
    patches.push({ t: PATCH_PROPS, remove: toRemove, node: _nodeId(a) });
  }

  if (toChange.length > 0) {
    patches.push({ t: PATCH_PROPS, change: toChange, node: _nodeId(a) });
  }
};

/**
 * Node identifier
 *
 * @name _nodeId
 * @function
 * @access private
 * @param {} node
 */
var _nodeId = function (node) {
  return node;
};

/**
 * Nodes comparison
 *
 * @name _isNodeSame
 * @function
 * @access private
 * @param {} a
 * @param {} b
 */
var _isNodeSame = function (a, b) {
  return a.tag === b.tag;
};

exports.PATCH_CREATE = PATCH_CREATE;
exports.PATCH_REMOVE = PATCH_REMOVE;
exports.PATCH_REPLACE = PATCH_REPLACE;
exports.PATCH_REORDER = PATCH_REORDER;
exports.PATCH_PROPS = PATCH_PROPS;
exports.diff = diff;
