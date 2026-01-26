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
// Column Color Configuration (RGB values)
const COLUMN_COLORS = {
  number_of_triples:    [255, 99, 132],  // Red
  number_of_links:      [54, 162, 235],  // Blue
  number_of_classes:    [75, 192, 192],  // Green
  number_of_instances:  [153, 102, 255], // Purple
  number_of_literals:   [255, 159, 64],  // Orange
  number_of_subjects:   [255, 205, 86],  // Yellow
  number_of_properties: [201, 203, 207], // Grey
  number_of_objects:    [231, 233, 237]  // Light Grey (or distinct) -> Let's use Teal [0, 128, 128]
};
// Override last one for better distinction
COLUMN_COLORS.number_of_objects = [0, 168, 168]; 

document.addEventListener('DOMContentLoaded', async function() {
  
  // Apply Heatmap Coloring
  function applyHeatmap() {
    const tableFn = document.querySelector('#StatisticsTableView > .inner > table');
    if (!tableFn) return;

    Object.keys(COLUMN_COLORS).forEach(key => {
      const color = COLUMN_COLORS[key];
      const cells = Array.from(tableFn.querySelectorAll(`td[data-key="${key}"]`));
      
      // Extract numeric values
      const values = cells.map(cell => {
        const text = cell.textContent.replace(/,/g, '').trim();
        return text ? parseFloat(text) : 0;
      });

      const max = Math.max(...values);
      const min = Math.min(...values); // Usually 0 or 1, but let's calculate
      const range = max - min;

      cells.forEach((cell, index) => {
        const val = values[index];
        if (range === 0 || val === 0) {
          cell.style.backgroundColor = 'transparent';
          return;
        }

        // Calculate intensity (0.1 to 0.6 to keep text readable)
        // Logarithmic scale often looks better for power-law distributions like RDF stats
        // But linear is requested? Let's stick to linear or simple relative for now.
        // User said "atmosphere is different", implying precise comparison isn't the goal.
        // Let's use a linear scale with a minimum floor for visibility if > 0.
        
        let ratio = (val - min) / range;
        
        // Enhance visibility for lower values? 
        // Let's just stick to linear for transparency.
        // Opacity 0.05 (min visible) to 0.5 (max, so text is clear)
        const opacity = 0.05 + (ratio * 0.55); 
        
        cell.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
      });
    });
  }

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

  // Apply Heatmap initially
  applyHeatmap();

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
        
        // Re-apply heatmap isn't strictly necessary if styles are inline on td,
        // but it doesn't hurt to ensure consistency if logic changes.
        // Actually, sorting moves trs, so tds keep their styles. No need to re-call.
      });
    });
  }
});
</script>
