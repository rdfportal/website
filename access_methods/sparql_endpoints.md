---
layout: page
title: SPARQL endpoints
pageId: sparql_endpoints
description: SPARQLエンドポイントの一覧を表示します
---

<div id="EndpointsListView">

  <table>
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Available datasets</th>
      </tr>
    </thead>
    <tbody>
    {% for endpoint in site.data.endpoints %}
      <tr>
        <th>
          <a href="https://rdfportal.org/{{ endpoint.id }}/sparql" target="endpoint">{{ endpoint.title }}</a>
        </th>
        <td>
          <ul class="datasets">
            {% for dataset in site.data.datasets %}
              {% if dataset.endpoint == endpoint.id %}
                <li>
                  <a href="{{ site.baseurl }}/dataset/{{ dataset.id | url_encode }}">
                    {{ dataset.title }}
                  </a>
                </li>
              {% endif %}
            {% endfor %}
          </ul>
        </td>
      </tr>
    {% endfor %}
    </tbody>
  </table>

</div>
