---
layout: page
title: SPARQL endpoints
pageId: sparql_endpoints
parentPageId: access_methods
description: SPARQLエンドポイントの一覧を表示します
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
                <li>
                  <a href="{{ site.baseurl }}/dataset/{{ dataset.id | url_encode }}">
                    {{ dataset.title }}
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
