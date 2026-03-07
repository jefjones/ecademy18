require('dotenv/config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {

  module: {
    rules: [
      // TypeScript & JavaScript — transpiled by Babel (fast; type checking via `npm run typecheck`)
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },

      // CSS Modules
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev
                  ? '[local]-[hash:base64:5]'
                  : '[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-import', { path: `${__dirname}/src/app` }],
                  ['postcss-preset-env', { stage: 2 }],
                ],
              },
            },
          },
        ],
      },

      // Assets
      {
        test: /\.(png|jpe?g|gif|svg|mp3|mpe?g)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[name]-[hash:8][ext]',
        },
      },
    ],
  },

  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src/app')],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    fallback: {
      // Polyfills removed in webpack 5 — supply only what the project truly needs
      fs: false,
      path: false,
      os: false,
      crypto: false,
    },
    alias: {
      // cptable / jszip shims used by xlsx
      './cptable': require.resolve('./node_modules/xlsx/dist/cpexcel.js'),
    },
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'app.css' }),
  ],
};
