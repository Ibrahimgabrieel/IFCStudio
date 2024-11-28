// config/webpack.dev.js
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
mode: 'development',
devtool: 'eval-source-map',
devServer: {
  static: {
    directory: path.join(__dirname, '../dist'),
  },
  hot: true,
  open: true,
  port: 3000,
  historyApiFallback: true,
  compress: true
}
});