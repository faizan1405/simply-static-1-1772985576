/**
 * Macduke Onepage — Main JS
 */
(function () {
  'use strict';

  /* ---- Sticky Header & Social Bar ---- */
  const header = document.getElementById('siteHeader');
  const socialBar = document.getElementById('socialBar');
  const progressBar = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    const scrolled = y > 50;
    header.classList.toggle('scrolled', scrolled);
    socialBar.classList.toggle('hidden-bar', scrolled);

    const total = document.body.scrollHeight - window.innerHeight;
    if (progressBar && total > 0) {
      progressBar.style.width = (y / total * 100) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile Menu ---- */
  const toggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) { el.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---- Count Up Animation ---- */
  const counters = document.querySelectorAll('.trust-value[data-target]');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';
      const target = parseInt(entry.target.dataset.target, 10);
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          entry.target.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          entry.target.textContent = Math.floor(current).toLocaleString();
        }
      }, duration / steps);
    });
  }, { threshold: 0.3 });
  counters.forEach(function (el) { counterObserver.observe(el); });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObserver.observe(el); });

  /* ---- AJAX Contact Form ---- */
  var form = document.getElementById('contactForm');
  var feedback = document.getElementById('formFeedback');

  if (form && typeof macduke_ajax !== 'undefined') {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      feedback.textContent = 'Sending...';
      feedback.className = 'form-feedback sending';

      var formData = new FormData(form);
      formData.append('action', 'macduke_contact');
      formData.append('nonce', macduke_ajax.nonce);

      fetch(macduke_ajax.url, { method: 'POST', body: formData })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            feedback.textContent = data.data;
            feedback.className = 'form-feedback success';
            form.reset();
          } else {
            feedback.textContent = data.data || 'Something went wrong.';
            feedback.className = 'form-feedback error';
          }
        })
        .catch(function () {
          feedback.textContent = 'Network error. Please call us directly.';
          feedback.className = 'form-feedback error';
        });
    });
  }
})();
