---
title: Gettinng libselinux-python error in virtual environment or SCL
tags: ["ansible", "linux", "selinux"]
categories: Ansible
layout: post
---

Getting this error when running Ansible template task with Python3 in virtual environment or SCL

```shell
TASK [template] **********************************************************************************************************************************************************
fatal: [localhost]: FAILED! => {"changed": false, "checksum": "09908cdcefd9544ab2de069d1a9e3d31a15220db", "msg": "Aborting, target uses selinux but python bindings (libselinux-python) aren't installed!"}TASK [template] **********************************************************************************************************************************************************
fatal: [localhost]: FAILED! => {"changed": false, "checksum": "09908cdcefd9544ab2de069d1a9e3d31a15220db", "msg": "Aborting, target uses selinux but python bindings (libselinux-python) aren't installed!"}
```

The libselinux-python3 rpm is already installed, but not in the right location.  Copy them to the proper virtual environment of SCL directory.

```shell
cp -r /usr/lib64/python3.6/site-packages/selinux /opt/rh/rh-python36/root/usr/lib64/python3.6/site-packages
```