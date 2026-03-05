import { isOwnedForm } from './utils.js';
import { trackFormEvent } from './observability.js';

const DIALTONE_ENDPOINT = 'https://dialtoneapp.com/api/v1/store-data/traafik';

function buildPayload(form) {
  const nameInput = form.querySelector('#FNAME-2');
  const emailInput = form.querySelector('#EMAIL-5');
  const phoneInput = form.querySelector('#PHONE-2');
  const companyInput = form.querySelector('#CMPNY');
  const websiteInput = form.querySelector('#WEB-2');
  const positionInput = form.querySelector('#POS-2');

  return {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    company: companyInput ? companyInput.value.trim() : '',
    website: websiteInput ? websiteInput.value.trim() : '',
    position: positionInput ? positionInput.value.trim() : ''
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
  const form = document.getElementById('wf-form-home-page-form');
  if (!isOwnedForm(form)) {
    return;
  }

  updateFormUiState(form, 'idle');

  // Capture submit first so third-party listeners (including Webflow) never run.
  form.addEventListener(
    'submit',
    async (event) => {
      if (!isOwnedForm(event.currentTarget)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      setSubmitButtonLoading(event.currentTarget, true);

      const response = await submitOwnedForm(event.currentTarget);
      setSubmitButtonLoading(event.currentTarget, false);

      if (response && response.status === 201) {
        updateFormUiState(event.currentTarget, 'success');
      } else {
        updateFormUiState(event.currentTarget, 'error');
      }
    },
    { capture: true }
  );
}
