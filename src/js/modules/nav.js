function getCollapseBreakpoint(navBar) {
  const collapse = navBar.getAttribute('data-collapse');
  if (collapse === 'all') {
    return Number.POSITIVE_INFINITY;
  }
  if (collapse === 'medium') {
    return 991;
  }
  if (collapse === 'small') {
    return 767;
  }
  if (collapse === 'tiny') {
    return 479;
  }

  return -1;
}

export function initNav() {
  const navBar = document.querySelector('.nav-bar.w-nav');
  const menuButton = navBar ? navBar.querySelector('.menu-button.w-nav-button') : null;
  const navMenu = navBar ? navBar.querySelector('.nav-menu.w-nav-menu') : null;

  if (!navBar || !menuButton || !navMenu) {
    return;
  }

  const collapseAt = getCollapseBreakpoint(navBar);
  const isCollapsed = () => window.innerWidth <= collapseAt;
  let isOpen = false;

  if (!menuButton.getAttribute('tabindex')) {
    menuButton.setAttribute('tabindex', '0');
  }
  menuButton.setAttribute('role', 'button');
  menuButton.setAttribute('aria-label', 'Toggle menu');
  menuButton.setAttribute('aria-expanded', 'false');

  function render() {
    if (!isCollapsed()) {
      isOpen = false;
    }

    menuButton.classList.toggle('w--open', isOpen);
    navMenu.classList.toggle('w--open', isOpen);
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (isCollapsed()) {
      navMenu.style.display = isOpen ? 'block' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    } else {
      navMenu.style.display = '';
      document.body.style.overflow = '';
    }
  }

  function openMenu() {
    isOpen = true;
    render();
  }

  function closeMenu() {
    isOpen = false;
    render();
  }

  function toggleMenu() {
    if (!isCollapsed()) {
      return;
    }

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  }

  menuButton.addEventListener('click', toggleMenu);
  menuButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (!isOpen) {
      return;
    }

    if (!navBar.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });

  window.addEventListener('resize', render);
  render();
}
