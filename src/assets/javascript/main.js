

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
  var projectListCache = $('#project-list').html();
  var projectFilter = function() {
    var cache = projectListCache;
    var $printFilter = $('#category-print-button');
    var $webFilter = $('#category-web-button');
    var $etcFilter = $('#category-etc-button');
    var $items = $('.project-list-item');
    var $print = $('.category-print');
    var $web = $('.category-web');
    var $etc = $('.category-etc');
    var $list = $('#project-list');
    $printFilter.on('click', function(e) {
      if ( $(this).hasClass('active') ) {
        e.preventDefault();
        $(this).removeClass('active');
        $list.fadeOut(400).delay(400).empty().html(cache).fadeIn(400);
      } else {
        e.preventDefault();
        $list.fadeOut(400).delay(400).empty();
        $list.html(cache);
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('.category-web').detach();
        $('.category-etc').detach();
        $list.fadeIn(400);
      };
    });
    $webFilter.on('click', function(e) {
      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active');
        $list.hide().empty().html(cache).show(400);
      } else {
        e.preventDefault();
        $list.hide();
        $list.empty();
        $list.html(cache);
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('.category-print').detach();
        $('.category-etc').detach();
        $list.show(400);
      }
    });
    $etcFilter.on('click', function(e) {
      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active');
        $list.hide().empty().html(cache).show(400);
      } else {
        e.preventDefault();
        $list.hide();
        $list.empty();
        $list.html(cache);
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('.category-print').detach();
        $('.category-web').detach();
        $list.show(400);
      }
    });
  }
  projectFilter();

  // Adjective Shuffler
  var adjectives = [
    ["Graphic", "Designer"],
    ["Ravenclaw"],
    ["Simlish", "translator"],
    ["Star Trek", "enthusiast"],
    ["Graphics", "Coordinator"],
    ["Problem", "Solver"],
    ["Logic", "lover"],
    ["Dog", "Person"]
  ]

  var shuffle = function() {
    var rand = Math.floor( Math.random() * adjectives.length );
    var string = "";
    adjectives[rand].forEach(function( i ) {
      string += "<span class='adjective shuffleIn'>" + i + "</span>";
    });
    $('.index-header-copy-adjectives').html(string);
  };
  shuffle();

  $('.index-header-shuffle').on('click', function() {
    var $adjs = $('.adjective');
    $adjs.removeClass('shuffleIn');
    $adjs.addClass('shuffleOut');
    var timeout1 = setTimeout(function() {
      shuffle();
    }, 400);
    // var timeout2 = setTimeout(function() {
    //   $adjs.removeClass('shuffleIn');
    // }, 800);
    // shuffle();
  });

})();
