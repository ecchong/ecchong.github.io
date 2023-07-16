---
title: Setup AAP Controller to trust a CA cert
tags: ["ansible", "certificate", "tower", "aap" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
description: "Ansible Automation Platform - setup trust CA Cert on Controller"
---

AAP Controller does not read system PKI directory.  So adding CA cert to `/etc/pki/ca-trust/source/anchors directory` and run `update-ca-trust` is not enough.  It will still return SSL error when pulling execution image, for example.

Add the following into `/etc/supervisord.d/tower.ini` file:
```ini
[supervisord]
...
environment=REQUESTS_CA_BUNDLE=/etc/pki/ca-trust/source/anchors/lets-encrypt-r3.pem
...
```

Then restart
```shell
automation-controller-service restart supervisord
```


