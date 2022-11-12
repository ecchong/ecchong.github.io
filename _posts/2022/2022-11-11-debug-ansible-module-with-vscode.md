---
title: Debug Ansible module with VSCode
tags: ["ansible", "debug", "python", "aap", "vscode" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
---

In this case I want to understand how the `awx.awx.credential` works. 

Step 1) Check out a local copy of the `awx.awx` collection, so we can modify the Python code without breaking anything.

```shell
$ ansible-galaxy collection install awx.awx -p collections
```
Step 2) Create a simple playbook using the collection

```yaml
---
- hosts: localhost
  connection: local
  gather_facts: no

  collections:
  - awx.awx

  tasks:
  - name: Add machine credential
    credential:
      name: ECHONG DEBUG
      description: DEBUG
      organization: Default
      credential_type: Machine
      state: present
      update_secrets: false
      inputs:
        username: root
        password: CHANGE_ME
        become_username: ""
        become_method: ""
      controller_host: aap-controller1.lab.automate.nyc
      controller_password: my_password
      controller_username: admin_user
```
Don't forget to setup an `ansible.cfg` to use the local collection folder.
```ini
[defaults]
collections_path=./collections
```

Step 3) Run the playbook but keeping the temporary file
```shell
$ ANSIBLE_KEEP_REMOTE_FILES=1  ansible-playbook test-credential.yml -vvv
```

Step 4) Copy the AnsiballZ to the local working directory
```shell
$ cp /Users/echong/.ansible/tmp/ansible-tmp-1665614966.4173708-72691-151852632021355/AnsiballZ_credential.py .
```

Step 5) Explode the AnsiballZ file
```shell
$ python3 AnsiballZ_credential.py explode
```
It will expand to files into `debug_dir` directory will all necessary files.
```shell
$ tree -L 4
.
├── AnsiballZ_credential.py
└── debug_dir
    ├── ansible
    │   ├── __init__.py
    │   └── module_utils
    │       ├── __init__.py
    │       ├── _text.py
    │       ├── basic.py
    │       ├── common
    │       ├── compat
    │       ├── distro
    │       ├── errors.py
    │       ├── parsing
    │       ├── pycompat24.py
    │       ├── six
    │       └── urls.py
    ├── ansible_collections
    │   ├── __init__.py
    │   └── awx
    │       ├── __init__.py
    │       └── awx
    └── args
```

Step 6) Insert the `debugpy` codes into the module file
```shell
$ vi debug_dir/ansible_collections/awx/awx/plugins/modules/credential.py
```
Depending on where you want to start the debugging, insert the following block:
```python
...
from ..module_utils.controller_api import ControllerAPIModule

def main():
    # Add this block for debugging
    import debugpy
    debugpy.listen(5678)
    debugpy.wait_for_client()
    debugpy.breakpoint()
    # End 

    # Any additional arguments that are not fields of the item can be added here
    argument_spec = dict(
        name=dict(required=True),
        new_name=dict(),
        copy_from=dict(),
        description=dict(),
        organization=dict(),
...
```

Step 7) Open VSCode at the local working directory.  We will also need to define a `launch.json` file to tell it to attach to the debugger port
```json
{
    ...
    {
      "name": "Python: Attach",
      "type": "python",
      "request": "attach",
      "connect": {
        "host": "127.0.0.1",
        "port": 5678
      }
    },
    ...
}
```

Step 8) Now run the Python script again and launch the VSCode debugger using `Python: Attach`.
```shell
$ python3 AnsiballZ_credential.py execute
```
The Python script will wait for VSCode to attach to port 5678.  Once attached, VSCode will stop at the `debugpy.breakpoint()` line.
