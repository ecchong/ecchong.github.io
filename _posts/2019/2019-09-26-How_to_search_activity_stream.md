---
title: How to search activity stream on Tower
tags: ["Ansible", "Tower", "activity stream"]
categories: Ansible
layout: post
---
## How to search events in activtiy stream

### Finding all user creation events
```
https://<Tower Hostname>/api/v2/activity_stream/?operation=create&object1=user
```

### Finding all lauch job events
```
/api/v2/activity_stream/?operation=create&object1=job
```

### Finding all delete job template events
```
/api/v2/activity_stream/?operation=delete&object1=job_template
```

