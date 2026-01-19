---
layout: page
title: アクセス方法
pageId: access_methods
parentPageId: access_methods
description: RDFポータルで利用可能なデータアクセス方法一覧
permalink: /access_methods/
lang: ja
---

<div class="grid-boxes -fullwidth">

<div class="box" markdown="1">
## [SPARQLエンドポイント]({{ '/access_methods/sparql_endpoints/' | relative_url }})
RDFデータに対してクエリを実行できるSPARQLエンドポイントを提供しています。標準的なSPARQL 1.1クエリ言語を使用して、複数のデータセットにまたがる複雑な検索やデータ抽出が可能です。
</div>

<div class="box" markdown="1">
## [GraphQL API]({{ '/access_methods/graphql_api/' | relative_url }})
よりアプリ開発者に親しみやすいGraphQL APIも利用可能です。スキーマに基づいた直感的なクエリ作成が可能で、フロントエンドアプリケーションからの利用に適しています。
</div>

<div class="box" markdown="1">
## [MCPインターフェース]({{ '/access_methods/mcp_interface/' | relative_url }})
AIエージェント向けのModel Context Protocol (MCP) インターフェースです。LLMがRDFデータセットの構造や内容を理解し、自然言語での質問に対して正確なデータを提供するための仕組みです。
</div>

<div class="box" markdown="1">
## [LLMチャットインターフェース]({{ '/access_methods/llm_chat_interface/' | relative_url }})
自然言語でデータベースと対話できるチャットインターフェースです。SPARQLやGraphQLの知識がなくても、質問を入力するだけでAIがデータを検索・回答してくれます。
</div>

</div>