module.exports = {
  _container : require('./mixer/container')._container,
  register : require('./mixer/container').register,
  unregister : require('./mixer/container').unregister,
  inject : require('./mixer/container').inject,
  Cream : require('./recipes/cream')
};