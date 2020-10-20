---
title: Create user with shared home
tags: ["Ansible", "jinja2", "user"]
categories: Ansible
layout: post
---
## Create user with shared home
When /home is on a NFS mount, most likely the user home directory is already created from other hosts.  Use following steps to avoid error when creating user but not creating the home directory.

{% raw %}
```yaml
  tasks:
  - name: Check if user home directory already exists
    stat:
      path: /home/{{ user }}
    register: user_home

  - name: Create user but not home directory if already exists
    user:
      name: "{{ user }}"
      create_home: "{{ false if user_home.stat.exists else true }}"
```
{% endraw %}

Note that the inline Jinja2 statement does not work with 'yes' and 'no', e.g.
{% raw %}
```yaml
      create_home: "{{ no if user_home.stat.exists else yes }}"
```
{% endraw %}