'use strict'

process.env.BABEL_ENV = 'server'

const path = require('path')

const { depencencies } = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let serverConfig = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: {
    server: path.resolve(__dirname, '../src/server/index')
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../dist')
  },
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [ ...Object.keys(depencencies || {}) ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/server'),
      'pouchdb': 'pouchdb-node/lib/index.js'
    },
    extensions: ['.ts', '.js', '.json']
  },
  target: 'node',
  externals: [ require('webpack-node-externals')()]
}

module.exports = serverConfig
