webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var Sortable = __webpack_require__(5);
	// const Sortable = require('../nochk_js/Sortable_custmized.js');

	var hideChildren = function hideChildren(list) {
	  var rootLevel = $(list).hasClass('parent_second_level') ? 2 : $(list).hasClass('parent_third_level') ? 3 : 1;
	  var lists = $("#project-table").children('.project-table-box');
	  for (var ind = 0, findFirst = false; ind < lists.length; ind++) {
	    if (!findFirst) {
	      findFirst = $(lists[ind]).attr('project-id') == $(list).attr('project-id');
	    } else {
	      var level = $(lists[ind]).find('.parent_second_level')[0] ? 2 : $(lists[ind]).find('.parent_third_level')[0] ? 3 : 1;
	      if (rootLevel >= level) {
	        break;
	      } else {
	        $(lists[ind]).hide();
	      }
	    }
	  }
	};
	var showChildren = function showChildren() {
	  var lists = $("#project-table").children('.project-table-box');
	  for (var ind = 0; ind < lists.length; ind++) {
	    $(lists[ind]).show();
	  }
	};

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
	  onStart: function onStart( /**Event*/evt) {
	    evt.oldIndex; // element index within parent
	    console.log('start!');

	    //紐付くプロジェクトが存在する場合、全て隠す
	    hideChildren(evt.item);
	    // console.log(evt);
	  },
	  onEnd: function onEnd( /**Event*/evt) {
	    evt.oldIndex; // element's old index within parent
	    evt.newIndex; // element's new index within parent

	    var itemEl = evt.item; // dragged HTMLElement
	    var child = $(itemEl).children('.project-table__list')[0];

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
	  onUpdate: function onUpdate( /**Event*/evt) {
	    // + indexes from onEnd
	    // console.log($(this).parents('project-tables'));
	    // updateIndex();
	  },
	  onAdd: function onAdd( /**Event*/evt) {
	    // updateIndex();
	  },
	  onFilter: function onFilter( /**Event*/evt) {
	    var itemEl = evt.item; // HTMLElement receiving the `mousedown|tapstart` event.
	    // console.log('onFilter!!!!!');
	    // console.log(itemEl);
	  },

	  // Event when you move an item in the list or between lists
	  onMove: function onMove( /**Event*/evt) {
	    // Example: http://jsbin.com/tuyafe/1/edit?js,output
	    evt.dragged; // dragged HTMLElement
	    evt.draggedRect; // TextRectangle {left, top, right и bottom}
	    evt.related; // HTMLElement on which have guided
	    evt.relatedRect; // TextRectangle
	    // return false; — for cancel
	  }
	});
	Sortable.utils.on(document.getElementById('project-table'), 'dragover', function (evt) {
	  // console.log(evt);
	  // console.log($(evt.target).parents('.project-table__list')[0]);
	  var rect = evt.target.getBoundingClientRect();
	  // console.log('clientX:' + (evt.clientX - rect.left) + ', pageX:' + (evt.pageX - rect.left) + ', x:' + (evt.x - rect.left) + ', clientX:' + (evt.clientX - rect.left));
	  // console.log(rect.left);

	  var positionX = 0,
	      parentElm = null;

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
	  console.log("parent: " + $(evt.target).parents('.project-table__list')[0] + "children: " + $(evt.target).children('.project-table__list')[0]);
	  if ($(evt.target).parents('.project-table__list')[0]) {
	    parentElm = $(evt.target).parents('.project-table__list')[0];
	  } else if ($(evt.target).children('.project-table__list')[0]) {
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
	  onAdd: function onAdd( /**Event*/evt) {
	    var itemEl = evt.item; // dragged HTMLElement
	    //  console.log(evt);
	    //  console.log(itemEl);
	    //  $.ajax(jsRoutes.controllers.projectAuthController.updateArchived($(itemEl).attr('project-id')));
	  }
	});

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 5:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! Sortable 1.4.2 - MIT | git://github.com/rubaxa/Sortable.git */
	!function(a){"use strict"; true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (a), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){if(!a||!a.nodeType||1!==a.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(a);this.el=a,this.options=b=r({},b),a[L]=this;var c={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1};for(var d in c)!(d in b)&&(b[d]=c[d]);V(b);for(var f in this)"_"===f.charAt(0)&&(this[f]=this[f].bind(this));this.nativeDraggable=b.forceFallback?!1:P,e(a,"mousedown",this._onTapStart),e(a,"touchstart",this._onTapStart),this.nativeDraggable&&(e(a,"dragover",this),e(a,"dragenter",this)),T.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){v&&v.state!==a&&(h(v,"display",a?"none":""),!a&&v.state&&w.insertBefore(v,s),v.state=a)}function c(a,b,c){if(a){c=c||N,b=b.split(".");var d=b.shift().toUpperCase(),e=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");do if(">*"===d&&a.parentNode===c||(""===d||a.nodeName.toUpperCase()==d)&&(!b.length||((" "+a.className+" ").match(e)||[]).length==b.length))return a;while(a!==c&&(a=a.parentNode))}return null}function d(a){a.dataTransfer&&(a.dataTransfer.dropEffect="move"),a.preventDefault()}function e(a,b,c){a.addEventListener(b,c,!1)}function f(a,b,c){a.removeEventListener(b,c,!1)}function g(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(K," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(K," ")}}function h(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return N.defaultView&&N.defaultView.getComputedStyle?c=N.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function i(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;f>e;e++)c(d[e],e);return d}return[]}function j(a,b,c,d,e,f,g){var h=N.createEvent("Event"),i=(a||b[L]).options,j="on"+c.charAt(0).toUpperCase()+c.substr(1);h.initEvent(c,!0,!0),h.to=b,h.from=e||b,h.item=d||b,h.clone=v,h.oldIndex=f,h.newIndex=g,b.dispatchEvent(h),i[j]&&i[j].call(a,h)}function k(a,b,c,d,e,f){var g,h,i=a[L],j=i.options.onMove;return g=N.createEvent("Event"),g.initEvent("move",!0,!0),g.to=b,g.from=a,g.dragged=c,g.draggedRect=d,g.related=e||b,g.relatedRect=f||b.getBoundingClientRect(),a.dispatchEvent(g),j&&(h=j.call(i,g)),h}function l(a){a.draggable=!1}function m(){R=!1}function n(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return(b.clientY-(d.top+d.height)>5||b.clientX-(d.right+d.width)>5)&&c}function o(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function p(a){var b=0;if(!a||!a.parentNode)return-1;for(;a&&(a=a.previousElementSibling);)"TEMPLATE"!==a.nodeName.toUpperCase()&&b++;return b}function q(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function r(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}var s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J={},K=/\s+/g,L="Sortable"+(new Date).getTime(),M=window,N=M.document,O=M.parseInt,P=!!("draggable"in N.createElement("div")),Q=function(a){return a=N.createElement("x"),a.style.cssText="pointer-events:auto","auto"===a.style.pointerEvents}(),R=!1,S=Math.abs,T=([].slice,[]),U=q(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h=b.scrollSensitivity,i=b.scrollSpeed,j=a.clientX,k=a.clientY,l=window.innerWidth,m=window.innerHeight;if(z!==c&&(y=b.scroll,z=c,y===!0)){y=c;do if(y.offsetWidth<y.scrollWidth||y.offsetHeight<y.scrollHeight)break;while(y=y.parentNode)}y&&(d=y,e=y.getBoundingClientRect(),f=(S(e.right-j)<=h)-(S(e.left-j)<=h),g=(S(e.bottom-k)<=h)-(S(e.top-k)<=h)),f||g||(f=(h>=l-j)-(h>=j),g=(h>=m-k)-(h>=k),(f||g)&&(d=M)),(J.vx!==f||J.vy!==g||J.el!==d)&&(J.el=d,J.vx=f,J.vy=g,clearInterval(J.pid),d&&(J.pid=setInterval(function(){d===M?M.scrollTo(M.pageXOffset+f*i,M.pageYOffset+g*i):(g&&(d.scrollTop+=g*i),f&&(d.scrollLeft+=f*i))},24)))}},30),V=function(a){var b=a.group;b&&"object"==typeof b||(b=a.group={name:b}),["pull","put"].forEach(function(a){a in b||(b[a]=!0)}),a.groups=" "+b.name+(b.put.join?" "+b.put.join(" "):"")+" "};return a.prototype={constructor:a,_onTapStart:function(a){var b=this,d=this.el,e=this.options,f=a.type,g=a.touches&&a.touches[0],h=(g||a).target,i=h,k=e.filter;if(!("mousedown"===f&&0!==a.button||e.disabled)&&(h=c(h,e.draggable,d))){if(D=p(h),"function"==typeof k){if(k.call(this,a,h,this))return j(b,i,"filter",h,d,D),void a.preventDefault()}else if(k&&(k=k.split(",").some(function(a){return a=c(i,a.trim(),d),a?(j(b,a,"filter",h,d,D),!0):void 0})))return void a.preventDefault();(!e.handle||c(i,e.handle,d))&&this._prepareDragStart(a,g,h)}},_prepareDragStart:function(a,b,c){var d,f=this,h=f.el,j=f.options,k=h.ownerDocument;c&&!s&&c.parentNode===h&&(G=a,w=h,s=c,t=s.parentNode,x=s.nextSibling,F=j.group,d=function(){f._disableDelayedDrag(),s.draggable=!0,g(s,f.options.chosenClass,!0),f._triggerDragStart(b)},j.ignore.split(",").forEach(function(a){i(s,a.trim(),l)}),e(k,"mouseup",f._onDrop),e(k,"touchend",f._onDrop),e(k,"touchcancel",f._onDrop),j.delay?(e(k,"mouseup",f._disableDelayedDrag),e(k,"touchend",f._disableDelayedDrag),e(k,"touchcancel",f._disableDelayedDrag),e(k,"mousemove",f._disableDelayedDrag),e(k,"touchmove",f._disableDelayedDrag),f._dragStartTimer=setTimeout(d,j.delay)):d())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),f(a,"mouseup",this._disableDelayedDrag),f(a,"touchend",this._disableDelayedDrag),f(a,"touchcancel",this._disableDelayedDrag),f(a,"mousemove",this._disableDelayedDrag),f(a,"touchmove",this._disableDelayedDrag)},_triggerDragStart:function(a){a?(G={target:s,clientX:a.clientX,clientY:a.clientY},this._onDragStart(G,"touch")):this.nativeDraggable?(e(s,"dragend",this),e(w,"dragstart",this._onDragStart)):this._onDragStart(G,!0);try{N.selection?N.selection.empty():window.getSelection().removeAllRanges()}catch(b){}},_dragStarted:function(){w&&s&&(g(s,this.options.ghostClass,!0),a.active=this,j(this,w,"start",s,w,D))},_emulateDragOver:function(){if(H){if(this._lastX===H.clientX&&this._lastY===H.clientY)return;this._lastX=H.clientX,this._lastY=H.clientY,Q||h(u,"display","none");var a=N.elementFromPoint(H.clientX,H.clientY),b=a,c=" "+this.options.group.name,d=T.length;if(b)do{if(b[L]&&b[L].options.groups.indexOf(c)>-1){for(;d--;)T[d]({clientX:H.clientX,clientY:H.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);Q||h(u,"display","")}},_onTouchMove:function(b){if(G){a.active||this._dragStarted(),this._appendGhost();var c=b.touches?b.touches[0]:b,d=c.clientX-G.clientX,e=c.clientY-G.clientY,f=b.touches?"translate3d("+d+"px,"+e+"px,0)":"translate("+d+"px,"+e+"px)";I=!0,H=c,h(u,"webkitTransform",f),h(u,"mozTransform",f),h(u,"msTransform",f),h(u,"transform",f),b.preventDefault()}},_appendGhost:function(){if(!u){var a,b=s.getBoundingClientRect(),c=h(s),d=this.options;u=s.cloneNode(!0),g(u,d.ghostClass,!1),g(u,d.fallbackClass,!0),h(u,"top",b.top-O(c.marginTop,10)),h(u,"left",b.left-O(c.marginLeft,10)),h(u,"width",b.width),h(u,"height",b.height),h(u,"opacity","0.8"),h(u,"position","fixed"),h(u,"zIndex","100000"),h(u,"pointerEvents","none"),d.fallbackOnBody&&N.body.appendChild(u)||w.appendChild(u),a=u.getBoundingClientRect(),h(u,"width",2*b.width-a.width),h(u,"height",2*b.height-a.height)}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;this._offUpEvents(),"clone"==F.pull&&(v=s.cloneNode(!0),h(v,"display","none"),w.insertBefore(v,s)),b?("touch"===b?(e(N,"touchmove",this._onTouchMove),e(N,"touchend",this._onDrop),e(N,"touchcancel",this._onDrop)):(e(N,"mousemove",this._onTouchMove),e(N,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,50)):(c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,s)),e(N,"drop",this),setTimeout(this._dragStarted,0))},_onDragOver:function(a){var d,e,f,g=this.el,i=this.options,j=i.group,l=j.put,o=F===j,p=i.sort;if(void 0!==a.preventDefault&&(a.preventDefault(),!i.dragoverBubble&&a.stopPropagation()),I=!0,F&&!i.disabled&&(o?p||(f=!w.contains(s)):F.pull&&l&&(F.name===j.name||l.indexOf&&~l.indexOf(F.name)))&&(void 0===a.rootEl||a.rootEl===this.el)){if(U(a,i,this.el),R)return;if(d=c(a.target,i.draggable,g),e=s.getBoundingClientRect(),f)return b(!0),void(v||x?w.insertBefore(s,v||x):p||w.appendChild(s));if(0===g.children.length||g.children[0]===u||g===a.target&&(d=n(g,a))){if(d){if(d.animated)return;r=d.getBoundingClientRect()}b(o),k(w,g,s,e,d,r)!==!1&&(s.contains(g)||(g.appendChild(s),t=g),this._animate(e,s),d&&this._animate(r,d))}else if(d&&!d.animated&&d!==s&&void 0!==d.parentNode[L]){A!==d&&(A=d,B=h(d),C=h(d.parentNode));var q,r=d.getBoundingClientRect(),y=r.right-r.left,z=r.bottom-r.top,D=/left|right|inline/.test(B.cssFloat+B.display)||"flex"==C.display&&0===C["flex-direction"].indexOf("row"),E=d.offsetWidth>s.offsetWidth,G=d.offsetHeight>s.offsetHeight,H=(D?(a.clientX-r.left)/y:(a.clientY-r.top)/z)>.5,J=d.nextElementSibling,K=k(w,g,s,e,d,r);if(K!==!1){if(R=!0,setTimeout(m,30),b(o),1===K||-1===K)q=1===K;else if(D){var M=s.offsetTop,N=d.offsetTop;q=M===N?d.previousElementSibling===s&&!E||H&&E:N>M}else q=J!==s&&!G||H&&G;s.contains(g)||(q&&!J?g.appendChild(s):d.parentNode.insertBefore(s,q?J:d)),t=s.parentNode,this._animate(e,s),this._animate(r,d)}}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();h(b,"transition","none"),h(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,h(b,"transition","all "+c+"ms"),h(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){h(b,"transition",""),h(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;f(N,"touchmove",this._onTouchMove),f(a,"mouseup",this._onDrop),f(a,"touchend",this._onDrop),f(a,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(J.pid),clearTimeout(this._dragStartTimer),f(N,"mousemove",this._onTouchMove),this.nativeDraggable&&(f(N,"drop",this),f(c,"dragstart",this._onDragStart)),this._offUpEvents(),b&&(I&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation()),u&&u.parentNode.removeChild(u),s&&(this.nativeDraggable&&f(s,"dragend",this),l(s),g(s,this.options.ghostClass,!1),g(s,this.options.chosenClass,!1),w!==t?(E=p(s),E>=0&&(j(null,t,"sort",s,w,D,E),j(this,w,"sort",s,w,D,E),j(null,t,"add",s,w,D,E),j(this,w,"remove",s,w,D,E))):(v&&v.parentNode.removeChild(v),s.nextSibling!==x&&(E=p(s),E>=0&&(j(this,w,"update",s,w,D,E),j(this,w,"sort",s,w,D,E)))),a.active&&((null===E||-1===E)&&(E=D),j(this,w,"end",s,w,D,E),this.save())),w=s=t=u=x=v=y=z=G=H=I=E=A=B=F=a.active=null)},handleEvent:function(a){var b=a.type;"dragover"===b||"dragenter"===b?s&&(this._onDragOver(a),d(a)):("drop"===b||"dragend"===b)&&this._onDrop(a)},toArray:function(){for(var a,b=[],d=this.el.children,e=0,f=d.length,g=this.options;f>e;e++)a=d[e],c(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||o(a));return b},sort:function(a){var b={},d=this.el;this.toArray().forEach(function(a,e){var f=d.children[e];c(f,this.options.draggable,d)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(d.removeChild(b[a]),d.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return c(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:(c[a]=b,void("group"===a&&V(c)))},destroy:function(){var a=this.el;a[L]=null,f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),this.nativeDraggable&&(f(a,"dragover",this),f(a,"dragenter",this)),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),T.splice(T.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},a.utils={on:e,off:f,css:h,find:i,is:function(a,b){return!!c(a,b,a)},extend:r,throttle:q,closest:c,toggleClass:g,index:p},a.create=function(b,c){return new a(b,c)},a.version="1.4.2",a});

/***/ }

});