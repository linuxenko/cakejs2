var Container = require('./container');
var Cream = require('./cream');
var Cake = require('./cake');

module.exports = {
  _container : Container._container,
  _mixer : require('./mixer'),
  h : require('./dom').h,
  spatial : require('./dom').spatial,
  next : require('./mixer').next,
  register : Container.register,
  unregister : Container.unregister,
  inject : Container.inject,
  Cream : Cream,
  create : Cake.create,
  destroy : Cake.destroy
};