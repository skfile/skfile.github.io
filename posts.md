---
layout: page
title: Posts
permalink: /posts/
sidebar_link: true
---
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}, {{ post.date | date_to_string }} </a>
    </li>
  {% endfor %}
</ul>