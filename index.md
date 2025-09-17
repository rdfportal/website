---
layout: default
title: Top
pageId: top
description: RDFポータルサイトへようこそ。データセットやエンドポイント情報を探索できます。
---

<p class="intro"><span>The RDF Portal provides a collection of </span><br>
<span>life science datasets in RDF (Resource Description Framework). </span><br>
<span>The portal aims to accelerate</span><br>
<span>integrative utilization of the heterogeneous datasets deposited by</span><br>
<span>various research institutions and groups.</span><br>
<span>In this portal, each dataset comes with a summary,</span><br>
<span>downloadable files and a SPARQL endpoint.</span></p>


<!-- JekyllでJSONデータを埋め込む -->
{% include datasets-json.html %}
{% comment %} Collect unique tags from datasets for server-side CSS generation {% endcomment %}
{% assign __all_tags = '' %}
{% for ds in site.data.datasets %}
  {% if ds.tags %}
    {% for t in ds.tags %}
      {% unless __all_tags contains t %}
        {% if __all_tags == '' %}
          {% assign __all_tags = t %}
        {% else %}
          {% assign __all_tags = __all_tags | append: '|' | append: t %}
        {% endif %}
      {% endunless %}
    {% endfor %}
  {% endif %}
{% endfor %}
{% assign __tag_list = __all_tags | split: '|' %}
{% include tag-styles.html tags=__tag_list %}

<div id="TopPageTilingDatasetsView">
  <div class="container"></div>
</div>
