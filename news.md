---
layout: page
title: News
pageId: news
---

<div class="timeline-list">
  {% assign current_year = "" %}
  {% for post in site.news reversed %}
    {% assign post_year = post.date | date: "%Y" %}
    {% if post_year != current_year %}
      <h2 class="year-heading">{{ post_year }}</h2>
      {% assign current_year = post_year %}
    {% endif %}
  <article>
    <time>{{ post.date | date: "%-m.%-d" }}</time>
    <h3 class="title">
      <a href="{{ post.url | relative_url }}">
        {{ post.title }}
      </a>
    </h3>
  </article>
  {% endfor %}
</div>
