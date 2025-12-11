---
layout: page
title: Statistics
pageId: statistics
description: RDFデータセットの統計情報一覧
permalink: /statistics/
---

<article lang="en">

  <h3>Dataset statistics overview</h3>

  <p>This dashboard highlights the scale of every dataset registered in RDF Portal. Compare triples, links, and class
    counts to spot large knowledge bases, and use the tag distribution bar to discover which research domains are most
    represented.</p>

  <p>Select each column header to sort in ascending or descending order. Numeric values automatically display thousand
    separators for readability.</p>

</article>

<article lang="ja">

  <h3>データセット統計の概要</h3>

  <p>このダッシュボードでは、RDF Portal に登録された各データセットの規模を比較できます。トリプル数やリンク数、クラス数などを
    確認して大規模な知識ベースを見つけたり、タグ分布バーから研究分野ごとの偏りを把握したりできます。</p>

  <p>列見出しをクリックすると昇順・降順で並べ替えられます。数値は自動的に 3 桁区切りで表示され、視認性を高めています。</p>

</article>

<script type="application/json" id="datasets-json">{{ site.data.datasets | jsonify }}</script>
<div id="TagStatsBar" aria-label="Tag distribution / タグ分布"></div>
<div id="StatisticsTableView">
  <div class="inner">
    <table>
      <thead>
        <tr>
          <th data-sort="title"><span class="th-label"><span lang="en">Dataset</span> / <span lang="ja">データセット</span></span></th>
          <th data-sort="number_of_triples"><span class="th-label"><span lang="en">Triples</span> / <span lang="ja">トリプル数</span></span></th>
          <th data-sort="number_of_links"><span class="th-label"><span lang="en">Links</span> / <span lang="ja">リンク数</span></span></th>
          <th data-sort="number_of_classes"><span class="th-label"><span lang="en">Classes</span> / <span lang="ja">クラス数</span></span></th>
          <th data-sort="number_of_instances"><span class="th-label"><span lang="en">Instances</span> / <span lang="ja">インスタンス数</span></span></th>
          <th data-sort="number_of_literals"><span class="th-label"><span lang="en">Literals</span> / <span lang="ja">リテラル数</span></span></th>
          <th data-sort="number_of_subjects"><span class="th-label"><span lang="en">Subjects</span> / <span lang="ja">主語数</span></span></th>
          <th data-sort="number_of_properties"><span class="th-label"><span lang="en">Properties</span> / <span lang="ja">プロパティ数</span></span></th>
          <th data-sort="number_of_objects"><span class="th-label"><span lang="en">Objects</span> / <span lang="ja">オブジェクト数</span></span></th>
        </tr>
      </thead>
      <tbody>
        {% for dataset in site.data.datasets %}
          <tr>
            <td data-key="title">{{ dataset.title }}</td>
            <td data-key="number_of_triples">{{ dataset.statistics.number_of_triples }}</td>
            <td data-key="number_of_links">{{ dataset.statistics.number_of_links }}</td>
            <td data-key="number_of_classes">{{ dataset.statistics.number_of_classes }}</td>
            <td data-key="number_of_instances">{{ dataset.statistics.number_of_instances }}</td>
            <td data-key="number_of_literals">{{ dataset.statistics.number_of_literals }}</td>
            <td data-key="number_of_subjects">{{ dataset.statistics.number_of_subjects }}</td>
            <td data-key="number_of_properties">{{ dataset.statistics.number_of_properties }}</td>
            <td data-key="number_of_objects">{{ dataset.statistics.number_of_objects }}</td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>

<script>
// タグ統計棒グラフ描画（DatasetsManagerで集計）

document.addEventListener('DOMContentLoaded', async function() {
  // Format numbers to use commas as separators
  function formatNumberWithCommas(num) {
    if (!num || num === '') return '';
    return parseInt(num).toLocaleString();
  }

  const numericCells = document.querySelectorAll('#StatisticsTableView td[data-key]:not([data-key="title"])');
  numericCells.forEach(cell => {
    const rawValue = cell.textContent.trim();
    if (rawValue && rawValue !== '' && rawValue !== '0') {
      cell.textContent = formatNumberWithCommas(rawValue);
    }
  });

  // タグ統計バー描画
  const barsContainerEl = document.querySelector('#TagStatsBar');
  if (barsContainerEl && window.DatasetsManager) {
    const mgr = window.DatasetsManager.getInstance();
    const tags = await mgr.getAvailableTags();
    if (tags.length) {
      // const totalTagCount = tags.reduce((acc, tag) => acc + tag.count, 0);
      const maxCount = Math.max(...tags.map(t => t.count));
      const barContainer = document.createElement('div');
      barContainer.className = 'tag-stats-bar';
      const inner = document.createElement('div');
      inner.className = 'inner';
      barContainer.append(inner);
      tags.forEach(tagObj => {
        const { id, count, color } = tagObj;
        const bar = document.createElement('div');
        bar.className = 'bar';
        // bar.style.width = `${tagObj.count / totalTagCount * 100}%`;
        bar.style.height = `${tagObj.count / maxCount * 100}%`;
        bar.style.background = color;
        bar.title = `${id}: ${count}`;
        bar.innerHTML = `<span class=\"label\">${id}</span>`;
        // bar.innerHTML = `<span class=\"tag-label\" style=\"writing-mode:vertical-lr; font-size:10px;\">${id}</span><span class=\"tag-value\" style=\"display:block; font-size:10px;\">${count}</span>`;
        inner.appendChild(bar);
      });
      barsContainerEl.innerHTML = '';
      barsContainerEl.appendChild(barContainer);
    }
  }

  // 簡易テーブルソート（数値・文字列対応）
  const table = document.querySelector('#StatisticsTableView > .inner > table');
  if (table) {
    table.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', function() {
        const sortKey = th.getAttribute('data-sort');
        const rows = Array.from(table.tBodies[0].rows);
        const isNumber = sortKey !== 'title';
        const asc = !th.classList.contains('asc');
        rows.sort((a, b) => {
          const cellA = a.querySelector(`[data-key='${sortKey}']`) || a.cells[th.cellIndex];
          const cellB = b.querySelector(`[data-key='${sortKey}']`) || b.cells[th.cellIndex];
          
          if (isNumber) {
            const va = parseInt(cellA?.textContent.replace(/,/g, '') || '0');
            const vb = parseInt(cellB?.textContent.replace(/,/g, '') || '0');
            return asc ? va - vb : vb - va;
          } else {
            const va = cellA?.textContent || '';
            const vb = cellB?.textContent || '';
            return asc ? va.localeCompare(vb) : vb.localeCompare(va);
          }
        });
        rows.forEach(row => table.tBodies[0].appendChild(row));
        table.querySelectorAll('th').forEach(h => h.classList.remove('asc', 'desc'));
        th.classList.add(asc ? 'asc' : 'desc');
      });
    });
  }
});

</script>
