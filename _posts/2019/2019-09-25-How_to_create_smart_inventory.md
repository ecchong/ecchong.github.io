---
title: How to create smart inventory
tags: ["Ansible", "inventory", "smart inventory", "Tower"]
categories: Ansible
layout: post
modified_date: 2021-03-02
---
### Smart inventory filter examples

These examples show how to create smart inventory in Tower using facts.

#### Hosts with a cached fact "some_fact" with value "some_value"
```shell
ansible_facts.some_fact:"some_value"
```

#### Using collected facts
```shell
ansible_facts.facter_os.name:"RedHat"
ansible_facts.facter_os.release.full:"7.6"
ansible_facts.facter_os.release.major:"7"
ansible_facts.facter_dmi.product.name:"VMware Virtual Platform"
```
