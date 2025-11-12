---
layout: page
title: News
pageId: news
---

<div class="timeline-list">
  {% for post in site.news reversed %}
  <article>
    <time>{{ post.date | date: "%b %-d, %Y" }}</time>
    <h3 class="title">
      <a href="{{ post.url | relative_url }}">
        {{ post.title }}
      </a>
    </h3>
  </article>
  {% endfor %}
</div>
