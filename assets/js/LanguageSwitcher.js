// LanguageManager: 言語切り替えUI制御
class LanguageManager {
  static DEFAULT_LANG = 'en';
  static STORAGE_KEY = 'site-language';

  static getCurrentLanguage() {
    return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANG;
  }

  static setLanguage(lang) {
    if (!lang) return;
    localStorage.setItem(this.STORAGE_KEY, lang);
    try { document.documentElement.lang = lang; } catch (e) { }
    this.updateUI();
  }

  static updateUI() {
    const currentLang = this.getCurrentLanguage();
    const toggle = document.getElementById('language-toggle');
    if (toggle) {
      const currentSpan = toggle.querySelector('.current');
      if (currentSpan) {
        currentSpan.textContent = currentLang === 'ja' ? 'JA' : 'EN';
      }
    }
  }

  static init() {
    // initialize document lang from storage/default before UI is rendered
    const lang = this.getCurrentLanguage();
    try { document.documentElement.lang = lang; } catch (e) { }
    this.updateUI();
    const toggle = document.getElementById('language-toggle');
    if (toggle) {
      const optionsPanel = toggle.querySelector('.options');
      // オプション表示制御（クラスのトグル）
      toggle.addEventListener('mouseenter', () => {
        optionsPanel.classList.add('-active');
      });
      toggle.addEventListener('mouseleave', () => {
        optionsPanel.classList.remove('-active');
      });
      // 個別のオプションにイベントリスナーを追加
      const options = toggle.querySelectorAll('.options > span[data-lang]');
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetLang = option.getAttribute('data-lang');
          if (targetLang) {
            this.setLanguage(targetLang);
            // 切り替え後にオプションを消す
            optionsPanel.classList.remove('-active');
          }
        });
      });
      // ボタン全体のクリックは無効化（オプション表示のみ）
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  }
}

// DOMが読み込まれたら言語管理システムを初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    LanguageManager.init();
  });
} else {
  LanguageManager.init();
}
