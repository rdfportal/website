---
layout: page
title:
  en: Access methods
  ja: アクセス方法
pageId: access_methods
parentPageId: access_methods
description:
  en: Learn how to access RDF data
  ja: RDFポータルで利用可能なデータアクセス方法一覧
permalink: /access_methods/
permalink_lang:
  en: /access_methods/
  ja: /access_methods/ja/
---

<div class="grid-boxes -fullwidth">

<div class="box" markdown="1">
{% lang 'en' %}
## [SPARQL endpoints]({{ '/access_methods/sparql_endpoints/' | relative_url }})
We provide SPARQL endpoints that allow you to execute queries against RDF data. Using the standard SPARQL 1.1 query language, you can perform complex searches and data extraction across multiple datasets.
{% endlang %}
{% lang 'ja' %}
## [SPARQLエンドポイント]({{ '/access_methods/sparql_endpoints/' | relative_url }})
RDFデータに対してクエリを実行できるSPARQLエンドポイントを提供しています。標準的なSPARQL 1.1クエリ言語を使用して、複数のデータセットにまたがる複雑な検索やデータ抽出が可能です。
{% endlang %}
</div>

<div class="box" markdown="1">
{% lang 'en' %}
## [GraphQL API]({{ '/access_methods/graphql_api/' | relative_url }})
GraphQL API is available for application developers. It allows intuitive query construction based on schemas and is suitable for use from frontend applications.
{% endlang %}
{% lang 'ja' %}
## [GraphQL API]({{ '/access_methods/graphql_api/' | relative_url }})
よりアプリ開発者に親しみやすいGraphQL APIも利用可能です。スキーマに基づいた直感的なクエリ作成が可能で、フロントエンドアプリケーションからの利用に適しています。
{% endlang %}
</div>

<div class="box" markdown="1">
{% lang 'en' %}
## [TogoMCP]({{ 'https://togomcp.rdfportal.org/' }}){:target="_blank"}
Model Context Protocol (MCP) interface for AI agents. This mechanism enables LLMs to understand the structure and content of RDF datasets and provide accurate data in response to natural language questions.
{% endlang %}
{% lang 'ja' %}
## [TogoMCP]({{ 'https://togomcp.rdfportal.org/' }}){:target="_blank"}
AIエージェント向けのModel Context Protocol (MCP) インターフェースです。LLMがRDFデータセットの構造や内容を理解し、自然言語での質問に対して正確なデータを提供するための仕組みです。
{% endlang %}
</div>

<div class="box" markdown="1">
{% lang 'en' %}
## [LLM Chat Interface]({{ '/access_methods/llm_chat_interface/' | relative_url }})
Chat interface allowing interaction with the database using natural language. Even without knowledge of SPARQL or GraphQL, simply entering a question allows AI to search for data and provide answers.
{% endlang %}
{% lang 'ja' %}
## [LLMチャットインターフェース]({{ '/access_methods/llm_chat_interface/' | relative_url }})
自然言語でデータベースと対話できるチャットインターフェースです。SPARQLやGraphQLの知識がなくても、質問を入力するだけでAIがデータを検索・回答してくれます。
{% endlang %}
</div>

<div class="box" markdown="1">
{% lang 'en' %}
## [SPARQL composer]({{ 'https://rdfportal.org/composer/' }}){:target="_blank"}
Interface for generating SPARQL queries.
{% endlang %}
{% lang 'ja' %}
## [SPARQL composer]({{ 'https://rdfportal.org/composer/' }}){:target="_blank"}
SPARQLクエリを生成するためのインターフェースです。
{% endlang %}
</div>

</div>
