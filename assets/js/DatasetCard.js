/**
 * DatasetCard - 花弁アイコン (0/1 タグも統一フォルム)
 */
class DatasetCard {
  static CARD_CLASS = "dataset-card";
  static TITLE_CLASS = "title";
  static DESCRIPTION_CLASS = "description";
  static TAGS_CLASS = "tags-container";
  static TAG_CLASS = "tag";
  static LINK_CLASS = "link";
  static DEFAULTS = {
    FALLBACK_TITLE: "Unknown Dataset",
    FALLBACK_DESCRIPTION: "No description available",
    OPTIONS: {
      showLink: false,
      showTags: false,
      showDescription: true,
      showFallbackDescription: false,
      linkBaseUrl: "",
      customClasses: [],
      onClick: null,
      showIcon: true,
      iconSize: 36,
      iconRendering: "svgOverlap",
      showHeaderMeta: false, // headerに発行日・トリプル数を表示するか
    },
  };
  static SVG = {
    // 幾何/制御パラメータ ==============================
    MAX_PETALS: 10, // 同時に描画する最大花弁枚数 (タグ数が多くても打ち止め)
    SCALE: 0.82, // 全体基礎スケール (viewBox 100x100 を card サイズへ収める調整)
    APEX_Y: 78, // 花弁先端（下端）Y 座標 (lenFactor で圧縮)
    PETAL_TOP_Y: 10, // 花弁上端（頂点寄り）Y 座標
    PETAL_CTRL_TOP_Y: 20, // Bézier 上側制御点 Y
    PETAL_CTRL_LOW_Y: 55, // Bézier 下側制御点 Y (lenFactor で圧縮)

    // グラデーション関連 ===============================
    GRAD_OPACITY_START: 1, // グラデ上部 stop の不透明度
    GRAD_OPACITY_END: 0.2, // グラデ下部 stop の不透明度
    USE_RANDOM_ID: true, // <defs> の gradient id にランダム要素を含め重複を防ぐ

    // 花弁幅・長さスケーリング =========================
    WIDTH_MAX: 32, // 最小枚数時の最大半幅
    WIDTH_MIN: 12, // 最大枚数時の最小半幅
    WIDTH_EXP: 1.25, // 幅補間用指数 (非線形に細くする)
    LENGTH_COMPRESS: 0.12, // 枚数増加に伴う縦方向圧縮率 (t2 を掛ける)

    // (垂直揃え関連は V_ALIGN に移動)

    ZERO_TAG_COLOR: "#e2e8f0", // タグ 0 件時のプレースホルダ色

    // 視覚サイズ補正 ===================================
    VISUAL_MIN_SCALE: 1.1, // 多枚数時の全体縮小下限 (最小)
    VISUAL_MAX_SCALE: 1.1, // 少枚数時の全体拡大上限 (最大)
    VISUAL_EXP: 1.0, // 視覚スケール補間指数 (大きいほど多枚数側を強く縮小)
    SINGLE_PETAL_EMPHASIS: 1.025, // 単一タグ表示時のわずかな追加拡大倍率
    FULL_CIRCLE_THRESHOLD: 11, // この枚数以上で扇状 → 360° 均等配置に切替
    // レイアウト角度制御 ==============================
    TWO_PETAL_SPAN: 50, // 2枚時の扇状角度 (中心対称配置で ±25°)
    FAN_SPAN_MIN: 70, // 3枚時の扇状角度 (開始値)
    FAN_SPAN_MAX: 110, // FULL_CIRCLE_THRESHOLD-1 枚時の扇状角度 (その次で 360° へ)
  };

  // 垂直位置調整: アイコンとテキストの視覚中心を合わせるための調整定数
  static V_ALIGN = {
    MODE: "geometric", // 'geometric' | 'interpolate' 将来切替用
    // geometric モード (既定)
    CENTER_BASE: 10, // 基本オフセット（下方向に重心を調整）
    CENTER_FACTOR: 1.0, // 中点差分係数
    // interpolate モード (必要なら MODE を変更し下記を調整）
    SHIFT_MIN: -0.8,
    SHIFT_MAX: 0.9,
    SHIFT_EXP: 0.9,
    SINGLE_EXTRA: 0.6,
  };

