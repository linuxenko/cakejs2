/* global __dirname */

var path = require('path');

var webpack = require('webpack');
var dir_js = path.resolve(__dirname, 'app');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry: {
    app : path.resolve(dir_js, 'index.js')
  },
  devtool: 'source-map',
  output: {
    path: dir_build,
    filename: 'bundle.js'
  },
  resolveLoader: {
    fallback: [path.join(__dirname, 'node_modules')]
  },
  resolve: {
    modulesDirectories: ['node_modules', '../../../lib', dir_js],
    fallback: [path.join(__dirname, 'node_modules')]
  },
  devServer: {
    contentBase: dir_build,
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        presets : ['es2015', 'react']
      },
      {
        test : /\.html$/,
        loader : 'file?name=[name].html'
      },
      {
        test : /\.cur$/,
        loader : 'file?name=[name].cur'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()

  ],
  stats: {
    colors: true
  }
};
