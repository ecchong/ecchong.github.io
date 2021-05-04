---
title: How to use Jinja2 inside a playbook
tags: ["Ansible", "Jinja2"]
categories: Ansible
layout: post
modified_date: 2021-05-04
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

5. Create a list from another list with additional info
{% raw %}
```yaml
  - name: Generate routes for DC1 PER01
    set_fact:
      new_routes: |
        {% set routes = [] %}
        {% for i in routes_to_add %}
        {% set _ = routes.append("router static vrf " + vrf|string + " address-family ipv4 unicast " + i + " " + bundle + "." + vlan|string + " " + firewall) %}
        {% endfor %}
        {{ routes }}
```
{% endraw %}