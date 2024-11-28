// config/webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
entry: path.resolve(__dirname, '../src/main.js'),
output: {
  path: path.resolve(__dirname, '../dist'),
  filename: 'bundle.[contenthash].js',
  clean: true,
  publicPath: '/'
},
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    }
  ]
},
plugins: [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../public/index.html'),
    filename: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  }),
  new CopyWebpackPlugin({
    patterns: [
      { 
        from: path.resolve(__dirname, '../node_modules/web-ifc/web-ifc.wasm'),
        to: './',
        noErrorOnMissing: true
      },
      {
        from: path.resolve(__dirname, '../public/assets'),
        to: 'assets',
        noErrorOnMissing: true
      }
    ]
  })
],
resolve: {
  extensions: ['.js'],
  alias: {
    '@': path.resolve(__dirname, '../src'),
    'assets': path.resolve(__dirname, '../public/assets')
  }
},
optimization: {
  moduleIds: 'deterministic',
  runtimeChunk: 'single',
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      }
    }
  }
}
};