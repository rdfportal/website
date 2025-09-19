---
layout: page
title: About
pageId: about
description: RDFポータルサイトについて
permalink: /about/
---

## About RDF Portal SPARQL Endpoints

RDF Portal provides multiple SPARQL endpoints. Ideally, all RDF datasets would be accessible through a single unified endpoint, which would maximize usability. However, with the RDF store currently in use, such an approach is not practical due to performance constraints related to data loading, updates, and query execution.


For this reason, RDF datasets are divided across several endpoints, primarily based on the size of the dataset and the institution providing it. Each endpoint is optimized for stable operation and efficient querying, while together they collectively cover the full range of datasets hosted in RDF Portal.


Each endpoint is equipped with frontend support tools developed at DBCLS: [sparql-support](https://github.com/moriya-dbcls/sparql-support)
 and [sparql-proxy](https://github.com/dbcls/sparql-proxy).


sparql-support is an editor that assists users in writing SPARQL queries, providing features such as input completion and tab-based management of multiple queries.


sparql-proxy functions as a proxy server for SPARQL endpoints, offering capabilities including job management of queries, detection of invalid queries, and faster responses through query result caching.


Below is the list of SPARQL endpoints currently available.
