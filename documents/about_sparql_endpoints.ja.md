---
layout: page
title: ドキュメント
pageId: about_sparql_endpoints
parentPageId: documents
description: RDFポータルサイトの利用方法とドキュメント
permalink: /documents/about_sparql_endpoints/
lang: ja
---

### RDF PortalのSPARQLエンドポイントについて

RDF Portalでは、複数のSPARQLエンドポイントを提供しています。本来であれば、すべてのRDFデータセットを単一のエンドポイントから利用できる方が利便性は高いのですが、現状使用しているRDFストアの性能上の制約（データのロード、更新、問い合わせ処理などの観点）から、そのような運用は現実的ではありません。

そのため現在は、主にデータセットの提供機関やデータサイズの観点からデータセットを分類し、複数のエンドポイントに分散してロードした上で、SPARQLによるアクセスサービスを提供しています。

各エンドポイントには、DBCLSが開発した <a href="https://github.com/moriya-dbcls/sparql-support" target="_blank">sparql-support</a> および <a href="https://github.com/dbcls/sparql-proxy" target="_blank">sparql-proxy</a> がフロントエンドとして利用されています。

sparql-support は、SPARQLクエリの記述を支援するエディタであり補完や複数クエリのタブ管理といった機能を提供します。

sparql-proxy は、SPARQLエンドポイントのプロキシサーバーとして、クエリのジョブ管理、不正なクエリの検出、キャッシュを利用した応答高速化などの機能を備えています。

以下に、現在利用可能なSPARQLエンドポイントの一覧を示します。

{% assign endpoints = site.data.endpoints | default: empty %}

{% for ep in endpoints %}
<p><a href="https://rdfportal.org/{{ ep.id }}/sparql" target="_blank">{{ ep.title }}</a></p>
{% endfor %}
