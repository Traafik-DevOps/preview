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

export function initForms() {
  const form = document.getElementById('wf-form-home-page-form');
  if (!isOwnedForm(form)) {
    return;
  }

  // Capture submit first so third-party listeners (including Webflow) never run.
  form.addEventListener(
    'submit',
    async (event) => {
      if (!isOwnedForm(event.currentTarget)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      await submitOwnedForm(event.currentTarget);
    },
    { capture: true }
  );
}
