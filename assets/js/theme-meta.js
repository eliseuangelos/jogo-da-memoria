(() => {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  const updateThemeColor = () => {
    meta.setAttribute(
      'content',
      root.getAttribute('data-theme') === 'dark' ? '#111C28' : '#F4F7FB'
    );
  };

  updateThemeColor();

  const observer = new MutationObserver(updateThemeColor);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
