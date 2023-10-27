---
title: Automation Hub Private Repository
tags: ["ansible", "aap", "pah", "hub" ]
categories: Ansible
last_modified_at: 2023-09-29
published: true
description: "Automation Hub - How to configure a private repository"
---

Background
----------
We want to allow users to create they own collection under company namespace, but not sharing with the rest of the Hub users

Procedures
----------
1. Create a Automation Hub group, but not adding any role to it.
2. Assign the user to the group.  For example, `hub_user2` is in `hub_group2`
![User and group](/assets/images/2023/2023-10-27-hub-user-group.png)
3. Create a private Automation Hub repository.  Make sure `Create Distribution` check box is selected.  Set `Pipeline` to `None`, otherwise the approval process will publish to the public `published` repo. ![Private repo](/assets/images/2023/2023-10-27-private-repository.png) 
4. Go to `Access` tab of the created repository, select the group created above ![Access group](/assets/images/2023/2023-10-27-private-repository-access-group.png)
5. Select `galaxy.ansible_repository_owner` role on the next step, and then click `Add` to complete ![Access role](/assets/images/2023/2023-10-27-private-repository-access-role.png)
6. We can add exisiting collection under the `Collection versions` tab, but we will push a new collection via command line.  Copy the info from the pop-up window by clicking `Copy CLI configuration` button on top right.  Update the `ansible.cfg` file with this new repo info.

    ```
    [galaxy]
    server_list = developer_repo
    
    [galaxy_server.developer_repo]
    url=https://aap-hub1.lab.automate.nyc/api/galaxy/content/developer_repo/
    token=my_token
    ```
7. Create the namesapce `automate_nyc` for our collection.
8. Under the `Access` tab of the created namespace, select the created group from above ![Namespace group](/assets/images/2023/2023-10-27-private-repository-namespace-group.png)
9. Select both `galaxy.collection_namespace_owner` and `galaxy.collection_publisher` to give the group full access to the repository content ![Namespace role](/assets/images/2023/2023-10-27-private-repository-namespace-role.png)
9. With the updated `ansible.cfg` pointing to `developer_repo`, push the collection using `ansible-galaxy`
```
ansible-galaxy collection publish automate_nyc-test-1.0.5.tar.gz
```
10. Verify the collection under the repository ![Collection](/assets/images/2023/2023-10-27-private-repository-collection.png)
11. But we won't be able to see it under `automate_nyc` namespace because the `Hide from search` option of the repository ![Namespace](/assets/images/2023/2023-10-27-private-repository-collection-namepace.png)
12. Other Hub users won't be able to see the repository or collection neither.
13. To use the collection in AAP, we will need to add a `Ansible Galaxy/Automation Hub API Token` specificly for this repository, similar to what we added to `ansible.cfg`, and assign to the organization