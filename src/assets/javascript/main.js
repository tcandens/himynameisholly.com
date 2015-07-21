

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

  $('.fittext').fitText(1.2);

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
      var scrollDown;
      if ( !localStorage.getItem('worktop') ) {
        scrollDown = $( window ).innerHeight();
      } else {
        scrollDown = localStorage.getItem('worktop');
      }
      $html.toggleClass('nav-list-open');
      setTimeout(function() {
        _scrollWindowTo( scrollDown );
        $('#nav').addClass('headroom--unpinned');
      }, 400);
    });
  };
  navButtons();

  var cycleAdjectives = function() {
    var _counter = 0;
    var $els = $('.cycleThru');
    var length = $els.length;
    function showAdj() {
      if ( _counter > length ) {
        _counter = 0
      }
      $els.eq(_counter).addClass('shuffleOut').removeClass('shuffleIn');
      setTimeout(function() {
        $els.eq( _counter++ ).addClass('shuffleIn').removeClass('shuffleOut');
      }, 400)
      _counter++;
    }
    var cycleInterval = setInterval(function() {
      showAdj();
    }, 8000)
    showAdj();
    $('.index-header-shuffle').click(function( e ) {
      showAdj();
      clearInterval(cycleInterval);
      cycleInterval = setInterval(function() {
        showAdj();
      }, 8000)
    });
  }
  cycleAdjectives();

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
    }, 500);
  }
  revealPaginate();

  // SmoothState.js
  var smoothState = $('#content').smoothState({
        prefetch: true,
        pageCacheSize: 3,
        onStart: {
          duration: 400,
          render: function ( $container ) {
            $container.addClass('is-exiting');
            smoothState.restartCSSAnimations();
          }
        },
        onProgress: {
          duration: 0,
          render: function( $container ) {
            _scrollWindowTo( 0 );
          }
        },
        onReady: {
          duration: 400,
          render: function( $container, $newContent ) {
            $container.removeClass('is-exiting');
            $container.html( $newContent );
            $('.fittext').fitText(1.2);
          }
        },
        onAfter: function($container, $newContent) {
          navButtons();
          filterAttachListeners();
          headroomInit();
          revealPaginate();
          cycleAdjectives();
        }
      }).data('smoothState');

}());
