---
title: How to run tasks on some nodes only
tags: ["Ansible", "inventory"] 
categories: Ansible
layout: post
---
## How to run tasks on some nodes only

### Only on first node in group

Check the group array

For example
```yaml
- name: Ping first node listed in group "tower"
  ping:
  when: inventory_hostname == groups['tower'][0]
```

### Only if node is in group

Is the host in group node_b?

```yaml
---
- hosts:
  - node_a
  - node_b
  gather_facts: no

  tasks:
  - ping:
    when: inventory_hostname in groups['node_b']
```