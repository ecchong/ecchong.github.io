---
title: How to visualize your Automation Mesh layout
tags: ["ansible", "aap", "container", "Tower", "mesh" ]
categories: Ansible
last_modified_at: 2022-06-09
published: true
description: "Ansible Automation Platform - visualize mesh layout"
---

Automation Mesh is a new feature that replace Isolated node.  Instead of just directly connecting the Tower nodes to Isolated nodes via SSH, we can have different layouts with the Mesh nodes depending on the needs.  To visualize the layout, AAP installation script `setup.sh` has an option to dump out the the Graphviz code and you can cut-and-paste it to [https://dreampuf.github.io/GraphvizOnline/](https://dreampuf.github.io/GraphvizOnline/) 

For example, following command will generate a file `mesh-topology.dot` with the current layout in `inventory` file:
````bash
./setup.sh -- --tag generate_dot_file
````
You can also specify the filename with the `generate_dot_file` extra variable:
```bash
./setup.sh -e generate_dot_file=/tmp/test-layout.dot -- --tag generate_dot_file
```

Here are some of the layout patterns, with the snippet of `inventory` file using a single control node and 6 execution nodes.

### All execution nodes are peers of control node, but not peer to each other
````ini
...
[automationcontroller]
control.lab.home ansible_connection=local

[automationcontroller:vars]
node_type=control
peers=execution_nodes

[execution_nodes]
node1.lab.home 
node2.lab.home
node3.lab.home
node4.lab.home
node5.lab.home
node6.lab.home 
...
````
![No peers](/assets/images/2022/2022-03-24-inventory-no-peers.png)

### All execution nodes are peers of control node, but also peer to the next node
````ini
...
[automationcontroller]
control.lab.home ansible_connection=local

[automationcontroller:vars]
node_type=control
peers=execution_nodes

[execution_nodes]
node1.lab.home peers=node2.lab.home
node2.lab.home peers=node3.lab.home
node3.lab.home peers=node4.lab.home
node4.lab.home peers=node5.lab.home
node5.lab.home peers=node6.lab.home
node6.lab.home 
...
````
![All peers](/assets/images/2022/2022-03-24-inventory-all-peers.png)

### Using 2 hop nodes to direct traffic to 2 sets of execution nodes
````ini
...
[automationcontroller]
control.lab.home ansible_connection=local

[automationcontroller:vars]
node_type=control
peers=node1.lab.home,node4.lab.home

[execution_nodes]
node1.lab.home peers=node2.lab.home,node3.lab.home node_type=hop
node2.lab.home peers=node3.lab.home
node3.lab.home 
node4.lab.home peers=node5.lab.home,node6.lab.home node_type=hop
node5.lab.home peers=node6.lab.home
node6.lab.home 
...
````
![2 DC](/assets/images/2022/2022-03-24-inventory-2dc-hop-peers.png)

### Using 2 hop nodes for redundancy to all 4 execution nodes
````ini
[automationcontroller]
control.lab.home ansible_connection=local

[automationcontroller:vars]
node_type=control
peers=node1.lab.home,node2.lab.home

[execution_nodes]
node1.lab.home peers=node3.lab.home,node4.lab.home,node5.lab.home,node6.lab.home node_type=hop
node2.lab.home peers=node3.lab.home,node4.lab.home,node5.lab.home,node6.lab.home node_type=hop
node3.lab.home 
node4.lab.home 
node5.lab.home 
node6.lab.home 
````
![2 redundant hop nodes](/assets/images/2022/2022-03-24-inventory-2hops-4peers.png)

## Receptorctl command
To verify the layout and check the status from command line.

````bash
[root@control var]# receptorctl --socket /var/run/awx-receptor/receptor.sock status
Node ID: control.lab.home
Version: 1.1.1
System CPU Count: 2
System Memory MiB: 7768

Connection       Cost
node2.lab.home   1
node1.lab.home   1

Known Node       Known Connections
control.lab.home {'node1.lab.home': 1, 'node2.lab.home': 1}
node1.lab.home   {'control.lab.home': 1,
 'node3.lab.home': 1,
 'node4.lab.home': 1,
 'node5.lab.home': 1,
 'node6.lab.home': 1}
node2.lab.home   {'control.lab.home': 1,
 'node3.lab.home': 1,
 'node4.lab.home': 1,
 'node5.lab.home': 1,
 'node6.lab.home': 1}
node3.lab.home   {'node1.lab.home': 1, 'node2.lab.home': 1}
node4.lab.home   {'node1.lab.home': 1, 'node2.lab.home': 1}
node5.lab.home   {'node1.lab.home': 1, 'node2.lab.home': 1}
node6.lab.home   {'node1.lab.home': 1, 'node2.lab.home': 1}

Route            Via
node1.lab.home   node1.lab.home
node2.lab.home   node2.lab.home
node3.lab.home   node1.lab.home
node4.lab.home   node1.lab.home
node5.lab.home   node1.lab.home
node6.lab.home   node1.lab.home

Node             Service   Type       Last Seen             Tags
node6.lab.home   control   StreamTLS  2022-03-25 00:13:59   {'type': 'Control Service'}
node1.lab.home   control   StreamTLS  2022-03-25 00:14:35   {'type': 'Control Service'}
control.lab.home control   StreamTLS  2022-03-25 00:14:45   {'type': 'Control Service'}
node2.lab.home   control   StreamTLS  2022-03-25 00:13:59   {'type': 'Control Service'}
node4.lab.home   control   StreamTLS  2022-03-25 00:13:59   {'type': 'Control Service'}
node3.lab.home   control   StreamTLS  2022-03-25 00:13:59   {'type': 'Control Service'}
node5.lab.home   control   StreamTLS  2022-03-25 00:13:59   {'type': 'Control Service'}

Node             Secure Work Types
node6.lab.home   ansible-runner
control.lab.home local, kubernetes-runtime-auth, kubernetes-incluster-auth
node4.lab.home   ansible-runner
node3.lab.home   ansible-runner
node5.lab.home   ansible-runner
````

To do a traceroute to see which nodes it pass through.
````bash
[root@control var]# receptorctl --socket /var/run/awx-receptor/receptor.sock traceroute node6.lab.home
0: control.lab.home in 69.04µs
1: node1.lab.home in 420.289µs
2: node6.lab.home in 476.88µs
````

See the Receptor document for more information

[https://receptor.readthedocs.io/en/latest/index.html](https://receptor.readthedocs.io/en/latest/index.html)

[https://github.com/ansible/receptor](https://github.com/ansible/receptor)

Update: AAP 2.2 now comes with a visualizer to display the layout of mesh