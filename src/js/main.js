import { initAnimations } from './modules/animations.js';
import { initForms } from './modules/forms.js';
import { initNav } from './modules/nav.js';
import { initObservability } from './modules/observability.js';
import { onDomReady } from './modules/utils.js';
import { initWidgets } from './modules/widgets.js';

function initFooterYear() {
  const yearNodes = document.querySelectorAll('.footer-link-year');
  const year = String(new Date().getFullYear());

  yearNodes.forEach((node) => {
    node.textContent = year;
  });
}

onDomReady(() => {
  initObservability();
  initFooterYear();
  initNav();
  initWidgets();
  initAnimations();
  initForms();
});
