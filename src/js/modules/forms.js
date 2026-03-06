import { isOwnedForm } from './utils.js';
import { trackFormEvent } from './observability.js';

const DIALTONE_ENDPOINT = 'https://dialtoneapp.com/api/v1/store-data/traafik';

function getFirstValue(form, selectors) {
  for (const selector of selectors) {
    const input = form.querySelector(selector);
    if (input && typeof input.value === 'string') {
      return input.value.trim();
    }
  }

  return '';
}

function buildPayload(form) {
  return {
    name: getFirstValue(form, ['#FNAME-2', '#FNAME', '#NAME', 'input[name="FNAME"]', 'input[name="NAME"]']),
    email: getFirstValue(form, ['#EMAIL-5', '#EMAIL', 'input[name="EMAIL"]']),
    phone: getFirstValue(form, ['#PHONE-2', '#PHONE', 'input[name="PHONE"]']),
    company: getFirstValue(form, ['#CMPNY', '#COMPANY', 'input[name="CMPNY"]', 'input[name="COMPANY"]']),
    website: getFirstValue(form, ['#WEB-2', '#WEBSITE', 'input[name="WEB"]', 'input[name="WEBSITE"]']),
    position: getFirstValue(form, ['#POS-2', '#TITLE-2', '#TITLE', 'input[name="POS"]', 'input[name="TITLE"]'])
  };
}

async function submitOwnedForm(form) {
  const payload = buildPayload(form);
  trackFormEvent('submit', { hasEmail: Boolean(payload.email) });

  try {
    const response = await fetch(DIALTONE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 201) {
      trackFormEvent('success', { status: response.status });
      alert("Thanks we'll be in touch soon!");
    } else {
      trackFormEvent('error', { status: response.status });
    }

    return response;
  } catch (_) {
    trackFormEvent('error', { status: 0 });
    return null;
  }
}

function updateFormUiState(form, state) {
  const formWrapper = form.closest('.w-form');
  if (!formWrapper) {
    return;
  }

  const done = formWrapper.querySelector('.w-form-done');
  const fail = formWrapper.querySelector('.w-form-fail');

  if (state === 'success') {
    form.style.display = 'none';
    if (done) {
      done.style.display = 'block';
    }
    if (fail) {
      fail.style.display = 'none';
    }
    return;
  }

  if (state === 'error') {
    form.style.display = '';
    if (done) {
      done.style.display = 'none';
    }
    if (fail) {
      fail.style.display = 'block';
    }
    return;
  }

  form.style.display = '';
  if (done) {
    done.style.display = 'none';
  }
  if (fail) {
    fail.style.display = 'none';
  }
}

function setSubmitButtonLoading(form, isLoading) {
  if (!form) {
    return;
  }

  const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
  if (!submitButton) {
    return;
  }

  if (!submitButton.dataset.defaultText) {
    submitButton.dataset.defaultText = submitButton.value || submitButton.textContent || '';
  }

  const waitText = submitButton.getAttribute('data-wait') || 'Please wait...';
  submitButton.disabled = isLoading;

  if ('value' in submitButton) {
    submitButton.value = isLoading ? waitText : submitButton.dataset.defaultText;
  } else {
    submitButton.textContent = isLoading ? waitText : submitButton.dataset.defaultText;
  }
}

export function initForms() {
  const forms = document.querySelectorAll('form.form-contact');

  forms.forEach((form) => {
    if (!isOwnedForm(form)) {
      return;
    }

    updateFormUiState(form, 'idle');

    // Capture submit first so third-party listeners (including Webflow) never run.
    form.addEventListener(
      'submit',
      async (event) => {
        const form = event.currentTarget;
        if (!(form instanceof HTMLFormElement) || !isOwnedForm(form)) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        setSubmitButtonLoading(form, true);

        const response = await submitOwnedForm(form);
        setSubmitButtonLoading(form, false);

        if (response && response.status === 201) {
          updateFormUiState(form, 'success');
        } else {
          updateFormUiState(form, 'error');
        }
      },
      { capture: true }
    );
  });
}
