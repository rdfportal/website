---
layout: default
title: Top
pageId: top
description: RDFポータルサイトへようこそ。データセットやエンドポイント情報を探索できます。
---

<div id="TopPageContentsView">
  <p class="intro">
    <span>The RDF Portal provides a collection of </span><br>
    <span>life science datasets in RDF (Resource Description Framework). </span><br>
    <span>The portal aims to accelerate</span><br>
    <span>integrative utilization of the heterogeneous datasets deposited by</span><br>
    <span>various research institutions and groups.</span><br>
    <span>In this portal, each dataset comes with a summary,</span><br>
    <span>downloadable files and a SPARQL endpoint.</span>
  </p>
</div>


<!-- JekyllでJSONデータを埋め込む -->
{% include datasets-json.html %}
<script>
document.addEventListener('DOMContentLoaded', function() {
  try {
    var dm = window.DatasetsManager && typeof window.DatasetsManager.getInstance === 'function'
      ? window.DatasetsManager.getInstance()
      : null;
    if (!dm) {
      // 簡易リトライ
      setTimeout(function() {
        try {
          dm = window.DatasetsManager && typeof window.DatasetsManager.getInstance === 'function'
            ? window.DatasetsManager.getInstance()
            : null;
          if (!dm) return;
          var tags = dm.getAvailableTags();
          if (Array.isArray(tags) && tags.length) dm.updateTagStyles(tags.map(function(t){ return t.id; }));
        } catch (e) { console.error('datasets tag init retry error', e); }
      }, 50);
      return;
    }
    var tags = dm.getAvailableTags();
    if (Array.isArray(tags) && tags.length) dm.updateTagStyles(tags.map(function(t){ return t.id; }));
  } catch (e) { console.error('datasets tag init error', e); }
});
</script>

<div id="TopPageTilingDatasetsView">
  <div class="container"></div>
</div>
