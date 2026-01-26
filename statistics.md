---
layout: page
title: Statistics
pageId: statistics
description: RDFデータセットの統計情報一覧
permalink: /statistics/
permalink_lang:
  en: /statistics/
  ja: /statistics/
---

<script type="application/json" id="datasets-json">{{ site.data.datasets | jsonify }}</script>

<div id="TagStatsBar" aria-label="{% lang 'en' %}Tag distribution{% endlang %}{% lang 'ja' %}タグ分布{% endlang %}"></div>
<div id="StatisticsTableView">
  <div class="inner">
    <table>
      <thead>
        <tr>
          <th data-sort="title"><span class="th-label">{% lang 'en' %}Dataset{% endlang %}{% lang 'ja' %}データセット{% endlang %}</span></th>
          <th data-sort="number_of_triples"><span class="th-label">{% lang 'en' %}Triples{% endlang %}{% lang 'ja' %}トリプル数{% endlang %}</span></th>
          <th data-sort="number_of_links"><span class="th-label">{% lang 'en' %}Links{% endlang %}{% lang 'ja' %}リンク数{% endlang %}</span></th>
          <th data-sort="number_of_classes"><span class="th-label">{% lang 'en' %}Classes{% endlang %}{% lang 'ja' %}クラス数{% endlang %}</span></th>
          <th data-sort="number_of_instances"><span class="th-label">{% lang 'en' %}Instances{% endlang %}{% lang 'ja' %}インスタンス数{% endlang %}</span></th>
          <th data-sort="number_of_literals"><span class="th-label">{% lang 'en' %}Literals{% endlang %}{% lang 'ja' %}リテラル数{% endlang %}</span></th>
          <th data-sort="number_of_subjects"><span class="th-label">{% lang 'en' %}Subjects{% endlang %}{% lang 'ja' %}主語数{% endlang %}</span></th>
          <th data-sort="number_of_properties"><span class="th-label">{% lang 'en' %}Properties{% endlang %}{% lang 'ja' %}プロパティ数{% endlang %}</span></th>
          <th data-sort="number_of_objects"><span class="th-label">{% lang 'en' %}Objects{% endlang %}{% lang 'ja' %}オブジェクト数{% endlang %}</span></th>
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
