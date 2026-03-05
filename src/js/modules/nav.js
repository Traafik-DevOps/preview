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
      navMenu.style.setProperty('background-color', 'var(--white)', 'important');
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.zIndex = '999';
      navMenu.style.setProperty('height', 'auto', 'important');
      navMenu.style.paddingTop = '24px';
      navMenu.style.paddingLeft = '24px';
      navMenu.style.paddingRight = '24px';
      navMenu.style.paddingBottom = '24px';
      navMenu.style.overflowY = 'auto';
      navMenu.style.maxHeight = 'calc(100vh - 64px)';

      navMenu.querySelectorAll('a').forEach((link) => {
        link.style.setProperty('color', '#0f0a4d', 'important');
        link.style.setProperty('display', 'block', 'important');
        link.style.setProperty('height', 'auto', 'important');
        link.style.setProperty('margin-left', '0', 'important');
        link.style.setProperty('padding-top', '24px', 'important');
        link.style.setProperty('padding-bottom', '24px', 'important');
        link.style.setProperty('opacity', '1', 'important');
        link.style.setProperty('visibility', 'visible', 'important');
        link.style.setProperty('text-decoration', 'none', 'important');
        link.style.setProperty('font-size', '20px', 'important');
        link.style.setProperty('line-height', '1.4', 'important');
        link.style.setProperty('position', 'relative', 'important');
        link.style.setProperty('z-index', '1001', 'important');

        link.querySelectorAll('*').forEach((child) => {
          child.style.setProperty('color', '#0f0a4d', 'important');
          child.style.setProperty('display', 'block', 'important');
          child.style.setProperty('opacity', '1', 'important');
          child.style.setProperty('visibility', 'visible', 'important');
          child.style.setProperty('font-size', '20px', 'important');
          child.style.setProperty('line-height', '1.4', 'important');
          child.style.setProperty('position', 'relative', 'important');
          child.style.setProperty('z-index', '1001', 'important');
        });
      });

      document.body.style.overflow = isOpen ? 'hidden' : '';
    } else {
      navMenu.style.display = '';
      navMenu.style.backgroundColor = '';
      navMenu.style.position = '';
      navMenu.style.top = '';
      navMenu.style.left = '';
      navMenu.style.right = '';
      navMenu.style.zIndex = '';
      navMenu.style.paddingTop = '';
      navMenu.style.paddingLeft = '';
      navMenu.style.paddingRight = '';
      navMenu.style.paddingBottom = '';
      navMenu.style.overflowY = '';
      navMenu.style.maxHeight = '';
      navMenu.style.height = '';

      navMenu.querySelectorAll('a').forEach((link) => {
        link.style.color = '';
        link.style.display = '';
        link.style.height = '';
        link.style.marginLeft = '';
        link.style.paddingTop = '';
        link.style.paddingBottom = '';
        link.style.opacity = '';
        link.style.visibility = '';
        link.style.textDecoration = '';

        link.querySelectorAll('*').forEach((child) => {
          child.style.color = '';
          child.style.opacity = '';
          child.style.visibility = '';
        });
      });

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
