---
title: Seaching a list of dictionay objects where keys name has dots
tags: ["ansible", "jinja2" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
---

We need to search a list of dictionary objects where the key name is dynamic and might have dots (".") inside, such as a FQDN hostname.

`selectattr` will be a good option, but it fails to handle the dot.  We will need to use `json_query` in the following example:

````
---
- name: Examples - Find dict with dots in key name
  hosts: localhost
  connection: local
  gather_facts: no

  vars:
    my_var: [
        { "one": {
             "one": {
                "one": "Just 1"
             }
          }
        },
        { "two": "2" },
        { "three": "3" },
        { "one.one.one": "1.1.1" }
      ]

  tasks:
  - name: Using selectattr
    debug:
      msg:
      - '{{ my_var | selectattr("one.one.one","defined")  }}'
      - '{{ my_var | selectattr("one","defined")  }}'
      - '{{ my_var | selectattr("two","defined")  }}'

  - name: Using json_query
    debug:
      msg: "{{ (my_var | json_query(x) | first | default({'default': 'none'}) | dict2items)[0].value }}"
    vars:
      x: "[?\"one.one.one\"]"
````

Output:
````
PLAY [Examples - Find dict with dots in key name] ********************************************************************************

TASK [Using selectattr] **********************************************************************************************************
ok: [localhost] => {
    "msg": [
        [
            {
                "one": {
                    "one": {
                        "one": "Just 1"
                    }
                }
            }
        ],
        [
            {
                "one": {
                    "one": {
                        "one": "Just 1"
                    }
                }
            }
        ],
        [
            {
                "two": "2"
            }
        ]
    ]
}

TASK [Using json_query] **********************************************************************************************************
ok: [localhost] => {
    "msg": "1.1.1"
}

PLAY RECAP ***********************************************************************************************************************
localhost                  : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
````

`selectattr("one.one.one","defined")` does not return key `one.one.one`, but nested dictionary `one`

Using `json_query`, will return expected match.