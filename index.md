---
layout: page
title: RDF Portal
lang: ja
permalink: /
---

<noscript>
  <div class="lang-redirect">
    <p>Choose your language:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/ja/">日本語</a></li>
      <li><a href="{{ site.baseurl }}/en/">English</a></li>
    </ul>
  </div>
</noscript>

<script>
  (function(){
    var base = '{{ site.baseurl }}'.replace(/\/$/, '');
    var preferred = (navigator.language || navigator.userLanguage || 'ja').slice(0, 2);
    var target = preferred === 'en' ? '/en/' : '/ja/';
    window.location.replace(base + target);
  })();
</script>
