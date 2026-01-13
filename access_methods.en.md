---
layout: page
title: Access methods
pageId: access_methods
parentPageId: access_methods
description: Learn how to access RDF data
permalink: /access_methods/
lang: en
---

<div class="grid-boxes" style="margin-top: 50px;">

<div class="box" markdown="1">
## [SPARQL endpoints]({{ '/access_methods/sparql_endpoints/' | relative_url }})

  <p>RDF Portal provides multiple SPARQL endpoints. Ideally, all RDF datasets would be accessible through a single
    unified endpoint, which would maximize usability. However, with the RDF store currently in use, such an approach is
    not practical due to performance constraints related to data loading, updates, and query execution.</p>

  <p>For this reason, RDF datasets are divided across several endpoints, primarily based on the size of the dataset and
    the institution providing it. Each endpoint is optimized for stable operation and efficient querying, while together
    they collectively cover the full range of datasets hosted in RDF Portal.</p>

  <p>Each endpoint is equipped with frontend support tools developed at DBCLS: <a
      href="https://github.com/moriya-dbcls/sparql-support" target="_blank">sparql-support</a> and <a
      href="https://github.com/dbcls/sparql-proxy" target="_blank">sparql-proxy</a>.</p>

  <p>sparql-support is an editor that assists users in writing SPARQL queries, providing features such as input
    completion and tab-based management of multiple queries.</p>

  <p>sparql-proxy functions as a proxy server for SPARQL endpoints, offering capabilities including job management of
    queries, detection of invalid queries, and faster responses through query result caching.</p>

  <a href="">See the list of SPARQL endpoints</a>


</div>

<div class="box" markdown="1">
## [GraphQL API]({{ '/access_methods/graphql_api/' | relative_url }})
The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
</div>

<div class="box" markdown="1">
## [MCP Interface]({{ '/access_methods/mcp_interface/' | relative_url }})
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>

<div class="box" markdown="1">
## [LLM Chat Interface]({{ '/access_methods/llm_chat_interface/' | relative_url }})
On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.
</div>

</div>