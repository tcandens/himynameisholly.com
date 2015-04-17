

$(function() {


    /*global jQuery */
  /*!
  * FitText.js 1.2
  *
  * Copyright 2011, Dave Rupert http://daverupert.com
  * Released under the WTFPL license
  * http://sam.zoy.org/wtfpl/
  *
  * Date: Thu May 05 14:23:00 2011 -0600
  */

  (function( $ ){

    $.fn.fitText = function( kompressor, options ) {

      // Setup options
      var compressor = kompressor || 1,
          settings = $.extend({
            'minFontSize' : Number.NEGATIVE_INFINITY,
            'maxFontSize' : Number.POSITIVE_INFINITY
          }, options);

      return this.each(function(){

        // Store the object
        var $this = $(this);

        // Resizer() resizes items based on the object width divided by the compressor * 10
        var resizer = function () {
          $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
        };

        // Call once to set.
        resizer();

        // Call on resize. Opera debounces their resize by default.
        $(window).on('resize.fittext orientationchange.fittext', resizer);

      });

    };

  })( jQuery );

  var el = document.querySelector('nav');
  var headroom = new Headroom(el);
  headroom.init();

  // window.sr = new scrollReveal({
  //   enter:  'bottom',
  //   move:   '200px',
  //   over:   '500ms',
  //   easing: 'ease-out',
  //   vFactor: 0.20,
  //   scale: { direction: 'up', power: '0' }
  // });

  $html = $('html');

  $('.nav-button').on('click', function(e) {
    e.preventDefault();
    $html.toggleClass('nav-list-open');
  });

  $('#contact-button').on('click', function(e) {
    e.preventDefault();
    $html.removeClass('nav-list-open');
    $html.toggleClass('contact-overlay-open');
  })

  $('#contact-overlay-esc').on('click', function(e) {
    e.preventDefault();
    $html.removeClass('contact-overlay-open');
  })

  var fixViewportUnits = function() {
    $('.100vh').css({'height': $( window ).height()});
  };
  fixViewportUnits();

  $('.fittext').fitText();

  // PROJECT FILTER
  var projectFilter = function() {
    $printFilter = $('#category-print-button');
    $webFilter = $('#category-web-button');
    $etcFilter = $('#category-etc-button');
    $items = $('.project-list-item');
    $print = $('.category-print');
    $web = $('.category-web');
    $etc = $('.category-etc');
    $list = $('#project-list');
    $printFilter.on('click', function(e) {
      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active');
        $list.emtpy();
        $list.html($items);
      } else {
        e.preventDefault();
        $list.empty();
        $list.html($items);
        $('.active').removeClass('active');
        $(this).addClass('active');
        $web.detach();
        $etc.detach();
      };
    });
    $webFilter.on('click', function(e) {
      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active');
        $list.emtpy();
        $list.html($items);
      } else {
        e.preventDefault();
        $list.empty();
        $list.html($items);
        $('.active').removeClass('active');
        $(this).addClass('active');
        $print.detach();
        $etc.detach();
      }
    });
    $etcFilter.on('click', function(e) {
      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active');
        $list.emtpy();
        $list.html($items);
      } else {
        e.preventDefault();
        $list.empty();
        $list.html($items);
        $('.active').removeClass('active');
        $(this).addClass('active');
        $print.detach();
        $web.detach();
      }
    });
  }
  projectFilter();

})();
