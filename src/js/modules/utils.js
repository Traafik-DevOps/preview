export function onDomReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
}

export function isOwnedForm(form) {
  if (!(form instanceof HTMLFormElement)) {
    return false;
  }

  return (
    form.id === 'wf-form-home-page-form' ||
    form.classList.contains('form-contact')
  );
}
