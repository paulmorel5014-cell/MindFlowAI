/* =============================================
   VIRY AUTO PLUS — Scripts principaux
   ============================================= */

(function () {
  'use strict';

  // ── STICKY HEADER ──────────────────────────
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── BURGER MENU ────────────────────────────
  const burger  = document.getElementById('burger');
  const navList = document.getElementById('nav-list');

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navList.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  // Fermer le menu mobile en cliquant sur un lien
  navList.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navList.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── BACK TO TOP ────────────────────────────
  const backTop = document.getElementById('back-top');
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── AOS — APPARITION AU SCROLL ─────────────
  const aosElements = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Délai échelonné pour les cartes dans une grille
          const siblings = [...entry.target.parentElement.children].filter(el => el.hasAttribute('data-aos'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('aos-visible');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    aosElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: tout afficher directement
    aosElements.forEach(el => el.classList.add('aos-visible'));
  }

  // ── SMOOTH SCROLL POUR LES ANCRES ──────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── ACTIVE NAV LINK AU SCROLL ───────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const linkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-72px 0px 0px 0px' });

  sections.forEach(s => linkObserver.observe(s));

  // Initialiser l'état du scroll au chargement
  onScroll();

})();
