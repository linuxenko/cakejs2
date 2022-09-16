exports.h     = require('./lib/h').h;
exports.diff  = require('./lib/diff').diff;
exports.patch = require('./lib/patch').patch;

exports.PATCH_CREATE  = require('./lib/diff').PATCH_CREATE;
exports.PATCH_REMOVE  = require('./lib/diff').PATCH_REMOVE;
exports.PATCH_REPLACE = require('./lib/diff').PATCH_REPLACE;
exports.PATCH_REORDER = require('./lib/diff').PATCH_REORDER;
exports.PATCH_PROPS   = require('./lib/diff').PATCH_PROPS;
