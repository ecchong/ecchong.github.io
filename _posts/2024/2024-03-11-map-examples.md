---
title: Some useful examples of using map
tags: ["ansible", "map" ]
categories: Ansible
last_modified_at: 2024-03-11
published: true
description: "Ansible - Some examples using map"
---
Apped some string to a list of string
{% raw %}
```yaml
  vars:
    file_name:
      - 'my_file'
      - 'some_other_file'
  tasks:
    - name: List all similar files 
      ansible.builtin.find:
        paths:
          - "/tmp/"
        patterns: "{{ ['*'] | product(file_name) | map('join') | list }}"
      register: _matched
```
{% endraw %}
or
{% raw %}
```
        patterns: "{{ file_name | map('regex_replace', '^(.*)$', '*\\1*') }}"
```
{% endraw %}
