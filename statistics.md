---
layout: page
title:
  en: Statistics
  ja: 統計情報
pageId: statistics
description:
  en: Statistical information of RDF datasets
  ja: RDFデータセットの統計情報一覧
permalink: /statistics/
permalink_lang:
  en: /statistics/
  ja: /statistics/
---

<script type="application/json" id="datasets-json">{{ site.data.datasets | jsonify }}</script>


<div id="StatisticsTableView" class="-fullwidth -nomargin">
  <div class="inner">
    <table>
      <thead>
        <tr>
          <th data-sort="title"><span class="th-label">{% lang 'en' %}Dataset{% endlang %}{% lang 'ja' %}データセット{% endlang %}</span></th>
          {% assign first_dataset = site.data.datasets | first %}
          {% for stat in first_dataset.statistics %}
            {% assign key = stat[0] %}
            {% assign label = key | replace: 'number_of_', '' | capitalize %}
            <th data-sort="{{ key }}"><span class="th-label">{{ label }}</span></th>
          {% endfor %}
        </tr>
      </thead>
      <tbody>
        {% for dataset in site.data.datasets %}
          <tr>
            <td data-key="title"><a href="{{ site.baseurl }}/dataset/{{ dataset.id }}/">{{ dataset.title }}</a></td>
            {% for stat in first_dataset.statistics %}
              {% assign key = stat[0] %}
              <td data-key="{{ key }}">{{ dataset.statistics[key] }}</td>
            {% endfor %}
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>

<script>
const HEATMAP_COLOR = [0, 122, 204]; // Brand Blue

document.addEventListener('DOMContentLoaded', async function() {
  
  // Apply Heatmap Coloring
  function applyHeatmap() {
    const table = document.querySelector('#StatisticsTableView > .inner > table');
    if (!table) return;

    // Get all numeric keys from headers (skip "title")
    const headers = Array.from(table.querySelectorAll('th[data-sort]'))
      .map(th => th.getAttribute('data-sort'))
      .filter(key => key && key !== 'title');

    headers.forEach(key => {
      const cells = Array.from(table.querySelectorAll(`td[data-key="${key}"]`));
      
      // Extract numeric values
      const values = cells.map(cell => {
        const text = cell.textContent.replace(/,/g, '').trim();
        return text ? parseFloat(text) : 0;
      });

      const max = Math.max(...values);
      const min = Math.min(...values); 
      const range = max - min;

      cells.forEach((cell, index) => {
        const val = values[index];
        if (range === 0 || val === 0) {
          cell.style.backgroundColor = 'transparent';
          return;
        }

        let ratio = (val - min) / range;
        const opacity = 0.05 + (ratio * 0.55); 
        
        cell.style.backgroundColor = `rgba(${HEATMAP_COLOR[0]}, ${HEATMAP_COLOR[1]}, ${HEATMAP_COLOR[2]}, ${opacity})`;
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

  // 簡易テーブルソート（数値・文字列対応）3-state: desc -> asc -> release
  const table = document.querySelector('#StatisticsTableView > .inner > table');
  if (table) {
    // Store original row order
    const originalRows = Array.from(table.tBodies[0].rows);
    
    table.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', function() {
        const sortKey = th.getAttribute('data-sort');
        const rows = Array.from(table.tBodies[0].rows);
        const isNumber = sortKey !== 'title';
        
        // Determine next state
        let nextState = 'desc'; // default first click
        if (th.classList.contains('desc')) {
          nextState = 'asc';
        } else if (th.classList.contains('asc')) {
          nextState = 'release';
        }

        // Reset all headers
        table.querySelectorAll('th').forEach(h => h.classList.remove('asc', 'desc'));

        if (nextState === 'release') {
          // Restore original order
          // Note: This restores the initial load order. 
          // If the table content changes dynamically, this logic needs to be revisited.
          // Assuming static table content for now.
          const tbody = table.tBodies[0];
          // Clear current rows
          while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
          // Append original rows
          originalRows.forEach(row => tbody.appendChild(row));
          
        } else {
          // Add class for next state
          th.classList.add(nextState);
          
          const asc = nextState === 'asc';
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
        }
      });
    });
  }
});
</script>
