---
layout: default
title: Home
lang: en
permalink: /
description: Welcome to the RDF Portal. Explore datasets and SPARQL endpoints.
page_id: home
---

<div id="TopPageContentsView">

  <section class="intro">
    {% lang 'en' %}
    <p>
      <span>The RDF Portal provides a collection of </span><br>
      <span>life science datasets in RDF (Resource Description Framework). </span><br>
      <span>The portal aims to accelerate</span><br>
      <span>integrative utilization of the heterogeneous datasets deposited by</span><br>
      <span>various research institutions and groups.</span><br>
      <span>In this portal, each dataset comes with a summary,</span><br>
      <span>downloadable files and a SPARQL endpoint.</span>
    </p>
    {% endlang %}
    {% lang 'ja' %}
    <p>
      <span>RDF Portal はライフサイエンス分野の RDF（Resource Description Framework）データセットを集約し、</span><br>
      <span>研究機関やコミュニティが公開する多様な知識を横断的に活用できるようにするための玄関口です。</span><br>
      <span>各データセットには概要、ダウンロードファイル、SPARQL エンドポイントを用意し、</span><br>
      <span>異種データの統合的な利用や再解析を後押しします。</span>
    </p>
    {% endlang %}
  </section>
  
  <section class="logs" aria-labelledby="log-heading">
    <h3 class="heading">{% lang 'en' %}Recent Updates{% endlang %}{% lang 'ja' %}最新のお知らせ{% endlang %}</h3>
    {% assign current_lang = site.active_lang | default: page.lang | default: site.default_lang %}
    {% assign translated_logs = site.logs | where: "lang", current_lang %}
    {% if translated_logs and translated_logs.size > 0 %}
      {% assign render_logs = translated_logs %}
    {% else %}
      {% assign render_logs = site.logs | where: "lang", site.default_lang %}
    {% endif %}
    {% for post in render_logs reversed limit:5 %}
    <article class="timeline-article">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
      <h4 class="title">{{ post.title }}</h4>
    </article>
    {% endfor %}
  </section>

</div>

{% include datasets-json.html %}
<script>
document.addEventListener('DOMContentLoaded', function() {
  try {
    var dm = window.DatasetsManager && typeof window.DatasetsManager.getInstance === 'function'
      ? window.DatasetsManager.getInstance()
      : null;
    if (!dm) {
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
