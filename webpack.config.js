var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index : './example/index.jsx'
  },
  //入口文件输出配置
  output: {
    path: 'dist/example',
    filename: '[name].js'
  },
  module: {
    //加载器配置
    loaders: [
      { 
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel-loader'
        ]
      },
      {
        test: /\.(png|svg)$/,
        loader: 'url-loader?limit=8192&name=[name]_[hash:6].[ext]'
      }
    ]
  },
  //其它解决方案配置
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html'
    })
  ],
  devServer: {
    stats: { chunks:false },
    contentBase: './example',
    hot: true
  }
};