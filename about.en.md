---
layout: page
title: About
lang: en
pageId: about
description: About RDF Portal and SPARQL endpoints
permalink: /about/
---

<article lang="en">

  <h3>About RDF Portal SPARQL Endpoints</h3>

  <p>RDF Portal provides multiple SPARQL endpoints. Ideally, all RDF datasets would be accessible through a single unified
    endpoint, which would maximize usability. However, with the RDF store currently in use, such an approach is not practical
    due to performance constraints related to data loading, updates, and query execution.</p>

  <p>For this reason, RDF datasets are divided across several endpoints, primarily based on the size of the dataset and the institution
    providing it. Each endpoint is optimized for stable operation and efficient querying, while together they collectively cover the full
    range of datasets hosted in RDF Portal.</p>

  <p>Each endpoint is equipped with frontend support tools developed at DBCLS: <a href="https://github.com/moriya-dbcls/sparql-support" target="_blank">
      sparql-support</a> and <a href="https://github.com/dbcls/sparql-proxy" target="_blank">sparql-proxy</a>.</p>

  <p>sparql-support is an editor that assists users in writing SPARQL queries, providing features such as input completion and tab-based
    management of multiple queries.</p>

  <p>sparql-proxy functions as a proxy server for SPARQL endpoints, offering capabilities including job management of queries, detection of
    invalid queries, and faster responses through query result caching.</p>

  <p>Below is the list of SPARQL endpoints currently available.</p>

</article>
