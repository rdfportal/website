/**
 * DatasetCard - 花弁アイコン (0/1 タグも統一フォルム)
 */
class DatasetCard {
  static CARD_CLASS = "dataset-card";
  static TITLE_CLASS = "title";
  static DESCRIPTION_CLASS = "description";
  static TAGS_CLASS = "tag-container";
  static TAG_CLASS = "tag-icon";
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
      if (
        this.#languageChangeHandler &&
        typeof this.#languageChangeHandler.disconnect === "function"
      ) {
        this.#languageChangeHandler.disconnect();
      }

      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "attributes" && m.attributeName === "lang") {
            if (this.#element) {
              this.#element.innerHTML = this.#generateContent();
              this.#setupEventListeners(this.#element);
            }
            break;
          }
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
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
        if (typeof this.#languageChangeHandler.disconnect === "function") {
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
    const titlePart = this.#generateTitle();
    const metaPart = this.#options.showHeaderMeta
      ? this.#generateHeaderMeta()
      : "";
    const descHtml = this.#generateDescription();
    const tagsHtml = this.#options.showTags ? this.#generateTags() : "";
    // title (containing icon) + meta を <header> にまとめる
    const headHtml = `<header class="head">${titlePart}${metaPart}</header>`;
    return `${headHtml}<div class="body">${descHtml}${tagsHtml}</div>`;
  }
  // header用: 発行日とトリプル数を表示
  #generateHeaderMeta() {
    const issued = this.#dataset.issued;
    const tripleCount = this.#dataset.statistics?.number_of_triples;
    let html = '<div class="meta">';
    if (issued) {
      html += `<span class="issued">${this.#escapeHtml(
        issued
      )}</span>`;
    }
    if (tripleCount && typeof tripleCount === "number") {
      html += `<span class="triples">${tripleCount.toLocaleString()} triples</span>`;
    }
    if (this.#dataset.rdf_provenance_type) {
      html += `<span class="provenance">${this.#escapeHtml(
        this.#formatMetaString(this.#dataset.rdf_provenance_type)
      )}</span>`;
    }
    if (this.#dataset.registration_type) {
      html += `<span class="registration">${this.#escapeHtml(
        this.#formatMetaString(this.#dataset.registration_type)
      )}</span>`;
    }
    html += "</div>";
    return html;
  }
  #formatMetaString(str) {
    if (!str) return "";
    return str
      .split("_")
      .map((word, index) => {
        const lower = word.toLowerCase();
        if (lower === "rdfportal") return "RDF portal";
        if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
        return word;
      })
      .join(" ");
  }
  #generateTitle() {
    const iconPart = this.#options.showIcon
      ? this.#buildPetalSvg()
      : "";

    let ttl = this.#dataset.title;
    if (typeof ttl === "object" && ttl) {
      ttl =
        ttl[this.#getCurrentLanguage()] ||
        ttl.en ||
        ttl.ja ||
        "";
    }
    ttl = ttl || this.#dataset.id || DatasetCard.DEFAULTS.FALLBACK_TITLE;
    const safe = this.#escapeHtml(ttl);

    let contentHtml = "";
    if (
      this.#options.showLink &&
      this.#dataset.id &&
      this.#options.linkBaseUrl
    ) {
      const href = this.#escapeHtml(
        this.#options.linkBaseUrl.replace(/\/$/, "") +
        "/dataset/" +
        encodeURIComponent(this.#dataset.id) +
        "/"
      );
      contentHtml = `<a class="${DatasetCard.LINK_CLASS}" href="${href}">${safe}</a>`;
    } else {
      contentHtml = `<span class="${DatasetCard.LINK_CLASS}">${safe}</span>`;
    }

    return `<div class="${DatasetCard.TITLE_CLASS}">${iconPart}${contentHtml}</div>`;
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
        desc
      )}</p>`;
    if (this.#options.showFallbackDescription)
      return `<p class="${DatasetCard.DESCRIPTION_CLASS
        } isFallback">${this.#escapeHtml(
          DatasetCard.DEFAULTS.FALLBACK_DESCRIPTION
        )}</p>`;
    return "";
  }

  // 現在の言語設定を取得
  #getCurrentLanguage() {
    return document.documentElement.lang || "en";
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
          txt
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
  #buildPetalSvg() {
    const size = this.#options.iconSize || 48;
    const baseUrl = (typeof window !== 'undefined' && window.SITE_BASE_URL_ROOT) ? window.SITE_BASE_URL_ROOT : "";
    
    if (this.#dataset && this.#dataset.id) {
      return `<img src="${baseUrl}/assets/images/dataset_symbols/${this.#escapeHtml(this.#dataset.id)}.svg" class="dataset-icon" width="${size}" height="${size}" alt="Icon" onerror="this.outerHTML='<svg class=\\'dataset-icon\\' width=\\'${size}\\' height=\\'${size}\\' viewBox=\\'0 0 ${size} ${size}\\'><rect width=\\'${size}\\' height=\\'${size}\\' fill=\\'#ddd\\'/></svg>'"/>`;
    }

    // fallback simple placeholder
    return `<svg class="dataset-icon" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Icon"><rect width="${size}" height="${size}" fill="#ddd"/></svg>`;
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
