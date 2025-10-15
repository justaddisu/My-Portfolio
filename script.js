/* Portfolio interactions */
(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Dark mode
  const root = document.documentElement;
  const modeBtn = document.getElementById('mode-toggle');
  const initial = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (initial === 'dark') root.classList.add('dark');
  modeBtn?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });

  // Filters
  const grid = document.querySelector('[data-projects]');
  const chips = document.querySelectorAll('.chip');
  function applyFilter(tag) {
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',').map(s => s.trim());
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  }
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      applyFilter(chip.getAttribute('data-filter'));
    });
  });

  // Contact form validation
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = ['name', 'email', 'message'];
    form.addEventListener('submit', (e) => {
      let ok = true;
      for (const id of fields) {
        const input = form.querySelector('#' + id);
        const error = form.querySelector('#error-' + id);
        if (!input.checkValidity()) {
          ok = false;
          error.textContent = input.validationMessage;
        } else {
          error.textContent = '';
        }
      }
      if (!ok) e.preventDefault();
    });
  }
})();