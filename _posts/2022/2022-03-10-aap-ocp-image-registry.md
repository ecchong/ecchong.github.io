---
title: How to use OpenShift internal registry for AAP
tags: ["ansible", "aap", "container", "Tower", "OpenShift" ]
categories: Ansible
#last_modified_at: 2022-02-10
published: false
---

# Automation Hub on OpenShift
The Automation Hub deployed using OpenShift operator does not come with image registry service to host the custom execution environment for AAP Controller.  It is expected customer running OpenShift will already has an image registry service, such as Quay, for their images.  In this article, we will discuss how to use the internal OpenShift image registry for this purpose.

# Expose the Image Registry Service
https://docs.openshift.com/container-platform/4.9/registry/securing-exposing-registry.html

# Setup a Service Account

# Add Execution Environment