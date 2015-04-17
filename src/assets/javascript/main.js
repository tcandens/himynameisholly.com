

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
  var projectCategories = [
    "etc",
    "web",
    "print"
  ];
  var projectListCache = $('#project-list').html();
  var projectFilter = function(category) {
    var $container = $('#project-list');
    var _reset = function() {
      $('#project-list').html(projectListCache);
    };
    var _animate = function(callback) {
      $container.addClass('sorting');
      var temp = setTimeout(function() {
        console.log('Timeout');
        $container.removeClass('sorting')
        callback();
        $container.addClass('sorted');
      }, 400);
      var temp2 = setTimeout(function() {
        $container.removeClass('sorted');
      }, 800);

    };
    var $list = $( projectListCache ); // New jQ object to mold
    var $mirror = $list.filter('[data-category]:not([data-catgory="' + category + '"])');
    var $target = $list.filter('[data-category="' + category + '"]');
    var $button = $('#category-' + category + '-button');
    var _mold = function() {
      $container.html( $target );
    };
    // Toggle class of button
    // If button already active, return list to default cache of items and remove active class
    if ( $button.hasClass('active') ) {
      _animate(_reset);
      $button.removeClass('active');
    } else {
      _animate(_reset);
      $('.active').removeClass('active');
      $button.addClass('active');
      // $('[data-category]:not([data-category=' + category + '])').detach();
      _animate(_mold);
    }
  }
  projectCategories.forEach(function( category ) {
    $('#category-' + category + '-button').on('click', function() {
      projectFilter( category );
    } );
  });

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
  ];
  var current = 0;
  var shuffle = function() {
    var string = "";
    var rand = Math.floor( Math.random() * adjectives.length );
    if ( rand === current ) {
      rand = Math.floor( Math.random() * adjectives.length );
    }
    current = rand;
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
  });

  // SmoothState.js
  var content = $('#content').smoothState({
        onStart: {
          duration: 400,
          render: function (url, $container) {
            content.toggleAnimationClass('is-exiting');
            window.setTimeout(function() {
              $('html, body').scrollTop(0);
            }, 400)
          }
        }
      }).data('smoothState');

})();
