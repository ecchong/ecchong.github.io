---
title: How to search on Tower
tags: ["Ansible", "facts", "search"]
categories: Ansible
layout: post
---
## Get the list of block devices from facts gathering

To just display the list of devices
```yaml
  - debug:
      msg: "{{ ansible_devices.keys() }}"
```


Get list of devices with "Virtual disk" as model
```yaml
  - debug:
      msg: '{{ ansible_devices | dict2items | selectattr("value.model","equalto","Virtual disk") | map(attribute="key") | list }}'
```
