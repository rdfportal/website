/**
 * DatasetsManager - Lightweight utility for fetching cached datasets
 */

class DatasetsManager {
  static #instance = null;

  static getInstance() {
    if (!DatasetsManager.#instance) DatasetsManager.#instance = new DatasetsManager();
    return DatasetsManager.#instance;
  }

  constructor() {
    this._datasets = null;
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
  async getDatasets() {
    return this.loadEmbeddedDatasets() || [];
  }

  getAvailableTags() {
    const ds = this.loadEmbeddedDatasets() || [];
    const counts = new Map();
    ds.forEach(d => {
      if (!Array.isArray(d.tags)) return;
      d.tags.forEach(t => { if (!t) return; counts.set(t, (counts.get(t) || 0) + 1); });
    });
    return Array.from(counts.entries()).map(([id, count]) => ({ id, count }));
  }
}

window.DatasetsManager = DatasetsManager;
