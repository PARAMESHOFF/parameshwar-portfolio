(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navbar: blur on scroll, progress bar, back-to-top */
  const nav = $('#nav'), bar = $('#progress'), top = $('#top');
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    top.classList.toggle('show', y > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* Mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('i', burger).className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* Active link highlighting */
  const links = $$('.menu a[href^="#"]:not(.btn)');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* Scroll reveal for section content */
  const targets = $$('.sec .card, .sec h2, .timeline li, .prose');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach((t, i) => {
      t.classList.add('reveal');
      t.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(t);
    });
  }

  /* Typing effect for the role title */
  const typed = $('#typed');
  if (typed && !reduce) {
    const text = typed.textContent;
    typed.textContent = '';
    let i = 0;
    const tick = () => {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 70);
    };
    setTimeout(tick, 500);
  }

  /* Contact form: validate, then open the visitor's email app.
     To send directly instead, replace the mailto block with
     fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body:new FormData(form) }) */
  const form = $('#form'), status = $('#status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input,textarea', form).forEach(f => {
      const valid = f.value.trim() && f.checkValidity();
      f.classList.toggle('bad', !valid);
      if (!valid) ok = false;
    });
    status.className = 'status ' + (ok ? 'ok' : 'err');
    if (!ok) { status.textContent = 'Please fill in your name, a valid email and a message.'; return; }
    const d = new FormData(form);
    const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:paramesh4118@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Thanks! Your email app should open with the message ready to send.';
    form.reset();
  });
})();
