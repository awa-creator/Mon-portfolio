/* =========================================
   PORTFOLIO — AWA TOURÉ  |  script.js
   ========================================= */

const EMAILJS_PUBLIC_KEY  = 'tku-WrtzUI_cZtqZ-';
const EMAILJS_SERVICE_ID  = 'service_70x87ei';
const EMAILJS_TEMPLATE_ID = 'template_xlq1dos';

document.addEventListener('DOMContentLoaded', () => {

  /* ── INITIALISATION EMAILJS ── */
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  /* ── GESTION DU FORMULAIRE DE CONTACT ── */
  const btnSend = document.getElementById('btn-send');
  if (btnSend) {
    btnSend.addEventListener('click', async () => {
      const name     = document.getElementById('contact-name').value.trim();
      const email    = document.getElementById('contact-email').value.trim();
      const message  = document.getElementById('contact-msg').value.trim();
      const feedback = document.getElementById('form-feedback');
      const btn      = document.getElementById('btn-send');

      if (!name || !email || !message) {
        showFeedback(feedback, '⚠ Merci de remplir tous les champs.', 'warn');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback(feedback, '⚠ Adresse email invalide.', 'warn');
        return;
      }

      btn.textContent = 'Envoi en cours…';
      btn.disabled = true;

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name:  name,
          from_email: email,
          message:    message,
        });

        showFeedback(feedback, '✓ Message envoyé ! Je vous répondrai bientôt.', 'ok');
        document.getElementById('contact-name').value  = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-msg').value   = '';
        btn.textContent = 'Message envoyé ✓';
      } catch (err) {
        console.error('EmailJS error:', err);
        showFeedback(feedback, "✗ Échec de l'envoi. Réessayez ou écrivez-moi directement.", 'error');
        btn.textContent = 'Envoyer le message →';
        btn.disabled = false;
      }
    });
  }

  /* ── FADE-IN AU SCROLL ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ── LIEN NAV ACTIF AU SCROLL ── */
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');
    let current    = '';

    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });

    links.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + current
        ? 'var(--accent)'
        : '';
    });
  });

});

function showFeedback(el, text, type) {
  el.textContent = text;
  el.style.display = 'block';
  el.style.background = type === 'ok'
    ? 'rgba(22,163,74,0.12)'
    : type === 'warn'
    ? 'rgba(202,138,4,0.12)'
    : 'rgba(220,38,38,0.12)';
  el.style.color = type === 'ok' ? '#15803d' : type === 'warn' ? '#a16207' : '#b91c1c';
  el.style.border = '1px solid ' + (type === 'ok' ? '#86efac' : type === 'warn' ? '#fde047' : '#fca5a5');
}
/* ── MENU MOBILE PORTFOLIO ── */
// Créer le bouton menu et l'injecter dans la nav
const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav-links');

const toggle = document.createElement('button');
toggle.classList.add('nav-toggle');
toggle.setAttribute('aria-label', 'Ouvrir le menu');
toggle.innerHTML = '<span></span><span></span><span></span>';
nav.appendChild(toggle);

// Overlay sombre
const overlay = document.createElement('div');
overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:140;';
document.body.appendChild(overlay);

function ouvrirMenu() {
    navLinks.classList.add('open');
    toggle.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function fermerMenu() {
    navLinks.classList.remove('open');
    toggle.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? fermerMenu() : ouvrirMenu();
});
overlay.addEventListener('click', fermerMenu);
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', fermerMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 900) fermerMenu(); });