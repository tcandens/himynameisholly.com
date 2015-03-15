$(function() {
  var el = document.querySelector('nav');
  var headroom = new Headroom(el);
  headroom.init();

  window.sr = new scrollReveal({
    enter:  'bottom',
    move:   '200px',
    over:   '500ms',
    easing: 'ease-out',
    scale: { direction: 'up', power: '0' }
  });

  $html = $('html');

  $('.nav-button').on('click', function(e) {
    e.preventDefault();
    $html.toggleClass('nav-list-open');
  });

})();
