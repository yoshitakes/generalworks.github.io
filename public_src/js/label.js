const Sortable = require('../../node_modules/sortablejs/Sortable.min.js');
require('../../node_modules/slick-carousel/slick/slick.min.js');
require('../../node_modules/slick-carousel/slick/slick.css');
require('../../node_modules/slick-carousel/slick/slick-theme.css');

require('../css/slick-theme_custmized.css');

// require('../../node_modules/slider-pro/dist/js/jquery.sliderPro.min.js');
// require('../../node_modules/slider-pro/dist/css/slider-pro.css');

const updateIndex = function() {
  const list = $('#label-table').children('.label-table__list');
  const labelIds = _.map(list, function(elem) {
                    console.log(elem);
                    console.log($(elem).attr('label-id'));
                    return $(elem).attr('label-id');
                  }).toString();

  $.ajax(jsRoutes.controllers.LabelAuthController.updateIndexAndNotArchived(labelIds));
}

$(document).on('change', '.label-table__colorbox__colorList__radio', function() {

  if ($(this).is(':checked')) {
    const id = $(this).attr('label-id');
    const color = $(this).attr('data-color');
    const x = $(this).parents('.label-table__colorbox__picker');
    // console.log('id:' + id + ", color:" + color + ", checked:" + $(this).is(':checked'));

    $($(x[0]).prev()[0]).css('background-color', '#'+color);

    //データを細かく取るとき
    // var r = jsRoutes.controllers.LabelAuthController.updateColor(id, color);
    // console.log(r);

    // $.ajax({
    //   url: r.url,
    //   method: r.method,
    //   type: 'html',
    //   success: function(){
    //     console.log('success.');
    //   },
    //   error: function(){console.log('error.');/*...*/}
    // });

    $.ajax(jsRoutes.controllers.LabelAuthController.updateColor(id, color))
    .done(function(result) {
      console.log('changed.');
    })
    .fail();
  }
});

$(document).on('change', '.label-table__name-text', function() {
  console.log('change start!');
  const id = $(this).attr('label-id');
  const name = $(this).val();

  // var r = jsRoutes.controllers.LabelAuthController.updateName(id, name);
  // console.log(r);
  // $.ajax({
  //   url: r.url,
  //   method: r.method,
  //   type: 'html',
  //   success: function(){
  //     console.log('success.');
  //   },
  //   error: function(){console.log('error.');/*...*/}
  // });
  $.ajax(jsRoutes.controllers.LabelAuthController.updateName(id, name))
  .done(function(result) {
    console.log('changed.');
  })
  .fail();
});

$(document).on('click', '[name="label_color"]', function() {
  console.log('label_color clicked!');
  const x = $(this.nextSibling);
  //他のcolorpicker閉じる
  x.show();

  const y = $('.label-table__colorbox__picker').not(x);
  if(y) {
    y.each(function(i, elem) {
       const z = $(elem).css('display');
       if(!(z == 'none')) {
         $(elem).hide();
       }
    });
  };

  // console.log(x.find('.slick-initialized'));
  // console.log(!(x.find('.slick-initialized')));
  // console.log(x.find('.slick-initialized').length);
  if(x.find('.slick-initialized').length == 0) {
    $(x.find('.label-table__colorbox__slickbox')[0]).slick({
      vertical: true,
      draggable: false
    });
  }
});


$(document).on('change', '[name="color_text"]', function() {
  var id = $(this).attr('label-id');
});

$('.add-label').click(function() {
  $.ajax(jsRoutes.controllers.LabelAuthController.newline())
  .done(function(result) {
    $('#label-table').append(result);
  })
  .fail( /*...*/ );

  //データを細かく取るとき
  // var r = jsRoutes.controllers.LabelAuthController.newline();
  // console.log(r);
  // $.ajax({
  //   url: r.url,
  //   type: r.type,
  //   success: function(){
  //     console.log('success.');
  //   },
  //   error: function(){console.log('error.');/*...*/}
  // });

});

$(document).on('click', '[name="remove_label"]', function() {
  const id = $(this).attr('label-id');
  const target = $(this).parents('.label-table__list')[0];

  $.ajax(jsRoutes.controllers.LabelAuthController.remove(id))
  .done(function(result) {
    target.remove();
  })

});


