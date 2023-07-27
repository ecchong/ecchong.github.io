---
title: Using the ansible.controller credential module
tags: ["ansible", "aap", "tower", "ansible collection", "ansible module" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
description: "How to avoid overwriting credential while using the awx.awx.credential or ansible.controller.credential module to manage credential in AAP"
---

The `awx.awx.credential` or `ansible.controller.credential` cannot see the secret value of existing credential, so it compares other fields in the `inputs` to determine if change is needed.  Therefore in order to avoid overwriting the secret value unnecessarily, make sure the `inputs` fields match exactly.

For example, we have a Amazon Web Services credential that appears in `/api/v2/credentials/62/` REST API browser page as:
```json
...
    "name": "Demo|aws key",
    "description": "",
    "organization": 9,
    "credential_type": 5,
    "managed": false,
    "inputs": {
        "password": "$encrypted$",
        "username": "AKIAY5L2N2GGHCAYML5I"
    },
...
```
To avoid marking change to the `password` value, which holds the AWS Secret Access Key, we should maintain the `name`, `description` and `username` fields exactly the same when calling the `credential` module in the playbook.
```yaml
  - name: Add aws credential
    credential:
      name: "Demo|aws key"
      description: ""
      organization: Demo
      credential_type: "Amazon Web Services"
      state: present
      update_secrets: false
      inputs:
        username: "AKIAY5L2N2GGHCAYML5I"
        password: "place holder value"
```
As long as `update_secrets` is set to `false`, the `credential` module will not update the existing credential if all other fields are the same.  Changing the `password` value will not cause the module to update the existing credential since there is no way to compare them.

Let say the description is modifed.
```yaml
  - name: Add aws credential
    credential:
      name: "Demo|aws key"
      description: "This is an AWS key"
      organization: Demo
      credential_type: "Amazon Web Services"
      state: present
      update_secrets: false
      inputs:
        username: "AKIAY5L2N2GGHCAYML5I"
        password: "new place holder value has no effect"
```
Now running this task will cause the credential to be updated, since the `description` is changed, the module assume everything need to be updated including the `password`.  If the password has been updated via the console, now it will be reset back to this place holder value.

Same behavior apply to `credentials` role in `infra.controller_configuration` which calls the `credentianl` module.

How to know what fields are available for each credential type?  Check the `api/v2/credential_types/` API browser page.