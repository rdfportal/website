---
layout: default
title:
  en: Home
  ja: ホーム
permalink: /
permalink_lang:
  en: /
  ja: /ja/
page_id: home
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
<!-- TopPageTilingDatasetsViewController 実行 -->
<script src="{{ '/assets/js/DatasetIcon.js' | relative_url }}"></script>
<script src="{{ '/assets/js/DatasetsManager.js' | relative_url }}"></script>
<script src="{{ '/assets/js/DatasetCard.js' | relative_url }}"></script>
<script src="{{ '/assets/js/top-page-tiles.js' | relative_url }}"></script>

<div id="TopPageTilingDatasetsView">
  <div class="container"></div>
</div>
