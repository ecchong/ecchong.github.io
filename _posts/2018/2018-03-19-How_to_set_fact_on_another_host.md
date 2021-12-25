---
title: How to set fact on another host
tags: ["Ansible", "set_fact", "inventory"]
categories: Ansible

last_modified_at: 2021-12-23
---
## How to set fact on another host?

Use delegate_to and delegate_fact together

```yaml
- name: Store some fact on host B
  set_fact:
    server_description: This is host B
  delegate_to: host_B
  delegate_facts: true
```
Otherwise, fact will not be associate with delegate_to host.

For example, we need to copy the SSH public key from user echong on the first host to the other hosts in a group.

- First we pull the public key from the first host 
- Then we store the fact on other hosts as a loop from first host

```yaml
  - name: Copy SSH key
    when: inventory_hostname == groups[group_name][0]
    block:
    - name: Slurp echong ssh key from the first node
      ansible.builtin.slurp:
        src: "/home/echong/.ssh/id_rsa.pub"
      register: echong_ssh_pub_key

    - name: Share the echong ssh key
      delegate_to: "{{ item }}"
      delegate_facts: yes
      ansible.builtin.set_fact:
        echong_ssh_pub_key_string: "{{ echong_ssh_pub_key.content | b64decode }}"
      loop: "{{ groups[group_name] }}"
````
