const glob = require('glob');
const path = require('path');

module.exports = {
  entry: {
    'index': './src/index.js',
    'test': ['babel-polyfill', ...glob.sync('./test/analytics/*-test.js')],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].js',
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', {'modules': false}]],
            plugins: ['dynamic-import-system-import'],
          },
        },
        resource: {
          test: /\.js$/,
          exclude: /node_modules\/(?!(autotrack|dom-utils))/,
        },
      },
    ],
  },
  stats: 'minimal',
};
