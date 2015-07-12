

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

  $('.fittext').fitText();

  // Helper function to deal with mobile discrepencies
  var _scrollWindowTo = function( val, animate ) {
    $(document).scrollTop( val );
  }

  var headroomInit = function() {
    var el = document.querySelector('nav');
    var headroom = new Headroom(el);
    headroom.init();
  };
  headroomInit();

  var navButtons = function() {
    $html = $('html');
    $('.nav-button').on('click', function(e) {
      e.preventDefault();
      $html.toggleClass('nav-list-open');
    });

    $('#contact-button').on('click', function(e) {
      e.preventDefault();
      $html.removeClass('nav-list-open');
      $html.toggleClass('contact-overlay-open');
    });

    $('#contact-overlay-esc').on('click', function(e) {
      e.preventDefault();
      $html.removeClass('contact-overlay-open');
    });

    $('#work-button').on('click', function( e ) {
      var scrollDown = $( window ).innerHeight();
      $html.toggleClass('nav-list-open');
      setTimeout(function() {
        _scrollWindowTo( scrollDown );
        $('#nav').addClass('headroom--unpinned');
      }, 450);
    });
  };
  navButtons();

  var lockHeight = function( $items ) {
    $items.each(function( i ) {
      $(this).css({
        height: $(this).height()
      });
    });
  }
  // lockHeight( $('.fix-height') );

  var fullHeight = function( $items ) {
    $items.each(function( i ) {
      $( this ).css({
        height: $( window ).height()
      });
    });
  }
  fullHeight( $('.index-header') );


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
      var temp = window.setTimeout(function() {
        $container.removeClass('sorting')
        callback();
        $container.addClass('sorted');
      }, 400);
      var temp2 = window.setTimeout(function() {
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
  var filterAttachListeners = function() {
    projectCategories.forEach(function( category ) {
      $('#category-' + category + '-button').on('click', function() {
        projectFilter( category );
      } );
    });
  };
  filterAttachListeners();

  // Adjective Shuffler
  var adjectives = [
    ["Graphic", "Designer"],
    ["Ravenclaw"],
    ["Simlish", "translator"],
    ["Star Trek", "enthusiast"],
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

  var shufflePeriod = setInterval(function() {
    var $adjs = $('.adjective');
    $adjs.removeClass('shuffleIn');
    $adjs.addClass('shuffleOut');
    var timeout2 = window.setTimeout(function() {
      shuffle();
    }, 400);
  }, 5000);

  var shuffleAttachListener = function() {
    $('.index-header-shuffle').on('click', function() {
      var $adjs = $('.adjective');
      $adjs.removeClass('shuffleIn');
      $adjs.addClass('shuffleOut');
      var timeout1 = window.setTimeout(function() {
        shuffle();
      }, 400);
    });
  };
  shuffleAttachListener();

  var revealPaginate = function() {
    var scroll = $( window ).scrollTop();
    var target = $( document ).innerHeight() - $( window ).innerHeight()*2;
    if ( scroll >= target ) {
      $('.paginate-container').removeClass('paginate-hidden');
    } else if ( scroll < target ) {
      $('.paginate-container').addClass('paginate-hidden');
    }
    var timeout = setTimeout(function() {
      revealPaginate();
    }, 500)
  }
  revealPaginate();

  // SmoothState.js
  var content = $('#content').smoothState({
        prefetch: true,
        pageCacheSize: 100,
        onStart: {
          duration: 400,
          render: function (url, $container) {
            content.toggleAnimationClass('is-exiting');
            var scrolltotop = window.setTimeout(function() {
              _scrollWindowTo( 0 );
            }, 400)
          }
        },
        callback: function(url, $container, $content) {
          $(function() {
            navButtons();
            shuffleAttachListener();
            filterAttachListeners();
            headroomInit();
            revealPaginate();
            $('.fittext').fitText();
            lockHeight( $('.fix-height') );
            fullHeight( $('.index-header') );
          })
        }
      }).data('smoothState');

}());
