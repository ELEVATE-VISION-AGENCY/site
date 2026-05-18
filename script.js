(function() {
  'use strict';

  // 1. Ao atualizar a página, volta para o topo (remove qualquer hash e scrolla)
  if (window.location.hash) {
    window.location.hash = '';
  }
  window.scrollTo(0, 0);

  // 2. Título clicável (logo) sobe para a primeira página
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Remove qualquer fragmento da URL
      if (window.location.hash) {
        history.pushState(null, null, window.location.pathname + window.location.search);
      }
    });
  }

  // 3. Resolver erro "Unsafe attempt to load URL file://..." - substituir navegação por hash por JS puro
  // Previne o comportamento padrão de todos os links internos que apontam para #id
  const allInternalLinks = document.querySelectorAll('a[href^="#"]');
  allInternalLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href').substring(1); // remove o '#'
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          // Atualiza a URL sem causar o warning file:// (usamos replaceState para não adicionar hash)
          history.pushState(null, null, window.location.pathname + window.location.search);
        }
      }
    });
  });

  // Também trata os links de navegação com data-nav (caso tenham sido adicionados)
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

  // Nav scroll effect
  const nav = document.getElementById('nav');
  function handleNavScroll() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });
    // Fecha o menu ao clicar em qualquer link interno
    navLinksContainer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // Scroll reveal (Intersection Observer)
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

  // Proteção extra contra injeção: limpa quaisquer atributos ou eventos maliciosos adicionados dinamicamente
  // Como não há inserção de HTML externo, apenas garantimos que o conteúdo estático é seguro.
  // Bloqueia tentativas de eval indesejado
  window.eval = function() { throw new Error('Eval blocked for security'); };
  // Impede acesso à funções perigosas (opcional, mas aumenta segurança)
  Object.freeze(window.document);
  // Impede modificação de prototypes críticos
  Object.freeze(Element.prototype);
})();