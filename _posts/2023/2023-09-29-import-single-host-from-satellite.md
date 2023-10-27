---
title: Importing a single host from Satellite to AAP inventory
tags: ["ansible", "aap", "tower", "satellite" ]
categories: Ansible
last_modified_at: 2023-09-29
published: true
description: "Ansible Automation Platform - Importing a single host from Satellite to AAP inventory"
---

In the new virtual machine provisioning process, vRO creates the machine and registered it to the Satellite host group selected by user.  Now AAP will take over to configure the VM.  Before the playbooks can run against this new VM, we will need to import it from Satellite into AAP inventory.  The regular Satellite inventory sync takes a long time to run because it queries all hosts managed by Satellite.  It is not feasible to run Satellite inventory sync to just import one host.  We can use `host_filters` attribute, but the AAP inventory source does not accept variable.  So the solution is to run `ansible-inventory` directly with `host_filters` for the target VM.  Captures the output which includes all Satellite parameters associated with the VM and import them into AAP using the `infra.controller_configuration.hosts` role to create the host in AAP inventory

```yaml
---
# Required Collection
#   infra.controller_configuration
# Rquired Variables
#   controller_*: credential for AAP
#   satellite_*: credential for Satellite
#   target_host: host to be imported
#   controller_inventory: AAP inventory name
- name: Import single host from Satellite 
  hosts: localhost
  connection: local
  gather_facts: false

  vars:
    controller_hostname: "{{ lookup('env', 'CONTROLLER_HOSTNAME) }}"
    controller_username: "{{ lookup('env', 'CONTROLLER_USERNAME') }}"
    controller_password: "{{ lookup('env', 'CONTROLLER_PASSWORD') }}"
    controller_oauth_token: "{{ lookup('env', 'CONTROLLER_OAUTH_TOKEN') | default(omit) }}"
    controller_validate_certs: "{{ lookup('env', 'CONTROLLER_VERIFY_SSL') }}"
    satellite_url: "{{ lookup('env', 'my_web_url') }}"
    satellite_user: "{{ lookup('env', 'my_web_url_usname') }}"
    satellite_password: "{{ lookup('env', 'my_web_url_password') }}"
    working_dir: /tmp

  tasks:
    - name: Import single host
      block:
        - name: Stage Foreman inventory plugin file
          ansible.builtin.copy:
            dest: "{{ working_dir }}/my.foreman.yml"
            mode: "0600"
            content: |
              plugin: redhat.satellite.foreman
              url: "{{ satellite_url }}"
              user: "{{ satellite_user }}"
              password: "{{ satellite_password }}"
              validate_certs: no
              want_host_group: yes
              want_params: yes
              want_host_collections: yes
              want_facts: yes
              use_reports_api: yes
              host_filters: 'name={{ target_host }}'

        - name: Run Foreman inventory plugin
          ansible.builtin.shell:
            cmd: "ansible-inventory -i my.foreman.yml --host {{ target_host }}"
            chdir: "{{ working_dir }}"
          register: _output

        - name: DEBUG
          ansible.builtin.debug:
            msg: "{{ _output }}"
            verbosity: 1

        - name: Set host parameter variables
          ansible.builtin.set_fact:
            import_host_vars: "{{ _output.stdout | from_json }}"

        - name: DEBUG
          ansible.builtin.debug:
            msg: "{{ import_host_vars }}"
            verbosity: 1

        - name: Add host to AAP inventory
          ansible.builtin.include_role:
            name: infra.controller_configuration.hosts
          vars:
            controller_hosts:
              - name: "{{ target_host }}"
                inventory: "{{ controller_inventory }}"
                variables: "{{ import_host_vars }}"
          register: _import_host_output

      always:
        - name: Remove Foreman inventory plugin file
          ansible.builtin.file:
            path: "{{ working_dir }}/my.foreman.yml"
            state: absent
```