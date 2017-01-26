require('dotenv').config();
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/collegemate'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        SERVER_HOST: JSON.stringify(process.env.SERVER_HOST),
        SOCKET_SERVER: JSON.stringify(process.env.SOCKET_SERVER),
        GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID)
      }
    })
  ],
  node: {
    net: 'empty'
  },
  module: {
    loaders: [
      // json
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // js
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'client')
      },
      // CSS
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: path.join(__dirname, 'client')
      },
      // CSS
      {
        test: /\.css$/,
        loader: 'style!css?modules',
        include: /flexboxgrid/
      },
      // statics
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]'
        ]
      }
    ]
  }
};
