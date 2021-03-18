---
title: Ansible Variables Precedence Gotcha
tags: ["ansible", "linux"]
categories: Ansible
layout: post
---

I recently got tripped by Ansible variables precedence.  We are familiar with the [precedence concept](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#:~:text=Ansible%20does%20apply%20variable%20precedence,in%20role%2Fdefaults%2Fmain.). Sometime in a complex playbooks, it help to remember how variables are loaded.

In recent project, a playbook is used to deploy configuration to a brand new Cisco switch setup with a temporary password.  The real password for the whole environment is stored in `prod.yaml` file and loaded using `include_vars` early in the playbook.  In order to connect to the new switch, I use set_fact to set the temporary credential, and expected I can reconnect to the switch with the production password once the configuration is loaded and rebooted.

```yaml
- name: Load production credential for the environment
  include_vars: prod.yaml
  ...
- name: Set a temporary password to connect to the new switch
  set_fact:
    ansible_password: temp_password
    ansible_become_password: temp_enable_password
  ...
- name: The configuration tasks and reboot the new switch
  ...
- name: Try to reset the production credential and reconnect to the new switch
  include_vars: prod.yaml
- name: Do more configuration with production credential
  ios_command:
    commands: show version
```

It turns out set_fact has higher precendence than include_vars.  The temporary credential is still being used at the last task.  The only way to overwrite that is with another `set_fact`.

```yaml
- name: Try to reset the production credential and reconnect to the new switch
  include_vars:
    file: prod.yaml
    name: prod_vars
- name: Reset the passwords
  set_fact:
    ansible_password: prod_vars.ansible_password
    ansible_enable_password: prod_vars.ansible_enable_password
```