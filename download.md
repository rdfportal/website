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
    <table class="-stickyheader">
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
            <a href="{{ site.baseurl }}/dataset/{{ dataset.id }}/">
              <img class="dataset-icon" src="{{ '/assets/images/dataset_symbols/' | append: dataset.id | append: '.svg' | relative_url }}" alt="" onerror="this.style.display='none'" />
              {% if dataset.title %}{{ dataset.title }}{% else %}{{ dataset.id }}{% endif %}
            </a>
          </td>
          <td>
            {% if dl and dl.formats.ntriples %}
              <a href="{{ dl.formats.ntriples | remove: 'https:' | remove: 'http:' }}" class="button-view -download -ntriples" target="_blank" rel="noopener" aria-label="Download RDF files in N-Triples format" title="N-Triples">
                N-Triples
              </a>
            {% else %}
              <span class="-downloadunavailable"></span>
            {% endif %}
          </td>
          <td>
            {% if dl and dl.formats.turtle %}
              <a href="{{ dl.formats.turtle | remove: 'https:' | remove: 'http:' }}" class="button-view -download -turtle" target="_blank" rel="noopener" aria-label="Download RDF files in Turtle format" title="Turtle">
                Turtle
              </a>
            {% else %}
              <span class="-downloadunavailable"></span>
            {% endif %}
          </td>
          <td>
            {% if dl and dl.formats.rdfxml %}
              <a href="{{ dl.formats.rdfxml | remove: 'https:' | remove: 'http:' }}" class="button-view -download -rdfxml" target="_blank" rel="noopener" aria-label="Download RDF files in RDF-XML format" title="RDF-XML">
                RDF-XML
              </a>
            {% else %}
              <span class="-downloadunavailable"></span>
            {% endif %}
          </td>
          <td>
            {% if dl and dl.formats.jsonld %}
              <a href="{{ dl.formats.jsonld | remove: 'https:' | remove: 'http:' }}" class="button-view -download -jsonld" target="_blank" rel="noopener" aria-label="Download RDF files in JSON-LD format" title="JSON-LD">
                JSON-LD
              </a>
            {% else %}
              <span class="-downloadunavailable"></span>
            {% endif %}
          </td>
        </tr>
      {% endfor %}
      </tbody>
    </table>
  </div>

</div><!-- /#DownloadPageView -->
