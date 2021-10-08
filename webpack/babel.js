'use strict'
module.exports = function () {
  return {
    module: {
      rules: [{
          test: /\.js$/,
          // include: inc,
          exclude: [/(node_modules|bower_components)/, /node_modules[\\\/]core-js/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        {
          test: /\.bundle\.js$/,
          use: {
            loader: 'bundle-loader'
          }
        }
      ]
    }
  }
}