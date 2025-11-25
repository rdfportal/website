class LanguageSwitcher {
  static init() {
    const container = document.querySelector('.language-switcher');
    const toggle = document.getElementById('language-toggle');
    if (!container || !toggle) return;
    const optionsPanel = container.querySelector('.options');
    if (!optionsPanel) return;

    const closePanel = () => {
      toggle.setAttribute('aria-expanded', 'false');
      optionsPanel.classList.remove('-active');
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closePanel();
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        optionsPanel.classList.add('-active');
      }
    });

    document.addEventListener('click', (event) => {
      if (!container.contains(event.target)) {
        closePanel();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LanguageSwitcher.init);
} else {
  LanguageSwitcher.init();
}
