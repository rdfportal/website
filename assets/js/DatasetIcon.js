/**
 * DatasetIcon - アイコン（花弁）生成ロジックを独立化
 * Provides a static createSvg(tags, size, options) -> svgString
 */

class DatasetIcon {
  static SVG = {
    MAX_PETALS: 10,
    SCALE: 0.82,
    APEX_Y: 78,
    PETAL_TOP_Y: 10,
    PETAL_CTRL_TOP_Y: 20,
    PETAL_CTRL_LOW_Y: 55,
    GRAD_OPACITY_START: 1,
    GRAD_OPACITY_END: 0.2,
    USE_RANDOM_ID: true,
    WIDTH_MAX: 32,
    WIDTH_MIN: 12,
    WIDTH_EXP: 1.25,
    LENGTH_COMPRESS: 0.12,
    ZERO_TAG_COLOR: '#e2e8f0',
    VISUAL_MIN_SCALE: 1.1,
    VISUAL_MAX_SCALE: 1.1,
    VISUAL_EXP: 1.0,
    SINGLE_PETAL_EMPHASIS: 1.025,
    FULL_CIRCLE_THRESHOLD: 11,
    TWO_PETAL_SPAN: 50,
    FAN_SPAN_MIN: 70,
    FAN_SPAN_MAX: 110,
  };

  static V_ALIGN = {
    MODE: 'geometric',
    CENTER_BASE: 10,
    CENTER_FACTOR: 1.0,
    SHIFT_MIN: -0.8,
    SHIFT_MAX: 0.9,
    SHIFT_EXP: 0.9,
    SINGLE_EXTRA: 0.6,
  };

