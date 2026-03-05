function isDebugPage() {
  const path = window.location.pathname;
  return path.includes('/motorists') || path.includes('/law-enforcement');
}

function debugLog(...args) {
  if (!isDebugPage()) {
    return;
  }
  console.log('[animations]', ...args);
}

function initZoomImages() {
  const zoomImages = Array.from(document.querySelectorAll('.zoom-image'));
  debugLog('initZoomImages', { count: zoomImages.length });

  if (!zoomImages.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    zoomImages.forEach((image) => image.classList.add('is-zoom-active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-zoom-active', entry.isIntersecting);
        debugLog('zoomIntersection', {
          src: entry.target.getAttribute('src'),
          isIntersecting: entry.isIntersecting
        });
      });
    },
    {
      threshold: 0.35
    }
  );

  zoomImages.forEach((image) => observer.observe(image));
}

export function initAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    return;
  }

  const animationTargets = [
    { selector: '.intro-title', delay: 0 },
    { selector: '.hero--bodycopy', delay: 80 },
    { selector: '.div-block-3', delay: 140 },
    { selector: '.contact-grid', delay: 200 },
    { selector: '.hero-title', delay: 0 },
    { selector: '.hero-text', delay: 80 },
    { selector: '.trail-form', delay: 140 },
    { selector: '.feature-tabs-wrap', delay: 200 },
    { selector: '.metrics-grid', delay: 260 },
    { selector: '.full-width-video-wrap', delay: 320 }
  ];

  animationTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (node.dataset.animReady === '1') {
        return;
      }
      node.dataset.animReady = '1';

      if (node.closest('.transition') || node.closest('.w-slider-mask') || node.closest('.w-tab-content')) {
        return;
      }

      node.style.opacity = '0';
      node.style.transform = 'translateY(16px)';
      node.style.willChange = 'opacity, transform';

      window.setTimeout(() => {
        node.style.transition = 'opacity 500ms ease, transform 500ms ease';
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';

        window.setTimeout(() => {
          node.style.willChange = '';
        }, 600);
      }, delay);
    });
  });

  initZoomImages();
}
