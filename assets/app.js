$(document).ready(function(){
  
  if((typeof Shopify) === 'undefined'){ window.Shopify = {}; }
  
  if((typeof Shopify.getCart) === 'undefined'){
    Shopify.getCart = function(callback, cart){
      if(!cart){
        return jQuery.getJSON('/cart.js', function(cart, textStatus, xhr){
          if((typeof callback) === 'function'){
            callback(cart, textStatus, xhr);
          } else {
            Shopify.onCartUpdate(cart);
          }
        })
          ;
      } else {
        if((typeof callback) === 'function'){
          callback(cart);
        } else if(typeof Shopify.onCartUpdate === 'function'){
          Shopify.onCartUpdate(cart);
        }
      }
    };
  }
});


//document ready
$(function() {

  var oldFlickityCreate = window.Flickity.prototype._create;

  window.Flickity.prototype._create = function(){
    var that = this;
    if(this.element.addEventListener){
      this.element.addEventListener('load', function(){
        that.onresize();
      }, true);
    }
    this._create = oldFlickityCreate;
    return oldFlickityCreate.apply(this, arguments);
  };

  // Call to flickity fix for sliders on IOS
  imageFunctions.flickityIosFix();

  objectFitImages();
  header.loadMegaMenu();
  header.init();
  if (Shopify.theme_settings.enable_autocomplete){
    searchAutocomplete.init();
  }
  utils.pageBannerCheck();
  slideshow.init();
  testimonial.init();
  videoSection.init();
  gallery.init();
  videoFeature.setupVideoPlayer();
  featuredPromotions.init();
  featuredCollectionSection.init();
  collectionSidebarFilter.init();
  cart.init();
  mapFunction.init();
  productPage.init();
  recentlyViewed.init();

  if (Shopify.theme_settings.show_multiple_currencies){
    convertCurrencies();
  }

  // Setup a timer
  var resizeTimeout;

  // Listen for resize events
  window.addEventListener('resize', function ( event ) {

    // If timer is null, reset it to 66ms and run your functions.
    // Otherwise, wait until timer is cleared
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        // Reset timeout
        resizeTimeout = null;
        // Run our resize functions
        if($(window).width() <= 798) {
          cart.init();
          header.unload();
          header.init();
        }
      }, 66);
    }
  }, false);

  //Lightbox default options
  //https://fancyapps.com/fancybox/3/docs/#options
  
  $.fancybox.defaults.animationEffect = 'fade';
  $.fancybox.defaults.transitionEffect = 'fade';
  $.fancybox.defaults.hash = false;
  $.fancybox.defaults.infobar = false;
  $.fancybox.defaults.toolbar = false;
  $.fancybox.defaults.arrows = false;
  $.fancybox.defaults.loop = true;
  $.fancybox.defaults.smallBtn = true;
  $.fancybox.defaults.live = false;
  $.fancybox.defaults.zoom = false;
  $.fancybox.defaults.mobile.preventCaptionOverlap = false;
  $.fancybox.defaults.mobile.toolbar = true;
  $.fancybox.defaults.mobile.buttons = ['close'];
  $.fancybox.defaults.mobile.clickSlide = 'close';
  $.fancybox.defaults.mobile.clickContent = 'zoom';
  $.fancybox.defaults.afterLoad = function(instance, slide) {
    if (instance.current.type == 'image'){
      slide.$content.wrapInner( "<div class='fancybox-image-wrap'></div>" )
    }
    if (instance.group.length > 1){
      slide.$content.find('.fancybox-image-wrap').append('<a title="Previous" class="fancybox-item fancybox-nav fancybox-prev" href="javascript:;" data-fancybox-prev><span>'+ svgArrowSizeLeft +'</span></a><a title="Next" class="fancybox-item fancybox-nav fancybox-next" href="javascript:;" data-fancybox-next><span>'+ svgArrowSizeRight +'</span></a>')
    }
  }
  
  
  //backwards compatibility with custom lightboxes
  $('.lightbox[rel="gallery"]').fancybox();
  

  //Make embedded Vimeo & Youtube iFrames responsive.
  $('.article_content iframe, body[class*="page"] .main.content iframe').wrap('<div class="lazyframe" data-ratio="16:9"></div>');

  // Prevent header overlap on dynamically generated policy pages. Add pagecontent tag to match current page structure.
  $('.shopify-policy__container').parent().prepend('<a name="pagecontent" id="pagecontent"></a>');

  //Add classes to determine column size
  $('.shopify-policy__container').addClass('ten offset-by-three columns');

  //Add featured divider beneath page title
  $('.shopify-policy__title').append('<div class="feature_divider"></div>');

  //Search input hiding
  //get current input
  var currentValue = $(".search_form input[name='q']").val()
  //return amount without *
  if ($(".search_form input[name='q']").length > 0){
    $(".search_form input[name='q']").val( currentValue.replace('*', '') );
  }

  $('#sort-by').val($('#sort-by').data('default-sort'));

  $('body')
    .on('change', '#sort-by', function() {
      quickFilter.init();
  });

  $('body')
    .on('change', '#tag_filter', function() {
      $('[data-option-filter] input').prop('checked', false);
      quickFilter.init();
  });

  $('body')
    .on('change', '#blog_filter', function() {
      var url = $(this).val();
      window.location = url;
  });

  $('input, select, textarea').on('focus blur', function(event) {
    $('meta[name=viewport]').attr('content', 'width=device-width,initial-scale=1,maximum-scale=' + (event.type == 'blur' ? 10 : 1));
  });

  //Collection sidebar filter
  //Check the checkbox values
  $('body').on('change', '[data-option-filter] input', function(){
    quickFilter.init();
    $("html, body").animate({
      scrollTop: ($('#pagecontent').offset().top)
    }, 500);
  })

  $('body').on('click', '[data-reset-filters]', function(){
    collectionSidebarFilter.clearAllFilters();
  });

  $('body').on('click', '[data-clear-filter]', function(){
    var selectedOption = $(this).parents('.filter-active-tag');
    collectionSidebarFilter.clearSelectedFilter(selectedOption);
  });

  $('body').on('change', '.currencies', function(e) {
      $('[data-initial-modal-price]').attr('data-initial-modal-price', '');
  });

  $('body').on('change', '.js-quick-shop select', function(e) {
      var currentVariant = $('.js-quick-shop select[name="id"]').val();
      if (currentVariant && globalQuickShopProduct){
        quickShop.updateVariant(currentVariant);
      }
  });

  if (Shopify.theme_settings.quick_shop_enabled){
    quickShop.init();
  }

  var touchStartPos = 0;

  //Detecting swipe vs tap
  $(document).bind("touchstart", function (e) {
    touchStartPos = $(window).scrollTop();
  }).bind("touchend", function (e) {
      var distance = touchStartPos - $(window).scrollTop();
      if (distance > 20 || distance < -20) {
          e.preventDefault;
      }
  });

  $('body').on('click', '.sidebar .parent-link--false', function(e) {
    e.preventDefault();
    $menu = $(this).parent('li');
    $menu.find('.menu-toggle').toggleClass('active');
    $menu.find('ul').slideToggle();
  });

  if (Shopify.theme_settings.newsletter_popup){
    newsletter_popup.init();
  }

  if(window.location.pathname.indexOf('/comments') != -1) {
    $('html,body').animate({scrollTop: $("#new-comment").offset().top-140},'slow');
  }

  $('body').on('mouseenter', '.icon-search', function() {
    $('.search-terms').focus();
  });

  $('body').on('click', '.icon-search', function() {
    $('input.search-terms').focus();
  });

  $('body').on('click', '.search-submit', function() {
    $(this).parent().submit();
  });


