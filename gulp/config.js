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

//webpack_sass用にファイル一覧取得用 TODO チャレンジしたけど、関数本読み終えた後に再チャレンジする。
//var fs = require("fs")
//    , path = require("path")
//    , dir = process.argv[2] || '.'; //引数が無いときはカレントディレクトリを対象とする
//
//var walk = function(p, fileCallback, errCallback) {
//
//    fs.readdir(p, function(err, files) {
//        if (err) {
//            errCallback(err);
//            return;
//        }
//
//        var list = _.forEach(files, function(f) {
//            var fp = path.join(p, f); // to full-path
//            if(fs.statSync(fp).isDirectory()) {
//                var res = walk(fp, fileCallback); // ディレクトリなら再帰
//                if (res) {fileCallback(res);}
//            } else {
//                var result = f.match(/^([^_]+).scss$/);
//                if(result) {fileCallback({}[result[1]] = fp);}
//            }
//        });
//
//        return list;
//    });
//};
//
//// 使う方
//var paths = new Array();
//walk('./public_src/scss',
//    function(f) {
//       paths.push(f);
//       console.log(paths);
//     },
//    function(err) {
//         console.log("Receive err:" + err); // エラー受信
//     });
//console.log(paths);


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
        main: src + '/js/main.js',
        tasks: src + '/js/tasks.js',
        label: src + '/js/label.js',
        project: src + '/js/project.js',
        routien: src + '/js/routien.js',
        snippet: src + '/js/snippet.js'
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
//        new webpack.ResolverPlugin(
//          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
//        )
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
        "main": src + '/scss/main.js',
        "pages/wikipedia": src + '/scss/wikipedia.js',
        "pages/github": src + '/scss/github.js',
      },
//      //指定パスから、sassの名称があるファイルを取ってくる TODO関数本読んだ後再チャレンジ
//      entry: walk('./public_src/scss'),
      output: {
//        path: __dirname + '/stylesheets',
        path: __dirname + "/../" + dest + '/stylesheets',
        filename: '[name].js'
      },
//      resolve: {
//          extensions: ['', '.js']
//      },
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
//          styl: relativeSrcPath + '/styl/**',
//          jade: relativeSrcPath + '/www/**',
          www: relativeSrcPath + '/www/**'
        },
}
