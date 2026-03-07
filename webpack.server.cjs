const base = require('./webpack.base.cjs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

// On the server, Babel must emit CommonJS (require/module.exports) rather than
// ESM (import/export).  When @babel/preset-env runs with modules:false
// (the default in the base config so webpack can tree-shake the client bundle),
// it injects polyfills as ESM `import "core-js/..."` statements.  Webpack 5
// then marks any file containing those import statements as a "harmony/ESM"
// module, and the old-style CJS code (module.exports = ...) in those same
// files trips the "ES Modules may not assign module.exports" runtime guard.
// Setting envName:'server' activates the env.server preset in babel.config.js
// which uses modules:'commonjs', emitting require() calls instead of imports.
const serverJsRule = {
  test: /\.(ts|tsx|js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      envName: 'server',
    },
  },
};

// On the server we only need css-loader to return class-name mappings.
// MiniCssExtractPlugin's loader (used in the base config for production)
// emits ESM import statements that clash with the CJS server bundle and
// cause "ES Modules may not assign module.exports" at runtime.
// esModule: false forces css-loader to emit CJS (module.exports) instead of
// ESM (export default), preventing the same conflict from within css-loader.
const serverCssRule = {
  test: /\.css$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        esModule: false,
        modules: {
          localIdentName: '[hash:base64:5]',
        },
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            ['postcss-import', { path: path.resolve(__dirname, 'src/app') }],
            ['postcss-preset-env', { stage: 2 }],
          ],
        },
      },
    },
  ],
};

module.exports = {
  ...base,

  // Replace the CSS rule inherited from base with the server-safe version
  // (css-loader only, no MiniCssExtractPlugin / style-loader)
  module: {
    ...base.module,
    rules: [
      ...base.module.rules.filter(
        r => String(r.test) !== '/\\.css$/' && String(r.test) !== '/\\.(ts|tsx|js|jsx)$/'
      ),
      serverJsRule,
      serverCssRule,
    ],
  },

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
