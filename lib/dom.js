var dom;

try {
  dom = require('basic-virtual-dom');
} catch (err) {
  dom = require('spatial-virtual-dom');
}

module.exports = dom;