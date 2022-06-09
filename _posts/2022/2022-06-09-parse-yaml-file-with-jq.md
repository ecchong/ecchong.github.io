---
title: Parse YAML with jq
tags: ["yaml", "jq", "python" ]
categories: Ansible
#last_modified_at: 2022-02-10
published: true
---

We want to parse YAML file with `jq` command like JSON file.  Following snippet will use Python to convert YAML file to JSON format and pass to `jq` command. 

Input file `my_list.yml`:
````yaml
---
fruit:
- name: apple
  color: red
- name: orange
  color: orange
- name: banana
  color: yellow
vegetable:
- name: broccoli
  color: green
- name: avocado
  color: green
````

````shell
$ python3 -c 'import sys, yaml, json; y=yaml.safe_load(sys.stdin.read()); print(json.dumps(y))' < my_list.yml  | jq .fruit
[
  {
    "name": "apple",
    "color": "red"
  },
  {
    "name": "orange",
    "color": "orange"
  },
  {
    "name": "banana",
    "color": "yellow"
  }
]

$ python3 -c 'import sys, yaml, json; y=yaml.safe_load(sys.stdin.read()); print(json.dumps(y))' < my_list.yml  | jq '.fruit[].name'
"apple"
"orange"
"banana"
````
