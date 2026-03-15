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
      l.style.color = l.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  });

  /* ── MENU HAMBURGER MOBILE ── */
  const nav      = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');

  // Créer le bouton ☰
  const toggle = document.createElement('button');
  toggle.classList.add('nav-toggle');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  toggle.style.cssText = `
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 9999;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  `;
  nav.appendChild(toggle);

  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 8000;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  `;
  document.body.appendChild(overlay);

  function ouvrirMenu() {
    navLinks.style.right = '0';
    navLinks.style.display = 'flex';
    toggle.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function fermerMenu() {
    navLinks.style.right = '-100%';
    toggle.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    setTimeout(() => {
      if (window.innerWidth <= 900) navLinks.style.display = 'none';
    }, 400);
  }

  // Afficher le bouton sur mobile
  function checkMobile() {
    if (window.innerWidth <= 900) {
      toggle.style.display = 'flex';
      navLinks.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: -100% !important;
        height: 100vh !important;
        width: 65% !important;
        max-width: 280px !important;
        background: rgba(250,247,242,0.99) !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 36px !important;
        padding: 80px 24px !important;
        list-style: none !important;
        transition: right 0.4s ease !important;
        z-index: 9000 !important;
        box-shadow: -4px 0 30px rgba(139,69,19,0.1) !important;
        border-left: 1px solid #E8DDD0 !important;
        display: none !important;
        pointer-events: auto !important;
      `;
    } else {
      toggle.style.display = 'none';
      navLinks.removeAttribute('style');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  checkMobile();
  window.addEventListener('resize', () => { checkMobile(); if (window.innerWidth > 900) fermerMenu(); });

  // Événements tactiles ET clic pour compatibilité mobile
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navLinks.style.display === 'flex' && navLinks.style.right === '0px'
      ? fermerMenu()
      : ouvrirMenu();
  });

  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    fermerMenu();
  });

  // Fermer au clic sur un lien — compatible mobile
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.cssText += '-webkit-tap-highlight-color: transparent; touch-action: manipulation; display: block; padding: 8px 0;';
    link.addEventListener('click', (e) => {
      fermerMenu();
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
