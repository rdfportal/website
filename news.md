---
layout: page
title: News
pageId: news
---

<div class="news-list">
  {% for post in site.posts %}
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
