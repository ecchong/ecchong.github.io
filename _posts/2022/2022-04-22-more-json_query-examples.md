---
title: More json_query examples
tags: ["ansible", "aap", "json_query", "aws" ]
categories: Ansible
#last_modified_at: 2022-02-10
published: true
---

More examples on using json_query in your playbook.

## Find VPC ID of a VPC on AWS
Module `ec2_vpc_net_info` returns a list of VPCs that looks like this:
````json
  "vpcs": [
      {
          "cidr_block": "172.31.0.0/16",
          ...
          "state": "available",
          "tags": {
              "Name": "Default"
          },
          "vpc_id": "vpc-c4c7abcd"
      },
      {
          "cidr_block": "10.1.0.0/24",
          ...
          "state": "available",
          "tags": {
              "Name": "echong-vpc"
          },
          "vpc_id": "vpc-070c059d2b78d1234"
      }
  ]
````
For exmple, to get the `vpc_id` of variable name `vpc_name`, we can use json_query:
````yaml
  - name: Find VPC ID matching vpc_name
    debug:
      msg: "{{ _vpc_info.vpcs |  json_query(_query) }}"
    vars:
      _query: "[?tags.Name == '{{ vpc_name }}'].vpc_id"
````
Of course, it will be easier to just use filter in `ec2_vpc_net_info` module:
````yaml
  - name: Gather VPC info with filter
    amazon.aws.ec2_vpc_net_info:
      aws_secret_key: "{{ aws_secret_key }}"
      aws_access_key: "{{ aws_access_key }}"
      region: "{{ aws_region }}"
      filters:
        "tag:Name": "{{ vpc_name }}"
    register: _vpc_info
````