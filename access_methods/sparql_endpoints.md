---
layout: page
title:
  en: SPARQL endpoints
  ja: SPARQLエンドポイント
pageId: sparql_endpoints
parentPageId: access_methods
description:
  en: List of SPARQL endpoints
  ja: SPARQLエンドポイントの一覧
---

<div id="EndpointsListView" class="-fullwidth -nomargin">

  <table>
    {% for endpoint in site.data.endpoints %}
    <tbody>
      <tr>
        <th>
          <a href="https://rdfportal.org/{{ endpoint.id }}/sparql" target="endpoint">{{ endpoint.title }}</a>
        </th>
      </tr>
      {% assign related_datasets = site.data.datasets | where: "endpoint", endpoint.id %}
      {% if related_datasets.size > 0 %}
      <tr>
        <td>
          <ul class="datasets">
            {% for dataset in related_datasets %}
                {% assign ds_title = dataset.title[current_lang] | default: dataset.title.en | default: dataset.title %}
                <li>
                  <a href="{{ site.baseurl }}/dataset/{{ dataset.id | url_encode }}">
                    {{ ds_title }}
                  </a>
                </li>
            {% endfor %}
          </ul>
        </td>
      </tr>
      {% endif %}
    </tbody>
    {% endfor %}
  </table>

</div>
