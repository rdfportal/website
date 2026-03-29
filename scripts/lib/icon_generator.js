/**
 * Node.js版 データセットアイコン生成モジュール
 * フロントエンドの DatasetIcon.js と DatasetsManager.js からロジックを抽出したもの
 */

const SVG_CONFIG = {
  MAX_PETALS: 10,
  SCALE: 0.82,
  APEX_Y: 78,
  PETAL_TOP_Y: 10,
  PETAL_CTRL_TOP_Y: 20,
  PETAL_CTRL_LOW_Y: 55,
  GRAD_OPACITY_START: 1,
  GRAD_OPACITY_END: 0.9,
  USE_RANDOM_ID: true,
  WIDTH_MAX: 32,
  WIDTH_MIN: 12,
  WIDTH_EXP: 1.25,
  LENGTH_COMPRESS: 0.12,
  ZERO_TAG_COLOR: "#e2e8f0",
  VISUAL_MIN_SCALE: 1.1,
  VISUAL_MAX_SCALE: 1.1,
  VISUAL_EXP: 1.0,
  SINGLE_PETAL_EMPHASIS: 1.025,
  FULL_CIRCLE_THRESHOLD: 11,
  TWO_PETAL_SPAN: 50,
  FAN_SPAN_MIN: 70,
  FAN_SPAN_MAX: 110,
};

const V_ALIGN = {
  MODE: "geometric",
  CENTER_BASE: 10,
  CENTER_FACTOR: 1.0,
  SHIFT_MIN: -0.8,
  SHIFT_MAX: 0.9,
  SHIFT_EXP: 0.9,
  SINGLE_EXTRA: 0.6,
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cssEscape(str) {
  return String(str).replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
    h >>>= 0;
  }
  return h >>> 0;
}

function hexToHsl(hex) {
  if (!hex || !/^#([0-9a-f]{6})$/i.test(hex)) return { h: 0, s: 0, l: 50 };
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function oklchToHex(l, c, h) {
  let r, g, bl;
  let clampedC = c;
  for (let i = 0; i < 20; i++) {
    const hRad = h * Math.PI / 180;
    const a = clampedC * Math.cos(hRad);
    const b = clampedC * Math.sin(hRad);
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
    const lCube = l_ * l_ * l_;
    const mCube = m_ * m_ * m_;
    const sCube = s_ * s_ * s_;
    const linR =  4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
    const linG = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
    const linB = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.7076147010 * sCube;
    const toSrgb = (cv) => cv <= 0.0031308 ? 12.92 * cv : 1.055 * Math.pow(Math.max(0, cv), 1 / 2.4) - 0.055;
    r = toSrgb(linR);
    g = toSrgb(linG);
    bl = toSrgb(linB);
    if (r >= 0 && r <= 1 && g >= 0 && g <= 1 && bl >= 0 && bl <= 1) break;
    clampedC *= 0.90;
  }
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bl = Math.max(0, Math.min(1, bl));
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function generateHashBasedColor(tagId) {
  let hash = 0;
  for (let i = 0; i < tagId.length; i++) {
    const ch = tagId.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  const lightness = 0.65;
  const chroma = 0.15;
  return oklchToHex(lightness, chroma, hue);
}

function getTagColor(tag) {
  const id = typeof tag === "object" && tag && tag.id ? tag.id : tag;
  if (typeof id !== "string") return "#888888";
  return generateHashBasedColor(id);
}

function createSvg(tags = [], size = 48) {
  const P = SVG_CONFIG;
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

  const V = V_ALIGN;
  let translateY = 0;
  if (V.MODE === "geometric") {
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
    return `<svg xmlns="http://www.w3.org/2000/svg" class="icon -svg" width="${size}" height="${size}" viewBox="-50 0 100 100" role="img" aria-label="No tags"><g transform="scale(${(
      P.SCALE * scaleVisual
    ).toFixed(4)}) translate(0,${translateY.toFixed(
      4
    )})"><path d="${path}" fill="${P.ZERO_TAG_COLOR}"/></g></svg>`.trim();
  }

  if (rawCount === 1) {
    const tag0 = tags[0];
    const baseHex = getTagColor(tag0);
    const hsl = hexToHsl(baseHex);
    const topHex = hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 14));
    const idBase = `g_${Math.abs(hashString(String(tag0)))}_single`;
    const id = P.USE_RANDOM_ID ? `${idBase}_${Math.floor(Math.random() * 1e5)}` : idBase;
    const grad = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${topHex}" stop-opacity="${P.GRAD_OPACITY_START}"/><stop offset="100%" stop-color="${baseHex}" stop-opacity="${P.GRAD_OPACITY_END}"/></linearGradient>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" class="icon -svg" width="${size}" height="${size}" viewBox="-50 0 100 100" role="img" aria-label="Tag: ${escapeHtml(
      String(tag0)
    )}"><defs>${grad}</defs><g transform="scale(${(
      P.SCALE *
      scaleVisual *
      P.SINGLE_PETAL_EMPHASIS
    ).toFixed(4)}) translate(0,${translateY.toFixed(
      4
    )})"><path d="${path}" fill="url(#${id})" style="mix-blend-mode:color-burn"/></g></svg>`.trim();
  }

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
  const lightenBase = 8,
    lightenExtra = 8;
  const lightenL = Math.min(lightenBase + (1 - t2) * lightenExtra, 20);
  const gradients = [];
  const petals = [];

  arr.forEach((tag, i) => {
    const angle = start + step * i;
    const baseHex = getTagColor(tag);
    const hsl = hexToHsl(baseHex);
    const topHex = hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + lightenL));
    const idBase = `g_${Math.abs(hashString(String(tag)))}_${i}`;
    const id = P.USE_RANDOM_ID ? `${idBase}_${Math.floor(Math.random() * 1e5)}` : idBase;
    gradients.push(
      `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${topHex}" stop-opacity="${P.GRAD_OPACITY_START}"/><stop offset="100%" stop-color="${baseHex}" stop-opacity="${P.GRAD_OPACITY_END}"/></linearGradient>`
    );
    petals.push(
      `<path d="${path}" fill="url(#${id})" transform="rotate(${angle} 0 ${APEX_Y})" style="mix-blend-mode:color-burn"/>`
    );
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" class="icon -svg" width="${size}" height="${size}" viewBox="-50 0 100 100" role="img" aria-label="Tags: ${escapeHtml(
    arr.join(", ")
  )}"><defs>${gradients.join("")}</defs><g transform="scale(${(
    P.SCALE * scaleVisual
  ).toFixed(4)}) translate(0,${translateY.toFixed(4)})">${petals.join(
    ""
  )}</g></svg>`.trim();
}

function generateTagStyles(tags) {
  if (!Array.isArray(tags)) return "";
  return tags.map((tagId) => {
    const color = getTagColor(tagId);
    const esc = cssEscape(tagId);
    return `[data-tag="${esc}"]::before { background-color: ${color}; }`;
  }).join("\n");
}

module.exports = {
  createSvg,
  getTagColor,
  hexToHsl,
  hslToHex,
  oklchToHex,
  generateTagStyles
};