/*! Waypoints - 4.0.0 */
!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.invokeAll("enable")},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical);t&&e&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s],l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),"function"==typeof f?f=f.apply(d):"string"==typeof f&&(f=parseFloat(f),d.options.offset.indexOf("%")>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=y+l-f,h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();

/*! Waypoints Infinite Scroll Shortcut - 4.0.0 */
!function(){"use strict";function t(n){this.options=i.extend({},t.defaults,n),this.container=this.options.element,"auto"!==this.options.container&&(this.container=this.options.container),this.$container=i(this.container),this.$more=i(this.options.more),this.$more.length&&(this.setupHandler(),this.waypoint=new o(this.options))}var i=window.jQuery,o=window.Waypoint;t.prototype.setupHandler=function(){this.options.handler=i.proxy(function(){this.options.onBeforePageLoad(),this.destroy(),this.$container.addClass(this.options.loadingClass),i.get(i(this.options.more).attr("href"),i.proxy(function(t){var n=i(i.parseHTML(t)),e=n.find(this.options.more),s=n.find(this.options.items);s.length||(s=n.filter(this.options.items)),this.$container.append(s),this.$container.removeClass(this.options.loadingClass),e.length||(e=n.filter(this.options.more)),e.length?(this.$more.replaceWith(e),this.$more=e,this.waypoint=new o(this.options)):this.$more.remove(),this.options.onAfterPageLoad(s)},this))},this)},t.prototype.destroy=function(){this.waypoint&&this.waypoint.destroy()},t.defaults={container:"auto",items:".infinite-item",more:".infinite-more-link",offset:"bottom-in-view",loadingClass:"infinite-loading",onBeforePageLoad:i.noop,onAfterPageLoad:i.noop},o.Infinite=t}();
/*! Waypoints - 4.0.0 */
  
  
  if ($(window).width() > 798) {
    $(".animate_right").waypoint(function() {
      $(this.element).addClass("animated fadeInRight");
    }, { offset: '70%' });
    $(".animate_left").waypoint(function() {
      $(this.element).addClass("animated fadeInLeft");
    }, { offset: '70%' });
    $(".animate_up").waypoint(function() {
      $(this.element).addClass("animated fadeInUp");
    }, { offset: '70%' });
    $(".animate_down").waypoint(function() {
      $(this.element).addClass("animated fadeInDown");
    }, { offset: '70%' });
  }


/*!
 * Flickity PACKAGED v3.0.0
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2022 Metafizzy
 */
//!function(t,e){"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,(function(t,e){let i=t.console,s=void 0===i?function(){}:function(t){i.error(t)};return function(i,n,o){(o=o||e||t.jQuery)&&(n.prototype.option||(n.prototype.option=function(t){t&&(this.options=Object.assign(this.options||{},t))}),o.fn[i]=function(t,...e){return"string"==typeof t?function(t,e,n){let l,r=`$().${i}("${e}")`;return t.each((function(t,h){let a=o.data(h,i);if(!a)return void s(`${i} not initialized. Cannot call method ${r}`);let c=a[e];if(!c||"_"==e.charAt(0))return void s(`${r} is not a valid method`);let d=c.apply(a,n);l=void 0===l?d:l})),void 0!==l?l:t}(this,t,e):(l=t,this.each((function(t,e){let s=o.data(e,i);s?(s.option(l),s._init()):(s=new n(e,l),o.data(e,i,s))})),this);var l})}})),function(t,e){"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,(function(){function t(){}let e=t.prototype;return e.on=function(t,e){if(!t||!e)return this;let i=this._events=this._events||{},s=i[t]=i[t]||[];return s.includes(e)||s.push(e),this},e.once=function(t,e){if(!t||!e)return this;this.on(t,e);let i=this._onceEvents=this._onceEvents||{};return(i[t]=i[t]||{})[e]=!0,this},e.off=function(t,e){let i=this._events&&this._events[t];if(!i||!i.length)return this;let s=i.indexOf(e);return-1!=s&&i.splice(s,1),this},e.emitEvent=function(t,e){let i=this._events&&this._events[t];if(!i||!i.length)return this;i=i.slice(0),e=e||[];let s=this._onceEvents&&this._onceEvents[t];for(let n of i){s&&s[n]&&(this.off(t,n),delete s[n]),n.apply(this,e)}return this},e.allOff=function(){return delete this._events,delete this._onceEvents,this},t})),
/*!
 * Infinite Scroll v2.0.4
 * measure size of elements
 * MIT license
 */
//function(t,e){"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,(function(){function t(t){let e=parseFloat(t);return-1==t.indexOf("%")&&!isNaN(e)&&e}let e=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];e.length;return function(i){if("string"==typeof i&&(i=document.querySelector(i)),!(i&&"object"==typeof i&&i.nodeType))return;let s=getComputedStyle(i);if("none"==s.display)return function(){let t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0};return e.forEach((e=>{t[e]=0})),t}();let n={};n.width=i.offsetWidth,n.height=i.offsetHeight;let o=n.isBorderBox="border-box"==s.boxSizing;e.forEach((t=>{let e=s[t],i=parseFloat(e);n[t]=isNaN(i)?0:i}));let l=n.paddingLeft+n.paddingRight,r=n.paddingTop+n.paddingBottom,h=n.marginLeft+n.marginRight,a=n.marginTop+n.marginBottom,c=n.borderLeftWidth+n.borderRightWidth,d=n.borderTopWidth+n.borderBottomWidth,u=t(s.width);!1!==u&&(n.width=u+(o?0:l+c));let p=t(s.height);return!1!==p&&(n.height=p+(o?0:r+d)),n.innerWidth=n.width-(l+c),n.innerHeight=n.height-(r+d),n.outerWidth=n.width+h,n.outerHeight=n.height+a,n}})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(t):t.fizzyUIUtils=e(t)}(this,(function(t){let e={extend:function(t,e){return Object.assign(t,e)},modulo:function(t,e){return(t%e+e)%e},makeArray:function(t){if(Array.isArray(t))return t;if(null==t)return[];return"object"==typeof t&&"number"==typeof t.length?[...t]:[t]},removeFrom:function(t,e){let i=t.indexOf(e);-1!=i&&t.splice(i,1)},getParent:function(t,e){for(;t.parentNode&&t!=document.body;)if((t=t.parentNode).matches(e))return t},getQueryElement:function(t){return"string"==typeof t?document.querySelector(t):t},handleEvent:function(t){let e="on"+t.type;this[e]&&this[e](t)},filterFindElements:function(t,i){return(t=e.makeArray(t)).filter((t=>t instanceof HTMLElement)).reduce(((t,e)=>{if(!i)return t.push(e),t;e.matches(i)&&t.push(e);let s=e.querySelectorAll(i);return t=t.concat(...s)}),[])},debounceMethod:function(t,e,i){i=i||100;let s=t.prototype[e],n=e+"Timeout";t.prototype[e]=function(){clearTimeout(this[n]);let t=arguments;this[n]=setTimeout((()=>{s.apply(this,t),delete this[n]}),i)}},docReady:function(t){let e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},toDashed:function(t){return t.replace(/(.)([A-Z])/g,(function(t,e,i){return e+"-"+i})).toLowerCase()}},i=t.console;return e.htmlInit=function(s,n){e.docReady((function(){let o="data-"+e.toDashed(n),l=document.querySelectorAll(`[${o}]`),r=t.jQuery;[...l].forEach((t=>{let e,l=t.getAttribute(o);try{e=l&&JSON.parse(l)}catch(e){return void(i&&i.error(`Error parsing ${o} on ${t.className}: ${e}`))}let h=new s(t,e);r&&r.data(t,n,h)}))}))},e})),
/*!
 * Unidragger v3.0.0
 * Draggable base class
 * MIT license
 */
//function(t,e){"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.Unidragger=e(t,t.EvEmitter)}("undefined"!=typeof window?window:this,(function(t,e){function i(){}let s,n,o=i.prototype=Object.create(e.prototype);o.handleEvent=function(t){let e="on"+t.type;this[e]&&this[e](t)},"ontouchstart"in t?(s="touchstart",n=["touchmove","touchend","touchcancel"]):t.PointerEvent?(s="pointerdown",n=["pointermove","pointerup","pointercancel"]):(s="mousedown",n=["mousemove","mouseup"]),o.touchActionValue="none",o.bindHandles=function(){this._bindHandles("addEventListener",this.touchActionValue)},o.unbindHandles=function(){this._bindHandles("removeEventListener","")},o._bindHandles=function(e,i){this.handles.forEach((n=>{n[e](s,this),n[e]("click",this),t.PointerEvent&&(n.style.touchAction=i)}))},o.bindActivePointerEvents=function(){n.forEach((e=>{t.addEventListener(e,this)}))},o.unbindActivePointerEvents=function(){n.forEach((e=>{t.removeEventListener(e,this)}))},o.withPointer=function(t,e){e.pointerId==this.pointerIdentifier&&this[t](e,e)},o.withTouch=function(t,e){let i;for(let t of e.changedTouches)t.identifier==this.pointerIdentifier&&(i=t);i&&this[t](e,i)},o.onmousedown=function(t){this.pointerDown(t,t)},o.ontouchstart=function(t){this.pointerDown(t,t.changedTouches[0])},o.onpointerdown=function(t){this.pointerDown(t,t)};const l=["TEXTAREA","INPUT","SELECT","OPTION"],r=["radio","checkbox","button","submit","image","file"];return o.pointerDown=function(t,e){let i=l.includes(t.target.nodeName),s=r.includes(t.target.type),n=!i||s;!this.isPointerDown&&!t.button&&n&&(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDownPointer={pageX:e.pageX,pageY:e.pageY},this.bindActivePointerEvents(),this.emitEvent("pointerDown",[t,e]))},o.onmousemove=function(t){this.pointerMove(t,t)},o.onpointermove=function(t){this.withPointer("pointerMove",t)},o.ontouchmove=function(t){this.withTouch("pointerMove",t)},o.pointerMove=function(t,e){let i={x:e.pageX-this.pointerDownPointer.pageX,y:e.pageY-this.pointerDownPointer.pageY};this.emitEvent("pointerMove",[t,e,i]),!this.isDragging&&this.hasDragStarted(i)&&this.dragStart(t,e),this.isDragging&&this.dragMove(t,e,i)},o.hasDragStarted=function(t){return Math.abs(t.x)>3||Math.abs(t.y)>3},o.dragStart=function(t,e){this.isDragging=!0,this.isPreventingClicks=!0,this.emitEvent("dragStart",[t,e])},o.dragMove=function(t,e,i){this.emitEvent("dragMove",[t,e,i])},o.onmouseup=function(t){this.pointerUp(t,t)},o.onpointerup=function(t){this.withPointer("pointerUp",t)},o.ontouchend=function(t){this.withTouch("pointerUp",t)},o.pointerUp=function(t,e){this.pointerDone(),this.emitEvent("pointerUp",[t,e]),this.isDragging?this.dragEnd(t,e):this.staticClick(t,e)},o.dragEnd=function(t,e){this.isDragging=!1,setTimeout((()=>delete this.isPreventingClicks)),this.emitEvent("dragEnd",[t,e])},o.pointerDone=function(){this.isPointerDown=!1,delete this.pointerIdentifier,this.unbindActivePointerEvents(),this.emitEvent("pointerDone")},o.onpointercancel=function(t){this.withPointer("pointerCancel",t)},o.ontouchcancel=function(t){this.withTouch("pointerCancel",t)},o.pointerCancel=function(t,e){this.pointerDone(),this.emitEvent("pointerCancel",[t,e])},o.onclick=function(t){this.isPreventingClicks&&t.preventDefault()},o.staticClick=function(t,e){let i="mouseup"==t.type;i&&this.isIgnoringMouseUp||(this.emitEvent("staticClick",[t,e]),i&&(this.isIgnoringMouseUp=!0,setTimeout((()=>{delete this.isIgnoringMouseUp}),400)))},i})),
/*!
 * imagesLoaded v5.0.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
//function(t,e){"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}("undefined"!=typeof window?window:this,(function(t,e){let i=t.jQuery,s=t.console;function n(t,e,o){if(!(this instanceof n))return new n(t,e,o);let l=t;var r;("string"==typeof t&&(l=document.querySelectorAll(t)),l)?(this.elements=(r=l,Array.isArray(r)?r:"object"==typeof r&&"number"==typeof r.length?[...r]:[r]),this.options={},"function"==typeof e?o=e:Object.assign(this.options,e),o&&this.on("always",o),this.getImages(),i&&(this.jqDeferred=new i.Deferred),setTimeout(this.check.bind(this))):s.error(`Bad element for imagesLoaded ${l||t}`)}n.prototype=Object.create(e.prototype),n.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)};const o=[1,9,11];n.prototype.addElementImages=function(t){"IMG"===t.nodeName&&this.addImage(t),!0===this.options.background&&this.addElementBackgroundImages(t);let{nodeType:e}=t;if(!e||!o.includes(e))return;let i=t.querySelectorAll("img");for(let t of i)this.addImage(t);if("string"==typeof this.options.background){let e=t.querySelectorAll(this.options.background);for(let t of e)this.addElementBackgroundImages(t)}};const l=/url\((['"])?(.*?)\1\)/gi;function r(t){this.img=t}function h(t,e){this.url=t,this.element=e,this.img=new Image}return n.prototype.addElementBackgroundImages=function(t){let e=getComputedStyle(t);if(!e)return;let i=l.exec(e.backgroundImage);for(;null!==i;){let s=i&&i[2];s&&this.addBackground(s,t),i=l.exec(e.backgroundImage)}},n.prototype.addImage=function(t){let e=new r(t);this.images.push(e)},n.prototype.addBackground=function(t,e){let i=new h(t,e);this.images.push(i)},n.prototype.check=function(){if(this.progressedCount=0,this.hasAnyBroken=!1,!this.images.length)return void this.complete();let t=(t,e,i)=>{setTimeout((()=>{this.progress(t,e,i)}))};this.images.forEach((function(e){e.once("progress",t),e.check()}))},n.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount===this.images.length&&this.complete(),this.options.debug&&s&&s.log(`progress: ${i}`,t,e)},n.prototype.complete=function(){let t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){let t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){this.getIsImageComplete()?this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.img.crossOrigin&&(this.proxyImage.crossOrigin=this.img.crossOrigin),this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.proxyImage.src=this.img.currentSrc||this.img.src)},r.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t;let{parentNode:i}=this.img,s="PICTURE"===i.nodeName?i:this.img;this.emitEvent("progress",[this,s,e])},r.prototype.handleEvent=function(t){let e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},h.prototype=Object.create(r.prototype),h.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},h.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},h.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},n.makeJQueryPlugin=function(e){(e=e||t.jQuery)&&(i=e,i.fn.imagesLoaded=function(t,e){return new n(this,t,e).jqDeferred.promise(i(this))})},n.makeJQueryPlugin(),n})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("get-size")):(t.Flickity=t.Flickity||{},t.Flickity.Cell=e(t.getSize))}("undefined"!=typeof window?window:this,(function(t){const e="flickity-cell";function i(t){this.element=t,this.element.classList.add(e),this.x=0,this.unselect()}let s=i.prototype;return s.destroy=function(){this.unselect(),this.element.classList.remove(e),this.element.style.transform="",this.element.removeAttribute("aria-hidden")},s.getSize=function(){this.size=t(this.element)},s.select=function(){this.element.classList.add("is-selected"),this.element.removeAttribute("aria-hidden")},s.unselect=function(){this.element.classList.remove("is-selected"),this.element.setAttribute("aria-hidden","true")},s.remove=function(){this.element.remove()},i})),function(t,e){"object"==typeof module&&module.exports?module.exports=e():(t.Flickity=t.Flickity||{},t.Flickity.Slide=e())}("undefined"!=typeof window?window:this,(function(){function t(t,e,i){this.beginMargin=t,this.endMargin=e,this.cellAlign=i,this.cells=[],this.outerWidth=0,this.height=0}let e=t.prototype;return e.addCell=function(t){this.cells.push(t),this.outerWidth+=t.size.outerWidth,this.height=Math.max(t.size.outerHeight,this.height),1===this.cells.length&&(this.x=t.x,this.firstMargin=t.size[this.beginMargin])},e.updateTarget=function(){let t=this.getLastCell(),e=t?t.size[this.endMargin]:0,i=this.outerWidth-(this.firstMargin+e);this.target=this.x+this.firstMargin+i*this.cellAlign},e.getLastCell=function(){return this.cells[this.cells.length-1]},e.select=function(){this.cells.forEach((t=>t.select()))},e.unselect=function(){this.cells.forEach((t=>t.unselect()))},e.getCellElements=function(){return this.cells.map((t=>t.element))},t})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("fizzy-ui-utils")):(t.Flickity=t.Flickity||{},t.Flickity.animatePrototype=e(t.fizzyUIUtils))}("undefined"!=typeof window?window:this,(function(t){let e={startAnimation:function(){this.isAnimating||(this.isAnimating=!0,this.restingFrames=0,this.animate())},animate:function(){this.applyDragForce(),this.applySelectedAttraction();let t=this.x;this.integratePhysics(),this.positionSlider(),this.settle(t),this.isAnimating&&requestAnimationFrame((()=>this.animate()))},positionSlider:function(){let e=this.x;this.isWrapping&&(e=t.modulo(e,this.slideableWidth)-this.slideableWidth,this.shiftWrapCells(e)),this.setTranslateX(e,this.isAnimating),this.dispatchScrollEvent()},setTranslateX:function(t,e){t+=this.cursorPosition,this.options.rightToLeft&&(t=-t);let i=this.getPositionValue(t);this.slider.style.transform=e?`translate3d(${i},0,0)`:`translateX(${i})`},dispatchScrollEvent:function(){let t=this.slides[0];if(!t)return;let e=-this.x-t.target,i=e/this.slidesWidth;this.dispatchEvent("scroll",null,[i,e])},positionSliderAtSelected:function(){this.cells.length&&(this.x=-this.selectedSlide.target,this.velocity=0,this.positionSlider())},getPositionValue:function(t){return this.options.percentPosition?.01*Math.round(t/this.size.innerWidth*1e4)+"%":Math.round(t)+"px"},settle:function(t){!this.isPointerDown&&Math.round(100*this.x)===Math.round(100*t)&&this.restingFrames++,this.restingFrames>2&&(this.isAnimating=!1,delete this.isFreeScrolling,this.positionSlider(),this.dispatchEvent("settle",null,[this.selectedIndex]))},shiftWrapCells:function(t){let e=this.cursorPosition+t;this._shiftCells(this.beforeShiftCells,e,-1);let i=this.size.innerWidth-(t+this.slideableWidth+this.cursorPosition);this._shiftCells(this.afterShiftCells,i,1)},_shiftCells:function(t,e,i){t.forEach((t=>{let s=e>0?i:0;this._wrapShiftCell(t,s),e-=t.size.outerWidth}))},_unshiftCells:function(t){t&&t.length&&t.forEach((t=>this._wrapShiftCell(t,0)))},_wrapShiftCell:function(t,e){this._renderCellPosition(t,t.x+this.slideableWidth*e)},integratePhysics:function(){this.x+=this.velocity,this.velocity*=this.getFrictionFactor()},applyForce:function(t){this.velocity+=t},getFrictionFactor:function(){return 1-this.options[this.isFreeScrolling?"freeScrollFriction":"friction"]},getRestingPosition:function(){return this.x+this.velocity/(1-this.getFrictionFactor())},applyDragForce:function(){if(!this.isDraggable||!this.isPointerDown)return;let t=this.dragX-this.x-this.velocity;this.applyForce(t)},applySelectedAttraction:function(){if(this.isDraggable&&this.isPointerDown||this.isFreeScrolling||!this.slides.length)return;let t=(-1*this.selectedSlide.target-this.x)*this.options.selectedAttraction;this.applyForce(t)}};return e})),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./cell"),require("./slide"),require("./animate"));else{let i=t.Flickity;t.Flickity=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,i.Cell,i.Slide,i.animatePrototype)}}("undefined"!=typeof window?window:this,(function(t,e,i,s,n,o,l){const{getComputedStyle:r,console:h}=t;let{jQuery:a}=t,c=0,d={};function u(t,e){let i=s.getQueryElement(t);if(i){if(this.element=i,this.element.flickityGUID){let t=d[this.element.flickityGUID];return t&&t.option(e),t}a&&(this.$element=a(this.element)),this.options={...this.constructor.defaults},this.option(e),this._create()}else h&&h.error(`Bad element for Flickity: ${i||t}`)}u.defaults={accessibility:!0,cellAlign:"center",freeScrollFriction:.075,friction:.28,namespaceJQueryEvents:!0,percentPosition:!0,resize:!0,selectedAttraction:.025,setGallerySize:!0},u.create={};let p=u.prototype;Object.assign(p,e.prototype),p._create=function(){let{resize:e,watchCSS:i,rightToLeft:s}=this.options,n=this.guid=++c;this.element.flickityGUID=n,d[n]=this,this.selectedIndex=0,this.restingFrames=0,this.x=0,this.velocity=0,this.beginMargin=s?"marginRight":"marginLeft",this.endMargin=s?"marginLeft":"marginRight",this.viewport=document.createElement("div"),this.viewport.className="flickity-viewport",this._createSlider(),this.focusableElems=[this.element],(e||i)&&t.addEventListener("resize",this);for(let t in this.options.on){let e=this.options.on[t];this.on(t,e)}for(let t in u.create)u.create[t].call(this);i?this.watchCSS():this.activate()},p.option=function(t){Object.assign(this.options,t)},p.activate=function(){if(this.isActive)return;this.isActive=!0,this.element.classList.add("flickity-enabled"),this.options.rightToLeft&&this.element.classList.add("flickity-rtl"),this.getSize();let t=this._filterFindCellElements(this.element.children);this.slider.append(...t),this.viewport.append(this.slider),this.element.append(this.viewport),this.reloadCells(),this.options.accessibility&&(this.element.tabIndex=0,this.element.addEventListener("keydown",this)),this.emitEvent("activate"),this.selectInitialIndex(),this.isInitActivated=!0,this.dispatchEvent("ready")},p._createSlider=function(){let t=document.createElement("div");t.className="flickity-slider",this.slider=t},p._filterFindCellElements=function(t){return s.filterFindElements(t,this.options.cellSelector)},p.reloadCells=function(){this.cells=this._makeCells(this.slider.children),this.positionCells(),this._updateWrapShiftCells(),this.setGallerySize()},p._makeCells=function(t){return this._filterFindCellElements(t).map((t=>new n(t)))},p.getLastCell=function(){return this.cells[this.cells.length-1]},p.getLastSlide=function(){return this.slides[this.slides.length-1]},p.positionCells=function(){this._sizeCells(this.cells),this._positionCells(0)},p._positionCells=function(t){t=t||0,this.maxCellHeight=t&&this.maxCellHeight||0;let e=0;if(t>0){let i=this.cells[t-1];e=i.x+i.size.outerWidth}this.cells.slice(t).forEach((t=>{t.x=e,this._renderCellPosition(t,e),e+=t.size.outerWidth,this.maxCellHeight=Math.max(t.size.outerHeight,this.maxCellHeight)})),this.slideableWidth=e,this.updateSlides(),this._containSlides(),this.slidesWidth=this.cells.length?this.getLastSlide().target-this.slides[0].target:0},p._renderCellPosition=function(t,e){let i=e*(this.options.rightToLeft?-1:1);this.options.percentPosition&&(i*=this.size.innerWidth/t.size.width);let s=this.getPositionValue(i);t.element.style.transform=`translateX( ${s} )`},p._sizeCells=function(t){t.forEach((t=>t.getSize()))},p.updateSlides=function(){if(this.slides=[],!this.cells.length)return;let{beginMargin:t,endMargin:e}=this,i=new o(t,e,this.cellAlign);this.slides.push(i);let s=this._getCanCellFit();this.cells.forEach(((n,l)=>{if(!i.cells.length)return void i.addCell(n);let r=i.outerWidth-i.firstMargin+(n.size.outerWidth-n.size[e]);s(l,r)||(i.updateTarget(),i=new o(t,e,this.cellAlign),this.slides.push(i)),i.addCell(n)})),i.updateTarget(),this.updateSelectedSlide()},p._getCanCellFit=function(){let{groupCells:t}=this.options;if(!t)return()=>!1;if("number"==typeof t){let e=parseInt(t,10);return t=>t%e!=0}let e=1,i="string"==typeof t&&t.match(/^(\d+)%$/);i&&(e=parseInt(i[1],10)/100);let s=(this.size.innerWidth+1)*e;return(t,e)=>e<=s},p._init=p.reposition=function(){this.positionCells(),this.positionSliderAtSelected()},p.getSize=function(){this.size=i(this.element),this.setCellAlign(),this.cursorPosition=this.size.innerWidth*this.cellAlign};let f={left:0,center:.5,right:1};p.setCellAlign=function(){let{cellAlign:t,rightToLeft:e}=this.options,i=f[t];this.cellAlign=void 0!==i?i:t,e&&(this.cellAlign=1-this.cellAlign)},p.setGallerySize=function(){if(!this.options.setGallerySize)return;let t=this.options.adaptiveHeight&&this.selectedSlide?this.selectedSlide.height:this.maxCellHeight;this.viewport.style.height=`${t}px`},p._updateWrapShiftCells=function(){if(this.isWrapping=this.getIsWrapping(),!this.isWrapping)return;this._unshiftCells(this.beforeShiftCells),this._unshiftCells(this.afterShiftCells);let t=this.cursorPosition,e=this.cells.length-1;this.beforeShiftCells=this._getGapCells(t,e,-1);let i=this.size.innerWidth-this.cursorPosition;this.afterShiftCells=this._getGapCells(i,0,1)},p.getIsWrapping=function(){let{wrapAround:t}=this.options;if(!t||this.slides.length<2)return!1;if("fill"!==t)return!0;let e=this.slideableWidth-this.size.innerWidth;if(e>this.size.innerWidth)return!0;for(let t of this.cells)if(t.size.outerWidth>e)return!1;return!0},p._getGapCells=function(t,e,i){let s=[];for(;t>0;){let n=this.cells[e];if(!n)break;s.push(n),e+=i,t-=n.size.outerWidth}return s},p._containSlides=function(){if(!(this.options.contain&&!this.isWrapping&&this.cells.length))return;let t=this.slideableWidth-this.getLastCell().size[this.endMargin];if(t<this.size.innerWidth)this.slides.forEach((e=>{e.target=t*this.cellAlign}));else{let e=this.cursorPosition+this.cells[0].size[this.beginMargin],i=t-this.size.innerWidth*(1-this.cellAlign);this.slides.forEach((t=>{t.target=Math.max(t.target,e),t.target=Math.min(t.target,i)}))}},p.dispatchEvent=function(t,e,i){let s=e?[e].concat(i):i;if(this.emitEvent(t,s),a&&this.$element){let s=t+=this.options.namespaceJQueryEvents?".flickity":"";if(e){let i=new a.Event(e);i.type=t,s=i}this.$element.trigger(s,i)}};const g=["dragStart","dragMove","dragEnd","pointerDown","pointerMove","pointerEnd","staticClick"];let m=p.emitEvent;p.emitEvent=function(t,e){if("staticClick"===t){let t=this.getParentCell(e[0].target),i=t&&t.element,s=t&&this.cells.indexOf(t);e=e.concat(i,s)}if(m.call(this,t,e),!g.includes(t)||!a||!this.$element)return;t+=this.options.namespaceJQueryEvents?".flickity":"";let i=e.shift(0),s=new a.Event(i);s.type=t,this.$element.trigger(s,e)},p.select=function(t,e,i){if(!this.isActive)return;if(t=parseInt(t,10),this._wrapSelect(t),(this.isWrapping||e)&&(t=s.modulo(t,this.slides.length)),!this.slides[t])return;let n=this.selectedIndex;this.selectedIndex=t,this.updateSelectedSlide(),i?this.positionSliderAtSelected():this.startAnimation(),this.options.adaptiveHeight&&this.setGallerySize(),this.dispatchEvent("select",null,[t]),t!==n&&this.dispatchEvent("change",null,[t])},p._wrapSelect=function(t){if(!this.isWrapping)return;const{selectedIndex:e,slideableWidth:i,slides:{length:n}}=this;if(!this.isDragSelect){let i=s.modulo(t,n),o=Math.abs(i-e),l=Math.abs(i+n-e),r=Math.abs(i-n-e);l<o?t+=n:r<o&&(t-=n)}t<0?this.x-=i:t>=n&&(this.x+=i)},p.previous=function(t,e){this.select(this.selectedIndex-1,t,e)},p.next=function(t,e){this.select(this.selectedIndex+1,t,e)},p.updateSelectedSlide=function(){let t=this.slides[this.selectedIndex];t&&(this.unselectSelectedSlide(),this.selectedSlide=t,t.select(),this.selectedCells=t.cells,this.selectedElements=t.getCellElements(),this.selectedCell=t.cells[0],this.selectedElement=this.selectedElements[0])},p.unselectSelectedSlide=function(){this.selectedSlide&&this.selectedSlide.unselect()},p.selectInitialIndex=function(){let t=this.options.initialIndex;if(this.isInitActivated)return void this.select(this.selectedIndex,!1,!0);if(t&&"string"==typeof t){if(this.queryCell(t))return void this.selectCell(t,!1,!0)}let e=0;t&&this.slides[t]&&(e=t),this.select(e,!1,!0)},p.selectCell=function(t,e,i){let s=this.queryCell(t);if(!s)return;let n=this.getCellSlideIndex(s);this.select(n,e,i)},p.getCellSlideIndex=function(t){let e=this.slides.find((e=>e.cells.includes(t)));return this.slides.indexOf(e)},p.getCell=function(t){for(let e of this.cells)if(e.element===t)return e},p.getCells=function(t){return(t=s.makeArray(t)).map((t=>this.getCell(t))).filter(Boolean)},p.getCellElements=function(){return this.cells.map((t=>t.element))},p.getParentCell=function(t){let e=this.getCell(t);if(e)return e;let i=t.closest(".flickity-slider > *");return this.getCell(i)},p.getAdjacentCellElements=function(t,e){if(!t)return this.selectedSlide.getCellElements();e=void 0===e?this.selectedIndex:e;let i=this.slides.length;if(1+2*t>=i)return this.getCellElements();let n=[];for(let o=e-t;o<=e+t;o++){let t=this.isWrapping?s.modulo(o,i):o,e=this.slides[t];e&&(n=n.concat(e.getCellElements()))}return n},p.queryCell=function(t){if("number"==typeof t)return this.cells[t];return"string"==typeof t&&!t.match(/^[#.]?[\d/]/)&&(t=this.element.querySelector(t)),this.getCell(t)},p.uiChange=function(){this.emitEvent("uiChange")},p.onresize=function(){this.watchCSS(),this.resize()},s.debounceMethod(u,"onresize",150),p.resize=function(){if(!this.isActive||this.isAnimating||this.isDragging)return;this.getSize(),this.isWrapping&&(this.x=s.modulo(this.x,this.slideableWidth)),this.positionCells(),this._updateWrapShiftCells(),this.setGallerySize(),this.emitEvent("resize");let t=this.selectedElements&&this.selectedElements[0];this.selectCell(t,!1,!0)},p.watchCSS=function(){if(!this.options.watchCSS)return;r(this.element,":after").content.includes("flickity")?this.activate():this.deactivate()},p.onkeydown=function(t){let{activeElement:e}=document,i=u.keyboardHandlers[t.key];this.options.accessibility&&e&&i&&this.focusableElems.some((t=>e===t))&&i.call(this)},u.keyboardHandlers={ArrowLeft:function(){this.uiChange(),this[this.options.rightToLeft?"next":"previous"]()},ArrowRight:function(){this.uiChange(),this[this.options.rightToLeft?"previous":"next"]()}},p.focus=function(){this.element.focus({preventScroll:!0})},p.deactivate=function(){this.isActive&&(this.element.classList.remove("flickity-enabled"),this.element.classList.remove("flickity-rtl"),this.unselectSelectedSlide(),this.cells.forEach((t=>t.destroy())),this.viewport.remove(),this.element.append(...this.slider.children),this.options.accessibility&&(this.element.removeAttribute("tabIndex"),this.element.removeEventListener("keydown",this)),this.isActive=!1,this.emitEvent("deactivate"))},p.destroy=function(){this.deactivate(),t.removeEventListener("resize",this),this.allOff(),this.emitEvent("destroy"),a&&this.$element&&a.removeData(this.element,"flickity"),delete this.element.flickityGUID,delete d[this.guid]},Object.assign(p,l),u.data=function(t){if(t=s.getQueryElement(t))return d[t.flickityGUID]},s.htmlInit(u,"flickity");let{jQueryBridget:y}=t;return a&&y&&y("flickity",u,a),u.setJQuery=function(t){a=t},u.Cell=n,u.Slide=o,u})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(t,require("./core"),require("unidragger"),require("fizzy-ui-utils")):t.Flickity=e(t,t.Flickity,t.Unidragger,t.fizzyUIUtils)}("undefined"!=typeof window?window:this,(function(t,e,i,s){Object.assign(e.defaults,{draggable:">1",dragThreshold:3});let n=e.prototype;function o(){return{x:t.pageXOffset,y:t.pageYOffset}}return Object.assign(n,i.prototype),n.touchActionValue="",e.create.drag=function(){this.on("activate",this.onActivateDrag),this.on("uiChange",this._uiChangeDrag),this.on("deactivate",this.onDeactivateDrag),this.on("cellChange",this.updateDraggable),this.on("pointerDown",this.handlePointerDown),this.on("pointerUp",this.handlePointerUp),this.on("pointerDown",this.handlePointerDone),this.on("dragStart",this.handleDragStart),this.on("dragMove",this.handleDragMove),this.on("dragEnd",this.handleDragEnd),this.on("staticClick",this.handleStaticClick)},n.onActivateDrag=function(){this.handles=[this.viewport],this.bindHandles(),this.updateDraggable()},n.onDeactivateDrag=function(){this.unbindHandles(),this.element.classList.remove("is-draggable")},n.updateDraggable=function(){">1"===this.options.draggable?this.isDraggable=this.slides.length>1:this.isDraggable=this.options.draggable,this.element.classList.toggle("is-draggable",this.isDraggable)},n._uiChangeDrag=function(){delete this.isFreeScrolling},n.handlePointerDown=function(e){if(!this.isDraggable)return void this.bindActivePointerEvents(e);let i="touchstart"===e.type,s="touch"===e.pointerType,n=e.target.matches("input, textarea, select");i||s||n||e.preventDefault(),n||this.focus(),document.activeElement!==this.element&&document.activeElement.blur(),this.dragX=this.x,this.viewport.classList.add("is-pointer-down"),this.pointerDownScroll=o(),t.addEventListener("scroll",this),this.bindActivePointerEvents(e)},n.hasDragStarted=function(t){return Math.abs(t.x)>this.options.dragThreshold},n.handlePointerUp=function(){delete this.isTouchScrolling,this.viewport.classList.remove("is-pointer-down")},n.handlePointerDone=function(){t.removeEventListener("scroll",this),delete this.pointerDownScroll},n.handleDragStart=function(){this.isDraggable&&(this.dragStartPosition=this.x,this.startAnimation(),t.removeEventListener("scroll",this))},n.handleDragMove=function(t,e,i){if(!this.isDraggable)return;t.preventDefault(),this.previousDragX=this.dragX;let s=this.options.rightToLeft?-1:1;this.isWrapping&&(i.x%=this.slideableWidth);let n=this.dragStartPosition+i.x*s;if(!this.isWrapping){let t=Math.max(-this.slides[0].target,this.dragStartPosition);n=n>t?.5*(n+t):n;let e=Math.min(-this.getLastSlide().target,this.dragStartPosition);n=n<e?.5*(n+e):n}this.dragX=n,this.dragMoveTime=new Date},n.handleDragEnd=function(){if(!this.isDraggable)return;let{freeScroll:t}=this.options;t&&(this.isFreeScrolling=!0);let e=this.dragEndRestingSelect();if(t&&!this.isWrapping){let t=this.getRestingPosition();this.isFreeScrolling=-t>this.slides[0].target&&-t<this.getLastSlide().target}else t||e!==this.selectedIndex||(e+=this.dragEndBoostSelect());delete this.previousDragX,this.isDragSelect=this.isWrapping,this.select(e),delete this.isDragSelect},n.dragEndRestingSelect=function(){let t=this.getRestingPosition(),e=Math.abs(this.getSlideDistance(-t,this.selectedIndex)),i=this._getClosestResting(t,e,1),s=this._getClosestResting(t,e,-1);return i.distance<s.distance?i.index:s.index},n._getClosestResting=function(t,e,i){let s=this.selectedIndex,n=1/0,o=this.options.contain&&!this.isWrapping?(t,e)=>t<=e:(t,e)=>t<e;for(;o(e,n)&&(s+=i,n=e,null!==(e=this.getSlideDistance(-t,s)));)e=Math.abs(e);return{distance:n,index:s-i}},n.getSlideDistance=function(t,e){let i=this.slides.length,n=this.options.wrapAround&&i>1,o=n?s.modulo(e,i):e,l=this.slides[o];if(!l)return null;let r=n?this.slideableWidth*Math.floor(e/i):0;return t-(l.target+r)},n.dragEndBoostSelect=function(){if(void 0===this.previousDragX||!this.dragMoveTime||new Date-this.dragMoveTime>100)return 0;let t=this.getSlideDistance(-this.dragX,this.selectedIndex),e=this.previousDragX-this.dragX;return t>0&&e>0?1:t<0&&e<0?-1:0},n.onscroll=function(){let t=o(),e=this.pointerDownScroll.x-t.x,i=this.pointerDownScroll.y-t.y;(Math.abs(e)>3||Math.abs(i)>3)&&this.pointerDone()},e})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("./core")):e(t.Flickity)}("undefined"!=typeof window?window:this,(function(t){const e="http://www.w3.org/2000/svg";function i(t,e,i){this.increment=t,this.direction=e,this.isPrevious="previous"===t,this.isLeft="left"===e,this._create(i)}i.prototype._create=function(t){let e=this.element=document.createElement("button");e.className=`flickity-button flickity-prev-next-button ${this.increment}`;let i=this.isPrevious?"Previous":"Next";e.setAttribute("type","button"),e.setAttribute("aria-label",i),this.disable();let s=this.createSVG(i,t);e.append(s)},i.prototype.createSVG=function(t,i){let s=document.createElementNS(e,"svg");s.setAttribute("class","flickity-button-icon"),s.setAttribute("viewBox","0 0 100 100");let n=document.createElementNS(e,"title");n.append(t);let o=document.createElementNS(e,"path"),l=function(t){if("string"==typeof t)return t;let{x0:e,x1:i,x2:s,x3:n,y1:o,y2:l}=t;return`M ${e}, 50\n    L ${i}, ${o+50}\n    L ${s}, ${l+50}\n    L ${n}, 50\n    L ${s}, ${50-l}\n    L ${i}, ${50-o}\n    Z`}(i);return o.setAttribute("d",l),o.setAttribute("class","arrow"),this.isLeft||o.setAttribute("transform","translate(100, 100) rotate(180)"),s.append(n,o),s},i.prototype.enable=function(){this.element.removeAttribute("disabled")},i.prototype.disable=function(){this.element.setAttribute("disabled",!0)},Object.assign(t.defaults,{prevNextButtons:!0,arrowShape:{x0:10,x1:60,y1:50,x2:70,y2:40,x3:30}}),t.create.prevNextButtons=function(){if(!this.options.prevNextButtons)return;let{rightToLeft:t,arrowShape:e}=this.options,s=t?"right":"left",n=t?"left":"right";this.prevButton=new i("previous",s,e),this.nextButton=new i("next",n,e),this.focusableElems.push(this.prevButton.element),this.focusableElems.push(this.nextButton.element),this.handlePrevButtonClick=()=>{this.uiChange(),this.previous()},this.handleNextButtonClick=()=>{this.uiChange(),this.next()},this.on("activate",this.activatePrevNextButtons),this.on("select",this.updatePrevNextButtons)};let s=t.prototype;return s.updatePrevNextButtons=function(){let t=this.slides.length?this.slides.length-1:0;this.updatePrevNextButton(this.prevButton,0),this.updatePrevNextButton(this.nextButton,t)},s.updatePrevNextButton=function(t,e){if(this.isWrapping&&this.slides.length>1)return void t.enable();let i=this.selectedIndex!==e;t[i?"enable":"disable"](),!i&&document.activeElement===t.element&&this.focus()},s.activatePrevNextButtons=function(){this.prevButton.element.addEventListener("click",this.handlePrevButtonClick),this.nextButton.element.addEventListener("click",this.handleNextButtonClick),this.element.append(this.prevButton.element,this.nextButton.element),this.on("deactivate",this.deactivatePrevNextButtons)},s.deactivatePrevNextButtons=function(){this.prevButton.element.remove(),this.nextButton.element.remove(),this.prevButton.element.removeEventListener("click",this.handlePrevButtonClick),this.nextButton.element.removeEventListener("click",this.handleNextButtonClick),this.off("deactivate",this.deactivatePrevNextButtons)},t.PrevNextButton=i,t})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("./core"),require("fizzy-ui-utils")):e(t.Flickity,t.fizzyUIUtils)}("undefined"!=typeof window?window:this,(function(t,e){function i(){this.holder=document.createElement("div"),this.holder.className="flickity-page-dots",this.dots=[]}i.prototype.setDots=function(t){let e=t-this.dots.length;e>0?this.addDots(e):e<0&&this.removeDots(-e)},i.prototype.addDots=function(t){let e=new Array(t).fill().map(((t,e)=>{let i=document.createElement("button");i.setAttribute("type","button");let s=e+1+this.dots.length;return i.className="flickity-page-dot",i.textContent=`View slide ${s}`,i}));this.holder.append(...e),this.dots=this.dots.concat(e)},i.prototype.removeDots=function(t){this.dots.splice(this.dots.length-t,t).forEach((t=>t.remove()))},i.prototype.updateSelected=function(t){this.selectedDot&&(this.selectedDot.classList.remove("is-selected"),this.selectedDot.removeAttribute("aria-current")),this.dots.length&&(this.selectedDot=this.dots[t],this.selectedDot.classList.add("is-selected"),this.selectedDot.setAttribute("aria-current","step"))},t.PageDots=i,Object.assign(t.defaults,{pageDots:!0}),t.create.pageDots=function(){this.options.pageDots&&(this.pageDots=new i,this.handlePageDotsClick=this.onPageDotsClick.bind(this),this.on("activate",this.activatePageDots),this.on("select",this.updateSelectedPageDots),this.on("cellChange",this.updatePageDots),this.on("resize",this.updatePageDots),this.on("deactivate",this.deactivatePageDots))};let s=t.prototype;return s.activatePageDots=function(){this.pageDots.setDots(this.slides.length),this.focusableElems.push(...this.pageDots.dots),this.pageDots.holder.addEventListener("click",this.handlePageDotsClick),this.element.append(this.pageDots.holder)},s.onPageDotsClick=function(t){let e=this.pageDots.dots.indexOf(t.target);-1!==e&&(this.uiChange(),this.select(e))},s.updateSelectedPageDots=function(){this.pageDots.updateSelected(this.selectedIndex)},s.updatePageDots=function(){this.pageDots.dots.forEach((t=>{e.removeFrom(this.focusableElems,t)})),this.pageDots.setDots(this.slides.length),this.focusableElems.push(...this.pageDots.dots)},s.deactivatePageDots=function(){this.pageDots.holder.remove(),this.pageDots.holder.removeEventListener("click",this.handlePageDotsClick)},t.PageDots=i,t})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("./core")):e(t.Flickity)}("undefined"!=typeof window?window:this,(function(t){function e(t,e){this.autoPlay=t,this.onTick=e,this.state="stopped",this.onVisibilityChange=this.visibilityChange.bind(this),this.onVisibilityPlay=this.visibilityPlay.bind(this)}e.prototype.play=function(){if("playing"===this.state)return;document.hidden?document.addEventListener("visibilitychange",this.onVisibilityPlay):(this.state="playing",document.addEventListener("visibilitychange",this.onVisibilityChange),this.tick())},e.prototype.tick=function(){if("playing"!==this.state)return;let t="number"==typeof this.autoPlay?this.autoPlay:3e3;this.clear(),this.timeout=setTimeout((()=>{this.onTick(),this.tick()}),t)},e.prototype.stop=function(){this.state="stopped",this.clear(),document.removeEventListener("visibilitychange",this.onVisibilityChange)},e.prototype.clear=function(){clearTimeout(this.timeout)},e.prototype.pause=function(){"playing"===this.state&&(this.state="paused",this.clear())},e.prototype.unpause=function(){"paused"===this.state&&this.play()},e.prototype.visibilityChange=function(){this[document.hidden?"pause":"unpause"]()},e.prototype.visibilityPlay=function(){this.play(),document.removeEventListener("visibilitychange",this.onVisibilityPlay)},Object.assign(t.defaults,{pauseAutoPlayOnHover:!0}),t.create.player=function(){this.player=new e(this.options.autoPlay,(()=>{this.next(!0)})),this.on("activate",this.activatePlayer),this.on("uiChange",this.stopPlayer),this.on("pointerDown",this.stopPlayer),this.on("deactivate",this.deactivatePlayer)};let i=t.prototype;return i.activatePlayer=function(){this.options.autoPlay&&(this.player.play(),this.element.addEventListener("mouseenter",this))},i.playPlayer=function(){this.player.play()},i.stopPlayer=function(){this.player.stop()},i.pausePlayer=function(){this.player.pause()},i.unpausePlayer=function(){this.player.unpause()},i.deactivatePlayer=function(){this.player.stop(),this.element.removeEventListener("mouseenter",this)},i.onmouseenter=function(){this.options.pauseAutoPlayOnHover&&(this.player.pause(),this.element.addEventListener("mouseleave",this))},i.onmouseleave=function(){this.player.unpause(),this.element.removeEventListener("mouseleave",this)},t.Player=e,t})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("./core"),require("fizzy-ui-utils")):e(t.Flickity,t.fizzyUIUtils)}("undefined"!=typeof window?window:this,(function(t,e){let i=t.prototype;return i.insert=function(t,e){let i=this._makeCells(t);if(!i||!i.length)return;let s=this.cells.length;e=void 0===e?s:e;let n=function(t){let e=document.createDocumentFragment();return t.forEach((t=>e.appendChild(t.element))),e}(i),o=e===s;if(o)this.slider.appendChild(n);else{let t=this.cells[e].element;this.slider.insertBefore(n,t)}if(0===e)this.cells=i.concat(this.cells);else if(o)this.cells=this.cells.concat(i);else{let t=this.cells.splice(e,s-e);this.cells=this.cells.concat(i).concat(t)}this._sizeCells(i),this.cellChange(e),this.positionSliderAtSelected()},i.append=function(t){this.insert(t,this.cells.length)},i.prepend=function(t){this.insert(t,0)},i.remove=function(t){let i=this.getCells(t);if(!i||!i.length)return;let s=this.cells.length-1;i.forEach((t=>{t.remove();let i=this.cells.indexOf(t);s=Math.min(i,s),e.removeFrom(this.cells,t)})),this.cellChange(s),this.positionSliderAtSelected()},i.cellSizeChange=function(t){let e=this.getCell(t);if(!e)return;e.getSize();let i=this.cells.indexOf(e);this.cellChange(i)},i.cellChange=function(t){let e=this.selectedElement;this._positionCells(t),this._updateWrapShiftCells(),this.setGallerySize();let i=this.getCell(e);i&&(this.selectedIndex=this.getCellSlideIndex(i)),this.selectedIndex=Math.min(this.slides.length-1,this.selectedIndex),this.emitEvent("cellChange",[t]),this.select(this.selectedIndex)},t})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("./core"),require("fizzy-ui-utils")):e(t.Flickity,t.fizzyUIUtils)}("undefined"!=typeof window?window:this,(function(t,e){const i="data-flickity-lazyload",s=`${i}-src`,n=`${i}-srcset`,o=`img[${i}], img[${s}], img[${n}], source[${n}]`;t.create.lazyLoad=function(){this.on("select",this.lazyLoad),this.handleLazyLoadComplete=this.onLazyLoadComplete.bind(this)};let l=t.prototype;function r(t){if(t.matches("img")){let e=t.getAttribute(i),o=t.getAttribute(s),l=t.getAttribute(n);if(e||o||l)return t}return[...t.querySelectorAll(o)]}function h(t,e){this.img=t,this.onComplete=e,this.load()}return l.lazyLoad=function(){let{lazyLoad:t}=this.options;if(!t)return;let e="number"==typeof t?t:0;this.getAdjacentCellElements(e).map(r).flat().forEach((t=>new h(t,this.handleLazyLoadComplete)))},l.onLazyLoadComplete=function(t,e){let i=this.getParentCell(t),s=i&&i.element;this.cellSizeChange(s),this.dispatchEvent("lazyLoad",e,s)},h.prototype.handleEvent=e.handleEvent,h.prototype.load=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this);let t=this.img.getAttribute(i)||this.img.getAttribute(s),e=this.img.getAttribute(n);this.img.src=t,e&&this.img.setAttribute("srcset",e),this.img.removeAttribute(i),this.img.removeAttribute(s),this.img.removeAttribute(n)},h.prototype.onload=function(t){this.complete(t,"flickity-lazyloaded")},h.prototype.onerror=function(t){this.complete(t,"flickity-lazyerror")},h.prototype.complete=function(t,e){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this),(this.img.parentNode.matches("picture")?this.img.parentNode:this.img).classList.add(e),this.onComplete(this.img,t)},t.LazyLoader=h,t})),function(t,e){"object"==typeof module&&module.exports?module.exports=e(require("./core"),require("imagesloaded")):e(t.Flickity,t.imagesLoaded)}("undefined"!=typeof window?window:this,(function(t,e){return t.create.imagesLoaded=function(){this.on("activate",this.imagesLoaded)},t.prototype.imagesLoaded=function(){if(!this.options.imagesLoaded)return;e(this.slider).on("progress",((t,e)=>{let i=this.getParentCell(e.img);this.cellSizeChange(i&&i.element),this.options.freeScroll||this.positionSliderAtSelected()}))},t}));
                                                                                                                                                                                                                                                                                                                                                                                                                  
                  
  //backwards compatibility with flexslider
  if( $('.slider, .flexslider').length > 0 ){
    $('.slider, .flexslider').find('li').unwrap();
    $('.slider, .flexslider').flickity({
      pageDots: usePageDots,
      imagesLoaded: true,
      arrowShape: arrowSize,
      lazyLoad: 2
    });
  }

  utils.createAccordion('.toggle-all--true', 'h4.toggle', 'ul.toggle_list');
  utils.createAccordion('.footer_menu', 'h6', 'ul');
  utils.createAccordion('.footer_content', 'h6', 'div.toggle_content');
  utils.createAccordion('.product_section .accordion-tabs', '.tabs li > a', '.tabs-content li');

  utils.mobileParentActiveAccordion('#mobile_menu', 'li.sublink > a.parent-link--true span', 'li.sublink ul');
  utils.mobileAccordion('#mobile_menu', 'li.sublink > a.parent-link--false', 'li.sublink ul');

  utils.initializeTabs();
  utils.resizeActionButtons();
  faqAccordion.init();

  $(window).on('resize', function() {
    utils.resizeActionButtons();
  });

  //Sidebar toggle check
  if ($(window).width() <= 798) {
    utils.createAccordion('.toggle-all--false', 'h4.toggle', 'ul.toggle_list');
  }

  $('body').on('click', '.menu-toggle', function(e) {
    var $content = $(this).next('ul');
    $content.slideToggle();
    $(this).toggleClass('active');
    $(this).attr('aria-expanded', $(this).attr('aria-expanded') == 'true' ? 'false' : 'true');
  });

  if ($(window).width() >= 959) {
    var modal_width = '870px';
    if($(window).width() >= 1200 || $('html').hasClass('ie')) {
      modal_width = '1110px'
    }
  }

  if (Shopify.theme_settings.collection_swatches){
    if ($(window).width() > 798) {
      $('body').on('mouseenter', '.collection_swatches', function() {
        $('.swatch span', $(this)).each(function() {
          if($(this).data("image").indexOf("no-image") == -1) {
            $('<img/>')[0].src = $(this).data("image");
          }
        });
      });
      $('body').on('mouseenter', '.swatch span', function() {
        if($(this).data("image").indexOf("no-image") == -1) {
          $(this).parents('.thumbnail').find('.image__container img:not(.secondary)').attr('src', $(this).data("image"));
          $(this).parents('.thumbnail').find('.image__container img:not(.secondary)').attr('srcset', $(this).data("image"));
        }
      });
    }
  }

  //Terms of service settings for minicart
  if (Shopify.theme_settings.display_tos_checkbox){
    $('body').on('click touchstart', '.cart_content .tos_label', function() {
      $(this).prev('input').prop('checked', true);
    });
  }

  if (Shopify.theme_settings.display_tos_checkbox){
    //Terms of service on mini-cart && cart page
    $('body').on('click', ".tos_warning .action_button", function(e) {
      if ($(this).parents('form').find('.tos_agree').is(':checked')) {
        // Check if we are on the cart page or mini cart
        if (Shopify.theme_settings.go_to_checkout || $('body').hasClass('cart')){
          $(this).submit();
        } else {
          // Redirect to cart page
          e.preventDefault();
          document.location.href = "/cart";
        }
      } else {
        var warning = '<p class="warning animated bounceIn">' + Shopify.translation.agree_to_terms_warning + '</p>';
        if ($('p.warning').length == 0) {
          $(this).before(warning);
        }
        return false;
      }
    });
  } else if (!Shopify.theme_settings.go_to_checkout){
    $('body').on('click', ".cart_content .action_button", function(e) {
      // Redirect to cart page
      e.preventDefault();
      document.location.href = "/cart";
    });
  }


  if (Shopify.theme_settings.collection_secondary_image){
    imageFunctions.showSecondaryImage();
  }

  // Contact form checkbox validation
  if ($('[data-is-required]').length){
    var $checkboxGroup = $('.contact-block--checkbox input');
    $checkboxGroup.prop('required', true);

    $('.contact-block--checkbox [data-is-required] input').on('change', function(){
      $checkboxGroup.prop('required', true);
      if ($checkboxGroup.is(":checked")) {
        $checkboxGroup.prop('required', false);
      }
    })
  }

  var $contact_form = $('.newsletter .contact-form');
  $contact_form.each(function() {
    var $cf = $(this);
    $cf.on('submit', function (e) {
      if($('input[name="challenge"]', $cf).val() !== "true") {
        $.ajax({
          type: $cf.attr('method'),
          url: $cf.attr('action'),
          data: $cf.serialize(),
          success: function (data) {
            $cf.fadeOut("slow", function(){
              $cf.prev('.message').html(Shopify.translation.newsletter_success_text);
            });
          },
          error: function(data) {
            $('input[name="challenge"]', $cf).val('true');
            $cf.submit();
          }
        });
        e.preventDefault();
      }
    });
  });

  $('.maps').click(function () {
    $('.maps iframe').css("pointer-events", "auto");
  });

  if (Shopify.theme_settings.pagination_type == 'load_more' ){
    enableLoadMoreProducts();
  }

  if (Shopify.theme_settings.pagination_type == 'infinite_scroll'){
    enableInfiniteScroll();
  }

  if (Shopify.theme_settings.search_pagination_type == 'load_more' ){
    enableLoadMoreSearch();
  }

  if (Shopify.theme_settings.search_pagination_type == 'infinite_scroll' ){
    enableInfiniteSearchScroll();
  }

  /*============================================================================
    Start of cart-related functionality
  ==============================================================================*/

  function ajaxSubmitCart(cart) {
    $cart = cart;
    $.ajax({
      url: '/cart/update.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: $cart.serialize(),
      success: function (data) {
        refreshCart(data);
      }
    });
  }

  function updateCartItemQuantity(cartItem) {
    $.ajax({
      url: '/cart/change.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: {
        quantity: cartItem.quantity,
        line: cartItem.lineID
      },
      success: function (data) {
        Shopify.getCart(function(cart){
        var cartItemsArray = data.items;
        var lineIDIndex = cartItem.lineID - 1;
        var totalCartItems = cartItem.parentCartForm.find('[data-variant-id]').length;
        var $quantityInputs = cartItem.parentCartForm.find('[data-variant-id="' + cartItem.variantID + '"] input');
        var initialQuantityTotal = 0;
        var apiQuantityTotal = 0;
        var apiLineItemQuantity = typeof data.items[lineIDIndex] !== 'undefined' ? data.items[lineIDIndex].quantity : 0;

        // Check if item has a "Buy X get Y" deal
        if ($quantityInputs.length > 1) {
          // Multiple inputs

          // Get all the quantities of same variants in the cart (including BOGO) in HTML
          $.each($quantityInputs, function (i, input) {
            initialQuantityTotal += parseInt($(input).val());
          });

          // Get quantities from cart object returned from API
          cartItemsArray.forEach(function (item) {
            if (item.variant_id === cartItem.variantID) {
              apiQuantityTotal += item.quantity;
            }
          })
        } else {
          // Single input
          initialQuantityTotal = parseInt($quantityInputs.val());
          apiQuantityTotal = typeof data.items[lineIDIndex] !== 'undefined' ? data.items[lineIDIndex].quantity : 0;
        }

        //Checks to see if there is enough inventory to update to an increased amount
        if (initialQuantityTotal > 0 && initialQuantityTotal > apiQuantityTotal) {
          if (apiQuantityTotal == 1) {
            items_left_text = Shopify.translation.one_item_left;
          } else {
            items_left_text = Shopify.translation.items_left_text;
          }

          $('.warning--quantity').remove();

          //Check if Buy one get one product
          if (totalCartItems < cartItemsArray.length) {

            if (cartItem.parentCartForm.data('cart-form') === 'cart-template') {
              // Refreshes cart if inventory is available
              cartItem.parentCartForm.submit();
            } else {
              refreshCart(data);
            }
          } else {
            var warning = '<p class="warning warning--quantity animated bounceIn">' + apiQuantityTotal + ' ' + items_left_text + '</p>';
            cartItem.parentCartForm.find("[data-line-id='" + cartItem.lineID + "'] input").parent().after(warning);
            cartItem.parentCartForm.find("[data-line-id='" + cartItem.lineID + "'] input").val(apiLineItemQuantity);
          }

        } else if (cartItem.parentCartForm.data('cart-form') === 'cart-template') {
          // Refreshes cart if inventory is available
          cartItem.parentCartForm.submit();
        } else {
          refreshCart(data);
        }
      }.bind(this));
      }
    });
  }

  function refreshCartID() {
    var cartItem = document.querySelectorAll('.cart__item');

    for(var i = 0; i < cartItem.length; i++) {
      var lineIndex = i + 1;
      var dataLineId = cartItem[i].querySelectorAll('[data-line-id]');

      for(var c = 0; c < dataLineId.length; c++) {
        dataLineId[c].dataset.lineId = lineIndex;
      }
    }
  }

  function refreshCart(cart) {
    $(".cart_count").empty();
    $cartBtn = $(".cart_count");
    var value = $cartBtn.text() || '0';
    var cart_items_html = "";
    var cart_discounts_html = "";
    var cart_action_html = "";
    var cart_savings_html = "";
    var $cart_form = $('[data-cart-form]');
    var productHasSale = false;
    var productCompareAtPrice = 0;
    var productFinalPrice = 0;

    $cart_form.data('total-discount', cart.total_discount);

    $cartBtn.text(value.replace(/[0-9]+/,cart.item_count));

    if (cart.item_count == 0) {
      $('.js-empty-cart__message').removeClass('hidden');
      $cart_form.addClass('hidden');
    } else {
      $('.js-empty-cart__message').addClass('hidden');
      $cart_form.removeClass('hidden');

      var total_saving = 0; // adding counter variables for total cart savings
      var saving = 0;

      $.each(cart.items, function(index, item) {
        var itemDiscounts = item.discounts;
        var discountMessage = "";

        for (i=0; i < itemDiscounts.length; i++) {
          var amount = Shopify.formatMoney(itemDiscounts[i].amount, $('body').data('money-format'));
          var title = itemDiscounts[i].title;
          discountMessage = '<p class="notification-discount meta">' + title + '</p>';
        }
        var line_id = index + 1;

        cart_items_html += '<li class="mini-cart__item clearfix" data-cart-item data-line-id="' + line_id + '" data-variant-id="' + item.id + '">' +
          '<a href="' + item.url +'">';
        if (item.image) {
          cart_items_html += '<div class="cart_image">' +
              '<img src="' + item.image.replace(/(\.[^.]*)$/, "_compact$1").replace('http:', '') + '" alt="' + htmlEncode(item.title) + '" />' +
            '</div></a>';
        }

        cart_items_html += '<div class="mini-cart__item--content"><div class="mini-cart__item__title"><div class="item_title"><a href="' + item.url + '">' + item.title + '</a></div>';

        if(item.properties) {
          $.each(item.properties, function(title, value) {
            if (value) {
              cart_items_html += '<div class="line-item">' + title +': ' + value + ' </div>';
            }
          });
        }

        cart_items_html += '<strong class="right price">';

        $.ajax({
          dataType: "json",
          async: false,
          cache: false,
          url: "/products/" + item.handle + ".js",
          success: function(data) {
            // If item has more than one variant, need to make sure we are pulling data from the correct variant
            if (data.variants) {
              var itemVariants = data.variants;
              if (itemVariants.length > 1) {
                for (v = 0; v < itemVariants.length; v++) {
                  if (itemVariants[v].id == item.id) {
                    var data = itemVariants[v];
                  }
                }
              }
            }

            // If compare at price exists then item is on sale
            if (data.compare_at_price) {
              if(data.compare_at_price > data.price) {
                productHasSale = true;
                productCompareAtPrice = data.compare_at_price;
                productFinalPrice = data.price;
              }
            } else {
              // Check required for non-sale items
              productHasSale = false;
            }
          }
        });

        if(productHasSale == true) {
          //puts the slash through the old item price
          var itemPrice = Shopify.formatMoney(productFinalPrice, $('body').data('money-format')) + ' </span><span class="money was_price">' + Shopify.formatMoney(productCompareAtPrice, $('body').data('money-format')) + '</span>';
          cart_items_html += '<span class="money sale">' + itemPrice + '</strong>';

          // Total savings
          saving = (productCompareAtPrice - productFinalPrice) * item.quantity;
          total_saving = saving + total_saving;
        } else {
          if (item.price > item.final_price) {
            //puts the slash through the old item price
            var itemPrice = Shopify.formatMoney(item.final_price, $('body').data('money-format')) + ' </span><span class="money was_price">' + Shopify.formatMoney(item.price, $('body').data('money-format')) + '</span>';
            cart_items_html += '<span class="money sale">' + itemPrice + '</strong>';
          } else {
            var itemPrice = Shopify.formatMoney(item.price, $('body').data('money-format'));
            cart_items_html += '<span class="money">' + itemPrice + '</span></strong>';
          }
        }

        if (item.price > item.final_price) {
          cart_items_html += discountMessage;
        }

        cart_items_html += '<div class="left product-quantity-box">';
        cart_items_html += '<span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"></span></span>';
        cart_items_html += '<input type="number" min="0" class="quantity" name="updates[]" id="updates_' + item.id + '" value="' + item.quantity + '" data-cart-quantity-input="mini-cart" />';
        cart_items_html += '<span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"></span></span>';
        cart_items_html += '</div></div></div>';
        cart_items_html += '<a href="/cart/change?line=' + line_id + '&amp;quantity=0" class="js-cart-remove-btn cart__remove-btn" data-line-id="' + line_id + '" data-remove-item="mini-cart"><span class="remove-icon"></span></a>';

      });

      var cartDiscounts = cart.cart_level_discount_applications;
      var cartDiscountMessage = "";

      for (i=0; i < cartDiscounts.length; i++) {
        var amount = Shopify.formatMoney(cartDiscounts[i].total_allocated_amount, $('body').data('money-format'));
        var title = cartDiscounts[i].title;

        cart_discounts_html += '<span class="cart_discounts--title">' + title + '</span>';
        cart_discounts_html += '<span class="cart_discounts--price">';
        cart_discounts_html += '-<span class="money">' + amount + '</span></span>';
      }

      cart_action_html += '<span class="right"><span class="money">' + Shopify.formatMoney(cart.total_price, $('body').data('money-format')) + '</span></span>' + '<span>' + Shopify.translation.cart_subtotal_text + '</span>';
      total_saving = total_saving + cart.total_discount;
      if(Shopify.theme_settings.display_savings && total_saving > 0) {
        cart_savings_html = '<span class="right"><span class="money">' + Shopify.formatMoney(total_saving, $('body').data('money-format')) + '</span></span>' +
            '<span>' + Shopify.translation.cart_savings_text + '</span>';
      } else {
        cart_savings_html = "";
      }
    }

    $('.js-cart_items').html(cart_items_html);
    $('.js-cart_discounts').html(cart_discounts_html);
    $('.js-cart_subtotal').html(cart_action_html);
    $('.js-cart_savings').html(cart_savings_html);

    if (Shopify.theme_settings.show_multiple_currencies){
      convertCurrencies();
    }
  }

  $('body').on('change', '[data-cart-quantity-input]', function() {
    var cartItem = {
      lineID: $(this).parents('[data-cart-item]').data('line-id'),
      variantID: $(this).parents('[data-cart-item]').data('variant-id'),
      quantity: $(this).val(),
      parentCartForm: $(this).parents('[data-cart-form]'),
      totalDiscount: $(this).parents('[data-cart-form]').data('total-discount'),
      $element : $(this).parents('[data-cart-item]')
    }
    // Disable button after click to prevent multiple clicks
    $(this).parents('.product-quantity-box').find('.js-change-quantity').addClass('is-disabled');
    updateCartItemQuantity(cartItem);
  });

  $('body').on('click', '[data-remove-item]', function(e) {
    e.preventDefault();
    var cartItem = {
      lineID: $(this).parents('[data-cart-item]').data('line-id'),
      variantID: $(this).parents('[data-cart-item]').data('variant-id'),
      quantity: 0,
      parentCartForm: $(this).parents('[data-cart-form]'),
      totalDiscount: $(this).parents('[data-cart-form]').data('total-discount'),
      $element : $(this).parents('[data-cart-item]')
    }
    cartItem.$element.addClass('animated fadeOutLeft');

    updateCartItemQuantity(cartItem);

    if (cartItem.parentCartForm.data('cart-form') === 'cart-template') {
      cartItem.$element.find('input').val('0');
      cartItem.parentCartForm.submit();
    }

    if (cartItem.parentCartForm.data('cart-form') === 'mini-cart') {
      cartItem.$element.find('input').val('0');
    }
  });

  if (Shopify.theme_settings.cart_action == 'ajax'){
    $(document).on('click', '.ajax-submit', function(e) { 
      e.preventDefault();
      var $addToCartForm = $(this).closest('form');
      var $addToCartBtn = $addToCartForm.find('.add_to_cart');
      //Refresh page on quick shop add to cart if on cart page
      if($('body').hasClass('cart')) {
        $addToCartForm.submit();
      }
      console.log('== $addToCartForm.serialize ==> ',$addToCartForm.serialize());
      $.ajax({
        url: '/cart/add.js',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: $addToCartForm.serialize(),
        beforeSend: function() {
          $addToCartBtn.attr('disabled', 'disabled').addClass('disabled');
          $addToCartBtn.find('span').removeClass("fadeInDown").addClass('animated zoomOut');
        },
        success: function(itemData) {
          $addToCartBtn.find('.checkmark').addClass('checkmark-active');

          window.setTimeout(function(){
            $addToCartBtn.removeAttr('disabled').removeClass('disabled');
            $addToCartBtn.find('.checkmark').removeClass('checkmark-active');
            $addToCartBtn.find('span').removeClass('zoomOut').addClass('fadeInDown');
          }, 1000);
          console.log('add_to_cart_gtag',add_to_cart_gtag);
          $.ajax({
            url: '/cart.js',
            dataType: "json",
            cache: false,
            success: function(cart) {
              setTimeout(function() {
                refreshCart(cart);
                if($('body').hasClass('fancybox-active')) {
                  $.fancybox.close();
                }
                if (window.SLIDECART_STATE && window.SLIDECART_STATE().settings.enabled) {
                  setTimeout(function () {
                    //window.SLIDECART_UPDATE();
                    window.HS_SLIDE_CART_UPDATE();
                    //window.SLIDECART_OPEN();
                    window.HS_SLIDE_CART_OPEN();
                  }, 300);
                }else{
                  //original
                  if($('#header').is(':visible')) {
                    $('#header .cart_container').addClass('active_link');
                  } else if ($('.sticky_nav--stick').length) {
                    $('.sticky_nav .cart_container').addClass('active_link');
                  } else {
                    $('.top_bar .cart_container').addClass('active_link');
                  }
                }
                //block scrolling on mobile
                if ($(window).width() <= 798) {
                  var $cart_container = $(this).parent();
                  if($cart_container.hasClass('active_link')) {
                    $('body').addClass('blocked-scroll');
                  } else {
                    $('body').addClass('blocked-scroll');
                  }
                }
              }, 850)
            }
          });
        },
        error: function(XMLHttpRequest) {
          var response = eval('(' + XMLHttpRequest.responseText + ')');
          response = response.description;
          $('.warning').remove();
          var warning = '<p class="warning animated bounceIn">' + response.replace('All 1 ', 'All ') + '</p>';
          $addToCartForm.after(warning);
          $addToCartBtn.removeAttr('disabled').removeClass('disabled');
          $addToCartBtn.find('span').text(Shopify.translation.add_to_cart).removeClass('zoomOut').addClass('zoomIn');
        }
      });

      return false;
    });
  }

  productPage.productSwatches();

});

