// config/webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
      publicPath: '/'
    },
    hot: true,
    compress: true,
    port: 3000,
    historyApiFallback: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Add debugging middleware
      devServer.app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
      });

      return middlewares;
    }
  }
});