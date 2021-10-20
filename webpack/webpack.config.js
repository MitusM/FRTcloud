const path = require('path')
const {
  merge
} = require('webpack-merge')
const webpack = require('webpack')
// const CopyPlugin = require('copy-webpack-plugin')

const svg = require('./svg')
const images = require('./images')
const sass = require('./sass')
const babel = require('./babel')

var appRoot = require('app-root-path')


const pathList = {
  // source: path.join(appRoot.path, 'developer', 'js'),
  build: path.join(appRoot.path, 'public', 'js')
}

const common = merge([{
    // context:
    entry: {
      style: './assets/js/index.js',
      users: './microservices/users/assets/js/index.js',
      login: './microservices/auth/assets/js/index.js'
      // files: './microservices/files/assets/js/index.js',
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        minSize: 0,
        minChunks: 2,
        maxInitialRequests: Infinity,
        // name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            enforce: true,
            chunks: 'all'
          }
        }
      }
    },


    output: {
      path: pathList.build,
      filename: '[name].js',
      chunkFilename: '[name].bundle.js',
      publicPath: pathList.build
    },
    devtool: false,
    watchOptions: {
      ignored: ["node_modules/**"],
    },
    stats: {
      assets: true,
      colors: true,
      errors: true,
      errorDetails: true,
      modules: false,
      performance: true,
      hash: false,
      version: false,
      timings: true,
      warnings: true,
      children: false
    },

    plugins: [
      // new DuplicatePackageCheckerPlugin({
      //   emitError: true
      // }),

      new webpack.DefinePlugin({
        "process.env": {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        },
      }),

    ]

  },
  images(),
  svg(),
  babel()
])

module.exports = function (env) {
  console.log('env', env)
  console.log('⚡ process.env.NODE_ENV', process.env.NODE_ENV)
  return merge([{
      mode: 'development',
      // watch: true
    },
    common,
    sass()
    // analyzer
  ])
}