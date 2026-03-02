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

{% assign downloads_map = "" | split: "" %}
{% for dl in site.data.downloads %}
  {% assign downloads_map = downloads_map | push: dl %}
{% endfor %}

<div id="DownloadPageView" class="-nomargin">

{% lang 'en' %}
<p>Below is a list of RDF datasets available for download.</p>
{% endlang %}

{% lang 'ja' %}
<p>RDF Portal で提供している RDF データセットのダウンロード一覧です。</p>
{% endlang %}

<ul class="download-list">
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

  <li data-dataset-id="{{ dataset.id }}">
    <header>
      <h3 class="title">
        <a href="../dataset/{{ dataset.id }}/">
          {% if dataset.title %}{{ dataset.title }}{% else %}{{ dataset.id }}{% endif %}
        </a>
      </h3>
    </header>

    {% if dataset.description %}
    <p class="description">
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
