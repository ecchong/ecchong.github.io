---
title: How to use Jinja2 inside a playbook
tags: ["Ansible", "Jinja2"]
categories: Ansible
layout: post
---
### How to use Jinja2 inside a playbook

1. To create variables
{% raw %}
```yaml
- set_fact:
    foo: |
      {% set aks_modified = dict() %}
      {% for ak in activation_keys %}
      {{ aks_modified.update({ak:[]}) }}
      {% endfor %}
      {{ aks_modified | to_json }}
```
{% endraw %}

2. To loop in range
{% raw %}
```yaml
  - debug:
      msg: |
       {%- for i in range(0,10) -%}
          {{ i }}
       {%- endfor -%}
```
{% endraw %}

3. To dynamically assign variables
{% raw %}
```yaml
  vars:
    foo: 'hello'
    bar: 'byebye'
    x: "{{ 'foo' if ansible_distribution_major_version == '7' else 'bar' }}"
```
{% endraw %}

4. If-then-else
{% raw %}
```yaml
  vars:
    test: this is a test environment
    uat: this is a uat environment
    prod: this isa prod environment
  tasks:
  - set_facts:
      env_vars:  "{{ test if ( env == 'test' ) else uat if ( env == 'uat' ) else prod if ( env == 'prod' ) }}"
```
{% endraw %}
