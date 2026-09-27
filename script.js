/* ===================================================
   Thomas Zijlstra Portfolio — script.js
   =================================================== */

(function () {
  'use strict';

  // --- Theme -----------------------------------------------
  const THEME_KEY = 'tz-theme';

  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.textContent = theme === 'dark' ? '☀' : '☾';
    }
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // --- Moonshot Mode ----------------------------------------
  function initMoonshot() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('target') === 'moonshot') {
      const banner = document.getElementById('moonshot-banner');
      if (banner) { banner.hidden = false; }
      // Override hero content
      const headline = document.getElementById('hero-heading');
      const sub = document.getElementById('hero-sub');
      const moonshotHL = document.getElementById('moonshot-headline');
      const moonshotSub = document.getElementById('moonshot-sub');
      if (headline && moonshotHL) headline.textContent = moonshotHL.textContent;
      if (sub && moonshotSub) sub.textContent = moonshotSub.textContent;
      // Show moonshot statement
      const stmt = document.getElementById('moonshot-statement');
      if (stmt) { stmt.hidden = false; }
      // Show target-specific sections (Delivery, Commercialisation, 90 Days, Role Fit)
      const targetSections = document.getElementById('target-sections');
      if (targetSections) {
        targetSections.hidden = false;
        targetSections.removeAttribute('aria-hidden');
        // Move target sections before the footer so they appear after main content
        const footer = document.querySelector('footer');
        if (footer) footer.parentNode.insertBefore(targetSections, footer);
      }
      // Update page title
      document.title = 'Thomas Zijlstra, CFA | Business Builder & Ecosystem';
    }
  }

  // --- Mobile Navigation -----------------------------------
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('nav-mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // --- Thesis Accordion ------------------------------------
  function initThesisAccordion() {
    document.querySelectorAll('.thesis-stage-header').forEach(function (header) {
      header.addEventListener('click', function () {
        const stage = this.closest('.thesis-stage');
        const isOpen = stage.classList.toggle('open');
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const body = stage.querySelector('.thesis-stage-body');
        if (body) body.hidden = !isOpen;
      });

      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // --- Project Filter Tabs ---------------------------------
  function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Update active tab
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const filter = this.dataset.filter;

        cards.forEach(function (card) {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            const tags = (card.dataset.tags || '').split(',').map(function (t) { return t.trim(); });
            if (tags.includes(filter)) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          }
        });
      });
    });
  }

  // --- Project Dialogs ------------------------------------
  var lastFocusedElement = null;

  function openDialog(dialogId) {
    var backdrop = document.getElementById(dialogId + '-backdrop');
    if (!backdrop) return;
    lastFocusedElement = document.activeElement;
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    var firstFocusable = backdrop.querySelector('button, a, [tabindex="0"]');
    if (firstFocusable) firstFocusable.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDialog(dialogId) {
    var backdrop = document.getElementById(dialogId + '-backdrop');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function initDialogs() {
    // Open buttons
    document.querySelectorAll('[data-dialog-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDialog(this.dataset.dialogOpen);
      });
    });

    // Close buttons
    document.querySelectorAll('[data-dialog-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var backdrop = this.closest('.dialog-backdrop');
        if (backdrop) closeDialog(backdrop.id.replace('-backdrop', ''));
      });
    });

    // Click outside
    document.querySelectorAll('.dialog-backdrop').forEach(function (backdrop) {
      backdrop.addEventListener('click', function (e) {
        if (e.target === this) {
          closeDialog(this.id.replace('-backdrop', ''));
        }
      });
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.dialog-backdrop.open').forEach(function (backdrop) {
          closeDialog(backdrop.id.replace('-backdrop', ''));
        });
      }
    });

    // Focus trap
    document.querySelectorAll('.dialog').forEach(function (dialog) {
      dialog.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var focusable = Array.from(dialog.querySelectorAll(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    });
  }

  // --- Copy Email ------------------------------------------
  function initCopyEmail() {
    var btn = document.getElementById('copy-email');
    if (!btn) return;
    var confirmation = document.getElementById('copy-confirmation');
    var liveRegion = document.getElementById('copy-live');
    btn.addEventListener('click', function () {
      var email = this.dataset.email || 'zijlstra.thomas@gmail.com';
      navigator.clipboard.writeText(email).then(function () {
        if (confirmation) {
          confirmation.classList.add('visible');
          setTimeout(function () { confirmation.classList.remove('visible'); }, 2000);
        }
        if (liveRegion) {
          liveRegion.textContent = 'Email address copied';
          setTimeout(function () { liveRegion.textContent = ''; }, 3000);
        }
      }).catch(function () {
        // Fallback
        var temp = document.createElement('input');
        document.body.appendChild(temp);
        temp.value = email;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        if (confirmation) {
          confirmation.classList.add('visible');
          setTimeout(function () { confirmation.classList.remove('visible'); }, 2000);
        }
      });
    });
  }

  // --- Scroll Reveal ---------------------------------------
  function initScrollReveal() {
    if (!window.IntersectionObserver) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll nav links -----------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 60;
          var y = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // --- Wire up theme button --------------------------------
  function initControls() {
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  }

  // --- Scroll Spy (active nav highlighting) ----------------
  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navLinks.length || !window.IntersectionObserver) return;

    // Map section id → nav link element
    var sectionMap = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      if (document.getElementById(id)) {
        sectionMap[id] = link;
      }
    });

    var activeSectionId = null;
    var visibleSections = new Set();

    function updateActive() {
      // Pick the first visible section (document order)
      var ids = Object.keys(sectionMap);
      var active = null;
      for (var i = 0; i < ids.length; i++) {
        if (visibleSections.has(ids[i])) { active = ids[i]; break; }
      }
      if (active === activeSectionId) return;
      activeSectionId = active;
      navLinks.forEach(function (l) { l.classList.remove('nav-active'); });
      if (active && sectionMap[active]) {
        sectionMap[active].classList.add('nav-active');
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });
      updateActive();
    }, {
      rootMargin: '0px 0px -60% 0px',
      threshold: 0
    });

    Object.keys(sectionMap).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  // --- Init ------------------------------------------------
  function init() {
    initTheme();
    initMoonshot();
    initMobileNav();
    initThesisAccordion();
    initFilterTabs();
    initDialogs();
    initCopyEmail();
    initScrollReveal();
    initSmoothScroll();
    initControls();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