/*============================================================================
  Swatch options - second and third swatch 'sold-out' will update based on availability of previous options selected
==============================================================================*/
Shopify.updateOptionsInSelector = function(selectorIndex, parent) {
  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = $(parent + ' .single-option-selector:eq(0)');
      break;
    case 1:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      var selector = $(parent + ' .single-option-selector:eq(1)');
      break;
    case 2:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      key += ' / ' + $(parent + ' .single-option-selector:eq(1)').val();
      var selector = $(parent + ' .single-option-selector:eq(2)');
  }
  var availableOptions = Shopify.optionsMap[key];
  $(parent + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
    if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
      $(this).removeClass('soldout').find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
    }
    else {
      $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled','disabled');
    }
  });
};
/*Aman Modified code on 12 June, 2023
Shopify.linkOptionSelectors = function(product, parent) {
    // Building our mapping object.
    Shopify.optionsMap = {};
    for (var i=0; i<product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant.available) {
        // Gathering values for the 1st drop-down.
        Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
        Shopify.optionsMap['root'].push(variant.option1);
        Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
        // Gathering values for the 2nd drop-down.
        if (product.options.length > 1) {
          var key = variant.option1;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option2);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
        // Gathering values for the 3rd drop-down.
        if (product.options.length === 3) {
          var key = variant.option1 + ' / ' + variant.option2;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option3);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
      }
    }
    // Update options right away.
    Shopify.updateOptionsInSelector(0, parent);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1, parent);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
    // When there is an update in the first dropdown.
    $(parent + " .single-option-selector:eq(0)").change(function() {
      Shopify.updateOptionsInSelector(1, parent);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      return true;
    });
    // When there is an update in the second dropdown.
    $(parent + " .single-option-selector:eq(1)").change(function() {
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      return true;
    });
};

*/
//Used for cart functionality
function htmlEncode(value){
    if (value) {
        return $('<div/>').text(value).html();
    } else {
        return '';
    }
}

