'use strict';

require('dotenv').config();

const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

const production = process.env.NODE_ENV === 'production'; // evals to a Boolean value

const webpackConfig = module.exports = {};

webpackConfig.entry = `${__dirname}/src/main.js`;

webpackConfig.output = {
  filename: '[name].[hash].js',
  path: `${__dirname}/build`,
  publicPath: process.env.CDN_URL,
};


webpackConfig.plugins = [
  new HtmlWebpackPlugin({
    title: 'Piper\'s Seekers - A Search Game',
  }),
  // this makes webpack constants
  new DefinePlugin({
    API_URL: JSON.stringify(process.env.API_URL),
  }),
];

if (production) {
  webpackConfig.plugins.push(new MiniCssPlugin({
    filename: '[name].[hash].css',
  }));
}

webpackConfig.module = {};

const finalLoader = production ? MiniCssPlugin.loader : 'style-loader'; // eslint-disable-line
webpackConfig.module.rules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'file-loader',
    ],
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['env', 'stage-0', 'react'],
        plugins: ['transform-react-jsx-source'],
        cacheDirectory: true,
      },
    },
  },
  {
    test: /\.(jpg|jpeg|gif|png|tiff|svg)$/,
    exclude: /\.glyph.svg/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
    ],
  },
];
