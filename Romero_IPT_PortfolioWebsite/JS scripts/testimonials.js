// ── Supabase config ──────────────────────────────
const SUPABASE_URL = 'https://hyllfetdufxsizxylmjr.supabase.co';   // ← your Project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bGxmZXRkdWZ4c2l6eHlsbWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzE0NTIsImV4cCI6MjA4NzQ0NzQ1Mn0.uemsoS3jA8mmxJkLf1fs5H5beGU0lftboYQ_frWGlKg';        // ← your anon key
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Render helpers ───────────────────────────────
function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

function renderTestimonials(list) {
    const container = document.getElementById('testimonial-list');
    if (!list.length) {
        container.innerHTML = '<p class="testimonial-empty">No testimonials yet. Be the first!</p>';
        return;
    }
    container.innerHTML = '';
    list.forEach((t, i) => {
        const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.animationDelay = `${i * 0.1}s`;
        card.innerHTML = `
        <div class="testimonial-author">
          ${escapeHtml(t.name)}${t.role ? ' · ' + escapeHtml(t.role) : ''}
        </div>
        <p class="testimonial-text">"${escapeHtml(t.message)}"</p>
        <div class="testimonial-stars">${stars}</div>
      `;
        container.appendChild(card);
    });
}

// ── Fetch from Supabase (real DB read) ───────────
async function loadTestimonials() {
    const container = document.getElementById('testimonial-list');
    container.innerHTML = '<p class="testimonial-empty">Loading…</p>';

    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        container.innerHTML = '<p class="testimonial-empty" style="color:#e96c7b">Failed to load testimonials.</p>';
        return;
    }
    renderTestimonials(data);
}

loadTestimonials();

// ── Validation ───────────────────────────────────
function tValidate() {
    let valid = true;
    const name = document.getElementById('t_name');
    const msg = document.getElementById('t_message');
    const nf = document.getElementById('tf-name');
    const mf = document.getElementById('tf-msg');

    nf.classList.remove('is-error');
    mf.classList.remove('is-error');

    if (!name.value.trim()) { nf.classList.add('is-error'); valid = false; }
    if (msg.value.trim().length < 15) { mf.classList.add('is-error'); valid = false; }
    return valid;
}

document.getElementById('t_name').addEventListener('input', () => {
    if (document.getElementById('t_name').value.trim())
        document.getElementById('tf-name').classList.remove('is-error');
});
document.getElementById('t_message').addEventListener('input', () => {
    if (document.getElementById('t_message').value.trim().length >= 15)
        document.getElementById('tf-msg').classList.remove('is-error');
});

// ── Submit to Supabase (real DB write) ───────────
document.getElementById('testimonialForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const toast = document.getElementById('t-toast');
    const btn = document.getElementById('t-submit-btn');
    toast.className = 't-toast';
    toast.textContent = '';

    if (!tValidate()) {
        toast.classList.add('error');
        toast.textContent = '⚠ Please fix the errors above.';
        return;
    }

    const payload = {
        name: document.getElementById('t_name').value.trim(),
        role: document.getElementById('t_role').value.trim() || null,
        message: document.getElementById('t_message').value.trim(),
        rating: parseInt(document.querySelector('input[name="rating"]:checked').value)
    };

    btn.disabled = true;
    btn.textContent = 'Submitting…';

    const { error } = await supabase
        .from('testimonials')
        .insert([payload]);

    btn.disabled = false;
    btn.textContent = 'Submit Testimonial';

    if (error) {
        console.error(error);
        toast.classList.add('error');
        toast.textContent = '⚠ Submission failed. Please try again.';
        return;
    }

    toast.classList.add('success');
    toast.textContent = '✓ Testimonial submitted! Thank you.';
    this.reset();
    document.querySelector('input[name="rating"][value="3"]').checked = true;
    loadTestimonials(); // reload from DB to show the new entry
});
