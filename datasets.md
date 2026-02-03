---
layout: page
title:
  en: Datasets
  ja: データセット
pageId: datasets
description:
  en: List of available RDF datasets
  ja: 利用可能なRDFデータセットの一覧
---

<!-- JekyllでJSONデータを埋め込む -->

{% include datasets-json.html %}

<!-- #DatasetsSortFilterView（default.html側）を活用するため独自UIは廃止 -->
<div id="DatasetsListView"></div>

<script src="{{ '/assets/js/DatasetIcon.js' | relative_url }}"></script>
<script src="{{ '/assets/js/DatasetCard.js' | relative_url }}"></script>
<script src="{{ '/assets/js/DatasetsManager.js' | relative_url }}"></script>

<script>


document.addEventListener('DOMContentLoaded', async function() {
  const datasetLoader = window.DatasetsManager.getInstance();
  let datasets = [];
  try {
    datasets = await datasetLoader.getDatasets();
  } catch (e) {
    console.error('Failed to load datasets:', e);
  }
  if (!datasets || datasets.length === 0) return;

  // #DatasetsSortFilterView のUI取得
  const sortSegment = document.getElementById('sortSegment');
  const sortOrderSegment = document.getElementById('sortOrderSegment');
  const tagSelect = document.getElementById('tagSelect');
  const provenanceSegment = document.getElementById('provenanceFilterSegment');
  const registrationSegment = document.getElementById('registrationFilterSegment');
  const searchInput = document.getElementById('DatasetSearchInput'); // 検索UIは必要に応じて

  // Helper for formatting meta strings (duplicated from DatasetCard)
  function formatMetaString(str) {
    if (!str) return "";
    return str
      .split("_")
      .map((word, index) => {
        const lower = word.toLowerCase();
        if (lower === "rdfportal") return "RDF portal";
        if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
        return word;
      })
      .join(" ");
  }

  // フィルタUI生成関数
  function createCheckboxFilter(segment, items, namePrefix) {
    if (!segment) return;
    segment.innerHTML = '';
    items.forEach(item => {
      const wrapper = document.createElement('label');
      wrapper.className = 'checkboxwrapper';
      
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = item.id;
      input.name = namePrefix;
      input.checked = true; // Default checked
      
      const text = document.createElement('span');
      text.textContent = `${formatMetaString(item.id)} (${item.count})`;
      
      wrapper.appendChild(input);
      wrapper.appendChild(text);
      segment.appendChild(wrapper);
      
      // イベントリスナー
      input.addEventListener('change', () => renderDatasets(getFilteredSortedDatasets()));
    });
  }

  // 集計とフィルタ生成
  const tagCounts = {};
  const provenanceCounts = {};
  const registrationCounts = {};

  datasets.forEach(ds => {
    // Tags
    (ds.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    // Provenance
    if (ds.rdf_provenance_type) {
      provenanceCounts[ds.rdf_provenance_type] = (provenanceCounts[ds.rdf_provenance_type] || 0) + 1;
    }
    // Registration
    if (ds.registration_type) {
      registrationCounts[ds.registration_type] = (registrationCounts[ds.registration_type] || 0) + 1;
    }
  });

  // タグ選択肢生成
  if (tagSelect) {
    const allTags = Object.keys(tagCounts).sort();
    allTags.forEach(tag => {
      if (!Array.from(tagSelect.options).some(opt => opt.value === tag)) {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = `${tag} (${tagCounts[tag]})`;
        tagSelect.appendChild(opt);
      }
    });
  }

  // Provenanceフィルタ生成
  if (provenanceSegment) {
    const items = Object.keys(provenanceCounts).sort().map(k => ({ id: k, count: provenanceCounts[k] }));
    createCheckboxFilter(provenanceSegment, items, 'provenance');
  }

  // Registrationフィルタ生成
  if (registrationSegment) {
    const items = Object.keys(registrationCounts).sort().map(k => ({ id: k, count: registrationCounts[k] }));
    createCheckboxFilter(registrationSegment, items, 'registration');
  }

  function getFilteredSortedDatasets() {
    let filtered = datasets;
    const currentLang = document.documentElement.lang || 'en';

    // Helper to get string from string or object
    const getStringVal = (val, lang) => {
       if (!val) return "";
       if (typeof val === "string") return val;
       if (typeof val === "object") return val[lang] || val.en || val.ja || "";
       return "";
    };
    // Helper for search (check all langs)
    const getSearchable = (val) => {
       if (!val) return "";
       if (typeof val === "string") return val.toLowerCase();
       if (typeof val === "object") return Object.values(val).join(" ").toLowerCase();
       return "";
    };

    // 検索
    if (searchInput && searchInput.value.trim()) {
      const keyword = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(ds =>
        getSearchable(ds.title).includes(keyword) ||
        getSearchable(ds.description).includes(keyword)
      );
    }
    // タグフィルタ
    if (tagSelect && tagSelect.value) {
      filtered = filtered.filter(ds => Array.isArray(ds.tags) && ds.tags.includes(tagSelect.value));
    }

    // Provenanceフィルタ
    if (provenanceSegment) {
      const checked = Array.from(provenanceSegment.querySelectorAll('input:checked')).map(cb => cb.value);
      // Filter strictly based on checked items. If none checked, show none (for this category).
      // Note: If a dataset doesn't have provenance type, it will be hidden if we filter strictly by checked values.
      // Assuming all datasets have these types if the filter exists.
      filtered = filtered.filter(ds => checked.includes(ds.rdf_provenance_type));
    }

    // Registrationフィルタ
    if (registrationSegment) {
      const checked = Array.from(registrationSegment.querySelectorAll('input:checked')).map(cb => cb.value);
      filtered = filtered.filter(ds => checked.includes(ds.registration_type));
    }

    // ソートキー
    let sortKey = 'date';
    if (sortSegment) {
      const activeBtn = sortSegment.querySelector('button[data-sort][aria-pressed="true"]');
      if (activeBtn) sortKey = activeBtn.getAttribute('data-sort');
    }
    // ソート順
    let sortOrder = 'desc';
    if (sortOrderSegment) {
      const activeOrderBtn = sortOrderSegment.querySelector('button[data-order][aria-pressed="true"]');
      if (activeOrderBtn) sortOrder = activeOrderBtn.getAttribute('data-order');
    }
    // 実際のソート
    filtered = filtered.slice().sort((a, b) => {
      let va, vb;
      if (sortKey === 'name') {
        va = getStringVal(a.title, currentLang).toLowerCase();
        vb = getStringVal(b.title, currentLang).toLowerCase();
        return sortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      } else if (sortKey === 'triples') {
        va = a.statistics?.number_of_triples || 0;
        vb = b.statistics?.number_of_triples || 0;
        return sortOrder === 'asc' ? va - vb : vb - va;
      } else {
        // date（仮: created, updated, issued, いずれか）
        va = a.created || a.updated || a.issued || '';
        vb = b.created || b.updated || b.issued || '';
        return sortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
    });
    return filtered;
  }

  function renderDatasets(datasetsToRender) {
    const container = document.getElementById('DatasetsListView');
    container.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'datasets';
    datasetsToRender.forEach(dataset => {
      const li = document.createElement('li');
      li.className = 'dataset';
      const datasetCard = new DatasetCard(dataset, {
        showDescription: true,
        showTags: true,
        showLink: true,
        linkBaseUrl: window.SITE_BASE_URL || "",
        iconRendering: 'svgOverlap',
        showHeaderMeta: true
      });
      const cardEl = datasetCard.getElement();
      li.appendChild(cardEl);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  // 初期表示
  renderDatasets(getFilteredSortedDatasets());
  // イベント
  if (searchInput) searchInput.addEventListener('input', () => renderDatasets(getFilteredSortedDatasets()));
  if (tagSelect) tagSelect.addEventListener('change', () => renderDatasets(getFilteredSortedDatasets()));
  if (sortSegment) sortSegment.addEventListener('click', e => {
    if (e.target.matches('button[data-sort]')) {
      sortSegment.querySelectorAll('button').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
      e.target.setAttribute('aria-pressed', 'true');
      if (sortOrderSegment) {
        const sortKey = e.target.getAttribute('data-sort');
        const desiredOrder = sortKey === 'name' ? 'asc' : 'desc';
        sortOrderSegment.querySelectorAll('button').forEach(btn => {
          const isTarget = btn.getAttribute('data-order') === desiredOrder;
          btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
        });
      }
      renderDatasets(getFilteredSortedDatasets());
    }
  });
  if (sortOrderSegment) sortOrderSegment.addEventListener('click', e => {
    if (e.target.matches('button[data-order]')) {
      sortOrderSegment.querySelectorAll('button').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
      e.target.setAttribute('aria-pressed', 'true');
      renderDatasets(getFilteredSortedDatasets());
    }
  });
});
</script>
