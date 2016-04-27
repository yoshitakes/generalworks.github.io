//require('../../node_modules/handsontable/dist/handsontable.full.js');
//require('../../node_modules/handsontable/dist/handsontable.full.css');
require('../nochk_js/handsontable_custmized_0.24.1_.full.js');
require('../css/handsontable.full.css');
require('../css/handsontable_custmize.css');

function numericZentohan(data)
{
    data += '';
    // alert(data);
    var table = {
        '０':'0',
        '１':'1',
        '２':'2',
        '３':'3',
        '４':'4',
        '５':'5',
        '６':'6',
        '７':'7',
        '８':'8',
        '９':'9',
        '／':'/',
        '：':':'
    };

    while(data.match(/[０-９]/)){
        for(let n in table){
            data = data.replace(n, table[n]);
        }
    }
    return data;
}

//データのloadは一回 レ


//modeリストの読み込みは一回。そのタイミングでautocompleteの中身を決定するのと、
//cellのrendererを更新する。 レ

//projectリストの読み込みも一回。 レ
//全リスト取得した上で、projecth,mの変更に伴ってautocompleteを更新する  レ

//不要なカラムは削除する レ

//keyval対応

//D&D

//autosave

//var _ = require('lodash');
var ajax = require("./ajax.js");
//var $ = require('jquery');

var $$ = function(id) {
      return document.getElementById(id);
    },container = $$('example'),
    exampleConsole = $$('console'),
    renderFuncArray={};

var getTaluuRenderer, TimeValidator, hot;
/**
  XX:XX 形式か、 数値のみ許可
*/

function planRender(args) {
   var argstmp = args;
   var row = argstmp[2];
   var prop = argstmp[4];
   var value = argstmp[5];
   var td = argstmp[1];
   /*
   if (plan_flg == '1') {
    if (prop == 'resultStartTimeStr') {
      var planStartTimeStr = hot.getDataAtCell(row, 'planStartTimeStr');
      if (value == '') {
        argstmp[5] = planStartTimeStr;
      td.style.fontStyle = 'italic';
      td.style.color = 'red';
      }
    }
    else if (prop == 'resultEndTimeStr') {
      var planEndTimeStr = hot.getDataAtRowProp(row, 'planEndTimeStr');
      if (value == '') {
        argstmp[5] = planEndTimeStr;
      td.style.fontStyle = 'italic';
      td.style.color = 'red';
      }
  }
   } else {
   */
      if (prop == 'resultStartTimeStr') {
        // argstmp[5] = value;
      td.style.fontStyle = '';
      td.style.color = 'black';
      }
      else if (prop == 'resultEndTimeStr') {
        // argstmp[5] = value;
      td.style.fontStyle = '';
      td.style.color = 'black';
    }
    /*
   }
   */
   return argstmp;
}

getTaluuRenderer = function(mode) {
  return function(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.color = mode.color;
      td.style.backgroundColor = mode.backgroundColor;

      //タスクの時間の大きさによる文字size、heightの調整
      if (prop == 'planTime' || planTime == 'planHourStr') {
          var planTime = hot.getDataAtCell(row, 'planTime');
          var size = 100;
          var height = $(td).height();
          if (planTime < 15) {
            size = 50;
          } else if (planTime >= 15 && planTime < 30) {
            size = 75;
          } else if (planTime >= 30 && planTime < 60) {
            size = 100;
          } else if (planTime >= 60 && planTime < 120) {
            size = 150;
          } else if (planTime >= 120) {
            size = 200;
          }
        td.style.fontSize = size+"%";
        td.style.height = (height * size / 100);
      }
      if (prop == 'resultMinuiteStr' || planTime == 'resultStartTimeStr' || planTime == 'resultEndTimeStr') {
          var resultMinuiteStr = hot.getDataAtCell(row, 'resultMinuiteStr');
          var size = 100;
          if (resultMinuiteStr < 15) {
            size = 50;
          } else if (resultMinuiteStr >= 15 && resultMinuiteStr < 30) {
            size = 75;
          } else if (resultMinuiteStr >= 30 && resultMinuiteStr < 60) {
            size = 100;
          } else if (resultMinuiteStr >= 60 && resultMinuiteStr < 120) {
            size = 150;
          } else if (resultMinuiteStr >= 120) {
            size = 200;
          }
          td.style.fontSize = size+"%";
      }
      Handsontable.renderers.TextRenderer.apply(this, planRender(arguments));
    };
}


var $container = $("#example");
var $console = $("#console");
var $parent = $container.parent();
var w = ["日","月","火","水","木","金","土"];
var autosaveNotification;
var projectObj;
var beforeValidateRow;
var beforeValidateProp;
var afterSelectionEndRow;
var afterSelectionEndCol;

//for window size adjust
var maxed = true
  , resizeTimeout
  , availableWidth
  , availableHeight
  , $window = $(window)


var calculateSize = function () {
  var offset = $console.offset();
  availableWidth = $window.width() - offset.left + $window.scrollLeft();
  availableHeight = $window.height() - offset.top + $window.scrollTop();

  $window.on('resize', calculateSize);
};


TimeValidator = function(value, callback) {
//console.log('this:');
//  console.log(this);
  if (!value) {
    callback(true);
  } else {
    var res = /^\d*(\:)?\d*$/.test(value);
    if(!res) {
      var afterChange;
      if(/^\d*(\:)?\d*$/.test(afterChange = numericZentohan(value))) {
        res = true;
        hot.setDataAtCell(this.row, this.col, afterChange);
      } else {
        hot.setDataAtCell(this.row, this.col, '');
      }
    }
    callback(res);
  }
};

