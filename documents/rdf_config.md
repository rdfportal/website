---
layout: page
title:
  en: About RDF config
  ja: RDF config の概要
pageId: rdf_config
parentPageId: documents
description:
  en: RDF config
  ja: RDF config
permalink: /documents/rdf_config/
permalink_lang:
  en: /documents/rdf_config/
  ja: /documents/rdf_config/ja/
---

{% lang 'en' %}
### Introduction: The Role of rdf-config in RDF Portal

RDF Portal is a service operated by the **[Database Center for Life Science](https://dbcls.rois.ac.jp/)** (DBCLS) that aggregates and provides RDF datasets developed by a wide range of research organizations, primarily in the life sciences. These datasets have been created with diverse objectives, modeling choices, and design philosophies, reflecting the assumptions and intentions of their original developers.

While RDF provides a flexible and expressive framework for publishing data, this flexibility also makes it difficult to understand how individual datasets are structured and how they are intended to be used. Even when ontologies are available, they do not always convey which graph patterns represent meaningful units of data or how entities are typically connected. As a result, both human users and software tools are often required to infer dataset structure through trial and error.

**[RDF-config](https://github.com/dbcls/rdf-config)** was introduced in RDF Portal to address this challenge by providing explicit, machine-readable descriptions of RDF dataset structure. Rather than aiming for a complete formal specification, rdf-config focuses on offering a practical and maintainable way to describe how RDF data is organized. This document explains the motivation behind rdf-config, its role within RDF Portal, and how it supports consistent use and reuse of RDF data across the platform.

### What Is RDF-config?

RDF-config is a framework for describing the structure of RDF datasets in an explicit and practical manner. It was developed in the context of operating RDF Portal, where large numbers of heterogeneous RDF datasets are collected, curated, and reused across domains. Its primary purpose is to make RDF data structure visible and machine-readable without introducing unnecessary complexity.

The motivation behind RDF-config is aligned with that of established RDF shape technologies such as ShEX and SHACL. These approaches share a common understanding that RDF data becomes significantly more usable when its structure is made explicit. Knowing how graph patterns correspond to database records, how resources are connected, and which properties play central roles is essential for reuse, integration, and automation.

At the same time, RDF-config was designed with a specific operational context in mind. RDF Portal hosts datasets created by many different research groups over extended periods of time. In such an environment, structural models must be easy to write, easy to understand, and easy to maintain. RDF-config therefore focuses on describing dataset structure in a simple and consistent way, rather than attempting to express every possible constraint.

Because RDF-config models are lightweight, they can be created and curated as part of normal portal operations. This makes them well suited for use at scale, where consistency and maintainability are critical. When needed, RDF-config models can also serve as a basis for further formalization, for example by generating ShEX schemas for validation-oriented use cases.

Within RDF Portal, rdf-config functions as a shared structural language that connects diverse RDF datasets to the portal’s services and tools. By ensuring that each dataset is accompanied by an explicit structural description, RDF Portal becomes not just a collection of RDF graphs, but a platform that understands how those graphs are shaped.

### The Role of rdf-config in RDF Portal

Within RDF Portal, RDF-config is not treated as optional metadata or supplementary documentation. It plays a central role in how the portal understands, manages, and exposes RDF datasets. This reflects a deliberate design choice: RDF Portal is intended to be more than a passive collection of RDF graphs. It is a platform that maintains explicit knowledge about the structure of the data it hosts.

RDF Portal aggregates RDF datasets developed by many independent research organizations, each reflecting different modeling decisions and domain-specific priorities. Without a shared structural layer, the portal would effectively become a loose collection of unrelated graphs, requiring users and tools to rediscover structure for each dataset independently. rdf-config provides this shared layer by offering a consistent way to describe dataset structure across the portal.

By maintaining RDF-config models for each dataset, RDF Portal is able to associate RDF data with explicit descriptions of how it is organized. Structural knowledge thus becomes a shared resource of the platform rather than an implicit property of individual datasets. This allows portal-level services to rely on common structural assumptions without embedding dataset-specific logic.

In practice, RDF-config metadata is used to support several core services provided by RDF Portal. For example, rdf-config models are used to automatically generate schema diagrams that visualize the structure of RDF datasets. These diagrams help users quickly grasp how entities are organized and related, without requiring them to inspect the underlying RDF directly.

RDF-config is also used to generate configuration files for **[Grasp](https://github.com/dbcls/grasp)**, a bridge software that provides a GraphQL endpoint wrapping SPARQL endpoints. By deriving Grasp configuration from rdf-config models, RDF Portal can expose RDF datasets through a GraphQL interface in a consistent and maintainable way, without manually crafting dataset-specific settings.

In addition, RDF-config metadata is utilized by the **[SPARQL composer](https://rdfportal.org/composer/)**, an interface for interactively generating SPARQL queries. By relying on explicit structural descriptions, the composer can guide users in constructing valid and meaningful queries, even when they are unfamiliar with the internal structure of a dataset.

Through these uses, rdf-config enables RDF Portal to treat heterogeneous datasets in a coherent way, without forcing them into a single rigid schema. The result is a balance between diversity and consistency: datasets retain their individual modeling choices, while the portal provides a unified structural framework for understanding and reuse.

### Automated Processing Enabled by RDF-config

A major consequence of introducing rdf-config into RDF Portal is that dataset structure becomes available for automated processing. When RDF data structure is explicitly described in a machine-readable form, tasks that would otherwise require manual, dataset-specific handling can be generalized.

Traditionally, automated RDF tools rely on implicit assumptions about data structure. Developers inspect datasets, identify recurring graph patterns, and encode this knowledge directly into software. While this approach can work for individual datasets, it does not scale in an environment like RDF Portal, where many heterogeneous datasets coexist and continue to evolve.

RDF-config addresses this limitation by making structural knowledge explicit and discoverable. Tools can consult RDF-config models to determine how resources are organized, which entities play central roles, and how relationships are typically expressed. This enables a more adaptable and data-driven approach to automation, in which tools respond to dataset structure rather than hardcoded expectations.

Within RDF Portal, this capability supports a wide range of automated processes. These include the generation of dataset-aware user interfaces, the construction of SPARQL queries guided by dataset structure, and the transformation or export of data in a consistent manner across datasets. Because RDF-config models follow a common pattern, the same tools can be applied to many datasets with minimal adjustment.

This structural foundation becomes even more important when RDF Portal is connected to external services and intelligent agents. One such service is **[TogoMCP](https://togomcp.rdfportal.org/)**, which enables large language models and other AI systems to interact with RDF Portal through a standardized interface. In this context, RDF-config provides reliable structural guidance that allows AI systems to ground their interactions in explicit dataset models rather than relying solely on inference.

AI systems are powerful but sensitive to ambiguity. Without explicit structural information, AI-driven interaction with RDF data can become inefficient or error-prone. By providing clear descriptions of dataset structure, RDF-config helps mitigate this risk and supports more stable and predictable use of RDF data by AI-based tools.

By treating structure as a first-class resource, RDF-config underpins both current services and future extensions of RDF Portal. It provides a stable reference point that supports incremental development of automated and intelligent services, while allowing RDF datasets themselves to evolve independently.

{% endlang %}

{% lang 'ja' %}
### はじめに

RDF Portalは、ライフサイエンス分野を中心に、幅広い研究機関によって開発された RDF データセットを集約・提供する、**[Database Center for Life Science](https://dbcls.rois.ac.jp/)**（DBCLS）が運営するサービスである。これらのデータセットは、多様な目的、モデリング上の選択、設計思想に基づいて作成されており、それぞれの元の開発者が持っていた前提や意図を反映している。

RDF は、データ公開のための柔軟で表現力の高い枠組みを提供する一方で、その柔軟性ゆえに、個々のデータセットがどのような構造を持ち、どのように利用されることを意図しているのかを理解することを難しくしている。たとえオントロジーが提供されていたとしても、どのようなグラフパターンが意味のあるデータ単位を表しているのか、エンティティ同士が通常どのように結び付けられているのかが、必ずしも伝わるとは限らない。その結果、人間の利用者もソフトウェアツールも、試行錯誤を通じてデータセット構造を推測せざるを得ない場合が多い。

**[RDF-config](https://github.com/dbcls/rdf-config)** は、この課題に対処するために RDF Portal に導入されたものであり、RDF データセットの構造を明示的かつ機械可読な形で記述する手段を提供する。完全に形式化された仕様を目指すのではなく、RDF-config は、RDF データがどのように組織化されているかを、実用的かつ保守しやすい形で記述することに焦点を当てている。本ドキュメントでは、RDF-config が導入された背景、その RDF Portal における役割、そしてプラットフォーム全体にわたって RDF データの一貫した利用と再利用をどのように支えているのかを説明する。

### RDF-config とは

RDF-config は、RDF データセットの構造を明示的かつ実用的に記述するためのフレームワークである。これは、多数の異種 RDF データセットが収集・キュレーションされ、分野横断的に再利用される RDF Portal の運用という文脈の中で開発された。その主な目的は、不必要な複雑さを持ち込むことなく、RDF データの構造を可視化し、機械可読にすることである。

RDF-config の背景にある動機は、ShEX や SHACL といった既存の RDF shape 技術のそれと整合している。これらのアプローチはいずれも、RDF データはその構造が明示されることで、著しく利用しやすくなるという共通の理解に基づいている。グラフパターンがどのようにレコードに対応しているのか、リソース同士がどのように接続されているのか、どのプロパティが中心的な役割を果たしているのかを把握することは、再利用、統合、自動化にとって不可欠である。

一方で、RDF-config は特定の運用環境を強く意識して設計されている。RDF Portal には、長期間にわた多くの異なる研究グループによって作成されたデータセットが収録されている。このような環境では、構造モデルは記述しやすく、理解しやすく、保守しやすいものでなければならない。そのため RDF-config は、あらゆる制約を表現しようとするのではなく、データセット構造を簡潔かつ一貫した方法で記述することに重点を置いている。

RDF-config モデルは軽量であるため、ポータルの日常的な運用の一部として作成・キュレーションすることができる。この点は、一貫性と保守性が特に重要となる大規模運用に適している。また、必要に応じて、RDF-config モデルはさらなる形式化の基盤としても利用できる。たとえば、検証を重視したユースケースに向けて、ShEX スキーマを生成することも可能である。

RDF Portal において、RDF-config は、多様な RDF データセットとポータルのサービスやツール群とを結び付ける、共通の構造言語として機能している。各データセットに明示的な構造記述を必ず付随させることで、RDF Portal は単なる RDF グラフの集合体ではなく、それらのグラフがどのような形をしているのかを理解するプラットフォームとなっている。

### RDF Portal における RDF-config の役割

RDF Portalにおいて、RDF-config は任意のメタデータや補助的なドキュメントとして扱われているわけではない。むしろ、ポータルが RDF データセットをどのように理解し、管理し、公開するかという点において、中心的な役割を担っている。これは意図的な設計上の選択を反映したものである。すなわち、RDF Portal は RDF グラフを受動的に集めただけの集合体ではなく、収録しているデータの構造について明示的な知識を保持するプラットフォームとして構想されている。

RDF Portal は、多くの独立した研究機関によって開発された RDF データセットを集約しており、それぞれが異なるモデリング上の判断や分野固有の優先事項を反映している。共通の構造レイヤーがなければ、ポータルは事実上、無関係なグラフの緩やかな集合体となり、利用者やツールはデータセットごとに独立して構造を再発見しなければならなくなる。RDF-config は、ポータル全体にわたって一貫した方法でデータセット構造を記述することにより、この共有レイヤーを提供している。

各データセットについて RDF-config モデルを維持することで、RDF Portal は、RDF データを「どのような構造で組織化されているか」という明示的な記述と結び付けることができる。その結果、構造的知識は、個々のデータセットに暗黙的に内在する性質ではなく、プラットフォーム全体で共有されるリソースとなる。これにより、ポータルレベルのサービスは、データセット固有のロジックを埋め込むことなく、共通の構造的前提に基づいて動作できるようになる。

実際の運用において、RDF-config のメタデータは、RDF Portal が提供するいくつかの中核的サービスを支えるために利用されている。たとえば、RDF-config モデルは、RDF データセットの構造を可視化するスキーマ図を自動生成するために用いられている。これらの図は、基盤となる RDF を直接確認しなくても、エンティティがどのように構成され、どのように関連付けられているのかを、利用者が迅速に把握する助けとなる。

また、RDF-config は、SPARQL エンドポイントを GraphQL エンドポイントとして提供するためのブリッジソフトウェアである Grasp の設定ファイルを生成する用途にも利用されている。RDF-config モデルから **[Grasp](https://github.com/dbcls/grasp)** の設定を導出することで、RDF Portal は、データセットごとに手作業で設定を作成することなく、一貫性と保守性を保った形で RDF データセットを GraphQL インタフェースとして公開できる。

さらに、RDF-config のメタデータは、SPARQL クエリを対話的に生成するためのインタフェースである **[SPARQL composer](https://rdfportal.org/composer/)**によっても活用されている。明示的な構造記述に基づくことで、利用者がデータセットの内部構造に詳しくなくても、意味のある妥当なクエリを構築できるよう支援する。

これらの利用を通じて、RDF-config は、異種混在のデータセットを単一の硬直したスキーマに押し込めることなく、RDF Portal がそれらを整合的に扱うことを可能にしている。その結果として得られるのは、多様性と一貫性のバランスである。各データセットは独自のモデリング上の選択を保持しつつ、ポータルは理解と再利用のための統一的な構造フレームワークを提供する。

### RDF-config によって可能となる自動処理

RDF Portalに RDF-config を導入したことによる主要な効果の一つは、データセット構造が自動処理に利用可能になる点である。RDF データの構造が機械可読な形で明示的に記述されることで、これまで手作業やデータセット固有の対応を必要としていた作業を、一般化できるようになる。

従来、自動化された RDF ツールは、データ構造に関する暗黙的な前提に依存してきた。開発者がデータセットを調査し、繰り返し現れるグラフパターンを特定し、その知識をソフトウェアに直接組み込むという方法である。このアプローチは個別のデータセットに対しては機能する場合もあるが、多数の異種データセットが共存し、かつ継続的に進化する RDF Portal のような環境では、スケールしない。

RDF-config は、構造的知識を明示的かつ発見可能なものにすることで、この制約を解消する。ツールは RDF-config モデルを参照することで、リソースがどのように組織化されているのか、どのエンティティが中心的な役割を果たしているのか、関係が通常どのように表現されているのかを判断できる。これにより、ツールがあらかじめ埋め込まれた期待に従うのではなく、データセットの構造に応じて振る舞う、より適応的でデータ駆動型の自動化が可能となる。

RDF Portal において、この能力は幅広い自動処理を支えている。具体的には、データセットの構造を考慮したユーザインタフェースの生成、データセット構造に基づいてガイドされる SPARQL クエリの構築、そしてデータセット間で一貫性のある形でのデータ変換やエクスポートなどが含まれる。RDF-config モデルは共通のパターンに従っているため、同一のツールを最小限の調整で多数のデータセットに適用できる。

この構造的基盤は、RDF Portal が外部サービスや知的エージェントと接続される際に、さらに重要性を増す。その一例が、標準化されたインタフェースを通じて大規模言語モデルやその他の AI システムが RDF Portal と対話できるようにする **[TogoMCP](https://togomcp.rdfportal.org/)** である。この文脈において、RDF-config は、AI システムが推測のみに頼るのではなく、明示的なデータセットモデルに基づいて対話を行えるようにする、信頼性の高い構造ガイダンスを提供する。

AI システムは強力である一方、曖昧さに対しては敏感である。明示的な構造情報がなければ、AI による RDF データとの対話は非効率になったり、誤りを生じやすくなったりする。RDF-config は、データセット構造を明確に記述することでこのリスクを軽減し、AI ベースのツールによる RDF データ利用を、より安定的で予測可能なものにする。

構造を第一級のリソースとして扱うことで、RDF-config は、RDF Portal が現在提供しているサービスだけでなく、将来的な拡張も下支えしている。RDF データセット自体が独立して進化することを許容しつつ、自動化された知的サービスの段階的な発展を支える、安定した参照点を提供しているのである。

{% endlang %}
