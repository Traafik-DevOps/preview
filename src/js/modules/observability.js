function emit(name, detail) {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail
    })
  );
}

export function initObservability() {
  emit('traafik:phase1:ready', {
    path: window.location.pathname,
    timestamp: Date.now()
  });
}

export function trackFormEvent(state, detail) {
  emit('traafik:form:' + state, {
    path: window.location.pathname,
    timestamp: Date.now(),
    ...detail
  });
}
