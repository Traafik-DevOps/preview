function parseBooleanAttr(value) {
  return String(value).toLowerCase() === 'true' || String(value) === '1';
}

function initSlider(slider) {
  const mask = slider.querySelector('.w-slider-mask');
  const slides = Array.from(slider.querySelectorAll('.w-slide'));
  const leftArrow = slider.querySelector('.w-slider-arrow-left');
  const rightArrow = slider.querySelector('.w-slider-arrow-right');
  const nav = slider.querySelector('.w-slider-nav');

  if (!mask || slides.length === 0) {
    return;
  }

  const infinite = parseBooleanAttr(slider.getAttribute('data-infinite'));
  const autoplay = parseBooleanAttr(slider.getAttribute('data-autoplay'));
  const delay = Number.parseInt(slider.getAttribute('data-delay') || '3000', 10);
  let index = 0;
  let timer = null;

  mask.style.display = 'flex';
  mask.style.transition = 'transform 500ms ease';
  slides.forEach((slide) => {
    slide.style.flex = '0 0 100%';
  });

  if (nav) {
    nav.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'w-slider-dot';
      dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      nav.appendChild(dot);
    });
  }

  function render() {
    mask.style.transform = `translateX(-${index * 100}%)`;
    if (nav) {
      Array.from(nav.children).forEach((dot, i) => {
        dot.classList.toggle('w-active', i === index);
      });
    }
  }

  function goTo(nextIndex) {
    if (nextIndex < 0) {
      index = infinite ? slides.length - 1 : 0;
    } else if (nextIndex >= slides.length) {
      index = infinite ? 0 : slides.length - 1;
    } else {
      index = nextIndex;
    }
    render();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    if (!autoplay || slides.length < 2) {
      return;
    }
    stopAutoplay();
    timer = window.setInterval(next, Number.isFinite(delay) ? delay : 3000);
  }

  if (leftArrow) {
    leftArrow.addEventListener('click', prev);
  }
  if (rightArrow) {
    rightArrow.addEventListener('click', next);
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  render();
  startAutoplay();
}

function initTabs(root) {
  const links = Array.from(root.querySelectorAll('.w-tab-link[data-w-tab]'));
  const panes = Array.from(root.querySelectorAll('.w-tab-pane[data-w-tab]'));
  if (!links.length || !panes.length) {
    return;
  }

  const initial = root.getAttribute('data-current') || links.find((l) => l.classList.contains('w--current'))?.getAttribute('data-w-tab');

  function activate(tabName) {
    links.forEach((link) => {
      link.classList.toggle('w--current', link.getAttribute('data-w-tab') === tabName);
    });
    panes.forEach((pane) => {
      pane.classList.toggle('w--tab-active', pane.getAttribute('data-w-tab') === tabName);
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      activate(link.getAttribute('data-w-tab'));
    });
  });

  activate(initial || links[0].getAttribute('data-w-tab'));
}

export function initWidgets() {
  document.querySelectorAll('.w-slider').forEach(initSlider);
  document.querySelectorAll('.w-tabs').forEach(initTabs);
}
