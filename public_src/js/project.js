const Sortable = require('../../node_modules/sortablejs/Sortable.min.js');
// const Sortable = require('../nochk_js/Sortable_custmized.js');

const hideChildren = function(list) {
  const rootLevel = $(list).hasClass('parent_second_level') ? 2 :
              $(list).hasClass('parent_third_level') ? 3 : 1;
  const lists = $("#project-table").children('.project-table-box');
  for (let ind = 0, findFirst = false; ind < lists.length; ind++) {
    if (!findFirst) {
      findFirst = $(lists[ind]).attr('project-id') == $(list).attr('project-id');
    } else {
      const level = $(lists[ind]).find('.parent_second_level')[0] ? 2 :
                  $(lists[ind]).find('.parent_third_level')[0] ? 3 : 1;
      if (rootLevel >= level) {
        break;
      } else {
        $(lists[ind]).hide();
      }
    }
  }
}
const showChildren = function() {
  const lists = $("#project-table").children('.project-table-box');
  for (let ind = 0; ind < lists.length; ind++) {
    $(lists[ind]).show();
  }
}

Sortable.create(document.getElementById('project-table'), {
    animation: 150,
    scrollSensitivity: 10,
    // handle: ".project-table__list",
    ghostClass: 'sortable-ghost',
    draggable: ".project-table-box",
    group: {
      name: 'projects',
      put: ['projects-archived']
    },
    onStart: function (/**Event*/evt) {
        evt.oldIndex;  // element index within parent
        console.log('start!');

        //紐付くプロジェクトが存在する場合、全て隠す
        hideChildren(evt.item);
        // console.log(evt);
    },
    onEnd: function (/**Event*/evt) {
        evt.oldIndex;  // element's old index within parent
        evt.newIndex;  // element's new index within parent

        const itemEl = evt.item;  // dragged HTMLElement
        const child = $(itemEl).children('.project-table__list')[0];

        console.log($(child).hasClass('second_level'));
        console.log($(child).hasClass('third_level'));

        if ($(child).hasClass('second_level')) {
          $(child).addClass('parent_second_level');
          $(child).removeClass('parent_third_level');

        } else if ($(child).hasClass('third_level')) {
          $(child).removeClass('parent_second_level');
          $(child).addClass('parent_third_level');

        } else {
          $(child).removeClass('parent_second_level');
          $(child).removeClass('parent_third_level');
        }

        //紐付くプロジェクトが存在する場合、全て再表示する
        showChildren();
    },
    onUpdate: function (/**Event*/evt) {
      // + indexes from onEnd
      // console.log($(this).parents('project-tables'));
      // updateIndex();
    },
    onAdd: function (/**Event*/evt) {
      // updateIndex();
    },
    onFilter: function (/**Event*/evt) {
        var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
        // console.log('onFilter!!!!!');
        // console.log(itemEl);
    },

    // Event when you move an item in the list or between lists
    onMove: function (/**Event*/evt) {
        // Example: http://jsbin.com/tuyafe/1/edit?js,output
        evt.dragged; // dragged HTMLElement
        evt.draggedRect; // TextRectangle {left, top, right и bottom}
        evt.related; // HTMLElement on which have guided
        evt.relatedRect; // TextRectangle
        // return false; — for cancel
    }
  }
);
Sortable.utils.on(document.getElementById('project-table'), 'dragover', function(evt) {
  // console.log(evt);
  // console.log($(evt.target).parents('.project-table__list')[0]);
  var rect = evt.target.getBoundingClientRect() ;
  // console.log('clientX:' + (evt.clientX - rect.left) + ', pageX:' + (evt.pageX - rect.left) + ', x:' + (evt.x - rect.left) + ', clientX:' + (evt.clientX - rect.left));
  // console.log(rect.left);

  let positionX = 0, parentElm = null;

  // if(parentElm = $(evt.target).parents('.project-table__list')[0]) {
  //   //子供がtarget
  //   console.log(evt.clientX);
  //   positionX = evt.clientX;
  // } else {
  //   //親自身がtarget
  //   var rect = evt.target.getBoundingClientRect() ;
  //   console.log(evt.clientX - rect.left);
  //   // $(evt.target).parents('.project-table__list')[0];
  //   positionX = evt.clientX - rect.left;
  //   parentElm = evt.target ;
  // }
  //
  // if (positionX < 50) {
  //   $(parentElm).removeClass('second_level');
  //   $(parentElm).removeClass('third_level');
  // } else if (positionX >= 50 && positionX < 100) {
  //   $(parentElm).addClass('second_level');
  //   $(parentElm).removeClass('third_level');
  // } else if (positionX >= 100) {
  //   $(parentElm).removeClass('second_level');
  //   $(parentElm).addClass('third_level');
  // } else {
  //   $(parentElm).removeClass('second_level');
  //   $(parentElm).removeClass('third_level');
  // }

  // console.log('clientX:' + evt.clientX + ', offsetX:' + evt.offsetX + ', pageX:' + evt.pageX + ', screenX:' + evt.screenX + ', x:' + evt.x + ', clientX:' + evt.clientX);
  // cosole.log(evt.target);
  console.log("parent: " + $(evt.target).parents('.project-table__list')[0] + "children: " + $(evt.target).children('.project-table__list')[0])
  if($(evt.target).parents('.project-table__list')[0]) {
    parentElm = $(evt.target).parents('.project-table__list')[0];
  } else if ($(evt.target).children('.project-table__list')[0]){
    parentElm = $(evt.target).children('.project-table__list')[0];
  } else {
    parentElm = evt.target;
  }

  if (evt.clientX < 100) {
    $(parentElm).removeClass('second_level');
    $(parentElm).removeClass('third_level');
  } else if (evt.clientX >= 100 && evt.clientX < 150) {
    $(parentElm).addClass('second_level');
    $(parentElm).removeClass('third_level');
  } else if (evt.clientX >= 150) {
    $(parentElm).removeClass('second_level');
    $(parentElm).addClass('third_level');
  } else {
    $(parentElm).removeClass('second_level');
    $(parentElm).removeClass('third_level');
  }
  //$($(evt.target).parents('.project-table__list')[0]).addClass('')
});

