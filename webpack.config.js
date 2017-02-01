const glob = require('glob');
const path = require('path');

module.exports = {
  entry: {
    'index': './src/index.js',
    'test': ['babel-polyfill', ...glob.sync('./test/*-test.js')],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].js',
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: [['es2015', {'modules': false}]],
          plugins: ['dynamic-import-system-import'],
        },
      },
    ],
  },
  stats: 'minimal',
};
