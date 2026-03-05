export function initAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    return;
  }

  const animationTargets = [
    { selector: '.intro-title', delay: 0 },
    { selector: '.hero--bodycopy', delay: 80 },
    { selector: '.div-block-3', delay: 140 },
    { selector: '.contact-grid', delay: 200 }
  ];

  animationTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((node) => {
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
}
