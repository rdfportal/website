---
layout: page
title:
  en: Update Log
  ja: 更新履歴
pageId: logs
permalink: /logs/
permalink_lang:
  en: /logs/
  ja: /logs/ja/
---

<div class="timeline-list -fullwidth -nomargin">
  {% assign current_lang = site.active_lang | default: page.lang | default: site.default_lang %}
  {% assign translated_posts = site.logs | where: "lang", current_lang %}
  {% if translated_posts.size == 0 %}
    {% assign translated_posts = site.logs | where: "lang", site.default_lang %}
  {% endif %}

  {% assign current_year = "" %}
  {% for post in translated_posts reversed %}
    {% assign post_year = post.date | date: "%Y" %}
    {% if post_year != current_year %}
      <h3 class="year"><time datetime="{{ post_year }}">{{ post_year }}</time></h3>
      {% assign current_year = post_year %}
    {% endif %}
  <article class="timeline-article">
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%m.%d" }}</time>
    <h4 class="title">
      <a href="{{ post.url | relative_url }}">
        {{ post.title }}
      </a>
    </h4>
  </article>
  {% endfor %}
</div>
