/*
 * Patch
 */

var PATCH_CREATE  = require('./diff').PATCH_CREATE;
var PATCH_REMOVE  = require('./diff').PATCH_REMOVE;
var PATCH_REPLACE = require('./diff').PATCH_REPLACE;
var PATCH_REORDER = require('./diff').PATCH_REORDER;
var PATCH_PROPS   = require('./diff').PATCH_PROPS;

var createElement = require('./h').createElement;

/**
 * Patch DOM and virtual tree
 *
 * @name patch
 * @function
 * @access public
 * @param {Object} tree Tree to patch
 * @param {Array} patches Array of patches
 */
var patch = function(tree, patches) {
  var render = true;

  if (typeof tree.el === 'undefined') {
    render = false;
  }

  for (var i = 0; i < patches.length; i++) {
    var p = patches[i];

    switch(p.t) {
      case PATCH_REORDER:
        _patchReorder(p, render);
        break;
      case PATCH_CREATE:
        _patchCreate(p, render);
        break;
      case PATCH_REMOVE:
        _patchRemove(p, render);
        break;
      case PATCH_REPLACE:
        _patchReplace(p, render);
        break;
      case PATCH_PROPS:
        _patchProps(p, render);
        break;
    }
  }
};

/**
 * Replace existen node content
 *
 * @name patchReplace
 * @function
 * @access private
 */
var _patchReplace = function(p, render) {
  p.node.children = String(p.with.children);

  if (render === true) {
    p.node.el.nodeValue = String(p.with.children);
  }
};

/**
 * Reorder existen node
 *
 * @name patchReorder
 * @function
 * @access private
 */
var _patchReorder = function(p, render) {
  if (render === true) {
    p.node.el.insertBefore(p.item.el, p.node.el.childNodes[p.to]);
  }

  p.node.children.splice(p.to, 0,
    p.node.children.splice(p.node.children.indexOf(p.item), 1)[0]);
};

/**
 * Create new tree node
 *
 * @name patchCreate
 * @function
 * @access private
 */
var _patchCreate = function(p, render) {
  var element;

  if (render === true) {
    element = p.item.tag === 'text' ?
      createElement(p.item) : p.item.render();
  }

  if (p.node.children.length - 1 < p.to) {
    p.node.children.push(p.item);

    if (render === true) {
      p.node.el.appendChild(element);
    }
  } else {
    p.node.children.splice(p.to, 0, p.item);

    if (render === true) {
      p.node.el.insertBefore(element, p.node.el.childNodes[p.to]);
    }
  }
};

/**
 * Remove tree node
 *
 * @name patchRemove
 * @function
 * @access private
 */
var _patchRemove = function(p, render) {
  if (render === true) {
    p.node.el.removeChild(p.item.el);
  }

  for (var i = 0; i < p.node.children.length; i++) {
    if (p.node.children[i] === p.item) {
      p.node.children.splice(i, 1);
    }
  }
};

/**
 * Replace props
 *
 * @name _patchProps
 * @function
 * @access private
 */
var _patchProps = function(p) {
  var i;

  if ('remove' in p) {
    for (i = 0; i < p.remove.length; i++) {
      p.node.rmProp(p.remove[i].name);
    }
    return;
  }

  if ('change' in p) {
    for (i = 0; i < p.change.length; i++) {
      p.node.setProp(p.change[i].name, p.change[i].value);
    }
    return;
  }
};

exports.patch = patch;
