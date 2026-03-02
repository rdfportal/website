/**
 * fetch-download-index.js
 *
 * datasets.json の各データセットIDについて
 * 4つのフォーマット（ntriples, turtle, rdfxml, jsonld）の
 * ダウンロードディレクトリが存在するか（HTTP 200）を確認し、
 * ../_data/downloads.json として保存する。
 *
 * 実行方法:
 *   cd scripts/
 *   bun fetch-download-index.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DOWNLOAD_BASE = 'https://rdfportal.org/download';
const DATASETS_FILE = path.resolve(__dirname, '../_data/datasets.json');
const OUTPUT_FILE = path.resolve(__dirname, '../_data/downloads.json');

const FORMATS = ['ntriples', 'turtle', 'rdfxml', 'jsonld'];

// HTTPS GET リクエストで存在確認 (200 OK なら true)
// HEAD だと Nginx の設定によってはハングすることがあるため GET + Timeout を使う
function checkUrlExists(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'GET', headers: { 'User-Agent': 'RDF-Portal-Bot/2.0' }, timeout: 5000 }, (res) => {
      resolve(res.statusCode === 200);
      res.destroy(); // データ本体は不要なので即座に破棄
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.end();
  });
}

async function checkDatasetFormats(id) {
  const result = { id, formats: {} };
  let hasAny = false;

  for (const fmt of FORMATS) {
    const url = `${DOWNLOAD_BASE}/${fmt}/${id}/`;
    const exists = await checkUrlExists(url);
    if (exists) {
      result.formats[fmt] = url;
      hasAny = true;
    } else {
      result.formats[fmt] = null;
    }
  }

  return { ...result, available: hasAny };
}

async function main() {
  console.log('🚀 Checking download directories for 4 formats...\n');

  // datasets.json を読み込む
  const datasets = JSON.parse(fs.readFileSync(DATASETS_FILE, 'utf-8'));
  console.log(`📊 Total datasets: ${datasets.length}\n`);

  const results = [];

  for (let i = 0; i < datasets.length; i++) {
    const { id } = datasets[i];
    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${datasets.length}] ${id.padEnd(15)} `);

    const result = await checkDatasetFormats(id);
    results.push(result);

    if (result.available) {
      const availFmts = FORMATS.filter(f => result.formats[f]).join(', ');
      console.log(`✅ ${availFmts}`);
    } else {
      console.log(`⚠️  none`);
    }

    // サーバー負荷軽減のため少し待機
    await new Promise((r) => setTimeout(r, 100));
  }

  // 出力
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');

  const available = results.filter((r) => r.available).length;
  console.log(`\n🎉 Done!`);
  console.log(`   Datasets with at least one format : ${available} / ${results.length}`);
  console.log(`   Output                            : ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
