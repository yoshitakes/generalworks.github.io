var path = require('path');
var webpack = require("webpack");
var BowerWebpackPlugin = require("bower-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var _ = require('lodash');

var dest = './public'; // 出力先ディレクトリ
var src = './public_src';  // ソースディレクトリ
var relativeSrcPath = path.relative('.', src); // 後々、つかいます

var autoprefixer = require('autoprefixer');
require('babel-core/register');

module.exports = {
  src: src,
  dest: dest,

  // 各タスクごとの設定をこの下に追加していく

  // jsのビルド設定
    js: {
      src: src + '/js/**',
      dest: dest + '/js',
      uglify: true
    },

    // webpackの設定(webpack.config.jsに書く内容をここに記述できる
    webpack: {
      entry: {
        main: src + '/js/main.js'
      },
      output: {
        path: __dirname + '/dist',
        filename: '[name].js'
      },
      resolve: {
        root: [path.join(__dirname, "bower_components")],
        moduleDirectories: ["bower_components"],
        extensions: ['', '.js']
      },
      plugins: [
          new BowerWebpackPlugin(),//Bowerのjsファイルを参照するプラグイン
          new webpack.ProvidePlugin({
                  jQuery: "jquery",
                  $: "jquery",
                  _: "lodash"
          }),
          new webpack.optimize.CommonsChunkPlugin('main', './main.js') //webpack関連のコードは絶対読み込むファイルに記述
      ],
      module: {
          loaders: [
              { test: /\.html$/, loader: 'html-loader' },
              { test: /\.css$/, loaders: ['style-loader','css-loader'] },
              {
                test: /\.(jpg|png|cur|gif|eot|ttf|woff|svg)$/,
                loader: 'url-loader'
              },
              {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|nochk_js)/,
                loader: 'babel-loader'
              }
          ],
          preLoaders: [
            {
              test: /\.js$/,
              exclude: /node_modules|bower_components|nochk_js/,
              loader: "eslint-loader"
            }
          ],
      },
      eslint: {
        configFile: '.eslintrc.json'
      }
    },
    webpack_sass: {
      entry: {
        "main": src + '/scss/main.js'
      },
      output: {
//        path: __dirname + '/stylesheets',
        path: __dirname + "/../" + dest + '/stylesheets',
        filename: '[name].js'
      },
      plugins: [
        new ExtractTextPlugin("[name].css")
      ],
      module: {
          loaders: [
            { test: /\.html$/, loader: 'html-loader' },
            {
              test: /\.(jpg|png|cur|gif|eot|ttf|woff|svg)$/,
              loader: 'url-loader'
            },
            { test: /\.css$/,  loaders: ExtractTextPlugin.extract(['style-loader','css-loader']) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader")}
          ]
      },
      postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
    },
    sass: {
       src: src + '/scss/**/*.scss',
       dest: dest + '/stylesheets'
    },
     // copy
      copy: {
        src: [
          src + '/www/**/*.!(jade)'
        ],
        dest: dest
      },

      watch: {
          js: relativeSrcPath + '/js/**',
          sass: relativeSrcPath + '/scss/**',
          css: relativeSrcPath + '/css/**',
          www: relativeSrcPath + '/www/**'
        },
}
