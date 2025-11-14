---
layout: page
title: Update Log
pageId: logs
---

<div class="timeline-list">
  {% assign current_year = "" %}
  {% for post in site.logs reversed %}
    {% assign post_year = post.date | date: "%Y" %}
    {% if post_year != current_year %}
      <h3 class="year"><time datetime="{{ post_year }}">{{ post_year }}</time></h3>
      {% assign current_year = post_year %}
    {% endif %}
  <article>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%-m.%-d" }}</time>
    <h4 class="title">
      <a href="{{ post.url | relative_url }}">
        {{ post.title }}
      </a>
    </h4>
  </article>
  {% endfor %}
</div>
