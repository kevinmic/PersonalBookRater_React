var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  context: __dirname + "/src",

  entry: {
    javascript: "./index.js",
    html: "../index.html",
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loader: "style!css-loader"
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
    ]
  }
};
