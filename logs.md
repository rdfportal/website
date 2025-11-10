---
layout: page
title: Update Log
pageId: logs
---

<div class="log-list">
  {% for post in site.logs reversed %}
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
