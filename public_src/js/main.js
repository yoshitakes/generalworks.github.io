// npmパッケージからも読み込める
var $ = require('jquery');


// bowerからも読み込み


// require('zeroclipboard');
// require('moment');
// require('pikaday');


// 自分のファイルから読み込み
// require("./tasks_bk.js");
// require("./tasks_bk.js");

// test
document.write(require("./content.js"));

$(function(){
  var test = $('body#main3');
  console.log(test.html());
});