//for window size adjust
  var allColumns = [
        {data: "deleteFlg", header:"", width:20, readOnly: true, type: 'text', disableVisualSelection: true, disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "id", header:"", width:20, readOnly: true, type: 'text', disableVisualSelection: true, disp: true, setAtAddRow: false, setAtCopyRow: false},
        {data: "projectHId", header:"", width:20, readOnly: true, type: 'text', disableVisualSelection: true, disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "projectMId", header:"", width:20, readOnly: true, type: 'text', disableVisualSelection: true, disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "projectLId", header:"", width:20, readOnly: true, type: 'text', disableVisualSelection: true, disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "labelId", header:"", width:20, disp:false, setAtAddRow: false, setAtCopyRow: true},
//        {data: "mark", readOnly: true, type: 'text'},
        {data: "targetDate", header:"月日", width:50, disp: false, setAtAddRow: true, setAtCopyRow: true},
        {data: "targetDateStr", header:"月日", width:50, type: 'text', disp: true, setAtAddRow: true, setAtCopyRow: true},
        {data: "targetDayOfTheWeek", header:"曜", width:25, readOnly: true, type: 'text', disp: true, setAtAddRow: true, setAtCopyRow: true},
//        {data: "sectionName",
//         type: 'autocomplete',strict: true,allowInvalid: false,source:[]
//        },
        {data: "grid", header:"G", width:25, readOnly: true, disableVisualSelection: true, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: false},
        {data: "ind", header:"No", width:50, type: 'numeric', disp: true, setAtAddRow: true, setAtCopyRow: true},
        {data: "projectHName",header:"ProjH", width:100,
         type: 'autocomplete',strict: true,allowInvalid: false,source:[], disp: true, setAtAddRow: false, setAtCopyRow: true
        },
        {data: "projectMName",header:"ProjM", width:100,
         type: 'autocomplete',strict: true,allowInvalid: false,source:[], disp: true, setAtAddRow: false, setAtCopyRow: true
        },
        {data: "projectLName",header:"ProjL", width:100,
         type: 'autocomplete',strict: true,allowInvalid: false,source:[], disp: true, setAtAddRow: false, setAtCopyRow: true
        },
        {data: 'labelName',header:"Label", width:70,
         type: 'autocomplete', strict: true,allowInvalid: false,source:[], disp: true, setAtAddRow: false, setAtCopyRow: true
        },
        {data: "name", header:"Task", width:250, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "hintCell", header:"hint", width:20, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: false},
        {data: "planTimeStr", header:"plan", width:50, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: true,
          validator: TimeValidator},
//        {data: "planTime", type: 'text'},
//        {data: "value", type: 'text'},
        {data: "resultTimeStr", header:"rslt", width:50, readOnly: true, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "resultStartTimeStr", header:"start", width:50, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: true,
          validator: TimeValidator},
        {data: "resultEndTimeStr", header:"end", width:50, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: true,
          validator: TimeValidator},
        {data: "limitDateStr", header:"limit", width:30, type: 'text', disp:false, setAtAddRow: false, setAtCopyRow: true},
        {data: "comment", header:"comment", width:150, type: 'text', disp: true, setAtAddRow: false, setAtCopyRow: true},
        {data: "hint", header:"hint", width:100, type: 'text', disp: false, setAtAddRow: false, setAtCopyRow: true}
  ];

var columns = _.filter(allColumns, 'disp');
var colWidths = _.map(columns, 'width');
var colHeaders = _.map(columns, 'header');

var columnRow = {};
for (let ind in columns) {
    columnRow[columns[ind].data] = ind;
}

var config =
    {
    comments: true, //fixedRowsTopが邪魔で見えないことがある野で注意！
//      invalidCellClassName: "noClass",
//     　 minSpareRows: 1,
//     　 rowHeaders: true,
//     　 colHeaders: true,
      colHeaders: colHeaders,//["","","","","",/*"",labelId*/"月日","曜","G","No","ProjectH","ProjectM","ProjectL","Label","Task","hint","見積",/*"見積",*//*"金額",*/"実績","開始","終了",/*"期日",*/"実行後memo","タスク実行前のヒント"],

//     　 contextMenu: true,
//      fixedRowsTop: 1,
//      dataSchema: {labelId: null,deleteFlg: null, id: null, /*mark: null, */targetDateStr: null, targetDayOfTheWeek: null, /*sectionName: null, */ind: null, projectHId: null, projectHName: null, projectMName: null, projectLName: null,
//       labelName: null, name: null, planHourStr: null, planTime: null, /*value: null, */resultTimeStr: null, resultStartTimeStr: null, resultEndTimeStr: null, /*limitDateStr: null, */comment: null, hint: null},
//      data: '',
      minSpareRows: 1,
      colWidths: colWidths,//[20,20,20,20,20,/*20,labelId*/50,25,25,50,100,100,100,70,250,20,50,/*50,*//*1,*/50,50,50,/*1,*/150/*,150*/],
      columns: columns,

      scrollH: 'auto',
      scrollV: 'auto',
      stretchH: 'hybrid', //actually you don't have to declare it because it is default
        width: function () {
          if (maxed && availableWidth === void 0) {
            calculateSize();
          }
          return maxed ? availableWidth : 400;
        },
        height: function () {
          if (maxed && availableHeight === void 0) {
            calculateSize();
          }
          return maxed ? availableHeight : 300;
        },
      horizontal: 'htJustify',
      vertical: 'htTop',
//        afterChange: function (change, source) {
//          if (source === 'loadData') {
//            return; //don't save this change
//          }
////          if (!autosave.checked) {
////            return;
////          }
//          clearTimeout(autosaveNotification);
//          ajax('/assets/json/save.json', 'GET', JSON.stringify({data: change}), function (data) {
//            exampleConsole.innerText  = 'Autosaved (' + change.length + ' ' + 'cell' + (change.length > 1 ? 's' : '') + ')';
//            autosaveNotification = setTimeout(function() {
//              exampleConsole.innerText ='Changes will be autosaved';
//            }, 1000);
//          });
//        }
    }

    /* ログ出力用  start */
    config['beforeValidate'] = function(value, row, prop, event, x, y) {
        console.log("beforeValidate:"+row);
        beforeValidateRow = row;
        beforeValidateProp = prop;
    }
    config['afterSelectionEnd'] = function(a, b, c, d) {
        console.log("afterSelectionEndBorders:"+a);
        afterSelectionEndRow = a;
        afterSelectionEndCol = b;
        beforeValidateRow = undefined;
        beforeValidateProp = undefined;
    }

    var hooks = Handsontable.hooks.getRegistered();

      hooks.forEach(function(hook) {
        var checked = '';

        if(hook !== 'modifyColWidth' &&
        hook !== 'modifyCol' &&
        hook !== 'modifyRow' &&
        hook !== 'beforeGetCellMeta' &&
        hook !== 'afterGetCellMeta'
        && hook !== 'beforeValidate'
//        && hook !== 'afterSelectionEndBorders'
        ) {
        //これコメント外すとログが表示されるようになる
//            config[hook] = function() {
//              log_events(hook, arguments);
//            }
        }
      });

      var start = (new Date()).getTime();
      var i = 0;
      var timer;
      var example1_events = document.getElementById("example1_events");

      function log_events(event, data) {
          var now = (new Date()).getTime(),
            diff = now - start,
            vals, str, div, text;

          vals = [
            i,
              "@" + numeral(diff / 1000).format('0.000'),
              "[" + event + "]"
          ];

          for (var d = 0; d < data.length; d++) {
            try {
              str = JSON.stringify(data[d]);
            }
            catch (e) {
              str = data[d].toString(); // JSON.stringify breaks on circular reference to a HTML node
            }

            if (str === void 0) {
              continue;
            }

            if (str.length > 20) {
              str = Object.prototype.toString.call(data[d]);
            }
            if (d < data.length - 1) {
              str += ',';
            }
            vals.push(str);
          }

          if (window.console) {
            console.log(i,
                "@" + numeral(diff / 1000).format('0.000'),
                "[" + event + "]",
              data);
          }
          i++;
      }
      /* ログ出力用  end */

