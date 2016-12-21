/* global __dirname */

var path = require('path');

var webpack = require('webpack');

var dir_js = path.resolve(__dirname, 'app');
var dir_build = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.resolve(dir_js, 'index.js'),
    output: {
        path: dir_build,
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: dir_build,
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: dir_js,
                presets : ['es2015', 'react']
            },

        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
  //  devtool: 'source-map',
}
