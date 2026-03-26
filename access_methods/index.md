---
layout: page
title:
  en: Access methods
  ja: アクセス方法
pageId: access_methods
parentPageId: access_methods
description:
  en: Learn how to access RDF data
  ja: RDFポータルで利用可能なデータアクセス方法一覧
permalink: /access_methods/
permalink_lang:
  en: /access_methods/
  ja: /access_methods/ja/
---

<div id="AccessMethodsDiagramView" class="grid-boxes -fullwidth">

{% assign lang = page.lang | default: site.active_lang | default: site.default_lang | default: "en" %}
{% for method in site.data.access_methods %}
{% assign title = method.title[lang] %}
{% assign desc = method.description[lang] %}
<article>
  <h2>
    <a href="{% if method.is_external %}{{ method.url }}{% else %}{{ method.url | relative_url }}{% endif %}"{% if method.is_external %} target="_blank"{% endif %}>
      {{ title }}
    </a>
  </h2>
  <p>{{ desc }}</p>
</article>
{% endfor %}

</div>
