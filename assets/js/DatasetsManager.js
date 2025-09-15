/**
 * DatasetsManager - タグ色生成とスタイル注入に特化した軽量ユーティリティ
 * 目的を限定して依存を減らし、DatasetCard などから安全に色情報を参照できるようにする
 */

class DatasetsManager {
  static #instance = null;

  static getInstance() {
    if (!DatasetsManager.#instance) DatasetsManager.#instance = new DatasetsManager();
    return DatasetsManager.#instance;
  }

  static getColor(tag) {
    return DatasetsManager.getInstance().getTagColor(tag);
  }

  static hexToHsl(hex) {
    return DatasetsManager.getInstance().hexToHsl(hex);
  }

  constructor() {
    this._datasets = null;
    this._styleEl = null;
  }

  // ページに埋め込まれた <script id="datasets-json"> を読んでキャッシュ
  loadEmbeddedDatasets() {
    if (this._datasets) return this._datasets;
    const el = document.getElementById('datasets-json');
    if (!el) return null;
    try {
      const txt = el.textContent || el.innerHTML || '';
      if (!txt) return null;
      const parsed = JSON.parse(txt);
      if (Array.isArray(parsed)) this._datasets = parsed;
      return this._datasets;
    } catch (e) {
      console.error('DatasetsManager: failed to parse embedded datasets-json', e);
      return null;
    }
  }

  // 互換性のための非同期メソッド
  // 旧実装を呼んでいたコードが `await datasetLoader.getDatasets()` を期待しているため
  async getDatasets() {
    // Load raw datasets once and compute tag colors + collect tags in one pass
    const raw = this.loadEmbeddedDatasets() || [];
    const tagSet = new Set();
    const datasets = raw.map((d) => {
      // derive tag id array: prefer d.tags, fallback to d.tagsWithColors
      let tagIds = [];
      if (Array.isArray(d.tags)) tagIds = d.tags.slice();
      else if (Array.isArray(d.tagsWithColors)) tagIds = d.tagsWithColors.map((t) => t && t.id).filter(Boolean);

      tagIds.forEach((t) => t && tagSet.add(t));

      return {
        ...d,
        tagsWithColors: tagIds.map((t) => ({ id: t, color: this.getTagColor(t) })),
      };
    });

    const tags = Array.from(tagSet);
    if (tags.length) this.updateTagStyles(tags);

    return datasets;
  }

  getAvailableTags() {
    const ds = this.loadEmbeddedDatasets() || [];
    const counts = new Map();
    ds.forEach(d => {
      if (!Array.isArray(d.tags)) return;
      d.tags.forEach(t => { if (!t) return; counts.set(t, (counts.get(t) || 0) + 1); });
    });
    return Array.from(counts.entries()).map(([id, count]) => ({ id, count, color: this.getTagColor(id) }));
  }

  // タグ色の取得
  getTagColor(tag) {
    const id = (typeof tag === 'object' && tag && tag.id) ? tag.id : tag;
    if (typeof id !== 'string') return '#888888';
    return this._generateHashBasedColor(id);
  }

  // hex -> hsl
  hexToHsl(hex) {
    if (!hex || !/^#([0-9a-f]{6})$/i.test(hex)) return { h: 0, s: 0, l: 50 };
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s; const l = (max + min) / 2;
    if (max === min) { h = s = 0; } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; } h /= 6; }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  // タグに基づく動的スタイル注入
  updateTagStyles(tags) {
    if (!Array.isArray(tags)) return;
    if (this._styleEl) this._styleEl.remove();
    this._styleEl = document.createElement('style');
    this._styleEl.id = 'datasets-manager-tag-styles';
    const css = tags.map(tagId => {
      const color = this.getTagColor(tagId);
      const esc = CSS.escape(tagId);
      return `[data-tag="${esc}"]::before{background-color:${color};}`;
    }).join('\n');
    this._styleEl.textContent = css;
    document.head.appendChild(this._styleEl);
  }

  // 内部: ハッシュベースの色生成
  _generateHashBasedColor(tagId) {
    let hash = 0; for (let i = 0; i < tagId.length; i++) { const ch = tagId.charCodeAt(i); hash = (hash << 5) - hash + ch; hash = hash & hash; }
    const hue = Math.abs(hash) % 360;
    const saturation = 65 + (Math.abs(hash) % 25);
    const lightness = 25 + (Math.abs(hash) % 20);
    return this._hslToHex(hue, saturation, lightness);
  }

  _hslToHex(h, s, l) {
    l /= 100; const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
}

window.DatasetsManager = DatasetsManager;
