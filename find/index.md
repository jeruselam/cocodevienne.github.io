---
layout: page
title: "Ayet"
date: 
modified:
excerpt:
image:
  feature:
search_omit: true
sitemap: false
---

<form action="/find/" method="get">
  <label for="search-box"></label>
  <input type="text" id="search-box" name="query">
  <input type="submit" value="Bul">
</form>

<ul id="search-results"></ul>

<script>
  window.store = {
    {% for post in site.posts %}
      "{{ post.url | slugify }}": {
        "title": "{{ post.title | xml_escape }}",
        "author": "{{ post.author | xml_escape }}",
        "category": "{{ post.category | xml_escape }}",
        "content": {{ post.content | strip_html | strip_newlines | jsonify }},
        "url": "{{ post.url | xml_escape }}"
      }
      {% unless forloop.last %},{% endunless %}
    {% endfor %}
  };
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.1.3/lunr.min.js"></script>
<script src="/js/search.js"></script>
