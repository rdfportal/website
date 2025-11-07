---
layout: page
title: News
---

<div class="posts">
  {% for post in site.posts %}
  <article class="post">
    <h3 class="post-title">
      <a href="{{ post.url | relative_url }}">
        {{ post.title }}
      </a>
    </h3>

    <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</p>
  </article>
  {% endfor %}
</div>
