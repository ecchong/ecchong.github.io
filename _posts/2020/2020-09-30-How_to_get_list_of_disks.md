---
title: How to get a list of disks from facts
tags: ["Ansible", "facts", "search"]
categories: Ansible
layout: post
---
## Get the list of block devices from facts gathering

To just display the list of devices
{% raw %}
```yaml
  - debug:
      msg: "{{ ansible_devices.keys() }}"
```
{% endraw %}


Get list of devices with "Virtual disk" as model
{% raw %}
```yaml
  - debug:
      msg: '{{ ansible_devices | dict2items | selectattr("value.model","equalto","Virtual disk") | map(attribute="key") | list }}'
```
{% endraw %}