  #dataset;
  #options;
  #element;
  #languageChangeHandler;
  constructor(dataset = {}, options = {}) {
    try {
      this.#dataset = dataset || {};
      this.#options = { ...DatasetCard.DEFAULTS.OPTIONS, ...(options || {}) };
      // ルートを <article> に変更 (セマンティクス向上)
      const el = document.createElement("article");
      el.className = DatasetCard.CARD_CLASS;
      if (Array.isArray(this.#options.customClasses))
        this.#options.customClasses.forEach((c) => c && el.classList.add(c));
      if (this.#dataset.id) el.dataset.datasetId = this.#dataset.id;
      el.innerHTML = this.#generateContent();
      this.#setupEventListeners(el);
      this.#element = el;

      // 言語変更イベントリスナーを追加
      this.#setupLanguageListener();
    } catch (e) {
      console.error("DatasetCard constructor error", e);
      const fb = document.createElement("div");
      fb.className = DatasetCard.CARD_CLASS + " dataset-card--error";
      fb.textContent =
        this.#dataset?.title || this.#dataset?.id || "Invalid Dataset";
      this.#element = fb;
    }
  }

  // 言語変更イベントリスナー設定
  #setupLanguageListener() {
    // Use a MutationObserver to watch for changes to <html lang="...">.
    // This avoids relying on custom events and works when LanguageManager
    // updates document.documentElement.lang.
    try {
      // disconnect existing observer if present
      if (this.#languageChangeHandler && typeof this.#languageChangeHandler.disconnect === 'function') {
        this.#languageChangeHandler.disconnect();
      }

      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.attributeName === 'lang') {
            if (this.#element) {
              this.#element.innerHTML = this.#generateContent();
              this.#setupEventListeners(this.#element);
            }
            break;
          }
        }
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
      this.#languageChangeHandler = observer;
    } catch (e) {
      // Fallback: no observer available, leave handler null.
      this.#languageChangeHandler = null;
    }
  }

  static createCards(datasets, options = {}) {
    const frag = document.createDocumentFragment();
    if (!Array.isArray(datasets)) return frag;
    datasets.forEach((ds) => {
      const c = new DatasetCard(ds, options);
      const el = c.getElement();
      if (el) frag.appendChild(el);
    });
    return frag;
  }

