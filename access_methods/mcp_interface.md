---
layout: page
title: 
  en: MCP interface
  ja: MCP interface
pageId: mcp_interface
parentPageId: access_methods
description: 
  en: About MCP interface
  ja: MCP interfaceについて
---
{% lang 'en' %}
## MCP interface (TogoMCP)

TogoMCP is a Model Context Protocol (MCP) server developed by [DBCLS](https://dbcls.rois.ac.jp/en/) that provides LLM-based AI agents with seamless access to a wide range of life sciences databases hosted on RDF Portal.

Through TogoMCP, AI assistants such as Claude, ChatGPT, and Gemini can help researchers query, explore, and integrate complex biological data using natural language — without requiring knowledge of SPARQL or database-specific schemas.

**MCP Server Endpoint:** `https://togomcp.rdfportal.org/mcp`

### Key features

- **Multi-database access** — Query proteins, genes, chemicals, diseases, pathways, and more across 20+ integrated databases including UniProt, PubChem, ChEMBL, PDB, Reactome, ClinVar, and others, all through a single MCP endpoint.
- **SPARQL & RDF-based** — Built on Semantic Web technologies. TogoMCP exposes SPARQL endpoints from RDF Portal, enabling precise, structured queries with rich cross-references between datasets.
- **ID conversion** — Powered by [TogoID](https://togoid.dbcls.jp), the server converts identifiers across 65+ biological databases, including cross-category conversions (e.g., disease IDs to gene IDs) with semantic relationship annotations.
- **AI-ready** — Designed for integration with LLM-based assistants. Compatible with Claude Desktop, ChatGPT, and Gemini CLI. No bioinformatics expertise required — use natural language to explore data.

### Available tools

TogoMCP exposes a rich set of tools organized into the following categories:

- **Database & information** — List available databases, retrieve metadata schemas (ShEx), SPARQL examples, and named graphs.
- **Keyword search** — Search across UniProt, ChEMBL (molecules and targets), PDB, Reactome, Rhea, and MeSH using keywords.
- **SPARQL query** — Execute custom SPARQL queries on any RDF database in the portal.
- **ID conversion (TogoID)** — Convert and look up identifiers across databases, discover available conversion routes.
- **NCBI E-utilities** — Search, summarize, and fetch records from NCBI databases (Gene, Taxonomy, ClinVar, MedGen, PubMed, PubChem).
- **PubChem-specific** — Look up compound IDs and retrieve detailed molecular descriptors.

### Getting started

TogoMCP can be connected to AI assistants in just a few steps. Setup guides are available for Claude Desktop, ChatGPT, and Gemini CLI.

For detailed setup instructions, usage examples, the complete list of available databases and tools, and information about complementary MCP servers, please visit the **[TogoMCP website](https://togomcp.rdfportal.org/)**.

The source code is open and available on GitHub: [dbcls/togomcp](https://github.com/dbcls/togomcp).

{% endlang %}

{% lang 'ja' %}

## MCP インターフェース（TogoMCP）

TogoMCP は、[DBCLS](https://dbcls.rois.ac.jp/) が開発した Model Context Protocol（MCP）サ
ーバーです。LLMベースのAIエージェントが、RDF Portal に収録されている幅広いライフサイエンスデータベースにシームレスにアクセスできるようにします。

TogoMCP を通じて、Claude、ChatGPT、Gemini などのAIアシスタントが、SPARQLやデータベース固有のスキーマの知識がなくても、自然言語を使って複雑な生物学データの検索、探索、統合を支援できます。

**MCP サーバーエンドポイント:** `https://togomcp.rdfportal.org/mcp`

### 主な特徴

- **マルチデータベースアクセス** — UniProt、PubChem、ChEMBL、PDB、Reactome、ClinVar をはじめとする20以上の統合データベースから、タンパク質、遺伝子、化学物質、疾患、パスウェイなどを単一のMCPエンドポイントで検索できます。
- **SPARQL・RDFベース** — セマンティックWeb技術に基づいて構築されています。TogoMCP は RDF Portal の SPARQL エンドポイントを公開し、データセット間の豊富な相互参照を活用した正確で構
造化されたクエリを可能にします。
- **ID変換** — [TogoID](https://togoid.dbcls.jp) を活用し、65以上の生物学データベース間で
識別子を変換します。セマンティックな関係アノテーション付きのカテゴリ横断変換（例：疾患ID → 遺伝子ID）にも対応しています。
- **AI対応** — LLMベースのアシスタントとの統合を前提に設計されています。Claude Desktop、ChatGPT、Gemini CLI に対応。バイオインフォマティクスの専門知識は不要で、自然言語でデータを探索できます。

### 利用可能なツール

TogoMCP は、以下のカテゴリに整理された豊富なツールセットを提供しています。

- **データベース・情報** — 利用可能なデータベースの一覧表示、メタデータスキーマ（ShEx）の
取得、SPARQLサンプルクエリ、名前付きグラフの確認。
- **キーワード検索** — UniProt、ChEMBL（分子・ターゲット）、PDB、Reactome、Rhea、MeSH をキーワードで検索。
- **SPARQLクエリ** — ポータル内の任意のRDFデータベースに対してカスタムSPARQLクエリを実行。
- **ID変換（TogoID）** — データベース間の識別子変換・検索、利用可能な変換ルートの確認。
- **NCBI E-utilities** — NCBIデータベース（Gene、Taxonomy、ClinVar、MedGen、PubMed、PubChem）のレコード検索・要約・取得。
- **PubChem固有** — 化合物IDの検索、詳細な分子記述子の取得。

### はじめに

TogoMCP は、数ステップでAIアシスタントに接続できます。Claude Desktop、ChatGPT、Gemini CLI のセットアップガイドが用意されています。

詳しいセットアップ手順、利用例、利用可能なデータベースとツールの完全なリスト、および補完的なMCPサーバーの情報については、**[TogoMCP ウェブサイト](https://togomcp.rdfportal.org/)** をご覧ください。

ソースコードはGitHubで公開されています: [dbcls/togomcp](https://github.com/dbcls/togomcp)

{% endlang %}
<div class="under-construction">
  <span>Under construction</span>
</div>
