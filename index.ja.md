---
layout: default
title: トップページ
lang: ja
permalink: /
description: RDFポータルサイトへようこそ。データセットやエンドポイント情報を探索できます。
page_id: home
permalink_lang:
  en: /
  ja: /ja/
---

<div id="TopPageContentsView">

<!-- TODO: replace with Japanese copy -->

  <section class="intro">
    <p>
      <span>The RDF Portal provides a collection of </span><br>
      <span>life science datasets in RDF (Resource Description Framework). </span><br>
      <span>The portal aims to accelerate</span><br>
      <span>integrative utilization of the heterogeneous datasets deposited by</span><br>
      <span>various research institutions and groups.</span><br>
      <span>In this portal, each dataset comes with a summary,</span><br>
      <span>downloadable files and a SPARQL endpoint.</span>
    </p>
  </section>
  
  <section class="logs" aria-labelledby="log-heading">
    <h3 class="heading">Recent Updates</h3>
    {% for post in site.logs reversed limit:5 %}
    <article class="timeline-article">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
      <h4 class="title">{{ post.title }}</h4>
    </article>
    {% endfor %}
  </section>

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
