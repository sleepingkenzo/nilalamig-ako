//modal
function openModal(imageSrc) {
  document.getElementById("modalImage").src = imageSrc;
  document.getElementById("projectModal").classList.add("active");
}
function closeModal() {
  document.getElementById("projectModal").classList.remove("active");
}

//skills anim
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) skillObserver.observe(skillsSection);


//github api
const GITHUB_USERNAME = 'sleepingkenzo';

async function loadGithubRepos() {
  const container = document.getElementById('github-repos-container');
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const repos = await res.json();

    if (!repos.length) {
      container.innerHTML = '<p class="github-error">No public repositories found.</p>';
      return;
    }

    container.innerHTML = '';
    repos.forEach((repo, i) => {
      const langDot = repo.language
        ? `<span><span class="repo-lang-dot" style="background:${langColor(repo.language)}"></span>${repo.language}</span>`
        : '';

      const card = document.createElement('a');
      card.href = repo.html_url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'repo-card';
      card.style.animationDelay = `${i * 0.08}s`;
      card.style.opacity = '0';
      card.style.animation = `fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s forwards`;
      card.innerHTML = `
            <div class="repo-name">
              <i class="bi bi-folder2-open"></i>
              ${escapeHtml(repo.name)}
            </div>
            <p class="repo-desc">${escapeHtml(repo.description || 'No description provided.')}</p>
            <div class="repo-meta">
              ${langDot}
              <span><i class="bi bi-star"></i> ${repo.stargazers_count}</span>
              <span><i class="bi bi-diagram-2"></i> ${repo.forks_count}</span>
            </div>
          `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="github-error"><i class="bi bi-exclamation-circle"></i> &nbsp;Could not load repositories. (${err.message})</p>`;
  }
}

function langColor(lang) {
  const map = { JavaScript: '#f1e05a', Java: '#b07219', PHP: '#4f5d95', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', TypeScript: '#2b7489' };
  return map[lang] || '#b06ab3';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadGithubRepos();


//api leaflet
const daetCoords = [14.1166, 122.9557]; // Daet, Camarines Norte

const map = L.map('map', { zoomControl: false, scrollWheelZoom: false }).setView(daetCoords, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// Custom purple marker
const markerIcon = L.divIcon({
  html: `<div style="
        width:16px;height:16px;
        background:#b06ab3;
        border:3px solid #f0ece8;
        border-radius:50%;
        box-shadow:0 0 20px rgba(176,106,179,0.8);
      "></div>`,
  className: '',
  iconAnchor: [8, 8]
});

L.marker(daetCoords, { icon: markerIcon })
  .addTo(map)
  .bindPopup('<b style="font-family:DM Mono,monospace;font-size:11px;letter-spacing:.1em;">Kyle Romero</b><br><span style="font-size:12px;color:#888;">Daet, Philippines</span>')
  .openPopup();

L.control.zoom({ position: 'bottomright' }).addTo(map);


const EMAILJS_PUBLIC_KEY = '8ItLgLIXSkbQHKAB6';
const EMAILJS_SERVICE_ID = 'service_neoorc2';
const EMAILJS_TEMPLATE_ID = 'template_yv2v40c';

emailjs.init(EMAILJS_PUBLIC_KEY);


// ─── TESTIMONIALS (PHP/MySQL backend) ────────────────────────────────────────

const BASE = 'http://localhost/Romero_IPT_PortfolioWebsite'; // ← change to your actual XAMPP folder name

async function renderTestimonials() {
  const list = document.getElementById('testimonial-list');
  list.innerHTML = '<p class="testimonial-empty">Loading…</p>';

  try {
    const res = await fetch(`${BASE}/get_testimonials.php`);
    const json = await res.json();

    if (!json.success || !json.data.length) {
      list.innerHTML = '<p class="testimonial-empty">No testimonials yet. Be the first!</p>';
      return;
    }

    list.innerHTML = '';
    json.data.forEach((t, i) => {
      const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.style.animationDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="testimonial-author">${escapeHtml(t.name)}${t.role ? ' · ' + escapeHtml(t.role) : ''}</div>
        <p class="testimonial-text">"${escapeHtml(t.message)}"</p>
        <div class="testimonial-stars">${stars}</div>
      `;
      list.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load testimonials:', err);
    list.innerHTML = '<p class="testimonial-empty">Could not load testimonials.</p>';
  }
}

const tForm = document.getElementById('testimonialForm');

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

// live re-check
document.getElementById('t_name').addEventListener('input', () => {
  if (document.getElementById('tf-name').classList.contains('is-error') && document.getElementById('t_name').value.trim())
    document.getElementById('tf-name').classList.remove('is-error');
});
document.getElementById('t_message').addEventListener('input', () => {
  if (document.getElementById('tf-msg').classList.contains('is-error') && document.getElementById('t_message').value.trim().length >= 15)
    document.getElementById('tf-msg').classList.remove('is-error');
});

tForm.addEventListener('submit', async function (e) {
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

  const name = document.getElementById('t_name').value.trim();
  const role = document.getElementById('t_role').value.trim();
  const message = document.getElementById('t_message').value.trim();
  const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);

  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    // 1. Save to MySQL via PHP
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('message', message);
    formData.append('rating', rating);

    const dbRes = await fetch(`${BASE}/submit_testimonial.php`, { method: 'POST', body: formData });
    const dbJson = await dbRes.json();

    if (!dbJson.success) throw new Error(dbJson.error || 'Database error.');

    // 2. Send email notification via EmailJS
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_role: role || 'Anonymous',
        message: message,
        rating: rating + '/5 stars',
        reply_to: 'no-reply@portfolio.com'
      });
    } catch (emailErr) {
      // Email failure is non-critical — testimonial is already saved in DB
      console.warn('EmailJS error (non-critical):', emailErr);
    }

    // 3. Refresh testimonials list from DB
    await renderTestimonials();

    toast.classList.add('success');
    toast.textContent = '✓ Testimonial submitted! Thank you.';
    tForm.reset();
    document.querySelector('input[name="rating"][value="3"]').checked = true;
    ['tf-name', 'tf-role', 'tf-msg'].forEach(id => document.getElementById(id)?.classList.remove('is-error', 'is-valid'));

  } catch (err) {
    console.error('Submit error:', err);
    toast.classList.add('error');
    toast.textContent = `⚠ ${err.message || 'Something went wrong. Please try again.'}`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Testimonial';
  }
});

// Initial load
renderTestimonials();

// document.getElementById('interested_btn').addEventListener('click', () => {
//   document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
// });