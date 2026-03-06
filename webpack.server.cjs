const base = require('./webpack.base.cjs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  ...base,

  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  devtool: 'source-map',

  entry: path.resolve('./src/server/index.ts'),

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
    publicPath: '/',
    // Use CommonJS so Node.js can require() the bundle
    libraryTarget: 'commonjs2',
  },

  // Don't bundle node_modules for the server build
  externals: [
    nodeExternals({
      // CSS imports must still go through webpack on the server for SSR
      allowlist: ['normalize.css', /\.css$/],
    }),
  ],

  target: 'node',

  node: {
    __filename: false,
    __dirname: false,
  },

  plugins: [
    ...(base.plugins || []),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
  ],
};
