/* Tema Day/Night: cor da barra do navegador e alternador integrado ao header. */
(() => {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const sync = () => meta && meta.setAttribute('content', root.getAttribute('data-theme') === 'dark' ? '#111C28' : '#F4F7FB');
  sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  DayNight.init({ target: '#alternador' });
})();
