module.exports = {
  _mixer : require('./mixer'),
  _container : require('./container')._container,
  next : require('./mixer').next,
  register : require('./container').register,
  unregister : require('./container').unregister,
  inject : require('./container').inject,
  Cream : require('./cream')
};