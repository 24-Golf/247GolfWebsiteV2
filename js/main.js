/* ============================================================
   24/7 Golf — main.js
   Shared JavaScript. Include at bottom of every page's <body>.
   ============================================================ */

(function () {
  'use strict';

  // ── Scroll Reveal ──────────────────────────────────────────
  // Automatically animates any element with class="reveal"
  // Optional: add reveal-delay-1 through reveal-delay-4 for staggered timing

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it doesn't re-trigger
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });


  // ── Mobile Navigation ──────────────────────────────────────
  // Toggles body.nav-open to show/hide mobile nav links

  const hamburger = document.querySelector('.nav-hamburger');
  const body = document.body;

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      body.classList.toggle('nav-open');
      const isOpen = body.classList.contains('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile nav when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (body.classList.contains('nav-open') &&
          !e.target.closest('nav.site-nav')) {
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  // ── Nav Scroll Shadow ──────────────────────────────────────
  // Adds a subtle class to nav when user scrolls down

  const nav = document.querySelector('nav.site-nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  // ── Smooth Scroll for Anchor Links ────────────────────────
  // Handles links like href="#locations" with nav offset

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72'
      );

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
