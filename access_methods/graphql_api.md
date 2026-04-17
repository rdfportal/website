---
layout: page
title: 
  en: GraphQL API
  ja: GraphQL API
pageId: graphql_api
parentPageId: access_methods
description: 
  en: About GraphQL API
  ja: GraphQL APIについて
---
{% lang 'en' %}
## GraphQL API

RDF Portal provides a GraphQL API that allows developers and researchers to query life science datasets using [GraphQL](https://graphql.org/), a widely adopted query language for APIs. The GraphQL API offers an intuitive, schema-driven alternative to SPARQL, making it easier to retrieve structured data from RDF datasets — especially for those familiar with web application development.

**Service URL:** [https://rdfportal.org/grasp](https://rdfportal.org/grasp)

> **Note:** The GraphQL API currently supports a limited set of databases: **UniProt**, **ChEBI**, **ChEMBL**, and **MedGen**. Additional databases will be added in future updates.

### What is GraphQL?

GraphQL is a query language for APIs developed by Facebook (now Meta) in 2012 and released as open source in 2015. Unlike traditional REST APIs where each endpoint returns a fixed data structure, GraphQL allows clients to specify exactly which fields they need in a single request. Key advantages include:

- **Request only what you need** — Specify the exact fields to retrieve, avoiding over-fetching of unnecessary data.
- **Single endpoint** — All queries go to one endpoint, rather than requiring different URLs for different resources.
- **Nested queries** — Retrieve related data across multiple entities in a single query, following relationships between datasets.
- **Self-documenting** — The schema defines all available types and fields, which can be explored interactively through tools like GraphiQL.

### Grasp: GraphQL-to-SPARQL bridge

The GraphQL API on RDF Portal is powered by [Grasp](https://github.com/dbcls/grasp), an open-source middleware developed by DBCLS. Grasp acts as a bridge between GraphQL and SPARQL: it receives GraphQL queries from clients, translates them into SPARQL queries, executes them against the RDF Portal's SPARQL endpoints, and returns the results in the standard GraphQL response format.

This means that users can take advantage of the rich, interlinked RDF datasets on RDF Portal without needing to write SPARQL queries. Grasp handles the translation transparently, including queries that span multiple databases.

For more details on Grasp, see the [GitHub repository](https://github.com/dbcls/grasp).

### Interactive query interface

The service URL [https://rdfportal.org/grasp](https://rdfportal.org/grasp) provides a GraphiQL interface — an interactive, in-browser IDE for writing and executing GraphQL queries. You can explore the schema, write queries with auto-completion, and view results instantly.

<!-- TODO: Screenshot of the GraphiQL interface -->

### Query examples

The following examples demonstrate how to query RDF Portal datasets through the GraphQL API.

#### Example 1: Basic query — Retrieve MedGen entries

Fetch basic information for specific MedGen entries by their IDs, including linked NCBI Gene identifiers.

```graphql
query {
  MedGen(id: ["C1835407", "C1835223"]) {
    iri
    id
    label
    ncbigene
  }
}
```

#### Example 2: Detailed query — Retrieve all available MedGen fields

Retrieve comprehensive information from MedGen, including descriptions, concept names, definitions, and associated metadata.

```graphql
query {
  MedGen(id: ["C1835407", "C1835223"]) {
    iri
    id
    label
    ncbigene
    description
    sty
    name_label
    name_source
    name_suppress
    mgdef_description
    mgdef_source
    mgdef_suppress
    mgconso_aui
    mgconso_ispref
    mgconso_stt
    mgconso_ts
    mgconso_label
    mgconso_source
    mgconso_suppress
    mgsat_metaui
    mgsat_stype
    mgsat_identifier
    mgsat_source
    mgsat_value
    mgsat_label
    mgsat_suppress
  }
}
```

#### Example 3: ClinVar query — Retrieve variant information

Fetch clinical variant data from ClinVar, including accession numbers, submission counts, review status, and species.


```graphql
query {
  ClinVar(id: "5378") {
    iri
    label
    accession
    submissions
    status
    species
  }
}
```

#### Example 4: UniProt query — Retrieve protein details

Retrieve detailed protein information from UniProt, including gene name, enzyme classification, sequence, and functional annotations.

```graphql
query {
  UniProt(id: "Q94KE2") {
    label
    mnemonic
    existence
    gene_name
    ec
    sequence
    function
    affinity
    activity
    kinetics
    ph_dependence
  }
}
```

#### Example 5: Nested query — UniProt with linked databases


One of GraphQL's strengths is the ability to follow relationships in a single query. This example retrieves a UniProt protein entry along with its linked ChEBI compounds, Gene Ontology (GO) annotations, and HGNC gene information.

```graphql
query {
  UniProt(id: "Q94KE2") {
    label
    mnemonic
    existence
    gene_name
    ec
    sequence
    function
    affinity
    activity
    kinetics
    ph_dependence
    ChEBI {
      formula
    }
    GO {
      id
      label
      namespace
    }
    HGNC {
      id
      label
      description
      location
    }
  }
}
```

#### Example 6: Cross-database query — ChEMBL with linked ChEBI and UniProt


This example demonstrates a cross-database query starting from a ChEMBL compound. It retrieves the compound's chemical properties and drug development information, along with linked ChEBI identifiers and UniProt protein targets.

```graphql
query {
  ChEMBL(id: "CHEMBL941") {
    label
    smiles
    atc
    alogp
    drug_development_phase
    pchembl
    ChEBI {
      id
      charge
    }
    UniProt {
      mnemonic
      label
      organism
    }
  }
}
```

### Programmatic access

You can also send GraphQL queries programmatically. For example, using `curl`:

```bash
curl -X POST https://rdfportal.org/grasp \
  -H "Content-Type: application/json" \
  -d '{"query": "{ UniProt(id: \"Q94KE2\") { label mnemonic gene_name } }"}'
```

Or using Python with the `requests` library:


```python
import requests

query = """
{
  UniProt(id: "Q94KE2") {
    label
    mnemonic
    gene_name
    ec
  }
}
"""

response = requests.post(
    "https://rdfportal.org/grasp",
    json={"query": query}
)
print(response.json())
```


{% endlang %}

{% lang 'ja' %}
## GraphQL API

RDF Portal は、広く普及している API クエリ言語 [GraphQL](https://graphql.org/) を
使ってライフサイエンスデータセットを検索できる GraphQL API を提供しています。GraphQL API は、スキーマ駆動型の直感的なクエリインターフェースとして SPARQL の代替手段
となり、特に Web アプリケーション開発に慣れた方にとって、RDF データセットから構造
化データを取得しやすくなります。

**サービスURL:** [https://rdfportal.org/grasp](https://rdfportal.org/grasp)

> **注意:** GraphQL API は現在、限られたデータベースのみを対象としています: **UniProt**、**ChEBI**、**ChEMBL**、**MedGen**。今後のアップデートで対応データベースを追加する予定です。

### GraphQL とは

GraphQL は、Facebook（現 Meta）が2012年に開発し、2015年にオープンソースとして公開
した API 向けクエリ言語です。従来の REST API ではエンドポイントごとに固定のデータ
構造が返されるのに対し、GraphQL ではクライアントが必要なフィールドを正確に指定して、1回のリクエストでデータを取得できます。主な利点は以下の通りです。

- **必要なデータだけ取得** — 取得するフィールドを正確に指定でき、不要なデータの過
剰取得を避けられます。
- **単一エンドポイント** — リソースごとに異なるURLを使い分ける必要がなく、すべてのクエリが1つのエンドポイントに送られます。
- **ネストされたクエリ** — データセット間の関係をたどり、複数のエンティティにまた
がる関連データを1つのクエリで取得できます。
- **自己文書化** — スキーマが利用可能なすべての型とフィールドを定義しており、GraphiQL などのツールを通じてインタラクティブに探索できます。

### Grasp: GraphQL-SPARQL ブリッジ

RDF Portal の GraphQL API は、DBCLS が開発したオープンソースのミドルウェア [Grasp](https://github.com/dbcls/grasp) によって実現されています。Grasp は GraphQL と SPARQL の間のブリッジとして機能します。クライアントから GraphQL クエリを受け取り、そ
れを SPARQL クエリに変換し、RDF Portal の SPARQL エンドポイントに対して実行し、結
果を標準的な GraphQL レスポンス形式で返します。

これにより、ユーザーは SPARQL クエリを書く必要なく、RDF Portal 上の豊富な相互リン
クされた RDF データセットを活用できます。Grasp は、複数のデータベースにまたがるク
エリも含めて、変換を透過的に処理します。

Grasp の詳細については、[GitHub リポジトリ](https://github.com/dbcls/grasp) をご参照ください。

### インタラクティブクエリインターフェース

サービスURL [https://rdfportal.org/grasp](https://rdfportal.org/grasp) では、GraphiQL インターフェースを提供しています。GraphiQL は、GraphQL クエリをブラウザ上で記
述・実行できるインタラクティブな IDE です。スキーマの探索、オートコンプリート付き
のクエリ記述、結果の即時確認が可能です。

<!-- TODO: GraphiQL インターフェースのスクリーンショット -->

### クエリ例

以下の例は、GraphQL API を通じて RDF Portal のデータセットにクエリする方法を示しています。

#### 例 1: 基本クエリ — MedGen エントリの取得

特定の ID で MedGen エントリの基本情報を取得します。リンクされた NCBI Gene 識別子
も含みます。

```graphql
query {
  MedGen(id: ["C1835407", "C1835223"]) {
    iri
    id
    label
    ncbigene
  }
}
```

#### 例 2: 詳細クエリ — MedGen の全フィールドの取得

MedGen から、説明、概念名、定義、関連メタデータなど包括的な情報を取得します。

```graphql
query {
  MedGen(id: ["C1835407", "C1835223"]) {
    iri
    id
    label
    ncbigene
    description
    sty
    name_label
    name_source
    name_suppress
    mgdef_description
    mgdef_source
    mgdef_suppress
    mgconso_aui
    mgconso_ispref
    mgconso_stt
    mgconso_ts
    mgconso_label
    mgconso_source
    mgconso_suppress
    mgsat_metaui
    mgsat_stype
    mgsat_identifier
    mgsat_source
    mgsat_value
    mgsat_label
    mgsat_suppress
  }
}
```

#### 例 3: ClinVar クエリ — バリアント情報の取得


ClinVar から臨床バリアントデータを取得します。アクセッション番号、サブミッション数、レビューステータス、種の情報を含みます。

```graphql
query {
  ClinVar(id: "5378") {
    iri
    label
    accession
    submissions
    status
    species
  }
}
```

#### 例 4: UniProt クエリ — タンパク質の詳細情報の取得

UniProt からタンパク質の詳細情報を取得します。遺伝子名、酵素分類、配列、機能アノテーションなどを含みます。

```graphql
query {
  UniProt(id: "Q94KE2") {
    label
    mnemonic
    existence
    gene_name
    ec
    sequence
    function
    affinity
    activity
    kinetics
    ph_dependence
  }
}
```

#### 例 5: ネストクエリ — UniProt とリンクされたデータベース


GraphQL の強みの1つは、1つのクエリで関係をたどれることです。この例では、UniProt のタンパク質エントリと、リンクされた ChEBI 化合物、Gene Ontology（GO）アノテーション、HGNC 遺伝子情報をまとめて取得しています。

```graphql
query {
  UniProt(id: "Q94KE2") {
    label
    mnemonic
    existence
    gene_name
    ec
    sequence
    function
    affinity
    activity
    kinetics
    ph_dependence
    ChEBI {
      formula
    }
    GO {
      id
      label
      namespace
    }
    HGNC {
      id
      label
      description
      location
    }
  }
}
```

#### 例 6: クロスデータベースクエリ — ChEMBL からChEBI・UniProt への横断検索


この例は、ChEMBL の化合物を起点としたクロスデータベースクエリです。化合物の化学的
性質や医薬品開発情報に加え、リンクされた ChEBI 識別子および UniProt のタンパク質ターゲット情報を取得します。

```graphql
query {
  ChEMBL(id: "CHEMBL941") {
    label
    smiles
    atc
    alogp
    drug_development_phase
    pchembl
    ChEBI {
      id
      charge
    }
    UniProt {
      mnemonic
      label
      organism
    }
  }
}
```

### プログラムからのアクセス

GraphQL クエリはプログラムから送信することもできます。例えば、`curl` を使う場合：

```bash
curl -X POST https://rdfportal.org/grasp \
  -H "Content-Type: application/json" \
  -d '{"query": "{ UniProt(id: \"Q94KE2\") { label mnemonic gene_name } }"}'
```

Python の `requests` ライブラリを使う場合：

```python
import requests

query = """
{
  UniProt(id: "Q94KE2") {
    label
    mnemonic
    gene_name
    ec
  }
}
"""

response = requests.post(
    "https://rdfportal.org/grasp",
    json={"query": query}
)
print(response.json())
```


{% endlang %}
