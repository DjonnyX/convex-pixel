const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'glsl'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'boundle.js',
    libraryTarget: 'var',
    library: 'CPXViewer',
  },
  devServer: {
    port: 9000,
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'demo')],
    compress: true,
    hot: true,
    index: 'assets/index.html',
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/,
          to: '/demo/index.html',
        },
      ],
    },
    proxy: [
      {
        target: 'https://cpx.eugene-grebennikov.pro/',
        secure: false,
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: true,
      }),
    ],
  },
};
