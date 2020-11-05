---
title: Find VM with the same name
tags: ["Ansible", "VMware", "vm"]
categories: Ansible
layout: post
---
## Find VM with the same name
We want to make sure the VM only exists in the folder we want or not exists at all.


{% raw %}
```yaml
- name: Find VM with the same name
  vmware_guest_find:
    hostname: "{{ vmware_vm_vcenter.hostname }}"
    username: "{{ vmware_vm_vcenter.username }}"
    password: "{{ vmware_vm_vcenter.password }}"
    validate_certs: "{{ vmware_vm_vcenter.validate_certs | default(false) }}"
    name: "{{ vmware_vm_vm.name }}"
  register: find_vm
  delegate_to: localhost
  ignore_errors: true

- name: VM already exists.  Setup search string to match folder name.
  set_fact:
    find_vm_search_string: "{{ vmware_vm_vm.folder }}$"
  when: not find_vm.failed

- name: Make sure VM exists only in the desired folder
  assert:
    that:
    - find_vm.folders | length == 1
    - find_vm.folders[0] | regex_search( find_vm_search_string )
    fail_msg: "VM {{ vmware_vm_vm.name }} already exists {{ find_vm.folders | default() }}"
  when: not find_vm.faile
```
{% endraw %}
