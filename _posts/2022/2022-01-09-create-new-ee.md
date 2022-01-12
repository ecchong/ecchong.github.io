---
title: How to create a new execution environment
tags: ["ansible", "aap", "ee", "execution environment", "docker", "podman", "container" ]
categories: Ansible
---

# Build a new EE image
We would like to use a third part collection, in this case `community.efficientip`, in our playbooks. The collection is currently in the Automation Hub server and it also requires a Python module, `SOLIDserverRest`, which is available via pip.  Since this Python module is no available in the standard execution environment, we will need to create a new EE image using `ansible-builder` 

Inside the build directory, create a file called `execution-environment.yml`:
````yaml
---
version: 1

build_arg_defaults:
  EE_BASE_IMAGE: 'aap-hub1.lab.automate.nyc/ee-supported-rhel8'

dependencies:
  python: requirements-efficientip.txt
  galaxy: requirements.yml

ansible_config: 'ansible.cfg'

additional_build_steps:
  prepend: |
    RUN pip3 install --upgrade pip wheel setuptools
````
We are going to use the standard EE image `ee-supported-rhel8` from my Automation Hub server `aap-hub1.lab.automate.nyc` as base image.  The dependency files identify required Python modules and collections.  In our case, the `requirement-efficientip.txt` contains the Python module name in pip format:
````
SOLIDserverRest
````
The `requirements.yml` file contains the list of required collections:
````yaml
---
collections:
- community.crypto
- community.efficientip
````
Since we will be pulling collections from our Automation Hub server, we will need to configure the `ansible.cfg` file with proper credentials:
````ini
[galaxy]
server_list = automation_hub, rh-certified_repo, published_repo, community_repo

[galaxy_server.automation_hub]
url=https://aap-hub1.lab.automate.nyc/api/galaxy/
token=<token string>

[galaxy_server.rh-certified_repo]
url=https://aap-hub1.lab.automate.nyc/api/galaxy/content/rh-certified/
token=<token string>

[galaxy_server.published_repo]
url=https://aap-hub1.lab.automate.nyc/api/galaxy/content/published/
token=<token string>

[galaxy_server.community_repo]
url=https://aap-hub1.lab.automate.nyc/api/galaxy/content/community/
token=<token string>
````
To create a new image, run command:
````shell
ansible-builder build --tag aap-hub1.lab.automate.nyc/efficientip_ee --container-runtime docker
````
The image will be tagged with our Automation Hub server name, so it can be pushed to our server once it is created.  Default `ansible-builder` command will use `podman`, but in this case we will be using `docker` while running on MacOS.

After the build is done, we can verify the new image with `ansible-navigator` command.  To list the installed collections:
````shell
ansible-navigator collections --ce docker  --eei aap-hub1.lab.automate.nyc/efficientip_ee
````
Again, we are running on MacOS, so we will need to specify to use `docker` as our container engine.

Publish the EE image with the same method as to any container registry:
````shell
$ docker login --username admin aap-hub1.lab.automate.nyc
Password: 
Login Succeeded
$ docker push aap-hub1.lab.automate.nyc/efficientip_ee
Using default tag: latest
The push refers to repository [aap-hub1.lab.automate.nyc/efficientip_ee]
206894a40f6c: Layer already exists 
2e257b8b9924: Layer already exists 
d1803f81822a: Layer already exists 
9b2e1ea8a49b: Layer already exists 
4fe50fe3a3b7: Layer already exists 
c02d758c2215: Layer already exists 
a65a1b01a4d2: Layer already exists 
af092941766c: Layer already exists 
latest: digest: sha256:8deba4dad1c74013ab02c41ce5f87f1353b4e85841ae88eacafdc8d9aed9b4fe size: 2009
````

# References
[Introduction to Ansible Builder](https://www.ansible.com/blog/introduction-to-ansible-builder)

[Automating execution environment image builds with GitHub Actions](https://www.ansible.com/blog/automating-execution-environment-image-builds-with-github-actions)