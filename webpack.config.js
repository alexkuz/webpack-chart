var path = require('path');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: 'eval',
  entry: isProduction ?
    [ './src/index' ] :
    [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/index'
    ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: isProduction ? 'static/' : '/static/'
  },
  plugins: isProduction ?
    [new webpack.NoErrorsPlugin()] :
    [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: isProduction ?
          ['babel?stage=0&optional=runtime'] :
          ['react-hot', 'babel?stage=0&optional=runtime'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  }
};