//Check if device is touch-enabled
function is_touch_device() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};

//Differentiate between mobile and touch screen laptops
var touch_device = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

/* option_selection.js */
function floatToString(t,e){var o=t.toFixed(e).toString();return o.match(/^\.\d+/)?"0"+o:o}if("undefined"==typeof Shopify)var Shopify={};Shopify.each=function(t,e){for(var o=0;o<t.length;o++)e(t[o],o)},Shopify.map=function(t,e){for(var o=[],i=0;i<t.length;i++)o.push(e(t[i],i));return o},Shopify.arrayIncludes=function(t,e){for(var o=0;o<t.length;o++)if(t[o]==e)return!0;return!1},Shopify.uniq=function(t){for(var e=[],o=0;o<t.length;o++)Shopify.arrayIncludes(e,t[o])||e.push(t[o]);return e},Shopify.isDefined=function(t){return"undefined"==typeof t?!1:!0},Shopify.getClass=function(t){return Object.prototype.toString.call(t).slice(8,-1)},Shopify.extend=function(t,e){function o(){}o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t,t.baseConstructor=e,t.superClass=e.prototype},Shopify.locationSearch=function(){return window.location.search},Shopify.locationHash=function(){return window.location.hash},Shopify.replaceState=function(t){window.history.replaceState({},document.title,t)},Shopify.urlParam=function(t){var e=RegExp("[?&]"+t+"=([^&#]*)").exec(Shopify.locationSearch());return e&&decodeURIComponent(e[1].replace(/\+/g," "))},Shopify.newState=function(t,e){var o;return o=Shopify.urlParam(t)?Shopify.locationSearch().replace(RegExp("("+t+"=)[^&#]+"),"$1"+e):""===Shopify.locationSearch()?"?"+t+"="+e:Shopify.locationSearch()+"&"+t+"="+e,o+Shopify.locationHash()},Shopify.setParam=function(t,e){Shopify.replaceState(Shopify.newState(t,e))},Shopify.Product=function(t){Shopify.isDefined(t)&&this.update(t)},Shopify.Product.prototype.update=function(t){for(property in t)this[property]=t[property]},Shopify.Product.prototype.optionNames=function(){return"Array"==Shopify.getClass(this.options)?this.options:[]},Shopify.Product.prototype.optionValues=function(t){if(!Shopify.isDefined(this.variants))return null;var e=Shopify.map(this.variants,function(e){var o="option"+(t+1);return void 0==e[o]?null:e[o]});return null==e[0]?null:Shopify.uniq(e)},Shopify.Product.prototype.getVariant=function(t){var e=null;return t.length!=this.options.length?e:(Shopify.each(this.variants,function(o){for(var i=!0,r=0;r<t.length;r++){var n="option"+(r+1);o[n]!=t[r]&&(i=!1)}return 1==i?void(e=o):void 0}),e)},Shopify.Product.prototype.getVariantById=function(t){for(var e=0;e<this.variants.length;e++){var o=this.variants[e];if(t==o.id)return o}return null},Shopify.money_format="$",Shopify.formatMoney=function(t,e){function o(t,e){return"undefined"==typeof t?e:t}function i(t,e,i,r){if(e=o(e,2),i=o(i,","),r=o(r,"."),isNaN(t)||null==t)return 0;t=(t/100).toFixed(e);var n=t.split("."),a=n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+i),s=n[1]?r+n[1]:"";return a+s}"string"==typeof t&&(t=t.replace(".",""));var r="",n=/\{\{\s*(\w+)\s*\}\}/,a=e||this.money_format;switch(a.match(n)[1]){case"amount":r=i(t,2);break;case"amount_no_decimals":r=i(t,0);break;case"amount_with_comma_separator":r=i(t,2,".",",");break;case"amount_with_apostrophe_separator":r=i(t,2,"'",".");break;case"amount_no_decimals_with_comma_separator":r=i(t,0,".",",")}return a.replace(n,r)},Shopify.OptionSelectors=function(t,e){return this.selectorDivClass="selector-wrapper",this.selectorClass="single-option-selector",this.variantIdFieldIdSuffix="-variant-id",this.variantIdField=null,this.historyState=null,this.selectors=[],this.domIdPrefix=t,this.product=new Shopify.Product(e.product),this.onVariantSelected=Shopify.isDefined(e.onVariantSelected)?e.onVariantSelected:function(){},this.replaceSelector(t),this.initDropdown(),e.enableHistoryState&&(this.historyState=new Shopify.OptionSelectors.HistoryState(this)),!0},Shopify.OptionSelectors.prototype.initDropdown=function(){var t={initialLoad:!0},e=this.selectVariantFromDropdown(t);if(!e){var o=this;setTimeout(function(){o.selectVariantFromParams(t)||o.fireOnChangeForFirstDropdown.call(o,t)})}},Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown=function(t){this.selectors[0].element.onchange(t)},Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown=function(t){var e=this.selectVariantFromParams(t);e||this.selectVariantFromDropdown(t)},Shopify.OptionSelectors.prototype.replaceSelector=function(t){var e=document.getElementById(t),o=e.parentNode;Shopify.each(this.buildSelectors(),function(t){o.insertBefore(t,e)}),e.style.display="none",this.variantIdField=e},Shopify.OptionSelectors.prototype.selectVariantFromDropdown=function(t){var e=document.getElementById(this.domIdPrefix).querySelector("[selected]");if(e||(e=document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')),!e)return!1;var o=e.value;return this.selectVariant(o,t)},Shopify.OptionSelectors.prototype.selectVariantFromParams=function(t){var e=Shopify.urlParam("variant");return this.selectVariant(e,t)},Shopify.OptionSelectors.prototype.selectVariant=function(t,e){var o=this.product.getVariantById(t);if(null==o)return!1;for(var i=0;i<this.selectors.length;i++){var r=this.selectors[i].element,n=r.getAttribute("data-option"),a=o[n];null!=a&&this.optionExistInSelect(r,a)&&(r.value=a)}return"undefined"!=typeof jQuery?jQuery(this.selectors[0].element).trigger("change",e):this.selectors[0].element.onchange(e),!0},Shopify.OptionSelectors.prototype.optionExistInSelect=function(t,e){for(var o=0;o<t.options.length;o++)if(t.options[o].value==e)return!0},Shopify.OptionSelectors.prototype.insertSelectors=function(t,e){Shopify.isDefined(e)&&this.setMessageElement(e),this.domIdPrefix="product-"+this.product.id+"-variant-selector";var o=document.getElementById(t);Shopify.each(this.buildSelectors(),function(t){o.appendChild(t)})},Shopify.OptionSelectors.prototype.buildSelectors=function(){for(var t=0;t<this.product.optionNames().length;t++){var e=new Shopify.SingleOptionSelector(this,t,this.product.optionNames()[t],this.product.optionValues(t));e.element.disabled=!1,this.selectors.push(e)}var o=this.selectorDivClass,i=this.product.optionNames(),r=Shopify.map(this.selectors,function(t){var e=document.createElement("div");if(e.setAttribute("class",o),i.length>1){var r=document.createElement("label");r.htmlFor=t.element.id,r.innerHTML=t.name,e.appendChild(r)}return e.appendChild(t.element),e});return r},Shopify.OptionSelectors.prototype.selectedValues=function(){for(var t=[],e=0;e<this.selectors.length;e++){var o=this.selectors[e].element.value;t.push(o)}return t},Shopify.OptionSelectors.prototype.updateSelectors=function(t,e){var o=this.selectedValues(),i=this.product.getVariant(o);i?(this.variantIdField.disabled=!1,this.variantIdField.value=i.id):this.variantIdField.disabled=!0,this.onVariantSelected(i,this,e),null!=this.historyState&&this.historyState.onVariantChange(i,this,e)},Shopify.OptionSelectorsFromDOM=function(t,e){var o=e.optionNames||[],i=e.priceFieldExists||!0,r=e.delimiter||"/",n=this.createProductFromSelector(t,o,i,r);e.product=n,Shopify.OptionSelectorsFromDOM.baseConstructor.call(this,t,e)},Shopify.extend(Shopify.OptionSelectorsFromDOM,Shopify.OptionSelectors),Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector=function(t,e,o,i){if(!Shopify.isDefined(o))var o=!0;if(!Shopify.isDefined(i))var i="/";var r=document.getElementById(t),n=r.childNodes,a=(r.parentNode,e.length),s=[];Shopify.each(n,function(t,r){if(1==t.nodeType&&"option"==t.tagName.toLowerCase()){var n=t.innerHTML.split(new RegExp("\\s*\\"+i+"\\s*"));0==e.length&&(a=n.length-(o?1:0));var p=n.slice(0,a),l=o?n[a]:"",c=(t.getAttribute("value"),{available:t.disabled?!1:!0,id:parseFloat(t.value),price:l,option1:p[0],option2:p[1],option3:p[2]});s.push(c)}});var p={variants:s};if(0==e.length){p.options=[];for(var l=0;a>l;l++)p.options[l]="option "+(l+1)}else p.options=e;return p},Shopify.SingleOptionSelector=function(t,e,o,i){this.multiSelector=t,this.values=i,this.index=e,this.name=o,this.element=document.createElement("select");for(var r=0;r<i.length;r++){var n=document.createElement("option");n.value=i[r],n.innerHTML=i[r],this.element.appendChild(n)}return this.element.setAttribute("class",this.multiSelector.selectorClass),this.element.setAttribute("data-option","option"+(e+1)),this.element.id=t.domIdPrefix+"-option-"+e,this.element.onchange=function(o,i){i=i||{},t.updateSelectors(e,i)},!0},Shopify.Image={preload:function(t,e){for(var o=0;o<t.length;o++){var i=t[o];this.loadImage(this.getSizedImageUrl(i,e))}},loadImage:function(t){(new Image).src=t},switchImage:function(t,e,o){if(t&&e){var i=this.imageSize(e.src),r=this.getSizedImageUrl(t.src,i);o?o(r,t,e):e.src=r}},imageSize:function(t){var e=t.match(/_(1024x1024|2048x2048|pico|icon|thumb|small|compact|medium|large|grande)\./);return null!=e?e[1]:null},getSizedImageUrl:function(t,e){if(null==e)return t;if("master"==e)return this.removeProtocol(t);var o=t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(null!=o){var i=t.split(o[0]),r=o[0];return this.removeProtocol(i[0]+"_"+e+r)}return null},removeProtocol:function(t){return t.replace(/http(s)?:/,"")}},Shopify.OptionSelectors.HistoryState=function(t){this.browserSupports()&&this.register(t)},Shopify.OptionSelectors.HistoryState.prototype.register=function(t){window.addEventListener("popstate",function(e){t.selectVariantFromParamsOrDropdown({popStateCall:!0})})},Shopify.OptionSelectors.HistoryState.prototype.onVariantChange=function(t,e,o){this.browserSupports()&&(!t||o.initialLoad||o.popStateCall||Shopify.setParam("variant",t.id))},Shopify.OptionSelectors.HistoryState.prototype.browserSupports=function(){return window.history&&window.history.replaceState};

$(document).on('shopify:block:select', function(e){
    var blockId = e.detail.blockId;
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    if ($parentSection.hasClass('slideshow-section') || $parentSection.hasClass('testimonial-section')){
      sliderBlock.select(blockId, $parentSection);
    }
    if ($parentSection.hasClass('recommended-products-section')){
      if ($('.block__recommended_products').length){
        productPage.unload($parentSection);
        productPage.init();
      }
    }
    if($parentSection.hasClass('page-details-section')){
      if($('.map-section').length) {
        mapFunction.init();
      }
      if($('.recently-viewed__section').length && Shopify.theme_settings.collection_secondary_image) {
        imageFunctions.showSecondaryImage();
      }
    }
    if ($parentSection.hasClass('cart-section')){
      if ($('.block__featured_collection').length){
        featuredCollectionSection.init();
      }
    }
    if ($parentSection.hasClass('product-template')){
      if (Shopify.theme_settings.enable_shopify_review_comments){
        if($('#shopify-product-reviews').length >= 1) {
          SPR.$(document).ready(function() {
            return SPR.registerCallbacks(),
            SPR.initRatingHandler(),
            SPR.initDomEls(),
            SPR.loadProducts(),
            SPR.loadBadges()
          })
        }
      }
    }
    utils.resizeActionButtons();
});

$(document).on('shopify:block:deselect', function(e){
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    if ($parentSection.hasClass('slideshow-section') || $parentSection.hasClass('testimonial-section')){
      sliderBlock.deselect($parentSection);
    }
});

$(document).on('shopify:section:reorder', function(e){
    utils.pageBannerCheck();
});

$(document).on('shopify:section:load', function(e){
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    utils.pageBannerCheck();
    if (Shopify.theme_settings.newsletter_popup){
      newsletter_popup.init();
    }
    if ($parentSection.hasClass('image-gallery-section')){
      gallery.init($parentSection);
    }
    if ($parentSection.hasClass('faq-section')){
      faqAccordion.init();
    }
    if ($parentSection.hasClass('cart-section')){
      cart.init();
      if ($('.block__featured_collection').length){
        featuredCollectionSection.init();
      }
    }
    if ($parentSection.hasClass('featured-promotions-section')){
      featuredPromotions.init();
    }
    if ($parentSection.hasClass('slideshow-section')){
      slideshow.init();
    }
    if (Shopify.theme_settings.enable_autocomplete){
      if ($parentSection.hasClass('search-section')){
        searchAutocomplete.init();
      }
    }
    if ($parentSection.hasClass('testimonial-section')){
      testimonial.init();
    }
    if ($parentSection.hasClass('featured-products-section')){
      productPage.init();
      videoFeature.init();
      productPage.productSwatches();
      if (Shopify.theme_settings.enable_shopify_review_comments){
        if($('.shopify-product-reviews-badge').length) {
          SPR.$(document).ready(function() {
            return SPR.registerCallbacks(),
            SPR.initRatingHandler(),
            SPR.initDomEls(),
            SPR.loadProducts(),
            SPR.loadBadges()
          })
        }
      }
    }
    if($parentSection.hasClass('map-section')){
      mapFunction.init();
    }
    if ($parentSection.hasClass('featured-collection-section')){
      featuredCollectionSection.init();
      videoFeature.init();
    }
    if ($parentSection.hasClass('video-section')){
      videoSection.init();
    }
    if ($parentSection.hasClass('recently-viewed__section')){
      recentlyViewed.init();
    }
    if ($parentSection.hasClass('product-template')){
      productPage.init();
      videoFeature.init();
      productPage.productSwatches();
      recentlyViewed.init();
      if (Shopify.theme_settings.enable_shopify_review_comments){
        if($('#shopify-product-reviews').length || $('.shopify-product-reviews-badge').length) {
          SPR.$(document).ready(function() {
            return SPR.registerCallbacks(),
            SPR.initRatingHandler(),
            SPR.initDomEls(),
            SPR.loadProducts(),
            SPR.loadBadges()
          })
        }
      }
    }
    if ($parentSection.hasClass('recommended-products-section')) {
      productPage.init();
    }
    if ($parentSection.hasClass('article-template-section')){
      if(window.location.pathname.indexOf('/comments') != -1) {
        $('html,body').animate({scrollTop: $("#new-comment").offset().top-140},'slow');
      }
    }
    if ($parentSection.hasClass('collection-template-section')){
      collectionSidebarFilter.init();
      recentlyViewed.init();
    }
    if($parentSection.hasClass('contact-section')){
      mapFunction.init();
    }
    if ($parentSection.hasClass('search-template-section')){
      if (Shopify.theme_settings.enable_autocomplete){
        searchAutocomplete.init();
      }
      collectionSidebarFilter.init();
    }
    if ($parentSection.hasClass('header-section')){
      header.init();
      header.loadMegaMenu();
    }
    if ($parentSection.hasClass('mega-menu-section')){
      header.loadMegaMenu();
    }
    if ($parentSection.hasClass('page-details-section')) {
      featuredCollectionSection.init();
      videoSection.init();
      recentlyViewed.init();
      if($('.block__image_gallery').length) {
        gallery.init();
      };
    }
    if ($parentSection.hasClass('product-details-section')) {
      featuredCollectionSection.init();
      videoSection.init();
      mapFunction.init();
      if($('.block__image_gallery').length) {
        gallery.init();
      };
      recentlyViewed.init();
      productPage.init();
    }
});


$(document).on('shopify:section:unload', function(e){
    var $target = $(e.target);
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    if ($parentSection.hasClass('header-section')){
      header.unload($target);
      header.unloadMegaMenu();
    }
    if ($parentSection.hasClass('slideshow-section')){
      slideshow.unload($target);
    }
    if ($parentSection.hasClass('testimonial-section')){
      testimonial.unload($target);
    }
    if ($parentSection.hasClass('video-section')){
      videoSection.unload($target);
    }
    if ($parentSection.hasClass('search-section')){
      searchAutocomplete.unload($target);
    }
    if ($parentSection.hasClass('product-template')){
      productPage.unload($parentSection);
    }
    if ($parentSection.hasClass('featured-products-section')){
      productPage.unload($parentSection);
    }
    if ($parentSection.hasClass('mega-menu-section')){
      header.unloadMegaMenu();
    }
    if ($parentSection.hasClass('page-details-section')) {
      videoSection.unload($target);
    }
    if ($parentSection.hasClass('product-details-section')) {
      videoSection.unload($target);
    }
});

$(document).on('shopify:section:select', function(e){
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    if ($parentSection.hasClass('mega-menu-section')){
      var megaMenuParent = $('.header .' + e.detail.sectionId).data('dropdown');
      setTimeout(function() {
        $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').trigger('mouseenter');
        $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').parents('header').addClass('editor-hover--true');
        header.removeDataAttributes('.header .mega-menu.dropdown_container .dropdown_column');
      }, 10);
    } 
    if ($parentSection.hasClass('featured-collection-section')){
      featuredCollectionSection.unload($parentSection);
      featuredCollectionSection.init();
    }
    utils.pageBannerCheck();
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
});

$(document).on('shopify:section:deselect', function(e){
  var $parentSection = $('#shopify-section-' + e.detail.sectionId);
  if ($parentSection.hasClass('mega-menu-section')){
    var megaMenuParent = $('.header .' + e.detail.sectionId).data('dropdown');
    $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').trigger('mouseout');
    $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').parents('header').removeClass('editor-hover--true');
  }
});

$(document).ready(function(){

  
/*  Owl Carousel v2.3.4  */
!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this._handlers={},this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._widths=[],this._invalidated={},this._pipe=[],this._drag={time:null,target:null,pointer:null,stage:{start:null,current:null},direction:null},this._states={current:{},tags:{initializing:["busy"],animating:["busy"],dragging:["interacting"]}},a.each(["onResize","onThrottledResize"],a.proxy(function(b,c){this._handlers[c]=a.proxy(this[c],this)},this)),a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a.charAt(0).toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Workers,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}e.Defaults={items:3,loop:!1,center:!1,rewind:!1,checkVisibility:!0,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,fallbackEasing:"swing",slideTransition:"",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",refreshClass:"owl-refresh",loadedClass:"owl-loaded",loadingClass:"owl-loading",rtlClass:"owl-rtl",responsiveClass:"owl-responsive",dragClass:"owl-drag",itemClass:"owl-item",stageClass:"owl-stage",stageOuterClass:"owl-stage-outer",grabClass:"owl-grab"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Type={Event:"event",State:"state"},e.Plugins={},e.Workers=[{filter:["width","settings"],run:function(){this._width=this.$element.width()}},{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){this.$stage.children(".cloned").remove()}},{filter:["width","items","settings"],run:function(a){var b=this.settings.margin||"",c=!this.settings.autoWidth,d=this.settings.rtl,e={width:"auto","margin-left":d?b:"","margin-right":d?"":b};!c&&this.$stage.children().css(e),a.css=e}},{filter:["width","items","settings"],run:function(a){var b=(this.width()/this.settings.items).toFixed(3)-this.settings.margin,c=null,d=this._items.length,e=!this.settings.autoWidth,f=[];for(a.items={merge:!1,width:b};d--;)c=this._mergers[d],c=this.settings.mergeFit&&Math.min(c,this.settings.items)||c,a.items.merge=c>1||a.items.merge,f[d]=e?b*c:this._items[d].width();this._widths=f}},{filter:["items","settings"],run:function(){var b=[],c=this._items,d=this.settings,e=Math.max(2*d.items,4),f=2*Math.ceil(c.length/2),g=d.loop&&c.length?d.rewind?e:Math.max(e,f):0,h="",i="";for(g/=2;g>0;)b.push(this.normalize(b.length/2,!0)),h+=c[b[b.length-1]][0].outerHTML,b.push(this.normalize(c.length-1-(b.length-1)/2,!0)),i=c[b[b.length-1]][0].outerHTML+i,g-=1;this._clones=b,a(h).addClass("cloned").appendTo(this.$stage),a(i).addClass("cloned").prependTo(this.$stage)}},{filter:["width","items","settings"],run:function(){for(var a=this.settings.rtl?1:-1,b=this._clones.length+this._items.length,c=-1,d=0,e=0,f=[];++c<b;)d=f[c-1]||0,e=this._widths[this.relative(c)]+this.settings.margin,f.push(d+e*a);this._coordinates=f}},{filter:["width","items","settings"],run:function(){var a=this.settings.stagePadding,b=this._coordinates,c={width:Math.ceil(Math.abs(b[b.length-1]))+2*a,"padding-left":a||"","padding-right":a||""};this.$stage.css(c)}},{filter:["width","items","settings"],run:function(a){var b=this._coordinates.length,c=!this.settings.autoWidth,d=this.$stage.children();if(c&&a.items.merge)for(;b--;)a.css.width=this._widths[this.relative(b)],d.eq(b).css(a.css);else c&&(a.css.width=a.items.width,d.css(a.css))}},{filter:["items"],run:function(){this._coordinates.length<1&&this.$stage.removeAttr("style")}},{filter:["width","items","settings"],run:function(a){a.current=a.current?this.$stage.children().index(a.current):0,a.current=Math.max(this.minimum(),Math.min(this.maximum(),a.current)),this.reset(a.current)}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;c<d;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children(".active").removeClass("active"),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass("active"),this.$stage.children(".center").removeClass("center"),this.settings.center&&this.$stage.children().eq(this.current()).addClass("center")}}],e.prototype.initializeStage=function(){this.$stage=this.$element.find("."+this.settings.stageClass),this.$stage.length||(this.$element.addClass(this.options.loadingClass),this.$stage=a("<"+this.settings.stageElement+">",{class:this.settings.stageClass}).wrap(a("<div/>",{class:this.settings.stageOuterClass})),this.$element.append(this.$stage.parent()))},e.prototype.initializeItems=function(){var b=this.$element.find(".owl-item");if(b.length)return this._items=b.get().map(function(b){return a(b)}),this._mergers=this._items.map(function(){return 1}),void this.refresh();this.replace(this.$element.children().not(this.$stage.parent())),this.isVisible()?this.refresh():this.invalidate("width"),this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)},e.prototype.initialize=function(){if(this.enter("initializing"),this.trigger("initialize"),this.$element.toggleClass(this.settings.rtlClass,this.settings.rtl),this.settings.autoWidth&&!this.is("pre-loading")){var a,b,c;a=this.$element.find("img"),b=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,c=this.$element.children(b).width(),a.length&&c<=0&&this.preloadAutoWidthImages(a)}this.initializeStage(),this.initializeItems(),this.registerEventHandlers(),this.leave("initializing"),this.trigger("initialized")},e.prototype.isVisible=function(){return!this.settings.checkVisibility||this.$element.is(":visible")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){a<=b&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),"function"==typeof e.stagePadding&&(e.stagePadding=e.stagePadding()),delete e.responsive,e.responsiveClass&&this.$element.attr("class",this.$element.attr("class").replace(new RegExp("("+this.options.responsiveClass+"-)\\S+\\s","g"),"$1"+d))):e=a.extend({},this.options),this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}})},e.prototype.optionsLogic=function(){this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.options.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};b<c;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={},!this.is("valid")&&this.enter("valid")},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){this.enter("refreshing"),this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$element.addClass(this.options.refreshClass),this.update(),this.$element.removeClass(this.options.refreshClass),this.leave("refreshing"),this.trigger("refreshed")},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this._handlers.onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return!!this._items.length&&(this._width!==this.$element.width()&&(!!this.isVisible()&&(this.enter("resizing"),this.trigger("resize").isDefaultPrevented()?(this.leave("resizing"),!1):(this.invalidate("width"),this.refresh(),this.leave("resizing"),void this.trigger("resized")))))},e.prototype.registerEventHandlers=function(){a.support.transition&&this.$stage.on(a.support.transition.end+".owl.core",a.proxy(this.onTransitionEnd,this)),!1!==this.settings.responsive&&this.on(b,"resize",this._handlers.onThrottledResize),this.settings.mouseDrag&&(this.$element.addClass(this.options.dragClass),this.$stage.on("mousedown.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("dragstart.owl.core selectstart.owl.core",function(){return!1})),this.settings.touchDrag&&(this.$stage.on("touchstart.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("touchcancel.owl.core",a.proxy(this.onDragEnd,this)))},e.prototype.onDragStart=function(b){var d=null;3!==b.which&&(a.support.transform?(d=this.$stage.css("transform").replace(/.*\(|\)| /g,"").split(","),d={x:d[16===d.length?12:4],y:d[16===d.length?13:5]}):(d=this.$stage.position(),d={x:this.settings.rtl?d.left+this.$stage.width()-this.width()+this.settings.margin:d.left,y:d.top}),this.is("animating")&&(a.support.transform?this.animate(d.x):this.$stage.stop(),this.invalidate("position")),this.$element.toggleClass(this.options.grabClass,"mousedown"===b.type),this.speed(0),this._drag.time=(new Date).getTime(),this._drag.target=a(b.target),this._drag.stage.start=d,this._drag.stage.current=d,this._drag.pointer=this.pointer(b),a(c).on("mouseup.owl.core touchend.owl.core",a.proxy(this.onDragEnd,this)),a(c).one("mousemove.owl.core touchmove.owl.core",a.proxy(function(b){var d=this.difference(this._drag.pointer,this.pointer(b));a(c).on("mousemove.owl.core touchmove.owl.core",a.proxy(this.onDragMove,this)),Math.abs(d.x)<Math.abs(d.y)&&this.is("valid")||(b.preventDefault(),this.enter("dragging"),this.trigger("drag"))},this)))},e.prototype.onDragMove=function(a){var b=null,c=null,d=null,e=this.difference(this._drag.pointer,this.pointer(a)),f=this.difference(this._drag.stage.start,e);this.is("dragging")&&(a.preventDefault(),this.settings.loop?(b=this.coordinates(this.minimum()),c=this.coordinates(this.maximum()+1)-b,f.x=((f.x-b)%c+c)%c+b):(b=this.settings.rtl?this.coordinates(this.maximum()):this.coordinates(this.minimum()),c=this.settings.rtl?this.coordinates(this.minimum()):this.coordinates(this.maximum()),d=this.settings.pullDrag?-1*e.x/5:0,f.x=Math.max(Math.min(f.x,b+d),c+d)),this._drag.stage.current=f,this.animate(f.x))},e.prototype.onDragEnd=function(b){var d=this.difference(this._drag.pointer,this.pointer(b)),e=this._drag.stage.current,f=d.x>0^this.settings.rtl?"left":"right";a(c).off(".owl.core"),this.$element.removeClass(this.options.grabClass),(0!==d.x&&this.is("dragging")||!this.is("valid"))&&(this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(this.closest(e.x,0!==d.x?f:this._drag.direction)),this.invalidate("position"),this.update(),this._drag.direction=f,(Math.abs(d.x)>3||(new Date).getTime()-this._drag.time>300)&&this._drag.target.one("click.owl.core",function(){return!1})),this.is("dragging")&&(this.leave("dragging"),this.trigger("dragged"))},e.prototype.closest=function(b,c){var e=-1,f=30,g=this.width(),h=this.coordinates();return this.settings.freeDrag||a.each(h,a.proxy(function(a,i){return"left"===c&&b>i-f&&b<i+f?e=a:"right"===c&&b>i-g-f&&b<i-g+f?e=a+1:this.op(b,"<",i)&&this.op(b,">",h[a+1]!==d?h[a+1]:i-g)&&(e="left"===c?a+1:a),-1===e},this)),this.settings.loop||(this.op(b,">",h[this.minimum()])?e=b=this.minimum():this.op(b,"<",h[this.maximum()])&&(e=b=this.maximum())),e},e.prototype.animate=function(b){var c=this.speed()>0;this.is("animating")&&this.onTransitionEnd(),c&&(this.enter("animating"),this.trigger("translate")),a.support.transform3d&&a.support.transition?this.$stage.css({transform:"translate3d("+b+"px,0px,0px)",transition:this.speed()/1e3+"s"+(this.settings.slideTransition?" "+this.settings.slideTransition:"")}):c?this.$stage.animate({left:b+"px"},this.speed(),this.settings.fallbackEasing,a.proxy(this.onTransitionEnd,this)):this.$stage.css({left:b+"px"})},e.prototype.is=function(a){return this._states.current[a]&&this._states.current[a]>0},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(b){return"string"===a.type(b)&&(this._invalidated[b]=!0,this.is("valid")&&this.leave("valid")),a.map(this._invalidated,function(a,b){return b})},e.prototype.reset=function(a){(a=this.normalize(a))!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(a,b){var c=this._items.length,e=b?0:this._clones.length;return!this.isNumeric(a)||c<1?a=d:(a<0||a>=c+e)&&(a=((a-e/2)%c+c)%c+e/2),a},e.prototype.relative=function(a){return a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=this.settings,f=this._coordinates.length;if(e.loop)f=this._clones.length/2+this._items.length-1;else if(e.autoWidth||e.merge){if(b=this._items.length)for(c=this._items[--b].width(),d=this.$element.width();b--&&!((c+=this._items[b].width()+this.settings.margin)>d););f=b+1}else f=e.center?this._items.length-1:this._items.length-e.items;return a&&(f-=this._clones.length/2),Math.max(f,0)},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2==0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c,e=1,f=b-1;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(this.settings.rtl&&(e=-1,f=b+1),c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[f]||0))/2*e):c=this._coordinates[f]||0,c=Math.ceil(c))},e.prototype.duration=function(a,b,c){return 0===c?0:Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(a,b){var c=this.current(),d=null,e=a-this.relative(c),f=(e>0)-(e<0),g=this._items.length,h=this.minimum(),i=this.maximum();this.settings.loop?(!this.settings.rewind&&Math.abs(e)>g/2&&(e+=-1*f*g),a=c+e,(d=((a-h)%g+g)%g+h)!==a&&d-e<=i&&d-e>0&&(c=d-e,a=d,this.reset(c))):this.settings.rewind?(i+=1,a=(a%i+i)%i):a=Math.max(h,Math.min(i,a)),this.speed(this.duration(c,a,b)),this.current(a),this.isVisible()&&this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.onTransitionEnd=function(a){if(a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0)))return!1;this.leave("animating"),this.trigger("translated")},e.prototype.viewport=function(){var d;return this.options.responsiveBaseElement!==b?d=a(this.options.responsiveBaseElement).width():b.innerWidth?d=b.innerWidth:c.documentElement&&c.documentElement.clientWidth?d=c.documentElement.clientWidth:console.warn("Can not detect viewport width."),d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)},this)),this.reset(this.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(b,c){var e=this.relative(this._current);c=c===d?this._items.length:this.normalize(c,!0),b=b instanceof jQuery?b:a(b),this.trigger("add",{content:b,position:c}),b=this.prepare(b),0===this._items.length||c===this._items.length?(0===this._items.length&&this.$stage.append(b),0!==this._items.length&&this._items[c-1].after(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)):(this._items[c].before(b),this._items.splice(c,0,b),this._mergers.splice(c,0,1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)),this._items[e]&&this.reset(this._items[e].index()),this.invalidate("items"),this.trigger("added",{content:b,position:c})},e.prototype.remove=function(a){(a=this.normalize(a,!0))!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.preloadAutoWidthImages=function(b){b.each(a.proxy(function(b,c){this.enter("pre-loading"),c=a(c),a(new Image).one("load",a.proxy(function(a){c.attr("src",a.target.src),c.css("opacity",1),this.leave("pre-loading"),!this.is("pre-loading")&&!this.is("initializing")&&this.refresh()},this)).attr("src",c.attr("src")||c.attr("data-src")||c.attr("data-src-retina"))},this))},e.prototype.destroy=function(){this.$element.off(".owl.core"),this.$stage.off(".owl.core"),a(c).off(".owl.core"),!1!==this.settings.responsive&&(b.clearTimeout(this.resizeTimer),this.off(b,"resize",this._handlers.onThrottledResize));for(var d in this._plugins)this._plugins[d].destroy();this.$stage.children(".cloned").remove(),this.$stage.unwrap(),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$stage.remove(),this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class",this.$element.attr("class").replace(new RegExp(this.options.responsiveClass+"-\\S+\\s","g"),"")).removeData("owl.carousel")},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:a<c;case">":return d?a<c:a>c;case">=":return d?a<=c:a>=c;case"<=":return d?a>=c:a<=c}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d,f,g){var h={item:{count:this._items.length,index:this.current()}},i=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),j=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},h,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(j)}),this.register({type:e.Type.Event,name:b}),this.$element.trigger(j),this.settings&&"function"==typeof this.settings[i]&&this.settings[i].call(this,j)),j},e.prototype.enter=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]===d&&(this._states.current[b]=0),this._states.current[b]++},this))},e.prototype.leave=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]--},this))},e.prototype.register=function(b){if(b.type===e.Type.Event){if(a.event.special[b.name]||(a.event.special[b.name]={}),!a.event.special[b.name].owl){var c=a.event.special[b.name]._default;a.event.special[b.name]._default=function(a){return!c||!c.apply||a.namespace&&-1!==a.namespace.indexOf("owl")?a.namespace&&a.namespace.indexOf("owl")>-1:c.apply(this,arguments)},a.event.special[b.name].owl=!0}}else b.type===e.Type.State&&(this._states.tags[b.name]?this._states.tags[b.name]=this._states.tags[b.name].concat(b.tags):this._states.tags[b.name]=b.tags,this._states.tags[b.name]=a.grep(this._states.tags[b.name],a.proxy(function(c,d){return a.inArray(c,this._states.tags[b.name])===d},this)))},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.pointer=function(a){var c={x:null,y:null};return a=a.originalEvent||a||b.event,a=a.touches&&a.touches.length?a.touches[0]:a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:a,a.pageX?(c.x=a.pageX,c.y=a.pageY):(c.x=a.clientX,c.y=a.clientY),c},e.prototype.isNumeric=function(a){return!isNaN(parseFloat(a))},e.prototype.difference=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},a.fn.owlCarousel=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),f=d.data("owl.carousel");f||(f=new e(this,"object"==typeof b&&b),d.data("owl.carousel",f),a.each(["next","prev","to","destroy","refresh","replace","add","remove"],function(b,c){f.register({type:e.Type.Event,name:c}),f.$element.on(c+".owl.carousel.core",a.proxy(function(a){a.namespace&&a.relatedTarget!==this&&(this.suppress([c]),f[c].apply(this,[].slice.call(arguments,1)),this.release([c]))},f))})),"string"==typeof b&&"_"!==b.charAt(0)&&f[b].apply(f,c)})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._interval=null,this._visible=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoRefresh&&this.watch()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoRefresh:!0,autoRefreshInterval:500},e.prototype.watch=function(){this._interval||(this._visible=this._core.isVisible(),this._interval=b.setInterval(a.proxy(this.refresh,this),this._core.settings.autoRefreshInterval))},e.prototype.refresh=function(){this._core.isVisible()!==this._visible&&(this._visible=!this._visible,this._core.$element.toggleClass("owl-hidden",!this._visible),this._visible&&this._core.invalidate("width")&&this._core.refresh())},e.prototype.destroy=function(){var a,c;b.clearInterval(this._interval);for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoRefresh=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel resized.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type)){var c=this._core.settings,e=c.center&&Math.ceil(c.items/2)||c.items,f=c.center&&-1*e||0,g=(b.property&&b.property.value!==d?b.property.value:this._core.current())+f,h=this._core.clones().length,i=a.proxy(function(a,b){this.load(b)},this);for(c.lazyLoadEager>0&&(e+=c.lazyLoadEager,c.loop&&(g-=c.lazyLoadEager,e++));f++<e;)this.load(h/2+this._core.relative(g)),h&&a.each(this._core.clones(this._core.relative(g)),i),g++}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={lazyLoad:!1,lazyLoadEager:0},e.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src")||f.attr("data-srcset");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):f.is("source")?f.one("load.owl.lazy",a.proxy(function(){this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("srcset",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":'url("'+g+'")',opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(c){this._core=c,this._previousHeight=null,this._handlers={"initialized.owl.carousel refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&"position"===a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass).index()===this._core.current()&&this.update()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._intervalId=null;var d=this;a(b).on("load",function(){d._core.settings.autoHeight&&d.update()}),a(b).resize(function(){d._core.settings.autoHeight&&(null!=d._intervalId&&clearTimeout(d._intervalId),d._intervalId=setTimeout(function(){d.update()},250))})};e.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},e.prototype.update=function(){var b=this._core._current,c=b+this._core.settings.items,d=this._core.settings.lazyLoad,e=this._core.$stage.children().toArray().slice(b,c),f=[],g=0;a.each(e,function(b,c){f.push(a(c).height())}),g=Math.max.apply(null,f),g<=1&&d&&this._previousHeight&&(g=this._previousHeight),this._previousHeight=g,this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass)},e.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._videos={},this._playing=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.register({type:"state",name:"playing",tags:["interacting"]})},this),"resize.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.video&&this.isInFullScreen()&&a.preventDefault()},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.is("resizing")&&this._core.$stage.find(".cloned .owl-video-frame").remove()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"===a.property.name&&this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};e.Defaults={video:!1,videoHeight:!1,videoWidth:!1},e.prototype.fetch=function(a,b){var c=function(){return a.attr("data-vimeo-id")?"vimeo":a.attr("data-vzaar-id")?"vzaar":"youtube"}(),d=a.attr("data-vimeo-id")||a.attr("data-youtube-id")||a.attr("data-vzaar-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else if(d[3].indexOf("vimeo")>-1)c="vimeo";else{if(!(d[3].indexOf("vzaar")>-1))throw new Error("Video URL not supported.");c="vzaar"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},e.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?"width:"+c.width+"px;height:"+c.height+"px;":"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(c){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?a("<div/>",{class:"owl-video-tn "+j,srcType:c}):a("<div/>",{class:"owl-video-tn",style:"opacity:1;background-image:url("+c+")"}),b.after(d),b.after(e)};if(b.wrap(a("<div/>",{class:"owl-video-wrapper",style:g})),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length)return l(h.attr(i)),h.remove(),!1;"youtube"===c.type?(f="//img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type?a.ajax({type:"GET",url:"//vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}):"vzaar"===c.type&&a.ajax({type:"GET",url:"//vzaar.com/api/videos/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a.framegrab_url,l(f)}})},e.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null,this._core.leave("playing"),this._core.trigger("stopped",null,"video")},e.prototype.play=function(b){var c,d=a(b.target),e=d.closest("."+this._core.settings.itemClass),f=this._videos[e.attr("data-video")],g=f.width||"100%",h=f.height||this._core.$stage.height();this._playing||(this._core.enter("playing"),this._core.trigger("play",null,"video"),e=this._core.items(this._core.relative(e.index())),this._core.reset(e.index()),c=a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'),c.attr("height",h),c.attr("width",g),"youtube"===f.type?c.attr("src","//www.youtube.com/embed/"+f.id+"?autoplay=1&rel=0&v="+f.id):"vimeo"===f.type?c.attr("src","//player.vimeo.com/video/"+f.id+"?autoplay=1"):"vzaar"===f.type&&c.attr("src","//view.vzaar.com/"+f.id+"/player?autoplay=true"),a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")),this._playing=e.addClass("owl-video-playing"))},e.prototype.isInFullScreen=function(){var b=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return b&&a(b).parent().hasClass("owl-video-frame")},e.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){a.namespace&&(this.swapping="translated"==a.type)},this),"translate.owl.carousel":a.proxy(function(a){a.namespace&&this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,
animateIn:!1},e.prototype.swap=function(){if(1===this.core.settings.items&&a.support.animation&&a.support.transition){this.core.speed(0);var b,c=a.proxy(this.clear,this),d=this.core.$stage.children().eq(this.previous),e=this.core.$stage.children().eq(this.next),f=this.core.settings.animateIn,g=this.core.settings.animateOut;this.core.current()!==this.previous&&(g&&(b=this.core.coordinates(this.previous)-this.core.coordinates(this.next),d.one(a.support.animation.end,c).css({left:b+"px"}).addClass("animated owl-animated-out").addClass(g)),f&&e.one(a.support.animation.end,c).addClass("animated owl-animated-in").addClass(f))}},e.prototype.clear=function(b){a(b.target).css({left:""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut),this.core.onTransitionEnd()},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Animate=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._call=null,this._time=0,this._timeout=0,this._paused=!0,this._handlers={"changed.owl.carousel":a.proxy(function(a){a.namespace&&"settings"===a.property.name?this._core.settings.autoplay?this.play():this.stop():a.namespace&&"position"===a.property.name&&this._paused&&(this._time=0)},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoplay&&this.play()},this),"play.owl.autoplay":a.proxy(function(a,b,c){a.namespace&&this.play(b,c)},this),"stop.owl.autoplay":a.proxy(function(a){a.namespace&&this.stop()},this),"mouseover.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"mouseleave.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.play()},this),"touchstart.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"touchend.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this.play()},this)},this._core.$element.on(this._handlers),this._core.options=a.extend({},e.Defaults,this._core.options)};e.Defaults={autoplay:!1,autoplayTimeout:5e3,autoplayHoverPause:!1,autoplaySpeed:!1},e.prototype._next=function(d){this._call=b.setTimeout(a.proxy(this._next,this,d),this._timeout*(Math.round(this.read()/this._timeout)+1)-this.read()),this._core.is("interacting")||c.hidden||this._core.next(d||this._core.settings.autoplaySpeed)},e.prototype.read=function(){return(new Date).getTime()-this._time},e.prototype.play=function(c,d){var e;this._core.is("rotating")||this._core.enter("rotating"),c=c||this._core.settings.autoplayTimeout,e=Math.min(this._time%(this._timeout||c),c),this._paused?(this._time=this.read(),this._paused=!1):b.clearTimeout(this._call),this._time+=this.read()%c-e,this._timeout=c,this._call=b.setTimeout(a.proxy(this._next,this,d),c-e)},e.prototype.stop=function(){this._core.is("rotating")&&(this._time=0,this._paused=!0,b.clearTimeout(this._call),this._core.leave("rotating"))},e.prototype.pause=function(){this._core.is("rotating")&&!this._paused&&(this._time=this.read(),this._paused=!0,b.clearTimeout(this._call))},e.prototype.destroy=function(){var a,b;this.stop();for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.autoplay=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(b){this._core=b,this._initialized=!1,this._pages=[],this._controls={},this._templates=[],this.$element=this._core.$element,this._overrides={next:this._core.next,prev:this._core.prev,to:this._core.to},this._handlers={"prepared.owl.carousel":a.proxy(function(b){b.namespace&&this._core.settings.dotsData&&this._templates.push('<div class="'+this._core.settings.dotClass+'">'+a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot")+"</div>")},this),"added.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,0,this._templates.pop())},this),"remove.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,1)},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&this.draw()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&!this._initialized&&(this._core.trigger("initialize",null,"navigation"),this.initialize(),this.update(),this.draw(),this._initialized=!0,this._core.trigger("initialized",null,"navigation"))},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._initialized&&(this._core.trigger("refresh",null,"navigation"),this.update(),this.draw(),this._core.trigger("refreshed",null,"navigation"))},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers)};e.Defaults={nav:!1,navText:['<span aria-label="Previous">&#x2039;</span>','<span aria-label="Next">&#x203a;</span>'],navSpeed:!1,navElement:'button type="button" role="presentation"',navContainer:!1,navContainerClass:"owl-nav",navClass:["owl-prev","owl-next"],slideBy:1,dotClass:"owl-dot",dotsClass:"owl-dots",dots:!0,dotsEach:!1,dotsData:!1,dotsSpeed:!1,dotsContainer:!1},e.prototype.initialize=function(){var b,c=this._core.settings;this._controls.$relative=(c.navContainer?a(c.navContainer):a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"),this._controls.$previous=a("<"+c.navElement+">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click",a.proxy(function(a){this.prev(c.navSpeed)},this)),this._controls.$next=a("<"+c.navElement+">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click",a.proxy(function(a){this.next(c.navSpeed)},this)),c.dotsData||(this._templates=[a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]),this._controls.$absolute=(c.dotsContainer?a(c.dotsContainer):a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"),this._controls.$absolute.on("click","button",a.proxy(function(b){var d=a(b.target).parent().is(this._controls.$absolute)?a(b.target).index():a(b.target).parent().index();b.preventDefault(),this.to(d,c.dotsSpeed)},this));for(b in this._overrides)this._core[b]=a.proxy(this[b],this)},e.prototype.destroy=function(){var a,b,c,d,e;e=this._core.settings;for(a in this._handlers)this.$element.off(a,this._handlers[a]);for(b in this._controls)"$relative"===b&&e.navContainer?this._controls[b].html(""):this._controls[b].remove();for(d in this.overides)this._core[d]=this._overrides[d];for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},e.prototype.update=function(){var a,b,c,d=this._core.clones().length/2,e=d+this._core.items().length,f=this._core.maximum(!0),g=this._core.settings,h=g.center||g.autoWidth||g.dotsData?1:g.dotsEach||g.items;if("page"!==g.slideBy&&(g.slideBy=Math.min(g.slideBy,g.items)),g.dots||"page"==g.slideBy)for(this._pages=[],a=d,b=0,c=0;a<e;a++){if(b>=h||0===b){if(this._pages.push({start:Math.min(f,a-d),end:a-d+h-1}),Math.min(f,a-d)===f)break;b=0,++c}b+=this._core.mergers(this._core.relative(a))}},e.prototype.draw=function(){var b,c=this._core.settings,d=this._core.items().length<=c.items,e=this._core.relative(this._core.current()),f=c.loop||c.rewind;this._controls.$relative.toggleClass("disabled",!c.nav||d),c.nav&&(this._controls.$previous.toggleClass("disabled",!f&&e<=this._core.minimum(!0)),this._controls.$next.toggleClass("disabled",!f&&e>=this._core.maximum(!0))),this._controls.$absolute.toggleClass("disabled",!c.dots||d),c.dots&&(b=this._pages.length-this._controls.$absolute.children().length,c.dotsData&&0!==b?this._controls.$absolute.html(this._templates.join("")):b>0?this._controls.$absolute.append(new Array(b+1).join(this._templates[0])):b<0&&this._controls.$absolute.children().slice(b).remove(),this._controls.$absolute.find(".active").removeClass("active"),this._controls.$absolute.children().eq(a.inArray(this.current(),this._pages)).addClass("active"))},e.prototype.onTrigger=function(b){var c=this._core.settings;b.page={index:a.inArray(this.current(),this._pages),count:this._pages.length,size:c&&(c.center||c.autoWidth||c.dotsData?1:c.dotsEach||c.items)}},e.prototype.current=function(){var b=this._core.relative(this._core.current());return a.grep(this._pages,a.proxy(function(a,c){return a.start<=b&&a.end>=b},this)).pop()},e.prototype.getPosition=function(b){var c,d,e=this._core.settings;return"page"==e.slideBy?(c=a.inArray(this.current(),this._pages),d=this._pages.length,b?++c:--c,c=this._pages[(c%d+d)%d].start):(c=this._core.relative(this._core.current()),d=this._core.items().length,b?c+=e.slideBy:c-=e.slideBy),c},e.prototype.next=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!0),b)},e.prototype.prev=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!1),b)},e.prototype.to=function(b,c,d){var e;!d&&this._pages.length?(e=this._pages.length,a.proxy(this._overrides.to,this._core)(this._pages[(b%e+e)%e].start,c)):a.proxy(this._overrides.to,this._core)(b,c)},a.fn.owlCarousel.Constructor.Plugins.Navigation=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(c){this._core=c,this._hashes={},this.$element=this._core.$element,this._handlers={"initialized.owl.carousel":a.proxy(function(c){c.namespace&&"URLHash"===this._core.settings.startPosition&&a(b).trigger("hashchange.owl.navigation")},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");if(!c)return;this._hashes[c]=b.content}},this),"changed.owl.carousel":a.proxy(function(c){if(c.namespace&&"position"===c.property.name){var d=this._core.items(this._core.relative(this._core.current())),e=a.map(this._hashes,function(a,b){return a===d?b:null}).join();if(!e||b.location.hash.slice(1)===e)return;b.location.hash=e}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers),a(b).on("hashchange.owl.navigation",a.proxy(function(a){var c=b.location.hash.substring(1),e=this._core.$stage.children(),f=this._hashes[c]&&e.index(this._hashes[c]);f!==d&&f!==this._core.current()&&this._core.to(this._core.relative(f),!1,!0)},this))};e.Defaults={URLhashListener:!1},e.prototype.destroy=function(){var c,d;a(b).off("hashchange.owl.navigation");for(c in this._handlers)this._core.$element.off(c,this._handlers[c]);for(d in Object.getOwnPropertyNames(this))"function"!=typeof this[d]&&(this[d]=null)},a.fn.owlCarousel.Constructor.Plugins.Hash=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){function e(b,c){var e=!1,f=b.charAt(0).toUpperCase()+b.slice(1);return a.each((b+" "+h.join(f+" ")+f).split(" "),function(a,b){if(g[b]!==d)return e=!c||b,!1}),e}function f(a){return e(a,!0)}var g=a("<support>").get(0).style,h="Webkit Moz O ms".split(" "),i={transition:{end:{WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}},animation:{end:{WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd",animation:"animationend"}}},j={csstransforms:function(){return!!e("transform")},csstransforms3d:function(){return!!e("perspective")},csstransitions:function(){return!!e("transition")},cssanimations:function(){return!!e("animation")}};j.csstransitions()&&(a.support.transition=new String(f("transition")),a.support.transition.end=i.transition.end[a.support.transition]),j.cssanimations()&&(a.support.animation=new String(f("animation")),a.support.animation.end=i.animation.end[a.support.animation]),j.csstransforms()&&(a.support.transform=new String(f("transform")),a.support.transform3d=j.csstransforms3d())}(window.Zepto||window.jQuery,window,document);
/*  Owl Carousel v2.3.4  */


  // Owl carousel
  if ( $("#home-rev-carousel").length > 0 ){
    $("#home-rev-carousel").owlCarousel({
      margin: 10,
      nav: true,
      dot: false,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1024: {
          items: 1
        },
        1366: {
          items: 1
        }
      }
    });
  }
    
  if ( $("#rev-carousel").length > 0 ){
    $("#rev-carousel").owlCarousel({
      autoplay: true,
      lazyLoad: true,
      loop: true,
      margin: 20,
       /*
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      */
      responsiveClass: true,
      autoHeight: true,
      autoplayTimeout: 7000,
      smartSpeed: 800,
      nav: true,
      dot: false,
      responsive: {
        0: {
          items: 1,
          stagePadding: 30
        },      
        600: {
          items: 2
        },      
        1024: {
          items: 3
        },      
        1366: {
          items: 4
        }
      }
    });
  }
  
  if ( $("#carousel").length > 0 ){
    $("#carousel").owlCarousel({
      autoplay: true,
      lazyLoad: true,
      loop: true,
      margin: 20,
       /*
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      */
      responsiveClass: true,
      autoHeight: true,
      autoplayTimeout: 7000,
      smartSpeed: 800,
      nav: true,
      dot: false,
      responsive: {
        0: {
          items: 1,
          stagePadding: 30
        },
        600: {
          items: 2
        },
        1024: {
          items: 3
        },
        1366: {
          items: 4
        }
      }
    });
  }
  
  if ( $("#carousel_page_review").length > 0 ){
    $("#carousel_page_review").owlCarousel({
      autoplay: true,
      lazyLoad: true,
      loop: true,
      margin: 20,
       /*
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      */
      responsiveClass: true,
      autoHeight: true,
      autoplayTimeout: 7000,
      smartSpeed: 800,
      nav: true,
      dot: false,
      responsive: {
        0: {
          items: 1,
          stagePadding: 30
        },
        600: {
          items: 2
        },
        1024: {
          items: 3
        },
        1366: {
          items: 4
        }
      }
    });
  }

  
  // PDP Stickry Price change
  function currPrice(){
    var $price = $('body').find('.product__container').find('.product_section').find('.prod-desc-det').find('.price__container').find('.money').text();
    // console.log('$price', $price);
    $('body').find('.prod-bottom-sticky').find('.prod-bottom-details').find('.prod-price').text($price);    
  }

  // PDP Stickry Image change
  function currImg(){
    var $imageSrc = $('body').find('.product__container').find('.gallery-cell.is-selected').find('img').attr('src');
    $imageSrc = $imageSrc+'&width=50';
    // console.log('img', $imageSrc);
    $('body').find('.prod-bottom-sticky').find('.prod-bottom-details-wrapper').find('.prod-bottom-image').find('img').attr('src', $imageSrc);
  }
  

  // PDP Page Sticky Variants Selection Trigger.  
  $('.prod-bottom-varints-wrapper select[data-index="option1"]').on('change',function(){
    var $this = $(this);
    var option1 = $this.val();
    //console.log('option1',option1);
    $this.closest('body').find('.product__container').find('.product_form').find('.single-option-selector[data-option="option1"]').val(option1).trigger('change');

    currPrice();
    currImg();
    
  });
  $('.prod-bottom-varints-wrapper select[data-index="option2"]').on('change',function(){
    var $this = $(this);
    var option2 = $this.val();
    //console.log('option2',option2);
    $this.closest('body').find('.product__container').find('.product_form').find('.single-option-selector[data-option="option2"]').val(option2).trigger('change');
    
    currPrice();
    currImg();
  });
  $('.prod-bottom-varints-wrapper select[data-index="option3"]').on('change',function(){
    var $this = $(this);
    var option3 = $this.val();
    //console.log('option3',option3);
    $this.closest('body').find('.product__container').find('.product_form').find('.single-option-selector[data-option="option3"]').val(option3).trigger('change');

    currPrice();
    currImg();
  });


  // PDP Top product select change.
  $('.shopify-product-form .selector-wrapper select[data-option="option1"]').on('change',function(){
    var $this = $(this);
    var top_option1 = $this.val();
    //console.log('option3',option3);
    $this.closest('body').find('.prod-bottom-sticky').find('.prod-bottom-varints-wrapper').find('select[data-index="option1"]').val(top_option1);
    setTimeout(function() {
      currPrice();
      currImg();
    },150);
  });
  $('.shopify-product-form .selector-wrapper select[data-option="option2"]').on('change',function(){
    var $this = $(this);
    var top_option2 = $this.val();
    //console.log('option3',option3);
    $this.closest('body').find('.prod-bottom-sticky').find('.prod-bottom-varints-wrapper').find('select[data-index="option2"]').val(top_option2);
    setTimeout(function() {
      currPrice();
      currImg();
    },150);
  });
  $('.shopify-product-form .selector-wrapper select[data-option="option3"]').on('change',function(){
    var $this = $(this);
    var top_option3 = $this.val();
    //console.log('option3',option3);
    $this.closest('body').find('.prod-bottom-sticky').find('.prod-bottom-varints-wrapper').find('select[data-index="option3"]').val(top_option3);
    
    currPrice();
    currImg();
  });

  
  

  // PDP Page Sticky Add to cart button trigger.
  if( $('.prod-add-to-cart').length > 0 ){
    $('.prod-add-to-cart').click(function(){
      var $this = $(this);
      var $addToCartBtn = $this;
      // $this.closest('body').find('.product__container').find('.product_form').find('.purchase-details').find('button[name="add"]').trigger('click');
      var prodVID = $this.closest('body').find('.product__container').find('.product_form').find('select[name="id"] option:selected').val();
      var qty = $this.closest('.prod-bottom-varints-wrapper').find('.prod-qty__wrapper').find('.js-qty__num').val();
      qty = parseInt(qty);

      var formdata = $this.closest('body').find('.product__container').find('.product_form .shopify-product-form').serialize()+'&quantity='+qty;
      
      // console.log('$addToCartBtn >',$addToCartBtn);
      // console.log('prodVID',prodVID);
      // console.log('qty',qty);      
      console.log('formdata',formdata);

      $.ajax({
        url: '/cart/add.js',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: formdata,
        beforeSend: function() {
          $addToCartBtn.attr('disabled', 'disabled').addClass('disabled');
          $addToCartBtn.find('span').removeClass("fadeInDown").addClass('animated zoomOut');
        },
        success: function(itemData) {
          $addToCartBtn.find('.checkmark').addClass('checkmark-active');
          window.setTimeout(function(){
            $addToCartBtn.removeAttr('disabled').removeClass('disabled');
            $addToCartBtn.find('.checkmark').removeClass('checkmark-active');
            $addToCartBtn.find('span').removeClass('zoomOut').addClass('fadeInDown');
          }, 1000);
          console.log('add_to_cart_gtag',add_to_cart_gtag);
          $.ajax({
            url: '/cart.js',
            dataType: "json",
            cache: false,
            success: function(cart) {
              setTimeout(function() {
                //refreshCart(cart);
                if($('body').hasClass('fancybox-active')) {
                  $.fancybox.close();
                }
                // if (window.SLIDECART_STATE().settings.enabled) {
                //   setTimeout(function () {
                //     //window.SLIDECART_UPDATE();
                //     window.HS_SLIDE_CART_UPDATE();
                //     //window.SLIDECART_OPEN();
                //     window.HS_SLIDE_CART_OPEN();
                //   }, 300);
                // }
              }, 850)
            }
          }); // $.ajax
        },
        error: function(XMLHttpRequest) {
          console.log('XMLHttpRequest',XMLHttpRequest);
        }
      }); // $.ajax
      
      
    });    
  }

  
});

jQuery(document).ready(function(){
  let dt;

  let dtt;
 jQuery(document).on('click','.swatch-element',function(){
    let id =jQuery(this).find('label').attr('data-image');
   let v_id = id.split("OurProducts_");
   let gg = v_id[1].split("_");
  
   // console.log(gg[1],'numbersss');
   
     jQuery('.product_gallery_nav .flickity-slider .gallery-cell ').each(function(index, element){
         console.log('enter product_gallery nav');
    let nn = jQuery(element).find('img').attr('src');
       
       
    let n_m = nn.split("OurProducts_");
       
     //  console.log(n_m[1],'value on n_m');
       
       
  if(n_m[1] != 'undefined' && n_m[1] != null){
   dt = n_m[1].split("_");
    
        console.log('split error');
       jQuery(element).removeClass('is-nav-selected');  
       if(gg[1] == dt[1]){
           console.log('enter if');
                  jQuery(element).addClass('is-nav-selected');  
        
             jQuery(element).click();
                 //  jQuery(this).trigger("click")
       }else{
        jQuery(element).removeClass('is-nav-selected');    
       }
  }
   
   
  });

    /*   jQuery('.product_gallery .flickity-viewport .flickity-slider .gallery-cell').each(function(index, element){
      console.log('enter product_gallery');
    let nnn = jQuery(element).find('img').attr('src');
    let nmmm = nnn.split("OurProducts_");
       
    if(nmmm[1] != 'undefined' && nmmm[1] != null){
   
     dtt = nmmm[1].split("_");
    
        console.log(dtt[1],'imgmmmm');
      //jQuery(element).removeClass('is-selected');  
       if(gg[1] == dtt[1]){
          console.log('enter if 2nd');
                  jQuery(element).addClass('is-selected'); 
                   jQuery(element).removeAttr('aria-hidden');
       }else{
      //  jQuery(element).removeClass('is-selected');
          jQuery(element).attr('aria-hidden','true');
         
       }
      }
   
  });
   */

  

 });
  
 


});

