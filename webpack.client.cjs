const base = require('./webpack.base.cjs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { WDS_PORT, PORT, APP_WEB_BASE_PATH } = process.env;
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  ...base,

  mode: isDev ? 'development' : 'production',

  devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',

  entry: './src/app/_client.tsx',

  output: {
    path: path.join(__dirname, 'dist', 'static'),
    filename: isDev ? 'app.js' : 'app.[contenthash:8].js',
    chunkFilename: isDev ? '[id].app.js' : '[id].app.[contenthash:8].js',
    publicPath: '/static/',
    clean: true,
  },

  plugins: [
    ...(base.plugins || []),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    ...(!isDev
      ? [
          new MiniCssExtractPlugin({ filename: 'app.[contenthash:8].css' }),
          // Uncomment to analyse bundle size:
          // new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
        ]
      : []),
  ],

  optimization: isDev
    ? {}
    : {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
        runtimeChunk: 'single',
      },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist', 'static'),
      publicPath: '/static/',
    },
    historyApiFallback: true,
    compress: true,
    port: WDS_PORT,
    hot: true,
    proxy: [
      {
        context: ['**'],
        target: `http://127.0.0.1:${PORT}`,
      },
    ],
  },
};