  getElement() {
    return this.#element;
  }
  appendTo(container) {
    if (container?.appendChild && this.#element)
      container.appendChild(this.#element);
  }
  remove() {
    // イベントリスナーをクリーンアップ
    if (this.#languageChangeHandler) {
      try {
        if (typeof this.#languageChangeHandler.disconnect === 'function') {
          this.#languageChangeHandler.disconnect();
        } else {
          // noop
        }
      } catch (e) { }
      this.#languageChangeHandler = null;
    }

    if (this.#element?.parentNode)
      this.#element.parentNode.removeChild(this.#element);
  }

  #generateContent() {
    const iconPart = this.#options.showIcon
      ? `<div class="iconwrapper">${this.#buildPetalSvg()}</div>`
      : "";
    const titlePart = this.#generateTitle();
    const metaPart = this.#options.showHeaderMeta
      ? this.#generateHeaderMeta()
      : "";
    const descHtml = this.#generateDescription();
    const tagsHtml = this.#options.showTags ? this.#generateTags() : "";
    // icon + title + meta を <header> にまとめる
    const headHtml = `<header class="head">${iconPart}${titlePart}${metaPart}</header>`;
    return `${headHtml}<div class="body">${descHtml}${tagsHtml}</div>`;
  }
  // header用: 発行日とトリプル数を表示
  #generateHeaderMeta() {
    const issued = this.#dataset.issued;
    const tripleCount = this.#dataset.statistics?.number_of_triples;
    let html = '<div class="meta">';
    if (issued) {
      html += `<span class="issued">${this.#escapeHtml(issued)}</span>`;
    }
    if (tripleCount && typeof tripleCount === "number") {
      html += `<span class="triples">${tripleCount.toLocaleString()} triples</span>`;
    }
    html += "</div>";
    return html;
  }
  #generateTitle() {
    const ttl =
      this.#dataset.title ||
      this.#dataset.id ||
      DatasetCard.DEFAULTS.FALLBACK_TITLE;
    const safe = this.#escapeHtml(ttl);
    if (
      this.#options.showLink &&
      this.#dataset.id &&
      this.#options.linkBaseUrl
    ) {
      const href = this.#escapeHtml(
        this.#options.linkBaseUrl.replace(/\/$/, "") +
        "/dataset/" +
        encodeURIComponent(this.#dataset.id) +
        "/",
      );
      return `<a class="${DatasetCard.TITLE_CLASS} ${DatasetCard.LINK_CLASS}" href="${href}">${safe}</a>`;
    }
    return `<div class="${DatasetCard.TITLE_CLASS}">${safe}</div>`;
  }
  #generateDescription() {
    if (!this.#options.showDescription) return "";

    // 多言語対応: description がオブジェクトの場合の処理
    let desc = "";
    if (typeof this.#dataset.description === "string") {
      // 従来形式（文字列）
      desc = this.#dataset.description.trim();
    } else if (
      typeof this.#dataset.description === "object" &&
      this.#dataset.description
    ) {
      // 新形式（多言語オブジェクト）
      const currentLang = this.#getCurrentLanguage();
      desc =
        this.#dataset.description[currentLang] ||
        this.#dataset.description.en ||
        this.#dataset.description.ja ||
        "";
      if (desc) desc = desc.trim();
    }

    if (desc)
      return `<p class="${DatasetCard.DESCRIPTION_CLASS}">${this.#escapeHtml(
        desc,
      )}</p>`;
    if (this.#options.showFallbackDescription)
      return `<p class="${DatasetCard.DESCRIPTION_CLASS
        } isFallback">${this.#escapeHtml(
          DatasetCard.DEFAULTS.FALLBACK_DESCRIPTION,
        )}</p>`;
    return "";
  }

  // 現在の言語設定を取得
  #getCurrentLanguage() {
    return localStorage.getItem("site-language") || "en";
  }
  #generateTags() {
    const tags = this.#extractTagStrings(this.#getTags());
    if (!tags.length) return "";
    return `<div class="${DatasetCard.TAGS_CLASS}">${tags
      .map((t) => this.#renderTag(t))
      .join("")}</div>`;
  }
  #renderTag(tag) {
    if (typeof tag === "string")
      return `<span class="${DatasetCard.TAG_CLASS
        }" data-tag="${this.#escapeHtml(tag)}">${this.#escapeHtml(tag)}</span>`;
    if (tag && typeof tag === "object" && tag.id) {
      const lang = document.documentElement.lang || "ja";
      const txt = tag.label?.[lang] || tag.label?.ja || tag.label?.en || tag.id;
      return `<span class="${DatasetCard.TAG_CLASS
        }" data-tag="${this.#escapeHtml(tag.id)}">${this.#escapeHtml(
          txt,
        )}</span>`;
    }
    return "";
  }

  // === helpers (復元) ===
  #getTags() {
    if (Array.isArray(this.#dataset.tagsWithColors))
      return this.#dataset.tagsWithColors;
    return Array.isArray(this.#dataset.tags) ? this.#dataset.tags : [];
  }
  #extractTagStrings(list) {
    return Array.isArray(list)
      ? list
        .map((t) => (typeof t === "string" ? t : t?.id || ""))
        .filter(Boolean)
      : [];
  }
  #escapeHtml(str) {
    return typeof str === "string"
      ? str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
      : "";
  }
  #hashString(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
      h >>> 0;
    }
    return h >>> 0;
  }

  #buildPetalSvg() {
    const size = this.#options.iconSize || 48;
    const tags = this.#extractTagStrings(this.#getTags());
    try {
      if (window.DatasetIcon && typeof window.DatasetIcon.createSvg === 'function') {
        return window.DatasetIcon.createSvg(tags, size, {});
      }
    } catch (e) {
      // fall through to placeholder
    }

    // fallback simple placeholder
    return `<svg class="icon -svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Icon"><rect width="${size}" height="${size}" fill="#ddd"/></svg>`;
  }
  #hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const r = Math.round(f(0) * 255)
      .toString(16)
      .padStart(2, "0");
    const g = Math.round(f(8) * 255)
      .toString(16)
      .padStart(2, "0");
    const b = Math.round(f(4) * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  #setupEventListeners(el) {
    if (typeof this.#options.onClick === "function") {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        this.#options.onClick(this.#dataset, e);
      });
      el.style.cursor = "pointer";
    }
  }
}

window.DatasetCard = DatasetCard;
