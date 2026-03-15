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

  // FIX : booléen d'état — plus fiable que lire les styles calculés
  let menuOuvert = false;

  // Créer le bouton ☰
  const toggle = document.createElement('button');
  toggle.classList.add('nav-toggle');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
  toggle.setAttribute('type', 'button');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  Object.assign(toggle.style, {
    display:                 'none',
    flexDirection:           'column',
    gap:                     '5px',
    background:              'none',
    border:                  'none',
    cursor:                  'pointer',
    padding:                 '8px',
    zIndex:                  '9999',
    WebkitTapHighlightColor: 'transparent',
    touchAction:             'manipulation',
  });
  // Styler les barres du burger
  toggle.querySelectorAll('span').forEach(s => {
    Object.assign(s.style, {
      display:         'block',
      width:           '24px',
      height:          '2px',
      background:      '#8B4513',
      borderRadius:    '2px',
      transition:      'all 0.3s ease',
      transformOrigin: 'center',
      pointerEvents:   'none',
    });
  });
  nav.appendChild(toggle);

  // Créer l'overlay
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    display:    'none',
    position:   'fixed',
    top:        '0',
    left:       '0',
    width:      '100%',
    height:     '100%',
    background: 'rgba(0,0,0,0.4)',
    zIndex:     '8000',
  });
  document.body.appendChild(overlay);

  /* ---- Ouvrir ---- */
  function ouvrirMenu() {
    menuOuvert = true;
    // Rendre visible PUIS déclencher la transition (reflow nécessaire)
    navLinks.style.setProperty('display', 'flex', 'important');
    void navLinks.offsetWidth; // force reflow
    navLinks.style.setProperty('right', '0', 'important');
    toggle.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-label', 'Fermer le menu');
  }

  /* ---- Fermer ---- */
  function fermerMenu() {
    menuOuvert = false;
    navLinks.style.setProperty('right', '-100%', 'important');
    toggle.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    // Masquer après la fin de la transition (400 ms)
    setTimeout(() => {
      if (!menuOuvert) {
        navLinks.style.setProperty('display', 'none', 'important');
      }
    }, 420);
  }

  /* ---- Adapter selon la taille d'écran ---- */
  function checkMobile() {
    if (window.innerWidth <= 900) {
      toggle.style.display = 'flex';
      // Appliquer les styles du panneau latéral une seule fois
      if (!navLinks.dataset.mobileReady) {
        navLinks.dataset.mobileReady = 'true';
        navLinks.style.setProperty('position',        'fixed',                            'important');
        navLinks.style.setProperty('top',             '0',                                'important');
        navLinks.style.setProperty('right',           '-100%',                            'important');
        navLinks.style.setProperty('height',          '100vh',                            'important');
        navLinks.style.setProperty('width',           '65%',                              'important');
        navLinks.style.setProperty('max-width',       '280px',                            'important');
        navLinks.style.setProperty('background',      'rgba(250,247,242,0.99)',           'important');
        navLinks.style.setProperty('flex-direction',  'column',                           'important');
        navLinks.style.setProperty('justify-content', 'center',                           'important');
        navLinks.style.setProperty('align-items',     'center',                           'important');
        navLinks.style.setProperty('gap',             '36px',                             'important');
        navLinks.style.setProperty('padding',         '80px 24px',                        'important');
        navLinks.style.setProperty('list-style',      'none',                             'important');
        navLinks.style.setProperty('transition',      'right 0.4s ease',                  'important');
        navLinks.style.setProperty('z-index',         '9000',                             'important');
        navLinks.style.setProperty('box-shadow',      '-4px 0 30px rgba(139,69,19,0.1)', 'important');
        navLinks.style.setProperty('border-left',     '1px solid #E8DDD0',                'important');
        navLinks.style.setProperty('display',         'none',                             'important');
        navLinks.style.setProperty('pointer-events',  'auto',                             'important');
      }
    } else {
      toggle.style.display = 'none';
      navLinks.removeAttribute('style');
      navLinks.removeAttribute('data-mobile-ready');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      menuOuvert = false;
    }
  }

  checkMobile();
  window.addEventListener('resize', () => {
    checkMobile();
    if (window.innerWidth > 900) menuOuvert = false;
  });

  // FIX : clic sur le bouton — utilise le booléen, jamais les styles
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOuvert ? fermerMenu() : ouvrirMenu();
  });

  overlay.addEventListener('click', () => fermerMenu());

  // Fermer au clic sur un lien
  document.querySelectorAll('.nav-links a').forEach(link => {
    Object.assign(link.style, {
      WebkitTapHighlightColor: 'transparent',
      touchAction:             'manipulation',
      display:                 'block',
      padding:                 '8px 0',
    });
    link.addEventListener('click', () => fermerMenu());
  });

});

/* ── FEEDBACK FORMULAIRE ── */
function showFeedback(el, text, type) {
  el.textContent    = text;
  el.style.display  = 'block';
  el.style.padding  = '10px 14px';
  el.style.borderRadius = '6px';
  el.style.marginTop = '8px';
  el.style.background = type === 'ok'
    ? 'rgba(22,163,74,0.12)'
    : type === 'warn'
    ? 'rgba(202,138,4,0.12)'
    : 'rgba(220,38,38,0.12)';
  el.style.color  = type === 'ok' ? '#15803d' : type === 'warn' ? '#a16207' : '#b91c1c';
  el.style.border = '1px solid ' + (type === 'ok' ? '#86efac' : type === 'warn' ? '#fde047' : '#fca5a5');
}