Sortable.create(document.getElementById('label-table'), {
    animation: 150,
    handle: ".label-table__handle",
    ghostClass: 'sortable-ghost',
    group: {
      name: 'labels',
      put: ['labels-archived']
    },
    onUpdate: function (/**Event*/evt) {
      // const itemEl = evt.item;  // dragged HTMLElement
      // + indexes from onEnd
      console.log($(this).parents('label-tables'));
      updateIndex();
    },
    onAdd: function (/**Event*/evt) {
      updateIndex();
    },
    onFilter: function (/**Event*/evt) {
        var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
        console.log('onFilter!!!!!');
        console.log(itemEl);
    },

    // Event when you move an item in the list or between lists
    onMove: function (/**Event*/evt) {
        // Example: http://jsbin.com/tuyafe/1/edit?js,output
        evt.dragged; // dragged HTMLElement
        evt.draggedRect; // TextRectangle {left, top, right и bottom}
        evt.related; // HTMLElement on which have guided
        evt.relatedRect; // TextRectangle
        // return false; — for cancel
        console.log(evt);
    }
  }
);

Sortable.create(document.getElementById('label-table-archived-sorted'), {
    animation: 150,
     handle: ".label-table__handle",
     ghostClass: 'ghost',
    group: {
     name: 'labels-archived',
     put: ['labels']
   },
   onAdd: function (/**Event*/evt) {
     const itemEl = evt.item;  // dragged HTMLElement
     console.log(evt);
     console.log(itemEl);
     $.ajax(jsRoutes.controllers.LabelAuthController.updateArchived($(itemEl).attr('label-id')));
   }
  }
);

//Colorpickerの領域外クリックで非表示に
$(document).on('click', function(e) {　
  // console.log($('.label-table__color'));
  // console.log($('.label-table__color')[1]);
  // console.log(e.target);

  //colorpicker内を選択している場合は、処理を行わない
  const foo = _.some($('.label-table__color'), function(p, i) {
                  const x = $.contains(p, e.target);
                  // console.log(x);
                  return x;
                })
  // console.log($.contains(, e.target));
  // console.log($.contains($('.label-table__color')[1], e.target));
  // console.log($('.label-table__colorbox')[1] == e.target);
  // console.log('--------------------');
  // console.log(foo);
  if (!foo) {
    $('.label-table__colorbox__picker').hide();　
  }
});
// $(document).on('click', ('.label-table__colorbox__picker'), function() {　event.stopPropagation();　});

/*
function handleDragOver(e) {
  console.log('overed');
  if (e.priventDefault) {
    e.preventDefault(); //Necessary. Alows us to drop.
  }
  e.originalEvent.dataTransfer.dropEffect = 'move'; //See the section on the DataTransfer object.
  return false;
}
function handleDragEnter(e) {
  // this / e.target is the current hover target.
}
function handleDragLeave(e) {
}

var dragSrcEl = null;
function handleDragStart(e) {
  var x = $(this).parents('.label-table__list')[0];
  // this.classList.add('is-opacity');
  $(x).addClass('is-dragging');

 dragSrcEl = x;

 // e.originalEvent.dataTransfer.effectAllowed = 'move';
 e.originalEvent.dataTransfer.setData('text/html', $(x).html());

}
function handleDrop(e) {
  var x = $(this).parents('.label-table__list')[0];

  // this / e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  if (dragSrcEl != x) {
  // Set the source column's HTML to the HTML of the columnwe dropped on.
    $(dragSrcEl).html($(x).html());
    $(x).html(e.originalEvent.dataTransfer.getData('text/html'));
  }

  // See the section on the DataTransfer object.
  return false;
}
function handleDragEnd(e) {
  console.log('handleDragEnd: start');
  // this/e.target is the source node.
  $('.label-table__draggable').removeClass('is-over');
  $('.label-table__draggable').removeClass('is-opacity');
}
$(document).on('dragstart', '.label-table__draggable', handleDragStart);
$(document).on('dragend', '.label-table__draggable', handleDragEnd);
$(document).on('drop', '.label-table__draggable', handleDrop);
$(document).on('dragover', '.label-table__list', handleDragOver);

$(document).on('dragenter', '.label-table__list', handleDragEnter);
$(document).on('dragleave', '.label-table__list', handleDragLeave);
*/
