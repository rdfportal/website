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
  Below is a list of RDF datasets available for download. Select a format link to view the directory contents.
</p>
{% endlang %}

{% lang 'ja' %}
<p class="download-intro">
  RDF Portal で提供している RDF データセットのダウンロード一覧です。各フォーマットのリンクからディレクトリを確認できます。
</p>
{% endlang %}

<div class="table-responsive">
  <table class="download-matrix-table">
    <thead>
      <tr>
        <th>Dataset</th>
        <th>N-Triples</th>
        <th>Turtle</th>
        <th>RDF-XML</th>
        <th>JSON-LD</th>
      </tr>
    </thead>
    <tbody>
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

      <tr>
        <td class="dataset-col">
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
        </td>
        <td class="format-col">
          {% if dl and dl.formats.ntriples %}
            <a href="{{ dl.formats.ntriples }}" class="dl-badge ntriples" target="_blank" rel="noopener" title="N-Triples">
              {% lang 'en' %}Link{% endlang %}{% lang 'ja' %}リンク{% endlang %}
            </a>
          {% else %}
            <span class="dl-unavailable">-</span>
          {% endif %}
        </td>
        <td class="format-col">
          {% if dl and dl.formats.turtle %}
            <a href="{{ dl.formats.turtle }}" class="dl-badge turtle" target="_blank" rel="noopener" title="Turtle">
              {% lang 'en' %}Link{% endlang %}{% lang 'ja' %}リンク{% endlang %}
            </a>
          {% else %}
            <span class="dl-unavailable">-</span>
          {% endif %}
        </td>
        <td class="format-col">
          {% if dl and dl.formats.rdfxml %}
            <a href="{{ dl.formats.rdfxml }}" class="dl-badge rdfxml" target="_blank" rel="noopener" title="RDF-XML">
              {% lang 'en' %}Link{% endlang %}{% lang 'ja' %}リンク{% endlang %}
            </a>
          {% else %}
            <span class="dl-unavailable">-</span>
          {% endif %}
        </td>
        <td class="format-col">
          {% if dl and dl.formats.jsonld %}
            <a href="{{ dl.formats.jsonld }}" class="dl-badge jsonld" target="_blank" rel="noopener" title="JSON-LD">
              {% lang 'en' %}Link{% endlang %}{% lang 'ja' %}リンク{% endlang %}
            </a>
          {% else %}
            <span class="dl-unavailable">-</span>
          {% endif %}
        </td>
      </tr>
    {% endfor %}
    </tbody>
  </table>
</div>

</div><!-- /#DownloadPageView -->

<style>
#DownloadPageView {
  container-type: inline-size;
}
.download-intro {
  margin-bottom: 2rem;
  color: var(--color-text-secondary, #666);
}

.table-responsive {
  overflow-x: auto;
}

.download-matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}
.download-matrix-table th,
.download-matrix-table td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  vertical-align: middle;
}
.download-matrix-table th {
  font-weight: 600;
  background: var(--color-bg-table-head, #f9fafb);
  color: var(--color-text-secondary, #555);
  white-space: nowrap;
}
.download-matrix-table tbody tr:last-child td {
  border-bottom: none;
}

.dataset-col {
  min-width: 250px;
}
.format-col {
  text-align: center !important;
  white-space: nowrap;
}

.download-dataset-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}
.download-dataset-title {
  margin: 0;
  font-size: 1.05rem;
}
.download-dataset-title a {
  text-decoration: none;
  color: var(--color-primary, #2563eb);
}
.download-dataset-title a:hover {
  text-decoration: underline;
}
.download-dataset-id code {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #888);
  background: var(--color-bg-code, #f4f4f5);
  padding: 0.1em 0.4em;
  border-radius: 4px;
}
.download-dataset-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #555);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.dl-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-decoration: none;
  background: var(--color-bg-table-head, #eff6ff);
  color: var(--color-primary, #1d4ed8);
  border: 1px solid #bfdbfe;
  transition: all 0.2s ease;
}
.dl-badge:hover {
  background: var(--color-primary, #2563eb);
  color: #fff;
  border-color: var(--color-primary, #2563eb);
  text-decoration: none;
}
.dl-unavailable {
  color: #d1d5db;
  font-size: 1rem;
}
</style>