  static createSvg(tags = [], size = 48, options = {}) {
    const P = DatasetIcon.SVG;
    const rawCount = Array.isArray(tags) ? tags.length : 0;
    const effectiveN = Math.min(Math.max(rawCount, 1), P.MAX_PETALS);
    const tRaw = (effectiveN - 2) / (P.MAX_PETALS - 2);
    const t = Math.max(0, Math.min(1, tRaw));
    const tVisual = Math.pow(t, P.VISUAL_EXP);
    const t2 = Math.pow(t, P.WIDTH_EXP);
    const scaleVisual = P.VISUAL_MAX_SCALE - (P.VISUAL_MAX_SCALE - P.VISUAL_MIN_SCALE) * tVisual;
    const ctrlX = P.WIDTH_MAX - (P.WIDTH_MAX - P.WIDTH_MIN) * t2;
    const lenFactor = 1 - P.LENGTH_COMPRESS * t2;
    const APEX_Y = P.APEX_Y * lenFactor;
    const CTRL_LOW_Y = P.PETAL_CTRL_LOW_Y * lenFactor;
    const path = `M0 ${APEX_Y} C ${ctrlX} ${CTRL_LOW_Y}, ${ctrlX} ${P.PETAL_CTRL_TOP_Y}, 0 ${P.PETAL_TOP_Y} C -${ctrlX} ${P.PETAL_CTRL_TOP_Y}, -${ctrlX} ${CTRL_LOW_Y}, 0 ${APEX_Y}Z`;

    // vertical alignment
    const V = DatasetIcon.V_ALIGN;
    let translateY = 0;
    if (V.MODE === 'geometric') {
      const baselineMid = (P.PETAL_TOP_Y + P.APEX_Y) * 0.5;
      const currentMid = (P.PETAL_TOP_Y + APEX_Y) * 0.5;
      const midDiff = baselineMid - currentMid;
      translateY = V.CENTER_BASE + midDiff * V.CENTER_FACTOR;
    } else {
      const effectiveN2 = Math.min(Math.max(rawCount, 1), P.MAX_PETALS);
      const tRaw2 = (effectiveN2 - 1) / (P.MAX_PETALS - 1);
      const tAlign = Math.pow(Math.max(0, Math.min(1, tRaw2)), V.SHIFT_EXP);
      translateY = V.SHIFT_MIN + (V.SHIFT_MAX - V.SHIFT_MIN) * tAlign;
      if (rawCount <= 2) translateY += V.SINGLE_EXTRA;
    }

    if (rawCount === 0) {
      return `<svg xmlns="http://www.w3.org/2000/svg" class="icon -svg" width="${size}" height="${size}" viewBox="-50 0 100 100" role="img" aria-label="No tags"><g transform="scale(${(P.SCALE * scaleVisual).toFixed(4)}) translate(0,${translateY.toFixed(4)})"><path d="${path}" fill="${P.ZERO_TAG_COLOR}"/></g></svg>`;
    }

    // helper color functions: rely on DatasetsManager if present
    const getBaseHex = (tag) => {
      if (window.DatasetsManager && typeof window.DatasetsManager.getColor === 'function') return window.DatasetsManager.getColor(tag);
      return '#999999';
    };
    const hexToHsl = (hex) => {
      if (window.DatasetsManager && typeof window.DatasetsManager.hexToHsl === 'function') return window.DatasetsManager.hexToHsl(hex);
      // fallback simple parser
      if (!hex || !/^#([0-9a-f]{6})$/i.test(hex)) return { h: 0, s: 0, l: 55 };
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s; const l = (max + min) / 2;
      if (max === min) { h = s = 0; } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; } h /= 6; }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };
    const hslToHex = (h, s, l) => {
      s /= 100; l /= 100; const k = n => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); const r = Math.round(f(0) * 255).toString(16).padStart(2, '0'); const g = Math.round(f(8) * 255).toString(16).padStart(2, '0'); const b = Math.round(f(4) * 255).toString(16).padStart(2, '0'); return `#${r}${g}${b}`;
    };

    if (rawCount === 1) {
      const tag0 = tags[0];
      const baseHex = getBaseHex(tag0);
      const hsl = hexToHsl(baseHex);
      const topHex = hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 14));
      const idBase = `g_${Math.abs(DatasetIcon._hashString(String(tag0)))}_single`;
      const id = P.USE_RANDOM_ID ? `${idBase}_${Math.floor(Math.random() * 1e5)}` : idBase;
      const grad = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${topHex}" stop-opacity="${P.GRAD_OPACITY_START}"/><stop offset="100%" stop-color="${baseHex}" stop-opacity="${P.GRAD_OPACITY_END}"/></linearGradient>`;
      return `<svg xmlns="http://www.w3.org/2000/svg" class="icon -svg" width="${size}" height="${size}" viewBox="-50 0 100 100" role="img" aria-label="Tag: ${DatasetIcon._escapeHtml(String(tag0))}"><defs>${grad}</defs><g transform="scale(${(P.SCALE * scaleVisual * P.SINGLE_PETAL_EMPHASIS).toFixed(4)}) translate(0,${translateY.toFixed(4)})"><path d="${path}" fill="url(#${id})" style="mix-blend-mode:multiply"/></g></svg>`;
    }

    // multiple petals
    const arr = tags.slice(0, P.MAX_PETALS);
    const n = arr.length;
    const fullCircle = n >= P.FULL_CIRCLE_THRESHOLD;
    let dynamicSpan;
    if (fullCircle) dynamicSpan = 360;
    else if (n <= 1) dynamicSpan = 0;
    else if (n === 2) dynamicSpan = P.TWO_PETAL_SPAN;
    else {
      const spanRange = P.FAN_SPAN_MAX - P.FAN_SPAN_MIN;
      const denom = P.FULL_CIRCLE_THRESHOLD - 1 - 3;
      const ratio = denom > 0 ? (n - 3) / denom : 0;
      const clamped = Math.max(0, Math.min(1, ratio));
      dynamicSpan = P.FAN_SPAN_MIN + spanRange * clamped;
    }
    const step = n === 1 ? 0 : fullCircle ? 360 / n : dynamicSpan / (n - 1);
    const start = fullCircle ? 0 : -dynamicSpan / 2;
    const lightenBase = 8, lightenExtra = 8;
    const lightenL = Math.min(lightenBase + (1 - t2) * lightenExtra, 20);
    const gradients = [];
    const petals = [];
    arr.forEach((tag, i) => {
      const angle = start + step * i;
      const baseHex = getBaseHex(tag);
      const hsl = hexToHsl(baseHex);
      const topHex = hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + lightenL));
      const idBase = `g_${Math.abs(DatasetIcon._hashString(String(tag)))}_${i}`;
      const id = P.USE_RANDOM_ID ? `${idBase}_${Math.floor(Math.random() * 1e5)}` : idBase;
      gradients.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${topHex}" stop-opacity="${P.GRAD_OPACITY_START}"/><stop offset="100%" stop-color="${baseHex}" stop-opacity="${P.GRAD_OPACITY_END}"/></linearGradient>`);
      petals.push(`<path d="${path}" fill="url(#${id})" transform="rotate(${angle} 0 ${APEX_Y})" style="mix-blend-mode:multiply"/>`);
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" class="icon -svg" width="${size}" height="${size}" viewBox="-50 0 100 100" role="img" aria-label="Tags: ${DatasetIcon._escapeHtml(arr.join(', '))}"><defs>${gradients.join('')}</defs><g transform="scale(${(P.SCALE * scaleVisual).toFixed(4)}) translate(0,${translateY.toFixed(4)})">${petals.join('')}</g></svg>`;
  }

  // small helpers
  static _hashString(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
      h >>>= 0;
    }
    return h >>> 0;
  }

  static _escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Render helper: render svg into a DOM container. Returns true on success.
  static renderInContainer(container, tags = [], size = 48, options = {}) {
    if (!container) return false;
    try {
      const svg = DatasetIcon.createSvg(tags, size, options);
      container.innerHTML = svg;
      container.setAttribute('aria-hidden', 'false');
      return true;
    } catch (e) {
      console.error('DatasetIcon.renderInContainer failed', e);
      return false;
    }
  }

  // Convenience: read tags from a <script type="application/json" id="..."> element and render into container
  // Handles DOMContentLoaded, retries while DatasetIcon may not yet be available, and a fallback SVG.
  static renderFromJsonElement(jsonElId, containerId, opts = {}) {
    const maxRetries = typeof opts.maxRetries === 'number' ? opts.maxRetries : 10;
    const retryMs = typeof opts.retryMs === 'number' ? opts.retryMs : 120;
    const size = typeof opts.size === 'number' ? opts.size : 48;
    let attempts = 0;

    const readTags = () => {
      try {
        const el = document.getElementById(jsonElId);
        if (!el) return [];
        const txt = el.textContent || el.innerText || '';
        if (!txt) return [];
        return JSON.parse(txt || '[]');
      } catch (e) {
        console.warn('DatasetIcon: failed to parse tags json', e);
        return [];
      }
    };

    const attempt = () => {
      const container = document.getElementById(containerId);
      if (!container) return;
      const tags = readTags();
      if (DatasetIcon.renderInContainer(container, tags, size, opts)) return;
      attempts++;
      if (attempts <= maxRetries) setTimeout(attempt, retryMs); else {
        // final fallback: empty icon
        try { container.innerHTML = DatasetIcon.createSvg([], size, opts); container.setAttribute('aria-hidden', 'false'); } catch (e) { container.innerHTML = '<svg class="icon -svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Dataset icon"><rect width="' + size + '" height="' + size + '" fill="#e5e7eb"></rect></svg>'; }
      }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attempt); else attempt();
  }
}

window.DatasetIcon = DatasetIcon;
