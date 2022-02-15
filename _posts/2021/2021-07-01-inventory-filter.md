---
title: How to filter and group VMs using dynamic inventory
tags: ["ansible", "tower", "vcenter", "vmware"]
categories: Ansible
last_modified_at: 2022-02-16
---

# How to filter and group VMs using dynamic inventory
We would like to pull only certain VMs from our vCenter and put them in different inventory groups.
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

## Scenario 3
- Only VMs in folders `Test VMs` and `pfSense Test` under `LAB` datacenter should be imported.
- They should be grouped based on the resource pool and OS.  The group name is prefixed accordingly.
```yaml
---
validate_certs: False
hostnames:
- config.name
properties:
- config.guestId
- config.name
- resourcePool
with_nested_properties: True
keyed_groups:
- key: resourcePool
  separator: ''
  prefix: 'ResourcePool'
- key: config.guestId
  separator: '_'
  prefix: 'OS'
resources:
- datacenter:
  - LAB
  resources:
  - folder:
    - Test VMs
    - pfSense Test
```
Note: Resource pool ID will be used in the group name, since pool name is not available.

# References
- [VM attributes](https://docs.ansible.com/ansible/latest/scenario_guides/vmware_scenarios/vmware_inventory_vm_attributes.html#vmware-inventory-vm-attributes)
- [plugin doc](https://docs.ansible.com/ansible/latest/collections/community/vmware/vmware_vm_inventory_inventory.html) 
- [Git repo](https://github.com/ansible-collections/community.vmware/blob/main/plugins/inventory/vmware_vm_inventory.py)