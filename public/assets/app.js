(() => {
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('#main-nav');
  const header = document.querySelector('.site-header');
  if (menuButton && nav) {
    const closeMenu = () => { nav.classList.remove('is-open'); menuButton.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú'); document.body.classList.remove('menu-open'); };
    menuButton.addEventListener('click', () => { const opened = nav.classList.toggle('is-open'); menuButton.classList.toggle('is-open', opened); menuButton.setAttribute('aria-expanded', String(opened)); menuButton.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú'); document.body.classList.toggle('menu-open', opened); });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }
  const scrollHandler = () => header?.classList.toggle('is-scrolled', window.scrollY > 25);
  window.addEventListener('scroll', scrollHandler, { passive: true }); scrollHandler();
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
    document.querySelectorAll('.destination-card').forEach(card => { card.hidden = selected !== 'todos' && !card.dataset.category.split(' ').includes(selected); });
    const grid = document.querySelector('#destination-grid'); if (grid) grid.setAttribute('aria-label', selected === 'todos' ? 'Todos los destinos' : `Destinos: ${selected}`);
  }));
  document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => { const select = document.querySelector('#destino-select'); if (select) select.value = link.dataset.interest; }));
  const year = document.querySelector('#year'); if (year) year.textContent = String(new Date().getFullYear());
})();
