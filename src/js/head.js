(function () {
  if (typeof WebFont !== 'undefined' && typeof WebFont.load === 'function') {
    WebFont.load({
      google: {
        families: ['Manrope:regular,500,600,700,800']
      }
    });
  }

  var root = document.documentElement;
  var prefix = ' w-mod-';
  root.className += prefix + 'js';

  if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
    root.className += prefix + 'touch';
  }
})();
