---
title: How to run task only on the first node in group
tags: ["Ansible", "inventory"]
categories: Ansible
layout: post
---
## How to run task only on first node in group

Check the group array

For example
```yaml
- name: Ping first node listed in group "tower"
  ping:
  when: inventory_hostname == groups['tower'][0]
```
