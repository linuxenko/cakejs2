var dom;

try {
  dom = require('basic-virtual-dom');
} catch (err) {
//  dom = require('spatial-virtual-dom');
}

if (!dom) {
  try {
    dom = require('spatial-virtual-dom');
  } catch (err) { throw err; }
}

module.exports = dom;