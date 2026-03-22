---
layout: page
title:
  en: Manual
  ja: マニュアル
pageId: manual
parentPageId: documents
description:
  en: manual
  ja: manual
permalink: /documents/manual/
permalink_lang:
  en: /documents/manual/
  ja: /documents/manual/ja/
---

{% lang 'en' %}
## 1. Getting started

### What is RDF Portal?

RDF Portal is a platform for accessing and integrating life science datasets represented in the Resource Description Framework (RDF). It hosts a wide range of RDF datasets covering genomic, proteomic, chemical, disease, and other biomedical domains.

The portal is maintained by the Database Center for Life Science (DBCLS) and provides multiple ways to access data — from browsing and downloading to querying via SPARQL endpoints and AI-assisted interfaces. For more details on the background, history, and mission of RDF Portal, see the [About](https://rdfportal.github.io/website/about/) page.

### Key concepts for beginners

If you are new to RDF and SPARQL, here is a brief introduction to the core concepts.

**RDF (Resource Description Framework)** is a standard model for representing data as a graph. Data is expressed as a collection of statements called *triples*, each consisting of three parts:

  - **Subject** — the entity being described (e.g., a gene, a protein)
  - **Predicate** — the relationship or property (e.g., "has function", "is located in")
  - **Object** — the value or related entity (e.g., a specific function, a chromosome)


Each component is typically identified by a URI (Uniform Resource Identifier), which ensures global uniqueness and allows datasets from different sources to be linked together.

**SPARQL** is the query language for RDF data. It allows you to retrieve, filter, and combine data across RDF datasets. If you are familiar with SQL for relational databases, SPARQL serves a similar role for graph-based RDF data.

**Ontology** is a formal representation of knowledge within a domain, defining the types of entities and the relationships between them. RDF Portal datasets use community-standard ontologies such as Gene Ontology (GO), ChEBI, and Disease Ontology to ensure consistent semantics across datasets.

### Site navigation

The RDF Portal website is organized into the following main sections, accessible from the left sidebar:

![Screenshot: RDF Portal top page showing the sidebar navigation and main content area](/website/assets/images/rdfportal_top_page.png)

| Section | Description |
|---------|-------------|
| **About** | Background information on RDF Portal, its history, and funding |
| **Access methods** | Different ways to query and interact with the data |
| **Datasets** | Browsable list of all hosted RDF datasets |
| **Statistics** | Summary statistics (triples, classes, properties, etc.) for each dataset |
| **Download** | Download RDF data files in various serialization formats |
| **Documents** | Manual, data submission guidelines, and RDF config documentation |
| **Announcements** | News and updates |
| **Update log** | History of data updates |

The site is available in both English and Japanese. You can switch languages using the language link at the bottom of the sidebar.

---

## 2. Browsing datasets

### Dataset list

The [Datasets](https://rdfportal.github.io/website/datasets/) page displays all RDF datasets hosted on the portal. You can use the controls at the top to sort and filter the list.

![Screenshot: Datasets page showing the sort, order, and filter controls](/website/assets/images/rdfportal_datasets_list.png)
<!-- TODO: Replace with actual screenshot of the Datasets page -->

**Sorting options:**

- **Date** — sort by the dataset registration or update date
- **Name** — sort alphabetically by dataset name
- **Triples** — sort by the number of triples (dataset size)

Each sort can be set to descending or ascending order.

**Filtering options:**

- **Tags** — filter by domain category (see the tag list below)
- **Provenance** — filter by data origin
- **Registration** — filter by how the dataset was registered

### Dataset tags

Each dataset is assigned one or more tags indicating its domain category. Tags are displayed with petal-shaped icons for easy visual identification.

<div style="text-align: center;">
  <img src="/website/assets/images/rdfportal_tag_filter.png" alt="Screenshot: Tag filter dropdown" width="50%">
</div>
<!-- TODO: Replace each "🌸" below with the actual petal icon image tag, e.g. <img src="icons/gene.svg" alt="Gene" width="20"> -->

| Icon | Tag | Description |
|------|-----|-------------|
| 🌸 | **Gene** | Datasets related to genes, gene annotations, and gene-level information |
| 🌸 | **Gene expression** | Datasets containing gene expression profiles and transcriptomics data |
| 🌸 | **Genome** | Datasets related to genome sequences and genomic features |
| 🌸 | **Protein** | Datasets related to protein sequences, structures, and functions |
| 🌸 | **Drug/Chemical** | Datasets related to drugs, chemical compounds, and bioactive molecules |
| 🌸 | **Health/Disease** | Datasets related to diseases, clinical variants, and medical information |
| 🌸 | **Glycan** | Datasets related to glycans and carbohydrate structures |
| 🌸 | **Organism** | Datasets related to organism-level information and taxonomy |
| 🌸 | **Cell** | Datasets related to cell-level information |
| 🌸 | **Bioresource** | Datasets related to biological resource collections (culture collections, biobanks) |
| 🌸 | **Polymorphism** | Datasets related to genetic variants, SNPs, and polymorphisms |
| 🌸 | **Sequence** | Datasets related to nucleotide or amino acid sequences |

<!-- TODO: Verify the complete list of tags and replace icon paths with actual petal icon files -->

A single dataset may have multiple tags. For example, Open TG-GATEs is tagged with Gene, Drug/Chemical, Health/Disease, and Gene expression, reflecting its coverage of toxicogenomics data across these domains.

### Provenance

Provenance indicates how the RDF data was created relative to the original data source.

| Value | Description |
|-------|-------------|
| **Original** | RDF data developed by the original database developers themselves. The data provider created the RDF representation of their own data. |
| **Third-party** | RDF data developed by a third party, not by the original database developers. Someone other than the original data provider independently converted the publicly available data into RDF. |

### Registration

Registration indicates how the dataset was added to RDF Portal.

| Value | Description |
|-------|-------------|
| **Submitted** | The dataset was submitted to RDF Portal by the RDF data developers. |
| **Added by RDF Portal** | The dataset was registered by the RDF Portal team. |

### Dataset detail page

Clicking on a dataset name opens its detail page. Each detail page contains the following information:

![Screenshot: Dataset detail page (e.g., DDBJ) showing specifications, statistics](/website/assets/images/rdfportal_dataset_detail.png)

**Dataset specifications** — a table showing metadata about the dataset:

| Field | Description |
|-------|-------------|
| Tags | Domain categories assigned to the dataset |
| Provenance | Whether the data is original or derived |
| Registration | How the dataset was added to RDF Portal |
| Data provider | The organization that provides the data |
| Creator | The creator of the RDF conversion |
| Issued | The date the current version was published |
| Licenses | License information for the dataset |
| Version | The version number of the dataset |
| Download | Link to download the RDF data files |
| SPARQL Endpoint | The SPARQL endpoint URL for querying this dataset |

**Dataset statistics** — summary counts including the total number of triples, subjects, properties, objects, and classes.

**SPARQL example queries** — ready-to-use example queries that demonstrate how to retrieve data from the dataset. Each example includes a description and a "Run on Endpoint" link that opens the query directly in the SPARQL endpoint interface.

<div style="text-align: center;">
  <img src="/website/assets/images/rdfportal_example_query.png" alt="Screenshot: SPARQL example query section with the 'Run on Endpoint' button" width="60%">
</div>

**Schema diagram** — a visual representation of the dataset's RDF schema, showing the classes and properties used in the data. These diagrams are automatically generated from [RDF-config](https://github.com/dbcls/rdf-config), a framework for describing RDF dataset structure in a machine-readable format. RDF-config models are maintained for each dataset hosted on RDF Portal, providing a consistent and practical way to document how the data is organized. In some exceptional cases, schema diagrams may be provided through other means. For more details on RDF-config and its role in RDF Portal, see the [RDF config](https://rdfportal.github.io/website/documents/rdf_config/) documentation.

<div style="text-align: center;">
  <img src="/website/assets/images/ddbj_schema.svg" alt="Screenshot: Schema diagram for a dataset" width="60%">
</div>

---

## 3. Access methods

RDF Portal provides several methods for accessing data, ranging from direct SPARQL queries to AI-assisted natural language interfaces.


### 3a. SPARQL endpoints

SPARQL endpoints allow you to execute SPARQL queries directly against the RDF data. RDF Portal organizes its datasets across multiple SPARQL endpoints, grouped by data source.

For a complete and up-to-date list of available SPARQL endpoints and the datasets they host, see the [SPARQL Endpoints](https://rdfportal.github.io/website/access_methods/sparql_endpoints/) page.


#### Using the SPARQL endpoint in a web browser

Each endpoint provides a web-based query interface. You can access it by visiting the endpoint URL directly (e.g., `https://rdfportal.org/ebi/sparql`). The interface allows you to:

 1. Enter a SPARQL query in the text area
 2. Click "Run" to execute the query
 3. View the results in tabular format

![Screenshot: SPARQL endpoint web interface with a query entered and results displayed](screenshots/sparql_web_interface.png)
<!-- TODO: Replace with actual screenshot of the SPARQL endpoint web interface -->

You can also use the "Run on Endpoint" links provided on each dataset's detail page to execute the example queries directly.

The web interface is powered by two open-source tools developed by DBCLS:

- **[SPARQL proxy](https://github.com/dbcls/sparql-proxy)** — A proxy server that sits in front of SPARQL endpoints, providing query validation, job scheduling for concurrent queries, result caching, and logging. It ensures safe and stable access to the endpoints by filtering out potentially harmful queries and managing query workloads.
- **[Endpoint browser](https://github.com/moriya-dbcls/endpoint_browser)** — A web-based interface for browsing and exploring the structure of RDF data stored in SPARQL endpoints. It allows users to visually navigate classes, properties, and their relationships within datasets.


#### Querying from the command line

You can send SPARQL queries programmatically using tools like `curl`:

```bash
curl -H "Accept: application/sparql-results+json" \
     --data-urlencode "query=SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10" \
     https://rdfportal.org/ebi/sparql
```

Common Accept header values for specifying the response format:

| Format | Accept header |
|--------|--------------|
| JSON | `application/sparql-results+json` |
| XML | `application/sparql-results+xml` |
| CSV | `text/csv` |
| TSV | `text/tab-separated-values` |

#### Querying from Python

```python
from SPARQLWrapper import SPARQLWrapper, JSON

sparql = SPARQLWrapper("https://rdfportal.org/ebi/sparql")
sparql.setQuery("""
    PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?molecule_chemblid ?molecule_label
    FROM <http://rdf.ebi.ac.uk/dataset/chembl>
    WHERE {
        ?Molecule a cco:SmallMolecule ;
            cco:chemblId ?molecule_chemblid ;
            rdfs:label ?molecule_label .
    }
    LIMIT 10
""")
sparql.setReturnFormat(JSON)
results = sparql.query().convert()

for result in results["results"]["bindings"]:
    print(result["molecule_chemblid"]["value"], result["molecule_label"]["value"])
```

To install the required library: `pip install sparqlwrapper`

#### Querying from R

```r
library(SPARQL)

endpoint <- "https://rdfportal.org/ebi/sparql"
query <- "
    PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?molecule_chemblid ?molecule_label
    FROM <http://rdf.ebi.ac.uk/dataset/chembl>
    WHERE {
        ?Molecule a cco:SmallMolecule ;
            cco:chemblId ?molecule_chemblid ;
            rdfs:label ?molecule_label .
    }
    LIMIT 10
"

results <- SPARQL(endpoint, query)
print(results$results)
```

#### Specifying the target graph

Many endpoints host multiple datasets within a single endpoint (e.g., the EBI endpoint hosts ChEBI, ChEMBL, Ensembl, and Reactome). To query a specific dataset, use the `FROM` clause to specify the named graph:

```sparql
SELECT ?s ?p ?o
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s ?p ?o .
}
LIMIT 10
```

To discover which named graphs are available in an endpoint, you can use the following query:

```sparql
SELECT DISTINCT ?g
WHERE {
    GRAPH ?g { ?s ?p ?o }
}
```

### 3b. GraphQL API

*This section will be available once the GraphQL API documentation is published.*

The GraphQL API provides an alternative query interface designed for application developers. It allows schema-based, intuitive query construction and is particularly suitable for frontend application integration.

### 3c. MCP interface (TogoMCP)

*This section will be available once the MCP interface documentation is published.*

TogoMCP is a Model Context Protocol (MCP) interface for AI agents. It enables large language models (LLMs) to understand the structure and content of RDF datasets, allowing them to retrieve accurate data in response to natural language questions.

The TogoMCP server URL is: `https://togomcp.rdfportal.org/mcp`

### 3d. LLM chat interface

*This section will be available once the LLM chat interface documentation is published.*

 *TBA*

### 3e. SPARQL composer

The [SPARQL composer](https://rdfportal.org/composer/) is a tool for generating SPARQL queries through a graphical interface. It is useful for users who want to construct queries visually without writing SPARQL syntax manually.

![Screenshot: SPARQL composer interface](screenshots/sparql_composer.png)
<!-- TODO: Replace with actual screenshot of the SPARQL composer -->

---

## 4. Statistics

The [Statistics](https://rdfportal.github.io/website/statistics/) page provides a summary table showing key metrics for each dataset hosted on RDF Portal.

![Screenshot: Statistics page showing the summary table](screenshots/statistics_page.png)
<!-- TODO: Replace with actual screenshot of the Statistics page -->

### Understanding the statistics table

| Column | Description |
|--------|-------------|
| **Dataset** | The name of the dataset (links to the dataset detail page) |
| **Triples** | The total number of RDF triples in the dataset. This is the primary measure of dataset size. |
| **Classes** | The number of distinct RDF classes (types of entities) defined or used in the dataset. |
| **Properties** | The number of distinct predicates (relationships) used in the dataset. |
| **Subjects** | The number of distinct subject URIs. This roughly corresponds to the number of unique entities described in the dataset. |
| **Objects** | The number of distinct object values (both URIs and literals). |

### Interpreting the numbers

The datasets on RDF Portal vary enormously in size. For example:

- **DDBJ** is the largest dataset with approximately 68.5 billion triples, containing nucleotide sequence data from the DNA Data Bank of Japan.
- **UniProt RDF** contains over 51.3 billion triples of protein sequence and functional information.
- **Nucleic Acid Drug Database** is one of the smallest datasets with 948 triples.

The ratio of classes to properties gives an indication of the dataset's schema complexity. A dataset with many classes and properties (e.g., wwPDB/RDF with 647 classes and 3,823 properties) has a rich, detailed data model, while a dataset with few classes and properties (e.g., PubMed with 2 classes and 5 properties) has a simpler, flatter structure.

---

## 5. Download

The [Download](https://rdfportal.github.io/website/download/) page provides links to download RDF data files for each dataset. Data is available in multiple RDF serialization formats.

![Screenshot: Download page showing the format columns for each dataset](screenshots/download_page.png)
<!-- TODO: Replace with actual screenshot of the Download page -->

### Available formats

| Format | Extension | Description | Best for |
|--------|-----------|-------------|----------|
| **N-Triples** | `.nt` | One triple per line, simple text format | Streaming, bulk loading, line-by-line processing |
| **Turtle** | `.ttl` | Compact, human-readable format with prefix abbreviations | Manual inspection, readability |
| **RDF-XML** | `.rdf` | XML-based serialization | XML toolchains, legacy systems |
| **JSON-LD** | `.jsonld` | JSON-based linked data format | Web applications, JavaScript environments |

### Format availability

Not all formats are available for every dataset. The availability follows these rules:

- **Original submitted files** — Every dataset provides at minimum the RDF files in the format originally submitted by the data provider. This is always available.
- **N-Triples** — In addition to the original format, an N-Triples (`.nt`) version is always generated and provided for every dataset. N-Triples serves as the common baseline format, ensuring that all datasets can be processed uniformly regardless of the original submission format.
- **Other formats (Turtle, RDF-XML, JSON-LD)** — These are provided when available, but are not guaranteed for every dataset. Availability depends on whether the conversion has been performed for that particular dataset.

On the Download page, a dash (—) in a format column indicates that the format is not currently available for that dataset.

### Choosing a format

- For **bulk loading into a triplestore** (e.g., Virtuoso, GraphDB, Apache Jena), N-Triples is generally the fastest format to parse and is always available.
- For **reading and understanding the data structure**, Turtle provides the most human-friendly representation.
- For **web application integration**, JSON-LD is the natural choice as it can be processed directly by JavaScript.
- For **compatibility with XML-based tools**, RDF-XML is appropriate.

### Download URLs

Download links follow the pattern: `https://rdfportal.org/download/{dataset_id}`

For example, to download ChEMBL RDF data: `https://rdfportal.org/download/chembl`

---

## 6. Use cases and tutorials

This section provides practical examples of how to use RDF Portal data for life science research.


### Tutorial 1: Your first SPARQL query

This tutorial walks you through executing a simple SPARQL query to retrieve data from ChEMBL.

**Goal:** List 10 small molecule compounds with their ChEMBL IDs and names.

**Step 1:** Open the EBI SPARQL endpoint at `https://rdfportal.org/ebi/sparql`

![Screenshot: Opening the EBI SPARQL endpoint in a browser](screenshots/tutorial1_step1.png)
<!-- TODO: Replace with actual screenshot -->

**Step 2:** Enter the following query:

```sparql
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?molecule_chemblid ?molecule_label
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?Molecule a cco:SmallMolecule ;
        cco:chemblId ?molecule_chemblid ;
        rdfs:label ?molecule_label .
}
LIMIT 10
```

**Step 3:** Click "Run" to execute the query. You will see a table of results showing ChEMBL IDs and molecule names.

![Screenshot: Query results displayed in the SPARQL endpoint interface](screenshots/tutorial1_step3.png)
<!-- TODO: Replace with actual screenshot -->

**Understanding the query:**

- `PREFIX` lines define namespace abbreviations used in the query
- `SELECT` specifies which variables to return
- `FROM` specifies the named graph (dataset) to query
- `WHERE` defines the pattern to match — here, we look for entities that are typed as `SmallMolecule` and have both a ChEMBL ID and a label
- `LIMIT 10` restricts the output to 10 results

### Tutorial 2: Finding approved drugs for a specific target

**Goal:** Find compounds approved as drugs (development phase 4) that target Tyrosine-protein kinase ABL.

```sparql
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX chembl_target: <http://rdf.ebi.ac.uk/resource/chembl/target/>

SELECT ?molecule_chemblid ?molecule_label
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?Molecule a cco:SmallMolecule ;
        cco:chemblId ?molecule_chemblid ;
        rdfs:label ?molecule_label ;
        cco:highestDevelopmentPhase 4 ;
        cco:hasMechanism ?mechanism .
    ?mechanism cco:hasTarget chembl_target:CHEMBL1862 .
}
LIMIT 100
```

This query combines multiple conditions: filtering by molecule type, development phase, and a specific drug target. Modify `chembl_target:CHEMBL1862` to search for drugs targeting other proteins.

### Tutorial 3: Cross-endpoint federated queries


SPARQL supports federated queries using the `SERVICE` keyword, which allows you to combine data from multiple endpoints in a single query.

**Goal:** Retrieve UniProt protein entries and link them to their corresponding Reactome pathways.

```sparql
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX biopax3: <http://www.biopax.org/release/biopax-level3.owl#>

SELECT ?protein ?proteinName ?pathway ?pathwayName
WHERE {
    SERVICE <https://rdfportal.org/sib/sparql> {
        ?protein a up:Protein ;
            up:mnemonic ?proteinName .
        FILTER(CONTAINS(?proteinName, "HUMAN"))
    }
    SERVICE <https://rdfportal.org/ebi/sparql> {
        ?pathway a biopax3:Pathway ;
            biopax3:displayName ?pathwayName .
    }
}
LIMIT 10
```

> **Note:** Federated queries can be slow depending on the size of the intermediate results. Always use `LIMIT` and apply `FILTER` conditions to reduce the data transferred between endpoints.

### Tutorial 4: Exploring dataset structure

Before writing queries for a new dataset, it is helpful to explore its structure. The following queries can be used with any endpoint.

**List all classes in a dataset:**


```sparql
SELECT DISTINCT ?class (COUNT(?s) AS ?count)
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s a ?class .
}
GROUP BY ?class
ORDER BY DESC(?count)
```

**List all properties used in a dataset:**

```sparql
SELECT DISTINCT ?property (COUNT(?s) AS ?count)
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s ?property ?o .
}
GROUP BY ?property
ORDER BY DESC(?count)
```

**Get sample data for a specific class:**

```sparql
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>

SELECT ?s ?p ?o
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s a cco:SmallMolecule ;
       ?p ?o .
}
LIMIT 20
```

---

## 7. FAQ and troubleshooting

### General questions

**Q: Is RDF Portal free to use?**
A: Yes. RDF Portal is a publicly funded infrastructure and all data access is free of charge. Individual datasets may have their own licenses — check the "Licenses" field on each dataset's detail page.

**Q: How often is the data updated?**
A: Update frequency varies by dataset. Check the [Update log](https://rdfportal.github.io/website/update-log/) page for the latest update history.

**Q: Can I submit my own RDF dataset?**
A: Yes. Please refer to the [Data submission](https://rdfportal.github.io/website/documents/data_submission/) guidelines. All submitted datasets undergo a quality review by DBCLS to ensure compliance with the DBCLS RDF Guidelines.

### SPARQL query issues

**Q: My query is timing out. What should I do?**
A: Try the following approaches:

1. Add a `LIMIT` clause to restrict the number of results
2. Use more specific `FILTER` conditions to narrow the search
3. Avoid `SELECT *` — specify only the variables you need
4. Use `FROM` to target a specific named graph rather than querying the entire endpoint
5. For very large result sets, consider downloading the data files and loading them into a local triplestore

**Q: How do I know which named graph to use in the `FROM` clause?**
A: Each dataset's detail page shows the SPARQL endpoint URL and named graph URI. You can also discover named graphs by running:

```sparql
SELECT DISTINCT ?g WHERE { GRAPH ?g { ?s ?p ?o } }
```

**Q: My query returns no results. What could be wrong?**
A: Common causes include:

1. Incorrect namespace URIs — check the prefix declarations against the dataset's schema diagram
2. Wrong named graph — verify the `FROM` clause matches the dataset's graph URI
3. Case sensitivity — URIs and literal values are case-sensitive in SPARQL
4. Data type mismatches — when filtering by numeric values, ensure the type matches (e.g., integer vs. string)

### Data and licensing

**Q: Can I redistribute the data I download?**
A: This depends on the license of each individual dataset. Check the "Licenses" field on the dataset's detail page. Many datasets are available under open licenses that permit redistribution.

**Q: How should I cite RDF Portal?**
A: Please cite the RDF Portal website URL (https://rdfportal.org/) and the specific dataset(s) you used. For individual datasets, cite the original data providers as specified on each dataset's detail page.

### Contact

For questions, bug reports, or feedback, please contact the DBCLS team through the information provided on the [About](https://rdfportal.github.io/website/about/) page.

{% endlang %}

{% lang 'ja' %}
## 1. はじめに

### RDF Portal とは

RDF Portal は、RDF（Resource Description Framework）で記述されたライフサイエンスデータセットにアクセスし、統合的に利用するためのプラットフォームです。ゲノム、プロテオーム、化学物質、疾患など幅広い生物医学分野のRDFデータセットを収録しています。

本ポータルはライフサイエンス統合データベースセンター（DBCLS）が運営しており、ブラウジングやダウンロードから、SPARQLエンドポイントによるクエリ、AI支援によるインターフェースまで、多様なデータアクセス方法を提供しています。RDF Portal の背景、歴史、ミッションの詳細については [About](https://rdfportal.github.io/website/about/) ページをご覧ください。

### 基本概念（初めての方へ）

RDFやSPARQLが初めての方のために、基本的な概念を簡単に紹介します。

**RDF（Resource Description Framework）** は、データをグラフとして表現するための標準的なモデルです。データは「トリプル」と呼ばれるステートメントの集合として表現され、各トリプルは以下の3つの要素で構成されます。

- **主語（Subject）** — 記述対象のエンティティ（例：遺伝子、タンパク質）
- **述語（Predicate）** — 関係やプロパティ（例：「機能を持つ」「〜に位置する」）
- **目的語（Object）** — 値や関連エンティティ（例：特定の機能、染色体）

各要素は通常、URI（Uniform Resource Identifier）で識別されます。URIによってグローバルな
一意性が保証され、異なるソースのデータセットを相互にリンクすることが可能になります。

**SPARQL** は、RDFデータに対するクエリ言語です。RDFデータセット全体に対してデータの検索
、フィルタリング、結合を行うことができます。リレーショナルデータベースにおけるSQLと同様
の役割を果たします。

**オントロジー** は、特定の分野における知識を形式的に表現したもので、エンティティの種類
とそれらの間の関係を定義します。RDF Portalのデータセットは、Gene Ontology（GO）、ChEBI、Disease Ontologyなどのコミュニティ標準オントロジーを使用しており、データセット間で一貫したセマンティクスを確保しています。

### サイトの構成

RDF Portal ウェブサイトは、左側のサイドバーからアクセスできる以下のセクションで構成され
ています。

![スクリーンショット：RDF Portal トップページ（サイドバーナビゲーションとメインコンテン
ツエリア）](/website/assets/images/rdfportal_top_page.png)

| セクション | 説明 |
|-----------|------|
| **About** | RDF Portalの背景、歴史、資金情報 |
| **Access methods** | データにクエリ・アクセスするための各種方法 |
| **Datasets** | 収録されている全RDFデータセットの一覧 |
| **Statistics** | 各データセットのサマリー統計（トリプル数、クラス数等） |
| **Download** | 各種シリアライズ形式でのRDFデータファイルのダウンロード |
| **Documents** | マニュアル、データ登録ガイドライン、RDF config ドキュメント |
| **Announcements** | お知らせ・ニュース |
| **Update log** | データ更新の履歴 |

サイトは英語と日本語の両方で利用可能です。サイドバー下部の言語リンクから切り替えることができます。

---

## 2. データセットの閲覧

### データセット一覧

[Datasets](https://rdfportal.github.io/website/datasets/) ページでは、ポータルに収録されている全RDFデータセットを一覧表示します。ページ上部のコントロールを使って、ソートやフィ
ルタリングが可能です。

![スクリーンショット：Datasetsページ（ソート、順序、フィルターコントロールの表示）](/website/assets/images/rdfportal_datasets_list.png)

**ソートオプション：**

- **Date** — データセットの登録日または更新日で並べ替え
- **Name** — データセット名でアルファベット順に並べ替え
- **Triples** — トリプル数（データセットのサイズ）で並べ替え

各ソートは昇順・降順の切り替えが可能です。

**フィルターオプション：**

- **Tags** — 分野カテゴリでフィルタ（下記のタグ一覧を参照）
- **Provenance** — データの由来でフィルタ
- **Registration** — データセットの登録方法でフィルタ

### データセットのタグ一覧

各データセットには、分野カテゴリを示す1つ以上のタグが付与されています。タグは花びら型の
アイコンで表示され、視覚的に識別しやすくなっています。

<div style="text-align: center;">
  <img src="/website/assets/images/rdfportal_tag_filter.png" alt="スクリーンショット：タグフィルターのドロップダウン" width="50%">
</div>
<!-- TODO: 下記の各「🌸」を実際の花びらアイコンの画像タグに置き換え（例: <img src="icons/gene.svg" alt="Gene" width="20">） -->

| アイコン | タグ | 説明 |
|---------|------|------|
| 🌸 | **Gene** | 遺伝子、遺伝子アノテーション、遺伝子レベルの情報に関するデータセット |
| 🌸 | **Gene expression** | 遺伝子発現プロファイル、トランスクリプトミクスデータを含む
データセット |
| 🌸 | **Genome** | ゲノム配列やゲノム上の特徴に関するデータセット |
| 🌸 | **Protein** | タンパク質の配列、構造、機能に関するデータセット |
| 🌸 | **Drug/Chemical** | 医薬品、化学物質、生理活性分子に関するデータセット |
| 🌸 | **Health/Disease** | 疾患、臨床バリアント、医療情報に関するデータセット |
| 🌸 | **Glycan** | 糖鎖や糖質構造に関するデータセット |
| 🌸 | **Organism** | 生物種レベルの情報や分類学に関するデータセット |
| 🌸 | **Cell** | 細胞レベルの情報に関するデータセット |
| 🌸 | **Bioresource** | 生物資源コレクション（培養株コレクション、バイオバンク等）に関
するデータセット |
| 🌸 | **Polymorphism** | 遺伝的変異、SNP、多型に関するデータセット |
| 🌸 | **Sequence** | 塩基配列やアミノ酸配列に関するデータセット |

<!-- TODO: タグの完全なリストを確認し、アイコンパスを実際の花びらアイコンファイルに置き
換え -->

1つのデータセットに複数のタグが付与される場合があります。例えば、Open TG-GATEs には Gene、Drug/Chemical、Health/Disease、Gene expression のタグが付与されており、トキシコゲノミ
クスデータがこれらの分野にまたがることを反映しています。

### Provenance（データの由来）

Provenance は、元のデータソースに対してRDFデータがどのように作成されたかを示します。

| 値 | 説明 |
|----|------|
| **Original** | 元のデータベースの開発者自身が作成したオリジナルのRDFデータ。データ提供者が自らのデータのRDF表現を作成したものです。 |
| **Third-party** | 元のデータベースの開発者以外の第三者が作成したRDFデータ。公開されて
いるデータを、データ提供元とは別の開発者が独自にRDFに変換したものです。 |

### Registration（登録方法）

Registration は、データセットがどのようにRDF Portalに登録されたかを示します。

| 値 | 説明 |
|----|------|
| **Submitted** | RDFデータの開発者からRDF Portalにサブミット（提出）されたデータセット
。 |
| **Added by RDF Portal** | RDF Portalチームによって登録されたデータセット。 |

### データセット詳細ページ

データセット名をクリックすると、詳細ページが開きます。各詳細ページには以下の情報が含まれています。

![スクリーンショット：データセット詳細ページ（例：DDBJ）のスペック、統計](/website/assets/images/rdfportal_dataset_detail.png)

**Dataset specifications** — データセットに関するメタデータ：

| フィールド | 説明 |
|-----------|------|
| Tags | データセットに割り当てられた分野カテゴリ |
| Provenance | データがオリジナルか派生かの区分 |
| Registration | RDF Portal への登録方法 |
| Data provider | データを提供する組織 |
| Creator | RDF変換の作成者 |
| Issued | 現在のバージョンの公開日 |
| Licenses | データセットのライセンス情報 |
| Version | データセットのバージョン番号 |
| Download | RDFデータファイルのダウンロードリンク |
| SPARQL Endpoint | このデータセットに対するクエリ用SPARQLエンドポイントのURL |

**Dataset statistics** — トリプル数、主語数、プロパティ数、目的語数、クラス数のサマリー
。

**SPARQL example queries** — データセットからデータを取得する方法を示すサンプルクエリ。
各例には説明と、SPARQLエンドポイントで直接クエリを実行できる「Run on Endpoint」リンクが
含まれています。

<div style="text-align: center;">
  <img src="/website/assets/images/rdfportal_example_query.png" alt="Screenshot: SPARQL example query section with the 'Run on Endpoint' button" width="60%">
</div>

**Schema diagram** — データセットのRDFスキーマを視覚的に表現した図。使用されているクラスとプロパティの関係を示しています。これらの図は、RDFデータセットの構造を機械可読な形式で
記述するフレームワークである [RDF-config](https://github.com/dbcls/rdf-config) から自動的に生成されています。RDF-config のモデルは RDF Portal に収録されている各データセットごとに整備されており、データの構造を一貫した実用的な方法でドキュメント化しています。一部の例外的なケースでは、別の方法でスキーマ図が提供される場合もあります。RDF-config の詳細と RDF Portal における役割については、[RDF config](https://rdfportal.github.io/website/documents/rdf_config/) ドキュメントをご参照ください。

<div style="text-align: center;">
  <img src="/website/assets/images/ddbj_schema.svg" alt="スクリーンショット：データセットのスキーマ" width="60%">
</div>

---

## 3. アクセス方法

RDF Portal では、直接的なSPARQLクエリからAI支援の自然言語インターフェースまで、複数のデ
ータアクセス方法を提供しています。


### 3a. SPARQL エンドポイント

SPARQLエンドポイントを使用すると、RDFデータに対してSPARQLクエリを直接実行できます。RDF Portal では、データソースごとにグループ化された複数のSPARQLエンドポイントを提供しています。

利用可能なSPARQLエンドポイントと、各エンドポイントに収録されているデータセットの最新の一覧は、[SPARQL Endpoints](https://rdfportal.github.io/website/access_methods/sparql_endpoints/) ページをご参照ください。


#### ウェブブラウザでの利用

各エンドポイントはウェブベースのクエリインターフェースを提供しています。エンドポイントのURLに直接アクセスすると利用できます（例：`https://rdfportal.org/ebi/sparql`）。

 1. テキストエリアにSPARQLクエリを入力します
 2. 「Run」をクリックしてクエリを実行します
 3. 結果が表形式で表示されます


![スクリーンショット：SPARQLエンドポイントのウェブインターフェース（クエリ入力と結果表示）](screenshots/sparql_web_interface.png)
<!-- TODO: SPARQLエンドポイントウェブインターフェースの実際のスクリーンショットに置き換
え -->

各データセットの詳細ページにある「Run on Endpoint」リンクを使えば、サンプルクエリをエンドポイントで直接実行することもできます。

このウェブインターフェースは、DBCLSが開発した以下の2つのオープンソースツールによって構成されています。

- **[SPARQL proxy](https://github.com/dbcls/sparql-proxy)** — SPARQLエンドポイントの前段に配置されるプロキシサーバーです。クエリの安全性検証、同時実行クエリのジョブスケジューリング、結果のキャッシュ、ログ記録などの機能を提供します。有害な可能性のあるクエリをフィルタリングし、クエリの負荷を管理することで、エンドポイントへの安全で安定したアクセスを確保します。
- **[Endpoint browser](https://github.com/moriya-dbcls/endpoint_browser)** — SPARQLエンドポイントに格納されているRDFデータの構造を閲覧・探索するためのウェブベースインターフェースです。データセット内のクラス、プロパティ、およびそれらの関係を視覚的にナビゲートすることができます。


#### コマンドラインからのクエリ

`curl` などのツールを使って、プログラムからSPARQLクエリを送信できます。

```bash
curl -H "Accept: application/sparql-results+json" \
     --data-urlencode "query=SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10" \
     https://rdfportal.org/ebi/sparql
```

レスポンス形式を指定するための Accept ヘッダー値：

| 形式 | Accept ヘッダー |
|------|----------------|
| JSON | `application/sparql-results+json` |
| XML | `application/sparql-results+xml` |
| CSV | `text/csv` |
| TSV | `text/tab-separated-values` |

#### Python からのクエリ

```python
from SPARQLWrapper import SPARQLWrapper, JSON

sparql = SPARQLWrapper("https://rdfportal.org/ebi/sparql")
sparql.setQuery("""
    PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?molecule_chemblid ?molecule_label
    FROM <http://rdf.ebi.ac.uk/dataset/chembl>
    WHERE {
        ?Molecule a cco:SmallMolecule ;
            cco:chemblId ?molecule_chemblid ;
            rdfs:label ?molecule_label .
    }
    LIMIT 10
""")
sparql.setReturnFormat(JSON)
results = sparql.query().convert()

for result in results["results"]["bindings"]:
    print(result["molecule_chemblid"]["value"], result["molecule_label"]["value"])
```

必要なライブラリのインストール：`pip install sparqlwrapper`

#### R からのクエリ

```r
library(SPARQL)

endpoint <- "https://rdfportal.org/ebi/sparql"
query <- "
    PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?molecule_chemblid ?molecule_label
    FROM <http://rdf.ebi.ac.uk/dataset/chembl>
    WHERE {
        ?Molecule a cco:SmallMolecule ;
            cco:chemblId ?molecule_chemblid ;
            rdfs:label ?molecule_label .
    }
    LIMIT 10
"

results <- SPARQL(endpoint, query)
print(results$results)
```

#### 対象グラフの指定

多くのエンドポイントでは、1つのエンドポイント内に複数のデータセットが収録されています（
例：EBIエンドポイントにはChEBI、ChEMBL、Ensembl、Reactomeが含まれます）。特定のデータセ
ットにクエリするには、`FROM` 句で名前付きグラフを指定します。

```sparql
SELECT ?s ?p ?o
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s ?p ?o .
}
LIMIT 10
```

エンドポイント内で利用可能な名前付きグラフを確認するには、以下のクエリを使用します。

```sparql
SELECT DISTINCT ?g
WHERE {
    GRAPH ?g { ?s ?p ?o }
}
```

### 3b. GraphQL API

*GraphQL API のドキュメントが公開され次第、このセクションを更新します。*

GraphQL API は、アプリケーション開発者向けの代替クエリインターフェースです。スキーマに基づいた直感的なクエリ構築が可能で、フロントエンドアプリケーションとの統合に適しています。

### 3c. MCP インターフェース（TogoMCP）

*MCP インターフェースのドキュメントが公開され次第、このセクションを更新します。*

TogoMCP は、AIエージェント向けの Model Context Protocol（MCP）インターフェースです。大規模言語モデル（LLM）がRDFデータセットの構造と内容を理解し、自然言語の質問に対して正確なデータを取得できるようにします。

TogoMCP サーバーURL: `https://togomcp.rdfportal.org/mcp`

### 3d. LLM チャットインターフェース

*LLM チャットインターフェースのドキュメントが公開され次第、このセクションを更新します。*

*TBA*

### 3e. SPARQL composer

[SPARQL composer](https://rdfportal.org/composer/) は、グラフィカルなインターフェースを
通じてSPARQLクエリを生成するツールです。SPARQL構文を手書きせずに、視覚的にクエリを構築したいユーザーに便利です。

![スクリーンショット：SPARQL composerインターフェース](screenshots/sparql_composer.png)
<!-- TODO: SPARQL composerの実際のスクリーンショットに置き換え -->

---

## 4. 統計情報

[Statistics](https://rdfportal.github.io/website/statistics/) ページでは、RDF Portal に
収録されている各データセットの主要な統計情報をまとめた表を提供しています。

![スクリーンショット：Statisticsページ（サマリーテーブルの表示）](screenshots/statistics_page.png)
<!-- TODO: Statisticsページの実際のスクリーンショットに置き換え -->

### 統計テーブルの読み方

| 列名 | 説明 |
|------|------|
| **Dataset** | データセット名（データセット詳細ページへのリンク） |
| **Triples** | データセット内のRDFトリプルの総数。データセットサイズの主要な指標です。 |
| **Classes** | データセットで定義または使用されている個別のRDFクラス（エンティティの種
類）の数。 |
| **Properties** | データセットで使用されている個別の述語（関係）の数。 |
| **Subjects** | 個別の主語URIの数。データセット内で記述されているユニークなエンティティの数におおよそ対応します。 |
| **Objects** | 個別の目的語の値（URIとリテラルの両方）の数。 |

### 数値の解釈

RDF Portal のデータセットはサイズが大きく異なります。例えば：

- **DDBJ** は約685億トリプルを持つ最大のデータセットで、日本DNAデータバンクの塩基配列デ
ータを含んでいます。
- **UniProt RDF** は513億以上のトリプルを含み、タンパク質配列と機能情報を提供しています
。
- **Nucleic Acid Drug Database** は948トリプルの最小規模のデータセットの一つです。

クラス数とプロパティ数の比率は、データセットのスキーマの複雑さを示します。クラス数・プロパティ数が多いデータセット（例：wwPDB/RDF は647クラス、3,823プロパティ）は詳細なデータモデルを持ち、少ないデータセット（例：PubMed は2クラス、5プロパティ）はよりシンプルなフラ
ットな構造です。

---

## 5. ダウンロード

[Download](https://rdfportal.github.io/website/download/) ページでは、各データセットのRDFデータファイルをダウンロードするためのリンクを提供しています。データは複数のRDFシリアライズ形式で利用可能です。

![スクリーンショット：Downloadページ（各データセットのフォーマット列表示）](screenshots/download_page.png)
<!-- TODO: Downloadページの実際のスクリーンショットに置き換え -->

### 利用可能な形式

| 形式 | 拡張子 | 説明 | 適した用途 |
|------|--------|------|-----------|
| **N-Triples** | `.nt` | 1行に1トリプルのシンプルなテキスト形式 | ストリーミング、一括
読み込み、行単位の処理 |
| **Turtle** | `.ttl` | プレフィックス省略を用いたコンパクトで人間が読みやすい形式 | 内
容の確認、可読性重視の用途 |
| **RDF-XML** | `.rdf` | XMLベースのシリアライズ形式 | XMLツールチェーン、レガシーシステム |
| **JSON-LD** | `.jsonld` | JSONベースのLinked Data形式 | Webアプリケーション、JavaScript環境 |

### 形式の提供ポリシー

すべての形式がすべてのデータセットで利用可能なわけではありません。提供状況は以下のルールに従います。

- **サブミットされたオリジナルファイル** — 各データセットは、データ提供者が元々サブミッ
トした形式のRDFファイルを最低限提供します。これは常に利用可能です。
- **N-Triples** — オリジナル形式に加えて、N-Triples（`.nt`）形式のファイルがすべてのデータセットに対して必ず生成・提供されます。N-Triples は共通の基本形式として機能し、元のサブミット形式に関わらず、すべてのデータセットを統一的に処理できることを保証します。
- **その他の形式（Turtle、RDF-XML、JSON-LD）** — 利用可能な場合に提供されますが、すべて
のデータセットでの提供は保証されていません。提供の有無は、当該データセットについて形式変換が実施されているかどうかに依存します。

Downloadページで、フォーマット列にダッシュ（—）が表示されている場合、そのデータセットで
は当該形式が現在利用できないことを意味します。

### 形式の選び方

- **トリプルストア（Virtuoso、GraphDB、Apache Jena 等）への一括読み込み**には、パース速
度の面でN-Triplesが一般的に最適で、かつ常に利用可能です。
- **データ構造の確認・理解**には、Turtleが最も人間にとって読みやすい表現を提供します。
- **Webアプリケーションとの統合**には、JavaScriptで直接処理できるJSON-LDが自然な選択です。
- **XMLベースのツールとの互換性**が必要な場合は、RDF-XMLが適切です。

### ダウンロードURL

ダウンロードリンクのパターン：`https://rdfportal.org/download/{dataset_id}`

例えば、ChEMBL RDFデータのダウンロード：`https://rdfportal.org/download/chembl`

---

## 6. ユースケースとチュートリアル

このセクションでは、ライフサイエンス研究におけるRDF Portalデータの実践的な活用例を紹介します。

### チュートリアル 1：はじめてのSPARQLクエリ

このチュートリアルでは、ChEMBLからデータを取得するシンプルなSPARQLクエリの実行手順を説明します。

**目標：** 低分子化合物10件のChEMBL IDと名称を取得する。

**ステップ 1：** EBI SPARQLエンドポイント `https://rdfportal.org/ebi/sparql` を開きます
。

![スクリーンショット：EBI SPARQLエンドポイントをブラウザで開いた状態](screenshots/tutorial1_step1.png)
<!-- TODO: 実際のスクリーンショットに置き換え -->

**ステップ 2：** 以下のクエリを入力します。

```sparql
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?molecule_chemblid ?molecule_label
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?Molecule a cco:SmallMolecule ;
        cco:chemblId ?molecule_chemblid ;
        rdfs:label ?molecule_label .
}
LIMIT 10
```

**ステップ 3：** 「Run」をクリックしてクエリを実行します。ChEMBL IDと分子名が表示されま
す。

![スクリーンショット：SPARQLエンドポイントインターフェースに表示されたクエリ結果](screenshots/tutorial1_step3.png)
<!-- TODO: 実際のスクリーンショットに置き換え -->

**クエリの解説：**

- `PREFIX` 行はクエリ内で使用する名前空間の省略形を定義します
- `SELECT` は返す変数を指定します
- `FROM` はクエリ対象の名前付きグラフ（データセット）を指定します
- `WHERE` はマッチするパターンを定義します — ここでは `SmallMolecule` という型を持ち、ChEMBL IDとラベルの両方を持つエンティティを探しています
- `LIMIT 10` は結果を10件に制限します

### チュートリアル 2：特定のターゲットに対する承認薬の検索

**目標：** チロシンプロテインキナーゼABLをターゲットとする承認済み医薬品（開発フェーズ4
）を検索する。

```sparql
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX chembl_target: <http://rdf.ebi.ac.uk/resource/chembl/target/>

SELECT ?molecule_chemblid ?molecule_label
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?Molecule a cco:SmallMolecule ;
        cco:chemblId ?molecule_chemblid ;
        rdfs:label ?molecule_label ;
        cco:highestDevelopmentPhase 4 ;
        cco:hasMechanism ?mechanism .
    ?mechanism cco:hasTarget chembl_target:CHEMBL1862 .
}
LIMIT 100
```

このクエリは、分子の種類、開発フェーズ、特定の薬物ターゲットという複数の条件を組み合わせています。`chembl_target:CHEMBL1862` を変更することで、他のタンパク質をターゲットとする
薬物を検索できます。

### チュートリアル 3：クロスエンドポイントのフェデレーテッドクエリ

SPARQLは `SERVICE` キーワードを使ったフェデレーテッドクエリをサポートしており、単一のク
エリで複数のエンドポイントのデータを組み合わせることができます。

**目標：** UniProtのタンパク質エントリを取得し、対応するReactomeパスウェイとリンクする。

```sparql
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX biopax3: <http://www.biopax.org/release/biopax-level3.owl#>

SELECT ?protein ?proteinName ?pathway ?pathwayName
WHERE {
    SERVICE <https://rdfportal.org/sib/sparql> {
        ?protein a up:Protein ;
            up:mnemonic ?proteinName .
        FILTER(CONTAINS(?proteinName, "HUMAN"))
    }
    SERVICE <https://rdfportal.org/ebi/sparql> {
        ?pathway a biopax3:Pathway ;
            biopax3:displayName ?pathwayName .
    }
}
LIMIT 10
```

> **注意：** フェデレーテッドクエリは中間結果のサイズによっては遅くなる場合があります。
常に `LIMIT` を使用し、`FILTER` 条件を適用してエンドポイント間で転送されるデータ量を削減してください。

### チュートリアル 4：データセット構造の探索

新しいデータセットに対するクエリを書く前に、その構造を探索すると便利です。以下のクエリはどのエンドポイントでも使用できます。

**データセット内の全クラスを一覧表示：**

```sparql
SELECT DISTINCT ?class (COUNT(?s) AS ?count)
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s a ?class .
}
GROUP BY ?class
ORDER BY DESC(?count)
```

**データセット内で使用されている全プロパティを一覧表示：**

```sparql
SELECT DISTINCT ?property (COUNT(?s) AS ?count)
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s ?property ?o .
}
GROUP BY ?property
ORDER BY DESC(?count)
```

**特定クラスのサンプルデータを取得：**

```sparql
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#>

SELECT ?s ?p ?o
FROM <http://rdf.ebi.ac.uk/dataset/chembl>
WHERE {
    ?s a cco:SmallMolecule ;
       ?p ?o .
}
LIMIT 20
```

---

## 7. FAQ・トラブルシューティング

### 一般的な質問

**Q: RDF Portal は無料で利用できますか？**
A: はい。RDF Portal は公的資金で運営されているインフラストラクチャであり、すべてのデータアクセスは無料です。個々のデータセットには独自のライセンスが設定されている場合があります。各データセットの詳細ページの「Licenses」フィールドをご確認ください。

**Q: データはどのくらいの頻度で更新されますか？**
A: 更新頻度はデータセットによって異なります。最新の更新履歴は [Update log](https://rdfportal.github.io/website/update-log/) ページでご確認ください。

**Q: 自分のRDFデータセットを登録できますか？**
A: はい。[Data submission](https://rdfportal.github.io/website/documents/data_submission/) ガイドラインをご参照ください。登録されたデータセットはすべて、DBCLS RDFガイドラインへの準拠を確認するためのDBCLSによる品質レビューを受けます。

### SPARQLクエリに関する問題

**Q: クエリがタイムアウトします。どうすればよいですか？**
A: 以下の方法をお試しください。

1. `LIMIT` 句を追加して結果数を制限する
2. より具体的な `FILTER` 条件で検索範囲を絞り込む
3. `SELECT *` を避け、必要な変数のみを指定する
4. `FROM` を使って特定の名前付きグラフに対象を限定する（エンドポイント全体にクエリしない）
5. 非常に大きな結果セットの場合は、データファイルをダウンロードしてローカルのトリプルス
トアに読み込むことを検討する

**Q: `FROM` 句で使うべき名前付きグラフはどうやって確認できますか？**
A: 各データセットの詳細ページにSPARQLエンドポイントURLと名前付きグラフURIが記載されてい
ます。以下のクエリで名前付きグラフを確認することもできます。

```sparql
SELECT DISTINCT ?g WHERE { GRAPH ?g { ?s ?p ?o } }
```

**Q: クエリが結果を返しません。何が問題ですか？**
A: よくある原因：

1. 名前空間URIの誤り — プレフィックス宣言がデータセットのスキーマ図と一致しているか確認
してください
2. 名前付きグラフの誤り — `FROM` 句がデータセットのグラフURIと一致しているか確認してください
3. 大文字・小文字の区別 — SPARQLではURIとリテラル値は大文字小文字が区別されます
4. データ型の不一致 — 数値でフィルタリングする場合、型が一致しているか確認してください（例：整数型 vs 文字列型）

### データとライセンス

**Q: ダウンロードしたデータを再配布できますか？**
A: 各データセットのライセンスによって異なります。データセット詳細ページの「Licenses」フ
ィールドをご確認ください。多くのデータセットは再配布を許可するオープンライセンスで提供されています。

**Q: RDF Portal をどのように引用すればよいですか？**
A: RDF Portal のウェブサイトURL（https://rdfportal.org/）と使用した特定のデータセットを
引用してください。個々のデータセットについては、各データセットの詳細ページに記載されている元のデータ提供者を引用してください。

### お問い合わせ

ご質問、バグ報告、フィードバックについては、[About](https://rdfportal.github.io/website/about/) ページに記載されている連絡先情報を通じてDBCLSチームにお問い合わせください。
{% endlang %}
