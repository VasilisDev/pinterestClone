const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VENDOR_LIBS = ['react', 'react-dom', 'react-redux', 'redux'];

module.exports = {
  entry: {
    bundle: './frontend/src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, './frontend/build'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/,
      },
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
      {
        use: [
          {
            loader: 'url-loader',
            options: { limit: 4000 }
          },
          'image-webpack-loader'
        ],
        test: /\.(jpe?g|png|gif|svg)$/
      }
    ]
  },
  resolve: {
   alias: {
     '@material-ui/core': '@material-ui/core/es'
   }
 },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'frontend/src/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
};
