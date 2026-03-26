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

{% for method in site.data.access_methods %}
<div class="box" markdown="1">
{% lang 'en' %}
## [{{ method.title.en }}]({% if method.is_external %}{{ method.url }}{% else %}{{ method.url | relative_url }}{% endif %}){% if method.is_external %}{:target="_blank"}{% endif %}
{{ method.description.en }}
{% endlang %}
{% lang 'ja' %}
## [{{ method.title.ja }}]({% if method.is_external %}{{ method.url }}{% else %}{{ method.url | relative_url }}{% endif %}){% if method.is_external %}{:target="_blank"}{% endif %}
{{ method.description.ja }}
{% endlang %}
</div>
{% endfor %}

</div>
