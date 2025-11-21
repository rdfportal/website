---
layout: default
title: Home
lang: en
permalink: /en/
description: Welcome to the RDF Portal. Explore datasets and SPARQL endpoints.
---

<div id="TopPageContentsView">

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
    {% assign translated_logs = site.logs | where: "lang", page.lang %}
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
