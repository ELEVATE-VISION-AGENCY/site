(function() {
  'use strict';

  if (window.location.hash) {
    window.location.hash = '';
  }
  window.scrollTo(0, 0);

  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        history.pushState(null, null, window.location.pathname + window.location.search);
      }
    });
  }

  const allInternalLinks = document.querySelectorAll('a[href^="#"]');
  allInternalLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href').substring(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, null, window.location.pathname + window.location.search);
        }
      }
    });
  });

  const navLinks = document.querySelectorAll('[data-nav]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('data-nav');
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, null, window.location.pathname + window.location.search);
        }
      }
    });
  });

  const nav = document.getElementById('nav');
  function handleNavScroll() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });
    navLinksContainer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => observer.observe(el));
  }

  window.eval = function() { throw new Error('Eval blocked for security'); };
})();
