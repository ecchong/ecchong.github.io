---
title: How to filter hosts on Tower inventory import
tags: ["ansible", "tower", "vcenter", "vmware"]
categories: Ansible
layout: post
---

# How to filter hosts on Tower inventory import
Some examples using filters when importing inventory from vCenter.  See the [plugin doc](https://docs.ansible.com/ansible/latest/collections/community/vmware/vmware_vm_inventory_inventory.html) for details.

## Scenario 1
- Import VMs in vCenter only with tag "import_to_inventory" under the categories "Test" and "Tower"
- Put VMs into group name of the corresponding tag category
- Import only the VMs that are powered on
- Import VMs with the configured name (VMs are created without duplicate name in vCenter)

```yaml
---
hostnames: ["config.name"]
groups:
  Tower: "'Tower' in categories"
  Test: "'Test' in categories"
with_tags: yes
filters:
- summary.runtime.powerState == "poweredOn"
- "'import_to_inventory' in tags"
```
Note: 
- Check host vars of imported host to see what variables are available for filtering
- If using "properties" to selective import host vars, it must include the one used in filters

## Scenario 2
- Import VMs under the "management" folder for datacenter "LAB"

```yaml
---
hostnames: ["config.name"]
with_tags: yes
resources:
- datacenter:
  - LAB
  resources:
  - folder:
    - "management"
```
