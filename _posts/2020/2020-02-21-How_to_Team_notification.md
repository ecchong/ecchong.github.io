---
title: How to setup Tower notification for MS Team
tags: ["Ansible", "Tower", "notification", "Microsoft Teams"]
categories: Ansible
layout: post
---
## Setup Tower notification for MS Teams

[https://github.com/ansible/awx/issues/885](https://github.com/ansible/awx/issues/885)

- In MS Team channel, go to More Options -> Connectors.  Configure "Incoming Webhook".  Assign a name and create.
- Copy the generated URL.
- Create a Tower Notification using Mattermost type.  Paste the Team Webhook URL into TARGET URL