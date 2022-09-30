---
title: Ansible Foreman Inventory Plugin Filters
tags: ["ansible", "foreman", "satellite" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
---

The Ansible Foreman inventory plugin import all hosts by default.  It can also be filtered to only import certain hosts.  The filter plugin uses the Foreman/Satellite search hosts API, so the filter syntax is very similar.

For example, we would like to import hosts belong to hostgroup `foo` or `bar`, the `inventory.foreman.yml` will looks like:
````yaml
plugin: theforeman.foreman.foreman
url: https://satellite.lab.automate.nyc
user: svc_ansible
password: my_password
validate_certs: false
want_params: yes
want_facts: no
want_puppet_enc: yes
want_enc: yes
host_filters: 'hostgroup="dummy" or hostgroup="puppet-module"'
````

Remember the inventory file name must ends with `foreman.yml`. Runs the following to verify the filter:
````shell
ansible-inventory -i inventory.foreman.yml --graph
````

Notice the inventory groups created for all matching hosts
````shell
@all:
  |--@foreman_content_view_rhel8_puppet:
  |  |--dummy1.lab.automate.nyc
  |  |--dummy10.lab.automate.nyc
...
  |--@foreman_dummy:
  |  |--dummy1.lab.automate.nyc
  |  |--dummy10.lab.automate.nyc
...
  |--@foreman_lifecycle_environment_library:
  |  |--dummy1.lab.automate.nyc
  |  |--dummy10.lab.automate.nyc
...
  |--@foreman_location_new_york:
  |  |--dummy501.lab.automate.nyc
  |--@foreman_organization_automate_nyc:
  |  |--dummy1.lab.automate.nyc
  |  |--dummy10.lab.automate.nyc
...
  |--@foreman_puppet_hostgroup:
  |  |--node6.lab.automate.nyc
  |--@ungrouped:
````

To only import hosts under `new_york` location by adding another filter:
````yaml
host_filters: 'hostgroup="dummy" or hostgroup="puppet-module"'
host_filters: 'location="new_york"'
````

To import hosts with lifecycle environment `Production`

To import by collection