(function () {
  var root = document.documentElement;
  var prefix = ' w-mod-';
  root.className += prefix + 'js';

  if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
    root.className += prefix + 'touch';
  }
})();
