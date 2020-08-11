---
title: How to add a custom firewall rule to ESXi
tags: ["VMware", "ESXi", "firewall"]
categories: VMware
layout: post
---
## How to add a custom firewall rule to ESXi

The vCenter or ESXi web GUI only allow turning pre-fined ports on and off.  What to do if we need to add a custom port?  For example, connecting to a iSCSI device using port 3261.

Create an XML file /etc/vmware/firewall/custom_iscsi.xml
```xml
<!-- Firewall configuration information for custom iSCSI port-->
<ConfigRoot>
  <service>
    <id>custom_iscsi</id>
    <rule id='0000'>
      <direction>outbound</direction>
      <protocol>tcp</protocol>
      <porttype>dst</porttype>
      <port>3261</port>
    </rule>
    <enabled>true</enabled>
    <required>false</required>
  </service>
</ConfigRoot>
```

Reload the firewall rule
```shell
esxcli network firewall refresh
```
Check if the rule has been added
```shell
esxcli network firewall ruleset list
```
The rule should be visible both from command line or web GUI. 