---
layout: page
title:
  en: Download
  ja: ダウンロード
pageId: download
description:
  en: Download RDF datasets available on RDF Portal
  ja: RDF Portal で提供されている RDF データセットのダウンロード
permalink: /download/
permalink_lang:
  en: /download/
  ja: /download/ja/
---

{% comment %}
downloads.json と datasets.json を id でマッチングするための lookup マップを作る
{% endcomment %}
{% assign downloads_map = "" | split: "" %}
{% for dl in site.data.downloads %}
  {% assign downloads_map = downloads_map | push: dl %}
{% endfor %}

<div id="DownloadPageView">

{% lang 'en' %}
<p class="download-intro">
  Below is a list of RDF datasets available for download.
  Files are hosted at <code>https://rdfportal.org/download/[id]/latest/</code>.
</p>
{% endlang %}

{% lang 'ja' %}
<p class="download-intro">
  RDF Portal で提供している RDF データセットのダウンロード一覧です。
  ファイルは <code>https://rdfportal.org/download/[id]/latest/</code> に格納されています。
</p>
{% endlang %}

<ul class="download-dataset-list">
{% for dataset in site.data.datasets %}
  {% assign dl = nil %}
  {% assign dl_found = false %}
  {% for d in site.data.downloads %}
    {% unless dl_found %}
      {% if d.id == dataset.id %}
        {% assign dl = d %}
        {% assign dl_found = true %}
      {% endif %}
    {% endunless %}
  {% endfor %}

  <li class="download-dataset-item" id="download-{{ dataset.id }}">
    <div class="download-dataset-header">
      <h3 class="download-dataset-title">
        <a href="/{{ dataset.id }}/">
          {% if dataset.title %}{{ dataset.title }}{% else %}{{ dataset.id }}{% endif %}
        </a>
      </h3>
      <span class="download-dataset-id"><code>{{ dataset.id }}</code></span>
    </div>

    {% if dataset.description %}
    <p class="download-dataset-desc">
      {% lang 'en' %}{{ dataset.description.en | default: dataset.description }}{% endlang %}
      {% lang 'ja' %}{{ dataset.description.ja | default: dataset.description.en | default: dataset.description }}{% endlang %}
    </p>
    {% endif %}

    {% if dl and dl.available %}
      {% assign files = dl.entries | where: "isDir", false %}
      {% assign dirs  = dl.entries | where: "isDir", true %}
      <div class="download-files">
        <a class="download-url" href="{{ dl.url }}" target="_blank" rel="noopener">
          {{ dl.url }}
        </a>
        {% if files.size > 0 %}
        <table class="download-table">
          <thead>
            <tr>
              {% lang 'en' %}<th>File</th><th>Size</th><th>Date</th>{% endlang %}
              {% lang 'ja' %}<th>ファイル</th><th>サイズ</th><th>更新日</th>{% endlang %}
            </tr>
          </thead>
          <tbody>
          {% for entry in files %}
            <tr>
              <td><a href="{{ entry.href }}" download>{{ entry.name }}</a></td>
              <td>{{ entry.size | default: "-" }}</td>
              <td>{{ entry.date | default: "-" }}</td>
            </tr>
          {% endfor %}
          </tbody>
        </table>
        {% endif %}
        {% if dirs.size > 0 %}
        <details class="download-dirs">
          <summary>
            {% lang 'en' %}Subdirectories ({{ dirs.size }}){% endlang %}
            {% lang 'ja' %}サブディレクトリ ({{ dirs.size }}){% endlang %}
          </summary>
          <ul class="download-dir-list">
          {% for entry in dirs %}
            <li><a href="{{ entry.href }}" target="_blank" rel="noopener">{{ entry.name }}</a></li>
          {% endfor %}
          </ul>
        </details>
        {% endif %}
      </div>
    {% else %}
      <p class="download-unavailable">
        {% lang 'en' %}Download files are not available for this dataset.{% endlang %}
        {% lang 'ja' %}このデータセットのダウンロードファイルは現在提供されていません。{% endlang %}
      </p>
    {% endif %}
  </li>
{% endfor %}
</ul>

</div><!-- /#DownloadPageView -->

<style>
#DownloadPageView {
  container-type: inline-size;
}
.download-intro {
  margin-bottom: 2rem;
  color: var(--color-text-secondary, #666);
}
.download-dataset-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.download-dataset-item {
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  background: var(--color-surface, #fff);
}
.download-dataset-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.download-dataset-title {
  margin: 0;
  font-size: 1.1rem;
}
.download-dataset-title a {
  text-decoration: none;
  color: var(--color-primary, #2563eb);
}
.download-dataset-title a:hover {
  text-decoration: underline;
}
.download-dataset-id code {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #888);
  background: var(--color-bg-code, #f4f4f5);
  padding: 0.1em 0.4em;
  border-radius: 4px;
}
.download-dataset-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #555);
  margin: 0 0 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.download-url {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--color-text-secondary, #888);
  margin-bottom: 0.75rem;
  word-break: break-all;
}
.download-files {
  margin-top: 0.5rem;
}
/* テーブル */
.download-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}
.download-table th,
.download-table td {
  text-align: left;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}
.download-table th {
  font-weight: 600;
  background: var(--color-bg-table-head, #f9fafb);
  color: var(--color-text-secondary, #555);
}
.download-table td:nth-child(2),
.download-table td:nth-child(3) {
  white-space: nowrap;
  color: var(--color-text-secondary, #777);
}
.download-table a {
  color: var(--color-primary, #2563eb);
  word-break: break-all;
}
/* サブディレクトリ */
.download-dirs summary {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #555);
  user-select: none;
  padding: 0.25rem 0;
}
.download-dir-list {
  list-style: none;
  padding: 0.5rem 0 0 1rem;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.download-dir-list li a {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  background: var(--color-bg-code, #f4f4f5);
  border-radius: 4px;
  text-decoration: none;
  color: var(--color-primary, #2563eb);
}
.download-dir-list li a:hover {
  text-decoration: underline;
}
.download-unavailable {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #999);
  font-style: italic;
  margin: 0;
}
</style>
