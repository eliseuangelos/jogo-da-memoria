(() => {
  const storageKey = 'dn-theme';
  const root = document.documentElement;
  let theme = null;

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme = savedTheme;
    }
  } catch {
    // Armazenamento indisponível: utilizar a preferência do sistema.
  }

  if (!theme) {
    const prefersDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  root.setAttribute('data-theme', theme);
})();
