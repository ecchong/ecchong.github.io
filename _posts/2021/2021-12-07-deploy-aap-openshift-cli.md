---
title: How to deploy AAP 2.1 on OpenShift from CLI
tags: ["openshift", "operator", "ansible", "aap" ]
categories: Ansible
category_archive: Ansible
tag_archive: ["openshift", "operator", "ansible", "aap" ]
---

# How to deploy AAP 2.1 on OpenShift from CLI without Cluster Admin privileges (kind of)

- Ask Cluster Admin to assign the following permission to access the OperatorHub
```
oc create clusterrolebinding user-aggregate-olm-view --clusterrole=aggregate-olm-view --user=myname
```

- Cluster Admin also need to create an OperatorGroup for your namespace. Create operator-group.yaml

```yaml
apiVersion: operators.coreos.com/v1alpha2
kind: OperatorGroup
metadata:
  name: my-user-operatorgroup
  namespace: myspace
spec:
  targetNamespaces:
  - myspace
```

```shell
oc create -n myspace -f operator-group.yaml
````

- As admin of your namespace, create a subscription for AAP 2.1 operator.  Create file `subscription.yml`

```yaml
---
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: ansible-automation-platform
  namespace: ansible-automation-platform
spec:
  channel: 'stable-2.1'
  installPlanApproval: Automatic
  name: ansible-automation-platform-operator
  source: redhat-operators
  sourceNamespace: openshift-marketplace
```

```shell
oc create -f subscription.yml
```

- As admin of your namespace, create a automation controller.  Create file `automation-controller.yaml`

```yaml
---
apiVersion: automationcontroller.ansible.com/v1beta1
kind: AutomationController
metadata:
  name: example
  namespace: ansible-automation-platform
spec:
  create_preload_data: true
  route_tls_termination_mechanism: Edge
  garbage_collect_secrets: false
  loadbalancer_port: 80
  image_pull_policy: IfNotPresent
  projects_storage_size: 8Gi
  task_privileged: false
  projects_storage_access_mode: ReadWriteMany
  projects_persistence: false
  replicas: 1
  admin_user: admin
  loadbalancer_protocol: http
  nodeport_port: 30080
```

## References
[Configure RBAC in Different Stages so End-users can Interact with OperatorHub in the Console](https://access.redhat.com/articles/5182341)