hot = new Handsontable(container, config);
var commentsPlugin = hot.getPlugin('comments');


hot.updateSettings(
      {
        contextMenu: {
          callback: function (key, options) {
            var corners = hot.getSelected();
            if (key === 'about') {
            setTimeout(function () {
              //timeout is used to make sure the menu collapsed before alert is shown
              alert("This is a context menu with default and custom options mixed");
            }, 100);
            } else if (key === 'removeRow') {
            removeLine(corners, event);
            } else if (key === 'rowAbove') {
            addRowAbove(corners, event);
            } else if (key === 'rowBelow') {
            addRowBelow(corners, event);
            } else if (key === 'steps') {
            steps(corners, event);
//            } else if (key === 'timer') {
//            timerset(corners);
            } else if (key === 'moveToThisTask') {
            moveToThisTask(corners, event);
            } else if (key === 'setCurrentDate') {
            setCurrentDate(corners, event);
            } else if (key === 'setCurrentTime') {
            setCurrentTime(corners, event);
            } else if (key === 'copyLine') {
            copyLine(corners, event);
            } else if (key === 'queueJump') {
            queueJump(corners, event);
            } else if (key === 'copyLine') {
            copyLine(corners, event);
            } else if (key === 'checklist') {
            //checklistダイアログを上げる
            }
          },
          items: {
            "removeRow": {
            name: '(Ctrl + D)removeRow'
            },
            "rowAbove": {
            name: '(Ctrl + Alt + Q)addRowAbove'
            // disabled: function () {
              // //if first row, disable this option
              // return (hot.getSelected()[0] === 0);
            // }
            },
            "rowBelow": {
            name: '(Ctrl + Alt + A)addRowBelow'
            },
            "steps": {
            name: '(Ctrl + H)steps'
            },
            "timer": {
            name: '(Ctrl + T)timer'
            },
            "moveToThisTask": {
            name: '(Ctrl + G)moveToThisTask'
            },
            "copyLine": {
            name: '(Ctrl + R)copyLine'
            },
            "setCurrentDate": {
            name: '(Ctrl + ;)setCurrentDate'
            },
            "setCurrentTime": {
            name: '(Ctrl + :)setCurrentTime'
            },
            "queueJump": {
            name: '(Ctrl + I)queueJump'
            },
            "commentsAddEdit": {},
            "commentsRemove": {}
          }
          },
      }
);
var current_date;
//autocompleteの各種データ取得
  $.ajax({
    url: "/tasks/autocomplete_data",
//        data: hot.getDataAtRow(0),
    dataType: 'json',
    type: 'GET',
    success: function (res) {
//      hot.loadData(res);
      console.log(res);

    //autocomplete設定変更
    var columns = hot.getSettings().__proto__.columns;
//    var sectionArray = new Array();
//    console.log(res.section)
//    //設定変更 sections
//    for(var ind in res.section) {
//        console.log("ind:" + ind);
//        console.log("val:" + res.section[ind]);
//        sectionArray.push(res.section[ind]);
//    }
//    columns[8].source = sectionArray;

    //autocomplete設定変更 mode
    var modeArray = new Array();
    console.log(res.mode);
    let labelObj = res.mode;//labelObjにラベルに関する情報を保管しておく
    current_date = res.current_date;
    $('#current_date').html(current_date);
    for(let ind in res.mode) {
        console.log("ind:" + ind);
        console.log("val:" + res.mode[ind].name);
        modeArray.push(res.mode[ind].name);
        renderFuncArray[res.mode[ind].name] = getTaluuRenderer(res.mode[ind]);
    }
    columns[columnRow.labelName].source = function (query, process) {
                          var row = beforeValidateRow ? beforeValidateRow : afterSelectionEndRow;
                          if(beforeValidateRow == undefined || (query != "" && modeArray.length > 0)) {
                              var index = process(modeArray);
  //                            var val = hot.getDataAtCell(currentPosition[0], currentPosition[1] - 1);
                              console.log("ind:" + index); //リストの何番目を選んだか返す
                              if(index !== undefined) {
                                  console.log("labelId:" + labelObj[index]);
                                  console.log("row:" + row)
                                  hot.setDataAtRowProp(row, "labelId", labelObj[index].id);
                              }
                          } else {
                              process([""]);
                              hot.setDataAtRowProp(row, "labelId", "");
                          }
                      };


    //autocomplete設定変更 project
    var projectHArray = new Array();
    console.log(res.project);
    for(let ind in res.project) {
        console.log("ind:" + res.project[ind].id);
        console.log("val:" + res.project[ind].name);
        projectHArray.push(res.project[ind].name);
    }
    projectObj = res.project;//projectObjにプロジェクト情報を保管しておく

    //projectH
    columns[columnRow.projectHName].source = function (query, process) {
                            var row = beforeValidateRow ? beforeValidateRow : afterSelectionEndRow;
                            console.log(projectHArray);
                            if(beforeValidateRow == undefined || (query != "" && projectHArray.length > 0)) {
                                var index = process(projectHArray);
    //                            var val = hot.getDataAtCell(currentPosition[0], currentPosition[1] - 1);
                                console.log("ind:" + index); //リストの何番目を選んだか返す
                                if(index !== undefined) {
                                    console.log("projectHID:" + projectObj[index]);
                                    console.log("row:" + row)
                                    hot.setDataAtRowProp(row, "projectHId", projectObj[index].id);
                                }
                            } else {
                                process([""]);
                                hot.setDataAtRowProp(row, "projectHId", null);
                            }
                        };
    //projectM
    columns[columnRow.projectMName].source = function (query, process) {
                            //現在位置を取得
                            var row = beforeValidateRow ? beforeValidateRow : afterSelectionEndRow;
                            var projectHId = hot.getDataAtRowProp(row, "projectHId");
                            var projectMObj;
                            var projectMArray = new Array();
                            for (var ind in projectObj) {
                                if (projectObj[ind].id == projectHId) {//初回文字列なので注意
                                    projectMObj = projectObj[ind].children;
                                    break;
                                }
                            }
                            for (var ind in projectMObj) {
                                projectMArray.push(projectMObj[ind].name);
                            }
//                            console.log("projectMArray:");
//                            console.log(projectMArray);
//                            console.log("projectObj:");
//                            console.log(projectObj);
                            if (projectMObj && (beforeValidateRow == undefined || (query != "" && projectMArray.length > 0))) {
                                var index = process(projectMArray); //リストの何番目を選んだか返す
                                if(index !== undefined) {
                                    console.log("projectm:");
                                    console.log(projectMObj[index]);
                                    hot.setDataAtRowProp(row, "projectMId", projectMObj[index].id);
                                }
                            } else {
                                process([""]);
                                hot.setDataAtRowProp(row, "projectMId", null);
                            }
                        };
    //projectL
    columns[columnRow.projectLName].source = function (query, process) {
                            //現在位置を取得
                            var row = beforeValidateRow ? beforeValidateRow : afterSelectionEndRow;

                            var projectHId = hot.getDataAtRowProp(row, "projectHId");
                            var projectMId = hot.getDataAtRowProp(row, "projectMId");
//                            console.log("projectHId:" + projectHId)
//                            console.log("projectMId:" + projectMId)
                            var projectMObj;
                            var projectLObj;
                            for (var ind in projectObj) {
                                if (projectObj[ind].id == projectHId) {//初回文字列なので注意
                                    projectMObj = projectObj[ind].children;
                                    break;
                                }
                            }
                            for (var ind in projectMObj) {
                                if (projectMObj[ind].id == projectMId) {
                                    projectLObj = projectMObj[ind].children;
                                    break;
                                }
                            }
                            var projectLArray = new Array();
                            for (var ind in projectLObj) {
                                projectLArray.push(projectLObj[ind].name);
                            }
                            if (beforeValidateRow == undefined || (query != "" && projectLArray && projectLArray.length > 0)) {
                                var index = process(projectLArray); //リストの何番目を選んだか返す
                                console.log("index:"+index)
                                if(index !== undefined) {
                                    hot.setDataAtRowProp(row, "projectLId", projectLObj[index].id);
                                }
                            } else {
                                process([""]);
                                hot.setDataAtRowProp(row, "projectLId", null);
                            }
                        };

    //最終セット(cellは、modeから作成されたrendererができてからセット
    hot.updateSettings(
          {columns: columns,
          cells: function (row, col, prop) {
             var cellProperties = {};
             var labelName = hot.getDataAtRowProp(row, 'labelName');
             var deleteFlg = hot.getDataAtRowProp(row, 'deleteFlg');
             if (deleteFlg == '1') {
                cellProperties.renderer = deleteRenderer;
             } else if (renderFuncArray[labelName]) {
                cellProperties.renderer = renderFuncArray[labelName];
             } else {
                cellProperties.renderer = whiteRenderer;
             }
            return cellProperties;
          }
        }
    );
    console.log(hot.getSettings().__proto__.columns);

//      renderFuncArray.focus = function (instance, td, row, col, prop, value, cellProperties) {
//         taluuRenderer(instance, td, row, col, prop, value, cellProperties, mode);
//      }
      addComment();
      $console.text('setting loaded');
    },
    error: function () {
      $console.text('Load error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });

//コメント追加
function addComment() {
      _.each(hot.tmpResponseData, function(element, index, res) {
        console.log(element);
        if(element.hint && element.hint != "") {
//            var cell = hot.getCell(index,14);
//            var cellMeata = hot.getCellMeta(index, 14);
//            console.log(cell);
//            console.log(cellMeata);
//            cellMeata.comment = element.hint;
//            commentsPlugin.editor.createEditor();
//            commentsPlugin.showAtCell(index+0, 14);
            commentsPlugin.setRange({row: index, col: columnRow["hintCell"]});
            commentsPlugin.editor.setValue(element.hint);
            commentsPlugin.saveCommentAtCell(index, columnRow["hintCell"]);
//            commentsPlugin.editor.focus();
//            commentsPlugin.editor.refreshEditorPosition(true);
//            commentsPlugin.show();


//            commentsPlugin.showAtCell(index+1, 14);
//            commentsPlugin.editor.setValue(element[19]);
//            commentsPlugin.saveCommentAtCell(index+1, 14);

//            commentCells.push({row: index, col: 14, comment: element.hint});
        }
      });
      hot.tmpResponseData = undefined;
//      commentsPlugin.saveComment();

}
//データ読み込み
function loadData() {
  $.ajax({
    url: "/tasks/list/load",
//        data: hot.getDataAtRow(0),
    dataType: 'json',
    type: 'GET',
    success: function (res) {
      hot.loadData(res);
      hot.tmpResponseData = res;
      $console.text('Data loaded');
    },
    error: function () {
      $console.text('Load error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });
}
loadData();

/////////////////////処理関数 start-----------------------------------

function saveData() {
  console.log(hot.getData());
  console.log(JSON.stringify(hot.getData()));
  console.log(hot.getSourceData());
  console.log(JSON.stringify(hot.getSourceData()));
  $.ajax({
    async: false,
    url: "/tasks/list/save",
    data: '{"data": ' + JSON.stringify(hot.getSourceData()) + '}', //returns all cells' data
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: function (res) {
      hot.loadData(res);
      $console.text('Data saved.');
    },
    error: function () {
      $console.text('Save error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });
}
function goodday() {
  var today = encodeURI(document.getElementById('currentDate').value.split("/").join(""));
  $.ajax({
    async: false,
    url: "/tasks/list/goodday/" + today + "/"+ "@isPlanned" + "/" + "@isOneDay",
    data: '{"tasks":' + JSON.stringify(hot.getData()) + '}', //returns all cells' data
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: function (res) {
      hot.loadData(res);
      var currentDate = document.getElementById('currentDate');
      var val = currentDate.value.split('/');
      alert(val[0] + "/" + val[1] + "/" + val[2]);
      currentDate.value = new XDate(val[0],val[1]-1,val[2]).addDays(1).toString('yyyy/MM/dd');
      $console.text('Data saved');
    },
    error: function () {
      $console.text('Save error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });
}
function garapon() {
  var today = new Date();
  $.ajax({
    async: false,
    url: "/tasks/list/garapon",
    data: '{"tasks":' + JSON.stringify(hot.getData()) + '}', //returns all cells' data
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: function (res) {
      hot.loadData(res);
      var currentDate = document.getElementById('currentDate');
      var val = currentDate.value.split('/');
      alert(val[0] + "/" + val[1] + "/" + val[2]);
      currentDate.value = new XDate(val[0],val[1]-1,val[2]).addDays(1).toString('yyyy/MM/dd');
      $console.text('Data saved');
    },
    error: function () {
      $console.text('Save error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });
}
function exportTasks() {
  $("#exportTask").submit();
}
function lastday() {
  var today = encodeURI(document.getElementById('currentDate').value.split("/").join(""));
  $.ajax({
    async: false,
    url: "/tasks/list/lastday/" + today + "/"+ "@isPlanned" + "/" + "@isOneDay",
    data: '{"tasks":' + JSON.stringify(hot.getData()) + '}', //returns all cells' data
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: function (res) {
      hot.loadData(res);
      var currentDate = document.getElementById('currentDate');
      var val = currentDate.value.split('/');
      currentDate.value = new XDate(val[0],val[1]-1,val[2]).addDays(-1).toString('yyyy/MM/dd');
      $console.text('Data saved');
    },
    error: function () {
      $console.text('Save error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });
}
function tommorow() {
  var today = encodeURI(document.getElementById('currentDate').value.split("/").join(""));
  $.ajax({
    async: false,
    url: "/tasks/list/tommorow/" + today + "/"+ "@isPlanned" + "/" + "@isOneDay",
    data: '{"tasks":' + JSON.stringify(hot.getData()) + '}', //returns all cells' data
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: function (res) {
      hot.loadData(res);
      var currentDate = document.getElementById('currentDate');
      var val = currentDate.value.split('/');
      currentDate.value = new XDate(val[0],val[1]-1,val[2]).addDays(1).toString('yyyy/MM/dd');
      $console.text('Data saved');
    },
    error: function () {
      $console.text('Save error. POST method is not allowed on GitHub Pages. Run this example on your own server to see the success message.');
    }
  });
}
function setToday() {
  var date = new Date();
  var dateFormat = new DateFormat("yyyy/MM/dd");
  document.getElementById('currentDate').value=dateFormat.format(date);
}
function saveAndLoadChecklist() {
  var taskId = document.checklistForm.checklist_taskId.value;
  var checklistId = document.checklistForm.checklist_template.value;
  $.ajax({
      url: '/api/taskcheckresult/createFromTemplate',
      data: 'checklist_id=' + checklistId + '&taskId=' + taskId,
    cache: false,
      type: 'GET',
      success: function (res) {
      $("#checklistField").html(res)
      },
      error: function () {
        alert("error!");
      }
    });
}
function addRowBelow(corners, event) {
          if(!corners) {
            return; //needed when there are 2 grids on a page
          }
        hot.alter("insert_row", corners[0]+1);
        setTimeout(function(){
              for (var i = 0; i < allColumns.length; i++) {
                  var value = hot.getDataAtRowProp(corners[0], allColumns[i].data);

                  if ('targetDate' == allColumns[i].data) {
                      hot.setDataAtRowProp(corners[0]+1, allColumns[i].data, current_date);
                  } else if(value && allColumns[i].setAtAddRow) {
                      hot.setDataAtRowProp(corners[0]+1, allColumns[i].data, value);
                  }
              }
            }, 100);
        event.preventDefault();
        event.altKey = false; //ctlr keyのみだと、その後のセル選択をスルーできるため、あえてaltkeyをoffにする
}
function addRowAbove(corners, event) {
          if(!corners) {
            return; //needed when there are 2 grids on a page
          }
        hot.alter("insert_row", corners[0]);
        setTimeout(function(){
              for (var i = 0; i < allColumns.length; i++) {
                  var value = hot.getDataAtRowProp(corners[0] + 1, allColumns[i].data);

                  if ('targetDate' == allColumns[i].data) {
                      hot.setDataAtRowProp(corners[0], allColumns[i].data, current_date);
                  } else if(value && allColumns[i].setAtAddRow) {
                    hot.setDataAtRowProp(corners[0], allColumns[i].data, value);
                  }
              }
           // self.forceFullRender = true; //used when data was changed
            //selection.refreshBorders();
            }, 100);
        event.preventDefault();
        event.altKey = false; //ctlr keyのみだと、その後のセル選択をスルーできるため、あえてaltkeyをoffにする
}
function moveToThisTask(corners, event) {
        var firstStartTimeStr = 'dummy';
        var firstBlankRow = 0;
        var maxrowSize = hot.countRows();
        for (; firstBlankRow <= maxrowSize && firstStartTimeStr != ''; firstBlankRow++) {
          firstStartTimeStr = hot.getDataAtRowProp(firstBlankRow, 'resultStartTimeStr');
        }
        if (firstStartTimeStr == '') {
          hot.selectCellByProp(firstBlankRow-1, 'resultStartTimeStr', firstBlankRow-1, 'resultStartTimeStr',true);
        }
        event.preventDefault();
}
function steps(corners, event) {
        if(!corners) {
          return; //needed when there are 2 grids on a page
        }
        var col = corners[0];
        var rowname = columns[corners[1]].data;
        if (rowname == 'resultStartTimeStr') { //この行より前で、かつ一番近い終了時間があればセットする
          var lastEndTimeStr = ''
          for (var i = col - 1; i >= 0 && lastEndTimeStr == ''; i--) {
            lastEndTimeStr = hot.getDataAtRowProp(i, 'resultEndTimeStr');
          }
          if (lastEndTimeStr != '') {
            hot.setDataAtRowProp(col, rowname, lastEndTimeStr);
//            self.forceFullRender = true; //used when data was changed
//            selection.refreshBorders();
            //終了時刻に移動
            hot.selectCellByProp(corners[0], 'resultEndTimeStr', corners[0], 'resultEndTimeStr',true);
          }
        }
        else if (rowname == 'resultEndTimeStr') {
                setCurrentTime(corners, event);
                //次の行の開始時刻に移動
          hot.selectCellByProp(corners[0] + 1, 'resultStartTimeStr', corners[0] + 1, 'resultStartTimeStr',true);
        }
        else { //開始時刻のセルに移動する
          hot.selectCellByProp(corners[0], 'resultStartTimeStr', corners[0], 'resultStartTimeStr',true);
        }
        event.preventDefault();
}
function timerset(corners) {
  if (!timerEndTime) {
    //現在の開始時刻をセット。終了時刻が入っていないタスクで、現在時刻がタスク内にあるもの（かつ一番最初のもの）
        if(!corners) {
          return; //needed when there are 2 grids on a page
        }
        var col = corners[0];
        var rowname = columns[corners[1]].data;
        //開始時刻、予定時間を取得
        var startTimeStr = hot.getDataAtRowProp(col, 'resultStartTimeStr');
        var planMinuiteStr = hot.getDataAtRowProp(col, 'planTime');

      if (startTimeStr && planMinuiteStr) {
        var cur = $('#currentDate').val().split('/');
        //console.log(cur);
          var str = startTimeStr.split(':');
        //console.log(str);
        timerEndTime = new XDate(cur[0],cur[1]-1,cur[2]).addHours(str[0]).addMinutes(str[1]).addMinutes(planMinuiteStr);
        console.log(timerEndTime);
          startTimer();
       }
  } else {
    stopTimer();
    timerEndTime = null;
    $("title").text("taluu");
  }
}
function setCurrentDate(corners, event) {
    if(!corners) {
      return; //needed when there are 2 grids on a page
    }
    var date = new Date();
    var dateFormat = new DateFormat("yyyy/MM/dd");
    var dateStr = dateFormat.format(date);
    for (var col = corners[0]; col <=corners[2]; col++) {
      for (var row = corners[1]; row <= corners[3]; row++) {
        if (columns[row].data == 'targetDateStr') {
          hot.setDataAtRowProp(col, columns[row].data, dateStr);
        }
      }
    }
    event.preventDefault();
}
function setCurrentTime(corners, event) {
  if(!corners) {
    return; //needed when there are 2 grids on a page
  }
  var currentDateArray = document.getElementById('currentDate').value.split('/');
  var date = new Date();
  var currentDate = new Date(Number(currentDateArray[0]),Number(currentDateArray[1])-1,Number(currentDateArray[2]));
  var nowDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var difDate = (nowDate.getTime() - currentDate.getTime()) / (1000*60*60*24);

  var dateStr = (date.getHours()+24*difDate) + ':' + (date.getMinutes());
  for (var col = corners[0]; col <=corners[2]; col++) {
    for (var row = corners[1]; row <= corners[3]; row++) {
      if (columns[row].data == 'resultStartTimeStr' || columns[row].data == 'resultEndTimeStr') {
        hot.setDataAtRowProp(col, columns[row].data, dateStr);
      }
    }
  }
  event.preventDefault();
}
function removeLine(corners, event) {
    if(!corners) {
      return; //needed when there are 2 grids on a page
    }
    //現在行に、削除フラグを立てる
    for (var i = corners[0]; i <= corners[2]; i++) {
    if (hot.getDataAtRowProp(i, 'deleteFlg') == '1') {
      hot.setDataAtRowProp(i, 'deleteFlg', 0)
    } else {
      hot.setDataAtRowProp(i, 'deleteFlg', 1)
    }
  }
  //行を削除すると、削除対象の行がjavaに送られないため物理削除しない
    // hot.alter("remove_row", corners[0], corners[2]);
    event.preventDefault();
    event.altKey = false; //ctlr keyのみだと、その後のセル選択をスルーできるため、あえてaltkeyをoffにする
}
function copyLine(corners, event) {
    if(!corners) {
      return; //needed when there are 2 grids on a page
    }
    var bool = hot.alter("insert_row", corners[0] + 1);
    setTimeout(function(){
          for (var i = 0; i < allColumns.length; i++) {
            var value = hot.getDataAtRowProp(corners[0], allColumns[i].data);
            if(value && allColumns[i].setAtCopyRow) {
              hot.setDataAtRowProp(corners[0] + 1, allColumns[i].data, value);
            }
          }
      }, 100);
    event.preventDefault();
//    event.altKey = false; //ctlr keyのみだと、その後のセル選択をスルーできるため、あえてaltkeyをoffにする
//    event["altKey"] = false;
//    alert('in list.scala event.ctrlKey:'+event.ctrlKey+',event.metaKey:'+event.metaKey+',event.altKey:'+event.altKey);
}
function queueJump(corners, event) {
    if(!corners) {
      return; //needed when there are 2 grids on a page
    }
    var col = corners[0];
    var newTasktime = 0;
    //plantime(minuite)を取得
    var plantime = hot.getDataAtRowProp(col, 'planTime');

    //終了時刻に移動し、現在時刻セット
    hot.selectCellByProp(corners[0], 'resultEndTimeStr', corners[0], 'resultEndTimeStr',true);
    corners = hot.getSelected();
    var endtime = hot.getDataAtRowProp(col, 'resultEndTimeStr');

    if (endtime == '') {
      setCurrentTime(corners, event);
    }
      //予定時刻から現在までかかった時間を引いた時間を算出、実績時刻をセット
      var starttime = hot.getDataAtRowProp(col, 'resultStartTimeStr');
      endtime = hot.getDataAtRowProp(col, 'resultEndTimeStr');
      if (starttime && starttime != '') {
      var starttimeH = Number(starttime.substring(0, starttime.indexOf(':')));
      var starttimeM = Number(starttime.substring(starttime.indexOf(':') + 1));
      var endtimeH = Number(endtime.substring(0, endtime.indexOf(':')));
      var endtimeM = Number(endtime.substring(endtime.indexOf(':') + 1));
      var resultTime = (endtimeH * 60 + endtimeM) - (starttimeH * 60 + starttimeM);
//      alert(resultTime);
      //予定時刻を実績が超えていなければ、予定時刻を実績時間で更新
//      alert("plantime:" + plantime + "," + "resultTime:" + resultTime);
      if (plantime > resultTime) {
        alert(plantime - resultTime);
        newTasktime = plantime - resultTime
        //hot.setDataAtRowProp(plantime, 'planTime');
        hot.setDataAtRowProp(corners[0], 'planTime', resultTime);
        //hot.setDataAtRowProp(col, 'planTime', plantime);
      }
    }

        //次の行の開始時刻に移動
      hot.selectCellByProp(corners[0] + 1, 'resultStartTimeStr', corners[0] + 1, 'resultStartTimeStr',true);

    var bool = hot.alter("insert_row", corners[0] + 1);
    setTimeout(function(){
            for (var i = 0; i < columns.length; i++) {
            var value = hot.getDataAtRowProp(corners[0], columns[i].data);
            if(value && 'id' != columns[i].data && 'deleteFlg' != columns[i].data &&
              'resultMinuiteStr' != columns[i].data && 'resultStartTimeStr' != columns[i].data &&
              'resultEndTimeStr' != columns[i].data ) {
                if (columns[i].data == 'planTime') {
              hot.setDataAtRowProp(corners[0] + 1, columns[i].data, newTasktime);
              } else {
              hot.setDataAtRowProp(corners[0] + 1, columns[i].data, value);
            }
            }
            }
        }, 100);

    event.preventDefault();
  　　event.altKey = false; //ctlr keyのみだと、その後のセル選択をスルーできるため、あえてaltkeyをoffにする
}
/////////////////////処理関数 end-----------------------------------

//@for(mode <- modeList) {
//  renderFuncArray.@mode.name = function (instance, td, row, col, prop, value, cellProperties) {
//    Handsontable.renderers.TextRenderer.apply(this, arguments);
//    td.style.color = '@if(mode.color==None){black} else {#@util.ColorUtil.getFontColor(mode.color.get)}'
//    td.style.backgroundColor = '@if(mode.color==None) {white} else {#@mode.color}';
//
//    //タスクの時間の大きさによる文字size、heightの調整
//    if (prop == 'planTime' || planTime == 'planHourStr') {
//      var planTime = hot.getDataAtCell(row, 'planTime');
//      var size = 100;
//      var height = $(td).height();
//      if (planTime < 15) {
//        size = 50;
//      } else if (planTime >= 15 && planTime < 30) {
//        size = 75;
//      } else if (planTime >= 30 && planTime < 60) {
//        size = 100;
//      } else if (planTime >= 60 && planTime < 120) {
//        size = 150;
//      } else if (planTime >= 120) {
//        size = 200;
//      }
//    td.style.fontSize = size+"%";
//    td.style.height = (height * size / 100);
//    }
//    if (prop == 'resultMinuiteStr' || planTime == 'resultStartTimeStr' || planTime == 'resultEndTimeStr') {
//      var resultMinuiteStr = hot.getDataAtCell(row, 'resultMinuiteStr');
//      var size = 100;
//      if (resultMinuiteStr < 15) {
//        size = 50;
//      } else if (resultMinuiteStr >= 15 && resultMinuiteStr < 30) {
//        size = 75;
//      } else if (resultMinuiteStr >= 30 && resultMinuiteStr < 60) {
//        size = 100;
//      } else if (resultMinuiteStr >= 60 && resultMinuiteStr < 120) {
//        size = 150;
//      } else if (resultMinuiteStr >= 120) {
//        size = 200;
//      }
//          td.style.fontSize = size+"%";
//    }
//    Handsontable.renderers.TextRenderer.apply(this, planRender(arguments));
//  };
//}

var whiteRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  td.style.backgroundColor = 'white';
  Handsontable.renderers.TextRenderer.apply(this, planRender(arguments));
};

var deleteRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  td.style.color = 'white';
  td.style.backgroundColor = '#434343';
  Handsontable.renderers.TextRenderer.apply(this, planRender(arguments));
};

$(document).ready(function () {
    let lastChange;

     $('button[name=load]').click(function () {
       loadData();
     });
     $('button[name=save]').click(function () {
       saveData();
     });
     $('button[name=addComment]').click(function () {
       addComment();
     });

    hot.updateSettings({
    beforeChange: function (changes, source) {
      lastChange = changes;
    },

      beforeKeyDown: function (event) {
      const corners = hot.getSelected();

//start CTRL + ALT +  ........
        const ctrlShiftDown = (event.ctrlKey || event.metaKey) && event.altKey;
        const ctrlDown = (event.ctrlKey || event.metaKey) && !event.altKey; //catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)
        if (Handsontable.helper.isPrintableChar(event.keyCode) && ctrlShiftDown) {
          if (event.keyCode === 68) { //CTRL + Alt + D remove line
              removeLine(corners, event);
          }
          else if (event.keyCode === 81) { //CTRL + Alt + Q add row below
              addRowAbove(corners, event);
          }
          else if (event.keyCode === 65) { //CTRL + Alt + A add row below
              addRowBelow(corners, event);
          }
          else if (event.keyCode === 82) { //CTRL + Alt + R copy line
        copyLine(corners, event);
          } else {
      event.preventDefault();
      event.stopPropagation();
      }

//end   CTRL + ALT +  ........
//start CTRL + ........
       } else if (Handsontable.helper.isPrintableChar(event.keyCode) && ctrlDown) {

            if (event.keyCode === 83) { //CTRL + S
            event.keyCode = 0; //firefoxの保存を効かなくする
              saveData();
              //alert('saved.');
             event.preventDefault();
             event.stopPropagation();
             }
            else if (event.keyCode === 82) { //CTRL + R (リロード防止)
        event.preventDefault();
            }
            else if (event.keyCode === 72) { //CTRL + H (直近の完了時刻を開始時刻にセット。予定通りの時間セット機能は未実装)
        steps(corners, event);
            }
//            else if (event.keyCode === 84) { //CTRL + T　(Timerスタート、終了)
//              alert('start!');
//        timerset(corners);
//            }
//////////////////////add start20140309---
            else if (event.keyCode === 73) { //CTRL + I (割り込み)
              queueJump(corners, event);
            }
//////////////////////add end20140309---
            else if (event.keyCode === 71) { //CTRL + G (最初の未完了タスクの開始時刻にセルを移動)
              moveToThisTask(corners, event);
            }
            else if (event.keyCode === 187) { //CTRL + ;
              setCurrentDate(corners, event);
            }
             else if (event.keyCode === 186) { //CTRL + :
              setCurrentTime(corners, event);
            }

          } else {
//          if (event.keyCode === Handsontable.helper.keyCode.BACKSPACE
//                || Handsontable.helper.keyCode.DELETE) { //Backspace or Delete
//          if(!corners) {
//            return; //needed when there are 2 grids on a page
//          }
//          for (var col = corners[0]; col <=corners[2]; col++) {
//            for (var row = corners[1]; row <= corners[3]; row++) {
//              hot.setDataAtRowProp(col, columns[row].data, '', 'notRender');
//            }
//          }
//                event.preventDefault();
//            }
          }

      lastChange = null;
      },

      afterChange: function (change, source) {
          console.log("changed!!");
          console.log(change);
          console.log(source);
          if (source === 'loadData') {
            return; //don't save this change
          }
//          if ($parent.find('input[name=autosave]').is(':checked')) {
            var changeMap = {};

            for(let i=0,j=change.length; i<j; i++){
              var rownum = change[i][0];
              var column = change[i][1];
              var before = change[i][2];
              var after = change[i][3];
              if (after != before) {
                if (column == "labelName") {
                  beforeValidateRow = rownum;
                } else if(column == "planTimeStr" && after) {
                  //時刻表示をXX:XXの形に自動調整
//                  var afterChange = numericZentohan(after);
                  var res = /^\d*(\:)?\d*$/.test(after);
                  if(res) {
                    var hour=0,minuite = 0;
                    if(after.indexOf(':')>0) {
                      var hm = after.split(':');
                      hour = parseInt(hm[0]) + Math.floor(hm[1]/60);
                      minuite = hm[1]%60;
                    } else {
                      hour = Math.floor(after/60);
                      minuite = after%60;
                    }
                    hot.setDataAtRowProp(rownum, column, hour+":"+("0"+minuite).slice(-2));
                  }
                } else if (column == "resultStartTimeStr" || column == "resultEndTimeStr") {
                  if (after) {
                      //時刻表示をXX:XXの形に自動調整
                      var res = /^\d*(\:)?\d*$/.test(after);
                      if(res) {
                        var hour=0,minuite = 0;
                        if(after.indexOf(':')>0) {
                          var hm = after.split(':');
                          hour = parseInt(hm[0]) + Math.floor(hm[1]/60);
                          minuite = hm[1]%60;
                        } else {
                          hour = Math.floor(after/60);
                          minuite = after%60;
                        }
                        hot.setDataAtRowProp(rownum, column, hour+":"+("0"+minuite).slice(-2));
                      }
                  }

                  var starttime, endtime;
                  if(column == "resultStartTimeStr") {
                    starttime = after;
                    endtime = hot.getDataAtRowProp(rownum, 'resultEndTimeStr');
                  } else if(column == "resultEndTimeStr") {
                    endtime = after;
                    starttime = hot.getDataAtRowProp(rownum, 'resultStartTimeStr');
                  }

//                    console.log('starttime:' + starttime);
//                    console.log('endtime:' + endtime);
//                    console.log(starttime);
//                    console.log(starttime != '');
//                    console.log(endtime);
//                    console.log(endtime != '');

//                    console.log(starttime);
//                    console.log(endtime);

                    //終了時刻変更時、実績時間自動セット
                    if (starttime && starttime != '' && endtime && endtime != '') {
                      var starttimeH = Number(starttime.substring(0, starttime.indexOf(':')));
                      var starttimeM = Number(starttime.substring(starttime.indexOf(':') + 1));

                      var endtimeH = Number(endtime.substring(0, endtime.indexOf(':')));
                      var endtimeM = Number(endtime.substring(endtime.indexOf(':') + 1));
                      var resultTime = (endtimeH * 60 + endtimeM) - (starttimeH * 60 + starttimeM);

//                      console.log(starttimeH);
//                      console.log(starttimeM);
//                      console.log(endtimeH);
//                      console.log(endtimeM);
//                      console.log(resultTime);
                      if(!isNaN(resultTime)) {
                        if(resultTime < 0) {
                          resultTime = -resultTime;
                          hot.setDataAtRowProp(rownum, 'resultStartTimeStr', endtime);
                          hot.setDataAtRowProp(rownum, 'resultEndTimeStr', starttime);
                        }
                        hot.setDataAtRowProp(rownum, 'resultTimeStr', resultTime);
                      }
                    } else {
                      hot.setDataAtRowProp(rownum, 'resultTimeStr', null);
                    }


                } else if (column == "projectHName") {
                  //changedProjectHRow = rownum;
                  //後ろのプロジェクトをクリア
                  beforeValidateRow = rownum;
                  hot.setDataAtRowProp(rownum, "projectMName", "");
                  hot.setDataAtRowProp(rownum, "projectLName", "");
                  hot.setDataAtRowProp(rownum, "projectMId", null);
                  hot.setDataAtRowProp(rownum, "projectLId", null);
                } else if (column == "projectMName") {
                  beforeValidateRow = rownum;
                  beforeValidateRow = change[0];
                  hot.setDataAtRowProp(rownum, "projectLName", "");
                  hot.setDataAtRowProp(rownum, "projectLId", null);
                } else if (column == "projectLName") {
                  beforeValidateRow = rownum;
                  changedProjectLRow = rownum;
                } else if (column == "ind") {
                  var afterChanged = numericZentohan(after);
                  if(after != afterChanged) {
                    hot.setDataAtRowProp(rownum, column, afterChanged);
                    after = afterChanged;
                  }
                } else if (column == "targetDateStr") {
                  var afterChanged = numericZentohan(after);
                  if(after != afterChanged) {
                    hot.setDataAtRowProp(rownum, column, afterChanged);
                    after = afterChanged;
                  }
                  //曜日自動セット
                  var targetDate = Date.parse(after);
                  hot.setDataAtRowProp(rownum, 'targetDayOfTheWeek', w[new Date(targetDate).getDay()]);
                } else if (column == "planHourStr") {
                  var afterChanged = numericZentohan(after);
                  if(after != afterChanged) {
                    hot.setDataAtRowProp(rownum, column, afterChanged);
                    after = afterChanged;
                  }
                  //予定時間→予定分 自動セット
                  var planHNum = Number(after);
                  hot.setDataAtRowProp(rownum, 'planTime', (planHNum*60).toFixed(0));
                } else if (column == "planTime") {
                  var afterChanged = numericZentohan(after);
                  if(after != afterChanged) {
                    hot.setDataAtRowProp(rownum, column, afterChanged);
                    after = afterChanged;
                  }
                  //予定分→予定時間 自動セット
                  var planTime = Number(after);
                  hot.setDataAtRowProp(rownum, 'planHourStr', (planTime/60).toFixed(2));
//                } else if (column == "resultEndTimeStr") {
//                  var afterChanged = numericZentohan(after);
//                  if(after != afterChanged) {
//                    hot.setDataAtRowProp(rownum, column, afterChanged);
//                    after = afterChanged;
//                  }
//                  //終了時刻変更時、実績時間自動セット
//                  var starttime = hot.getDataAtRowProp(rownum, 'resultStartTimeStr');
//                  if (starttime && starttime != '') {
//                    var starttimeH = Number(starttime.substring(0, starttime.indexOf(':')));
//                    var starttimeM = Number(starttime.substring(starttime.indexOf(':') + 1));
//
//                    var endtimeH = Number(after.substring(0, after.indexOf(':')));
//                    var endtimeM = Number(after.substring(after.indexOf(':') + 1));
//                    var resultTime = (endtimeH * 60 + endtimeM) - (starttimeH * 60 + starttimeM);
//                    hot.setDataAtRowProp(rownum, 'resultMinuiteStr', resultTime);
//                  }
//                } else if (column == "resultStartTimeStr") {
//                  var afterChanged = numericZentohan(after);
//                  if(after != afterChanged) {
//                    hot.setDataAtRowProp(rownum, column, afterChanged);
//                    after = afterChanged;
//                  }
//                  //終了時刻変更時、実績時間自動セット
//                  if (after && after != '') {
//                    var starttimeH = Number(after.substring(0, after.indexOf(':')));
//                    var starttimeM = Number(after.substring(after.indexOf(':') + 1));
//                    var endtime = hot.getDataAtRowProp(rownum, 'resultEndTimeStr');
//                    if (endtime && endtime != '') {
//                      var endtimeH = Number(endtime.substring(0, endtime.indexOf(':')));
//                      var endtimeM = Number(endtime.substring(endtime.indexOf(':') + 1));
//                      var resultTime = (endtimeH * 60 + endtimeM) - (starttimeH * 60 + starttimeM);
//                      hot.setDataAtRowProp(rownum, 'resultMinuiteStr', resultTime);
//                    }
//                  }
                }
              }
              var beforeAfter = {"before": change[i][2], "after": change[i][3]};
              if (changeMap[change[i][0]] == null) {
                var obj = {};
                obj[change[i][1]] = beforeAfter;
                changeMap[change[i][0]] = obj;
              } else {
                changeMap[change[i][0]][change[i][1]] = beforeAfter;
              }
            };
            //changeをjson形式に整形
            clearTimeout(autosaveNotification);
//          }
        }


     }
    );
});

function myAutocompleteRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.AutocompleteCell.renderer.apply(this, arguments);
  td.style.fontStyle = 'italic';
  td.title = 'Type to show the list of options';
}
