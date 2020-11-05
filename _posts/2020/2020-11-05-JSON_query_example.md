---
title: json_query example with multiple search patterns
tags: ["Ansible", "json_query", "libvirt", "kvm", "virsh"]
categories: Ansible
layout: post
---
## Find VM IP address when not on the defined VM network
We deployed a KVM VM using macvtap connect directly to the physical network and getting a DHCP address.  How can we get the VM IP address from the hypervisor and use it in Ansible?

First pull the interfaces information using __virsh qemu-agent-command__.

{% raw %}
```yaml
  - name: Get temporary dhcp address for eth0
    shell: virsh qemu-agent-command {{ inventory_hostname }} '{"execute":"guest-network-get-interfaces"}' | sed 's/-/_/g'
    register: vm_interfaces
    delegate_to: "{{ libvirt_hypervisor_name }}"
```
{% endraw %}

The returned output uses "-", therefore we need to do inline substitution with __sed__.  The final JSON output looks like this:

{% raw %}
```json
{
    "return": [
        {
            "name": "lo",
            "ip-addresses": [
                {
                    "ip-address-type": "ipv4",
                    "ip-address": "127.0.0.1",
                    "prefix": 8
                },
                {
                    "ip-address-type": "ipv6",
                    "ip-address": "::1",
                    "prefix": 128
                }
            ],
            "statistics": {
                "tx-packets": 70,
                "tx-errs": 0,
                "rx-bytes": 5856,
                "rx-dropped": 0,
                "rx-packets": 70,
                "rx-errs": 0,
                "tx-bytes": 5856,
                "tx-dropped": 0
            },
            "hardware-address": "00:00:00:00:00:00"
        },
        {
            "name": "eth0",
            "ip-addresses": [
                {
                    "ip-address-type": "ipv4",
                    "ip-address": "192.168.0.187",
                    "prefix": 24
                },
                {
                    "ip-address-type": "ipv6",
                    "ip-address": "fe80::5054:ff:fe66:b8b0",
                    "prefix": 64
                }
            ],
            "statistics": {
                "tx-packets": 65,
                "tx-errs": 0,
                "rx-bytes": 8456,
                "rx-dropped": 0,
                "rx-packets": 57,
                "rx-errs": 0,
                "tx-bytes": 5642,
                "tx-dropped": 0
            },
            "hardware-address": "52:54:00:66:b8:b0"
        }
    ]
}
```
{% endraw %}

We are only interested on the ipv4 address on eth0.  Use the following json_query to pull it into Ansible

{% raw %}
```yaml
  - name: Get IP
    set_fact:
      ip_address_list: "{{ interfaces.return | json_query(find_eth0) }}"
    vars:
      find_eth0: "[?name=='eth0'].ip_addresses[] | [?ip_address_type=='ipv4'].ip_address"
```
{% endraw %}