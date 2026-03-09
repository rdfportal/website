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

<div id="DownloadPageView" class="-fullwidth -nomargin">


  <div class="inner">
    <table class="download-table">
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
          <td>
            <a href="/{{ dataset.id }}/">
              {% if dataset.title %}{{ dataset.title }}{% else %}{{ dataset.id }}{% endif %}
            </a>
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
