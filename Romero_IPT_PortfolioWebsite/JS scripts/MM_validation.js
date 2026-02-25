const form = document.getElementById('contactForm');

const fields = {
    name: { el: document.getElementById('user_name_id'), msg: document.getElementById('msg-name'), wrap: document.getElementById('field-name') },
    email: { el: document.getElementById('user_email_id'), msg: document.getElementById('msg-email'), wrap: document.getElementById('field-email') },
    subject: { el: document.getElementById('user_subject_id'), msg: document.getElementById('msg-subject'), wrap: document.getElementById('field-subject') },
    message: { el: document.getElementById('user_message_id'), msg: document.getElementById('msg-message'), wrap: document.getElementById('field-message') },
};

const rules = {
    name: v => v.trim().length < 2 ? 'Name must be at least 2 characters.' : '',
    email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Please enter a valid email address.' : '',
    subject: v => v.trim().length < 3 ? 'Subject must be at least 3 characters.' : '',
    message: v => v.trim().length < 10 ? 'Message must be at least 10 characters.' : '',
};

function validateField(name) {
    const { el, msg, wrap } = fields[name];
    const error = rules[name](el.value);
    if (error) {
        wrap.classList.add('is-error');
        wrap.classList.remove('is-valid');
        msg.textContent = error;
    } else {
        wrap.classList.remove('is-error');
        wrap.classList.add('is-valid');
        msg.textContent = el.value.trim() ? '✓ Looks good' : '';
    }
    return !error;
}

// Live validation on blur
Object.keys(fields).forEach(name => {
    fields[name].el.addEventListener('blur', () => validateField(name));
    fields[name].el.addEventListener('input', () => {
        // only re-validate if already in error state
        if (fields[name].wrap.classList.contains('is-error')) validateField(name);
    });
});

// Submit
form.addEventListener('submit', function (e) {
    const allValid = Object.keys(fields).map(validateField).every(Boolean);

    if (!allValid) {
        e.preventDefault(); // only stop if invalid
        const toast = document.getElementById('formToast');
        toast.classList.add('error');
        toast.textContent = '⚠ Please fix the errors above before sending.';
    }
});