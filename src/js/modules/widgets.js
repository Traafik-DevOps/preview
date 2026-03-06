function parseBooleanAttr(value) {
  return String(value).toLowerCase() === 'true' || String(value) === '1';
}

function restartEnterAnimation(slide) {
  slide.classList.remove('is-entering');
  // Force reflow so the class re-add reliably restarts animation.
  void slide.offsetWidth;
  slide.classList.add('is-entering');
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
  const pauseOnHover = parseBooleanAttr(slider.getAttribute('data-pause-on-hover'));
  const delay = Number.parseInt(slider.getAttribute('data-delay') || '3000', 10);
  const duration = Number.parseInt(slider.getAttribute('data-duration') || '500', 10);
  const animation = (slider.getAttribute('data-animation') || '').toLowerCase();
  const isFade = animation === 'fade';
  let index = 0;
  let timer = null;

  if (isFade) {
    mask.style.position = 'relative';
    mask.style.display = 'block';
    slides.forEach((slide) => {
      slide.style.position = 'absolute';
      slide.style.inset = '0';
      slide.style.width = '100%';
      slide.style.height = '100%';
      slide.style.opacity = '0';
      slide.style.transition = `opacity ${Number.isFinite(duration) ? duration : 500}ms ease`;
      slide.style.pointerEvents = 'none';
    });
  } else {
    mask.style.display = 'flex';
    mask.style.transition = `transform ${Number.isFinite(duration) ? duration : 500}ms ease`;
    slides.forEach((slide) => {
      slide.style.flex = '0 0 100%';
    });
  }

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
    if (isFade) {
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.style.opacity = active ? '1' : '0';
        slide.style.pointerEvents = active ? 'auto' : 'none';
        slide.classList.toggle('is-active', active);
        if (active) {
          restartEnterAnimation(slide);
        } else {
          slide.classList.remove('is-entering');
        }
      });
    } else {
      mask.style.transform = `translateX(-${index * 100}%)`;
    }

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

  if (pauseOnHover) {
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
  }

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
