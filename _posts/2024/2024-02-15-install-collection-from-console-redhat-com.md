---
title: Install Ansible Collection Directly from console.redhat.com
tags: ["ansible", "aap", "pah", "hub", "collection" ]
categories: Ansible
last_modified_at: 2024-02-15
published: true
description: "Ansible Galaxy - Installing collections directly from console.redhat.com"
---
We generated the offline token from [Red Hat Hybrid Cloud Console](https://console.redhat.com/ansible/automation-hub/token), and setup it up on Private Automation Hub to pull collections to Hub.  What if we want to use the same token to installation the collections directly onto our workstation from console.redhat.com, instead of pulling from Private Automation Hub?

```ini
[galaxy]
server_list = rh-certified_repo

[galaxy_server.rh-certified_repo]
url=https://console.redhat.com/api/automation-hub/content/published/
auth_url=https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
token=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhZDUyMjdhMy1iY2ZkLTRjZjAtYTdiNi....
```

Note the `auth_url` attribute is needed if we want to authenticate with token.  It is not required if we just pointing it to Private Automation Hub.