Sortable.create(document.getElementById('project-table-archived-sorted'), {
    animation: 150,
     handle: ".project-table__handle",
     ghostClass: 'sortable-ghost',
    group: {
     name: 'projects-archived',
     put: ['projects']
   },
   onAdd: function (/**Event*/evt) {
     const itemEl = evt.item;  // dragged HTMLElement
    //  console.log(evt);
    //  console.log(itemEl);
    //  $.ajax(jsRoutes.controllers.projectAuthController.updateArchived($(itemEl).attr('project-id')));
   }
  }
);

// マウスイベントを設定
// var mouseEvent = function( e ) {
// 	// 動作を停止
// 	// e.preventDefault() ;
//
// 	// マウス位置を取得する
// 	var mouseX = e.pageX ;	// X座標
// 	var mouseY = e.pageY ;	// Y座標
//
// 	// 要素の位置を取得
// 	var element = document.getElementById( "project-table" ) ;
// 	var rect = element.getBoundingClientRect() ;
//
// 	// 要素の位置座標を計算
// 	var positionX = rect.left + window.pageXOffset ;	// 要素のX座標
// 	var positionY = rect.top + window.pageYOffset ;	// 要素のY座標
//
// 	// 要素の左上からの距離を計算
// 	var offsetX = mouseX - positionX ;
// 	var offsetY = mouseY - positionY ;
//
// 	// 結果の書き出し
// 	xElement.textContent = Math.floor( offsetX ) ;
// 	yElement.textContent = Math.floor( offsetY ) ;
// }

// イベントの設定
// var element = document.getElementById( "project-table" ) ;
// // element.addEventListener( "click", mouseEvent ) ;
// element.addEventListener( "mousemove", mouseEvent ) ;
// $(window).mousemove( 'sortable-chosen', function(evt) {
//   var client_pos = "clientX: " + evt.clientX + " / " + "clientY: " + evt.clientY + "<br />";
//   var page_pos = "pageX: " + evt.pageX + " / " + "pageY: " + evt.pageY + "<br />";
//   var offset_pos = "offsetX: " + evt.offsetX + " / " + "offsetY: " + evt.offsetY + "<br />";
//   var screen_pos = "screenX: " + evt.screenX + " / " + "screenY: " + evt.screenY + "<br />";
//   var window_size = "window width: " + $(window).width() + " / " + "window height: " + $(window).height() + "<br />";
//   var document_size = "document width: " + $(document).width() + " / " + "document height: " + $(document).height() + "<br />";
//   var info = client_pos + page_pos + offset_pos + screen_pos + window_size + document_size;
//   $("#x").html(info);
// });
// 結果書き出し用の要素
// var xElement = document.getElementById( "x" ) ;
// var yElement = document.getElementById( "y" ) ;
