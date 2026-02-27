/**
 * fetch-download-index.js
 *
 * datasets.json の各データセットIDについて
 * https://rdfportal.org/download/[id]/latest/ にアクセスし、
 * Nginx autoindex の HTML からファイル一覧を取得して
 * ../_data/downloads.json として保存する。
 *
 * 実行方法:
 *   cd scripts/
 *   node fetch-download-index.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DOWNLOAD_BASE = 'https://rdfportal.org/download';
const DATASETS_FILE = path.resolve(__dirname, '../_data/datasets.json');
const OUTPUT_FILE = path.resolve(__dirname, '../_data/downloads.json');

// HTTPS GET (テキストで返す)
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'RDF-Portal-Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

/**
 * Nginx autoindex HTML からエントリ一覧をパースする。
 *
 * autoindex HTML の典型的な行:
 *   <a href="bct/">bct/</a>                      29-Oct-2024 16:43       -
 *   <a href="ddbj.ttl.gz">ddbj.ttl.gz</a>        29-Oct-2024 16:43   1234567
 */
function parseAutoIndex(html, baseUrl) {
  const entries = [];

  // <a href="...">...</a> の行をひとつずつ処理
  // フォーマット例（スペース区切り）:
  //   <a href="NAME">NAME</a>   DATE   TIME   SIZE
  const lineRe = /<a href="([^"]+)">([^<]+)<\/a>\s+([\d]+-[\w]+-[\d]+)\s+([\d:]+)\s+([\d\-]+|-)/gi;
  let match;

  while ((match = lineRe.exec(html)) !== null) {
    const href = match[1];
    const date = match[3]; // e.g. "29-Oct-2024"
    const rawSize = match[5]; // e.g. "1234567" or "-"

    // 親ディレクトリへのリンクは除外
    if (href === '../' || href === './') continue;

    const isDir = href.endsWith('/');
    const name = isDir ? href : href.split('/').pop();

    // サイズの整形
    let size = null;
    if (!isDir && rawSize !== '-') {
      const bytes = parseInt(rawSize, 10);
      if (!isNaN(bytes)) {
        size = formatBytes(bytes);
      }
    }

    entries.push({
      name,
      href: baseUrl + href,
      isDir,
      date: parseDate(date),
      size,
    });
  }

  return entries;
}

/** "29-Oct-2024" → "2024-10-29" （ISO形式） */
function parseDate(str) {
  const months = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const m = str.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) return str;
  return `${m[3]}-${months[m[2]] || m[2]}-${m[1]}`;
}

/** バイト数を人間が読みやすい文字列に変換 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

async function fetchDatasetIndex(id) {
  const url = `${DOWNLOAD_BASE}/${id}/latest/`;
  try {
    const { statusCode, body } = await httpsGet(url);
    if (statusCode !== 200) {
      console.log(`  ⚠️  ${id}: HTTP ${statusCode} — skipped`);
      return { id, url, available: false, entries: [] };
    }
    const entries = parseAutoIndex(body, url);
    console.log(`  ✅ ${id}: ${entries.length} entries`);
    return { id, url, available: true, entries };
  } catch (err) {
    console.log(`  ❌ ${id}: ${err.message}`);
    return { id, url, available: false, entries: [] };
  }
}

async function main() {
  console.log('🚀 Fetching download indexes...\n');

  // datasets.json を読み込む
  const datasets = JSON.parse(fs.readFileSync(DATASETS_FILE, 'utf-8'));
  console.log(`📊 Total datasets: ${datasets.length}\n`);

  const results = [];

  for (let i = 0; i < datasets.length; i++) {
    const { id } = datasets[i];
    process.stdout.write(`[${String(i + 1).padStart(2)}/${datasets.length}] `);
    const result = await fetchDatasetIndex(id);
    results.push(result);

    // サーバー負荷軽減のため少し待機
    await new Promise((r) => setTimeout(r, 300));
  }

  // 出力
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');

  const available = results.filter((r) => r.available).length;
  console.log(`\n🎉 Done!`);
  console.log(`   Available : ${available} / ${results.length}`);
  console.log(`   Output    : ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
