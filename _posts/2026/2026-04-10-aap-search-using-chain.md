---
title: Searching in AAP inventory using chain filter
tags: ["aap", "api", "ansible"]
categories: Ansible
last_modified_at: 2026-04-10
published: true
description: "AAP - Find hosts that are imported from one inventory source but not from the other in an inventory"
---

Within an inventory, we need to find hosts that are imported today from one source but not from the other.  This will require the chain filter.  Mindful of the double underscore "_" characters.

```yaml
- name: Create API query to get list of hosts that are created today and only from in source A but not from source B
  ansible.builtin.set_fact:
    _api_query: "?chain__inventory_sources__name={{ source_A }}\
                 &chain__not__inventory_sources__name={{ source_B }}\
                 &created_lt={{ _today.stdout}}\
                 &page_size=1000"

- name: Get list of hosts from API query
  ansible.builtin.uri:
    url: "https://{{ aap_hostname}}/api/controller/v2/hosts/{{ _api_query }}"
    method: Get
    return content: true
    headers:
      Authorization: "Bearer {{ _oauthtoken.json.token }}"
    validate_certs: "{{ controller_validate_certs | default(true) }}"
  register: _host_list
  no_log: "{{ _no_log | default(true) }}"

- name: List of hosts to be removed
  ansible.builtin.debug:
    msg: "{{_host_list.json.results | map(attribute='name') }}"
```
