var store = [{
        "title": "How to set fact on another host",
        "excerpt":"How to set fact on another host? Use delegate_to and delegate_fact together - name: Store some fact on host B set_fact: server_description: This is host B delegate_to: host_B delegate_facts: true Otherwise, fact will not be associate with delegate_to host. For example, we need to copy the SSH public key from...","categories": ["Ansible"],
        "tags": ["Ansible","set_fact","inventory"],
        "url": "/ansible/How_to_set_fact_on_another_host/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to create a host in Tower inventory",
        "excerpt":"How to create a host in Tower via REST API call? First we need to get the inventory id. curl -k -X GET -u admin:ar2iis! https://dvnv-rhans01.dev.iisl.com/api/v2/inventories/ To create a host under inventory ID 15. curl -X POST \\ https://&lt;Tower hostname&gt;/api/v2/hosts/ \\ -H 'authorization: Basic XXXXXXXXXXXXXXXX’ \\ -H 'cache-control: no-cache' \\...","categories": ["Ansible"],
        "tags": ["Ansible","Tower","REST"],
        "url": "/ansible/Create_a_host_in_Tower_inventory/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Markdown cheatsheet",
        "excerpt":"Where to get markdown language syntax and cheat sheet?   Markdown Cheatsheet   Another one  ","categories": ["Markdown"],
        "tags": ["markdown"],
        "url": "/markdown/Markdown_cheat_sheet/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to set cached fact in Tower",
        "excerpt":"How to set persistent fact in Tower? The playbook set_fact task must set “cacheable: true” - name: set cached fact set_fact: my_var1: 'this is a fact' my_var2: 'it is cacheable' cacheable: true In Tower, check option “Use Fact Cache” for the job template. The facts will be store with the...","categories": ["Ansible"],
        "tags": ["Ansible","set_fact","Tower"],
        "url": "/ansible/How_to_set_cached_fact_in_Tower/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to run task only on the first node in group",
        "excerpt":"How to run task only on first node in group   Check the group array   For example  - name: Ping first node listed in group \"tower\"   ping:   when: inventory_hostname == groups['tower'][0]  ","categories": ["Ansible"],
        "tags": ["Ansible","inventory"],
        "url": "/ansible/How_to_run_only_on_first_node_in_group/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to call groups in the inventory",
        "excerpt":"# To see all hosts in the inventory ansible all -i inventory --list-hosts ansible '*' -i inventory --list-hosts To see all hosts by wild cards ansible '*.example.com' -i inventory --list-hosts ansible '192.168.1.*' -i inventory --list-hosts To see hosts in groups ‘lab’ or ‘datacenter1’ ansible lab:datacenter1 -i inventory --list-hosts To see...","categories": ["Ansible"],
        "tags": ["Ansible","inventory"],
        "url": "/ansible/How_to_call_groups_in_inventory/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to check yaml syntax",
        "excerpt":"Using python yaml module python -c 'import yaml, sys; print yaml.load(sys.stdin);' &lt; my_playbook.yml If no syntax error exists, Python prints the contents of the YAML file to stdout in JSON format. The example here shows the use of the Python method on a YAML file with valid syntax. Use –syntax-check...","categories": ["Ansible"],
        "tags": ["Ansible","yaml"],
        "url": "/ansible/How_to_check_yaml_syntax/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to enter multilines text",
        "excerpt":"Use | or &gt; sign Use Preserves line returns within string: include_newlines: | Example Company 123 Main Street Atlanta, GA 30303 Use &gt; Converts line returns to spaces. Removes leading white spaces in lines Use to break long strings at space characters Spanning multiple lines promotes better readability fold_newlines: &gt;...","categories": ["Ansible"],
        "tags": ["Ansible"],
        "url": "/ansible/How_to_enter_multilines_text/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to determine variable precedence",
        "excerpt":"Lowest precedence to hightest Role default variables Inventory variables Inventory group_vars variables: Inventory host_vars variables: group_vars variables defined in group_vars directory host_vars variables defined in host_vars directory Host facts Registered variables Variables defined via set_facts: Variables defined with -a or –args vars_prompt variables Variables included using vars_files role and include...","categories": ["Ansible"],
        "tags": ["Ansible"],
        "url": "/ansible/Variable_Precedence/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to check async task status",
        "excerpt":"How to check async task status Asynchronous Task Status To check task status, use async_status module Required parameter: Job or task identifier: --- # Async status - fire-forget.yml - name: Async status with fire and forget task hosts: demoservers remote_user: devops become: true tasks: - name: Download big file get_url:...","categories": ["Ansible"],
        "tags": ["Ansible","async_status"],
        "url": "/ansible/Async_status_check/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to use virtualenv Python on localhost",
        "excerpt":"Force to use virtualenv python  When running modules that require virtualenv, such as Azure, local_action or localhost connection sometimes still  use the  default /usr/bin/python   localhost ansible_python_interpreter=python  now localhost will run python from the activated virtualenv. See this  ","categories": ["Ansible"],
        "tags": ["Ansible","virtual environment","Python"],
        "url": "/ansible/Use_virtualenv_on_localhost/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to refresh inventory mid play",
        "excerpt":"Refresh inventory mid play  - meta: refresh_inventory  ","categories": ["Ansible"],
        "tags": ["Ansible","inventory"],
        "url": "/ansible/How_to_refresh_inventory_mid_play/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to replace multiple lines in file",
        "excerpt":"Replacing multiple lines in file - name: Set some kernel parameters lineinfile: dest: /etc/sysctl.conf regexp: \"\" line: \"\" with_items: - { regexp: '^kernel.shmall', line: 'kernel.shmall = 2097152' } - { regexp: '^kernel.shmmax', line: 'kernel.shmmax = 134217728' } - { regexp: '^fs.file-max', line: 'fs.file-max = 65536' } Replacing a block of...","categories": ["Ansible"],
        "tags": ["Ansible","lineinfile","blockinfile","RegEx"],
        "url": "/ansible/How_to_replace_multiple_lines_in_file/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to start asynchronous task and check status",
        "excerpt":"Start the asynchronous task and check status later    - name: Run sleep     shell: sleep 30     async: 30     poll: 0     register: async_output    - debug:       msg: \"Started an async job \"    - name: check async status     async_status:       jid: \"\"     register: async_result     until: async_result.finished     retries: 50     delay: 5  ","categories": ["Ansible"],
        "tags": ["Ansible","async_status"],
        "url": "/ansible/How_to_start_a_task_and_check_back_later/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to install virtual environment with specific versions of Python and Ansible",
        "excerpt":"How to install a virtual environment with specific versions of Python and Ansible  download python-2.7.5 ./configure --prefix=/home/echong/PYTHON-2.7.5 make make install virtualenv --python=PYTHON-2.7.5/bin/python venv-azure source venv-azure/bin/activate pip install ansible[azure]==2.5.0  ","categories": ["Ansible"],
        "tags": ["Ansible","Python","virtual environment"],
        "url": "/ansible/How_to_setup_specific_versions_of_Ansible_and_Python/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to replace a substring in variable with regex",
        "excerpt":"How to replace a substring in variable with regex For example, we nee to reconstruct the path to the .vmx file of a VM. The information is pull from vmware_guest_facts task into a list called hw_files. The list of strings look like this \"hw_files\": [ \"[1node_vsan] bdf3125b-a135-fd6b-c56c-f44d3068826f/2-tet.vmx\", \"[1node_vsan] bdf3125b-a135-fd6b-c56c-f44d3068826f/2-tet.nvram\", \"[1node_vsan]...","categories": ["Ansible"],
        "tags": ["Ansible","RegEx","filter","regex_replace"],
        "url": "/ansible/How_to_replace_substring_with_regex/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to wait until a lock file is removed by other process",
        "excerpt":"Wait until a lock file is removed by other process    - name: Wait until lock file is     stat:       path: \"\"     register: lck_file     until: lck_file.stat.exists == False     retries: 10     delay: 5     when: inventory_hostname != esxi_host.name     delegate_to: \"\"  ","categories": ["Ansible"],
        "tags": ["Ansible","stat"],
        "url": "/ansible/How_to_wait_until_a_lock_file_disappear/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to create a virtual NIC on vnet from a different resource group",
        "excerpt":"How to create a virtual NIC on vnet from a different resource group.   Specify the full path of the vnet https://github.com/ansible/ansible/issues/29607     - name: Create virtual NIC      azure_rm_networkinterface:       resource_group: \"\"       virtual_network: \"/subscriptions//resourceGroups//providers/Microsoft.Network/virtualNetworks/\"       subnet: \"\"       name: \"\"  ","categories": ["Ansible"],
        "tags": ["Ansible","Azure"],
        "url": "/ansible/How_to_create_vnic_on_vnet_from_other_resource_group/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to loop",
        "excerpt":"Loops   https://chromatichq.com/blog/untangling-ansible-loops      with_items   with_subelements   with_dict   with_nested   ","categories": ["Ansible"],
        "tags": ["Ansible","loop"],
        "url": "/ansible/How_to_loop/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to accept EULA when yum installing something?",
        "excerpt":"How to accept EULA when yum installing something?   - name: Install mssql-tools and msodbcsql   yum:     name: \"\"     state: present   with_items:     - mssql-tools     - msodbcsql   environment:     ACCEPT_EULA: 'y'   become: true   become_user: root  ","categories": ["Ansible"],
        "tags": ["Ansible","yum"],
        "url": "/ansible/How_to_accept_EULA_in_yum/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to test connection to host",
        "excerpt":"How to test connection to host We need to test connection to hosts, and run tasks on hosts that are online. Hosts that are offline will be marked unreachable. We need to clear them and continue next tasks on all hosts no matter they are online or off. - name:...","categories": ["Ansible"],
        "tags": ["Ansible","wait_for_connection"],
        "url": "/ansible/How_to_test_host_connections/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to enable or disable a host during import",
        "excerpt":"How to enable or disable a host during import We want to able to control the available of a managed host that is imported from dynamic inventory script. Default behavior only allow disabling manually created host. Host imported with dynamic inventory is always enabled. To change this behavior: Create a...","categories": ["Ansible"],
        "tags": ["Ansible","inventory"],
        "url": "/ansible/How_to_enable_or_disable_host_during_import/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to use Azure Rest API",
        "excerpt":"How to use Azure REST API. Use azure_rm_resource module. Install the Azure REST for Ansible extension for VSCode to help create the skeleton Ansible task. It works best with Ansible 2.7. Below version 2.7, it seems to require to uncomment the url line. For example, to run command on VM...","categories": ["Ansible"],
        "tags": ["Ansible","Azure","Cloud"],
        "url": "/ansible/How_to_use_azure_rest_api/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to cache facts locally when not using Tower",
        "excerpt":"How to cache facts locally when not using Tower Default running ansible from command line only cache facts in memory. To store them locally in a file, change the following in local or global ansible.cfg #fact_caching = memory # Cache facts to local file fact_caching = yaml fact_caching_connection = \"/some_dir/ansible_cached_facts\"...","categories": ["Ansible"],
        "tags": ["Ansible","fact"],
        "url": "/ansible/How_to_fact_caching_locally/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to expand a variables using Jinja2 template",
        "excerpt":"How to expand a variables using Jinja2 template Problem: We want to generate a list of VMs and past it to our VM creation role that will take a list as input. Each VM in the list could be a little different, for example, different disk size or definitely different...","categories": ["Ansible"],
        "tags": ["Ansible","Jinja2","filter","lookup"],
        "url": "/ansible/How_to_import_variables_from_j2/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to authenticate with token to REST API",
        "excerpt":"How to authenticate with server and retrieve a token. Then submit a JSON file via REST API. To login and obtain a token. Then submit a payload file using the given token. --- - hosts: localhost gather_facts: no connection: local vars: username: user1 domain: dev auth_url: http://server1/SysInfo/auth/login api_url: http://server1/SysInfo/api/hw/v1/ json_file:...","categories": ["Ansible"],
        "tags": ["Ansible","REST","token"],
        "url": "/ansible/How_to_authenticate_with_auth_token/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to launch a job or workflow via REST API call",
        "excerpt":"How to launch a job or workflow via REST API call tasks: - name: Launch Tower Job uri: url: '{{ tower_url }}/job_templates/{{ template_id }}/launch/' return_cotent: yes method: POST user: admin password: password headers: Content-Type: 'application/json' body: \"{\\\"extra_vars\\\":{\\\"sleep_time\\\":\\\"5\\\"}}\" status_code: 201 register: output - name: Get job status uri: url: '{{ tower_url...","categories": ["Ansible"],
        "tags": ["Ansible","Tower","job","REST"],
        "url": "/ansible/How_to_launch_job_via_API/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to pass variables between job templates in a workflow template",
        "excerpt":"How to pass variables between job templates in a workflow template Use the set_stats module to store variables in one job template and then retrive them as variables in following job templates. - name: Set stats set_stats: data: myvar: first template status Check Ansible doc for other options of set_stats...","categories": ["Ansible"],
        "tags": ["Ansible","Tower","job"],
        "url": "/ansible/How_to_pass_variables_between_job_templates_in_workflow/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Some useful magic variables",
        "excerpt":"It is just magic     role_name : current role name   role_names : list of roles in current play   groups : list of groups and their hosts   inventory_hostname : name of current host   play_hosts: list of hosts in current play   More https://docs.ansible.com/ansible/latest/reference_appendices/special_variables.html  ","categories": ["Ansible"],
        "tags": ["Ansible"],
        "url": "/ansible/Magic_variables/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to use user data to setup WinRM for Ansible on AWS Windows Instance",
        "excerpt":"How to use user data to setup WinRM on AWS user_data: | &lt;powershell&gt; $url = \"https://raw.githubusercontent.com/ansible/ansible/devel/examples/scripts/ConfigureRemotingForAnsible.ps1\" $file = \"$env:temp\\ConfigureRemotingForAnsible.ps1\" (New-Object -TypeName System.Net.WebClient).DownloadFile($url, $file) powershell.exe -ExecutionPolicy ByPass -File $file -EnableCredSSP $Password = ConvertTo-SecureString \"Password\" -AsPlainText -Force New-LocalUser \"local_ansible\" -Password $Password -FullName \"Ansible User\" -Description \"For running Ansible\" Add-LocalGroupMember -Group Administrators -Member...","categories": ["Ansible"],
        "tags": ["Ansible","AWS","Windows","WinRM"],
        "url": "/ansible/How_to_setup_winrm_with_user_data/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to sort a list of dictionay objects",
        "excerpt":"How to sort a list of dict objects Example data from list of datastores from vCenter: \"datastores\": [ { \"accessible\": true, \"capacity\": 444797550592, \"datastore_cluster\": \"N/A\", \"freeSpace\": 426470539264, \"maintenanceMode\": \"normal\", \"multipleHostAccess\": false, \"name\": \"hqdev-esx1_local\", \"provisioned\": 18327011328, \"type\": \"VMFS\", \"uncommitted\": 0, \"url\": \"ds:///vmfs/volumes/524aa72f-de223a5e-b4f1-78e3b50b2d88/\" }, { \"accessible\": true, \"capacity\": 733634101248, \"datastore_cluster\": \"N/A\", \"freeSpace\":...","categories": ["Ansible"],
        "tags": ["Ansible","dictionary","list"],
        "url": "/ansible/How_to_sort_a_list_of_dict/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to write data from multiple hosts to a single file",
        "excerpt":"How to write data from multiple hosts to a single file We need to gather information from multiple hosts and store them to a single file. Possibly email it to someone as an attachment. We can use lineinfile or blockinfile module with delegate_to localhost to write the information to a...","categories": ["Ansible"],
        "tags": ["Ansible","set_fact","blockinfile"],
        "url": "/ansible/How_to_write_data_from_different_hosts_to_single_file/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to append facts to a dictionary and append it to a list",
        "excerpt":"How to append facts to a dictionary and append it to a list We need to store some facts using set_fact, but we want to store them in a dictionary format. For example, we want to store dictionary user information into a list accounts tasks: - name: New dict set_fact:...","categories": ["Ansible"],
        "tags": ["Ansible","set_fact","dictionary","list"],
        "url": "/ansible/How_to_append_facts_to_dict_and_list/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to launch Tower job using Curl",
        "excerpt":"How to launch Tower job using Curl Launching a job template from command line using Curl. Passing extra_vars in the body. Make sure extra variables “Prompt on launch” is enabled, so extra_vars can be passed. curl -f -k -H 'Content-Type: application/json' -H 'Authorization: Bearer YF6pz330n7MjOGiZ5mQEM0024X6Ut7' -XPOST -d '{\"extra_vars\": \"{\\\"hello\\\": \\\"world\\\"}\"...","categories": ["Ansible"],
        "tags": ["Ansible","Tower","job","curl"],
        "url": "/ansible/How_to_launch_job_with_curl/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to use different SSH keys for different Git Repos",
        "excerpt":"How to use different SSH keys for different Git repos Each Git repo is assigned with it’s own deploy key. We can configure the .ssh/config file to use different keys for each repo. Modify the config file “Host” field with a unique name, e.g. adding “-repo_name” after the hostname. $...","categories": ["Ansible"],
        "tags": ["Ansible","SSH","Git"],
        "url": "/ansible/How_to_use_different_SSH_keys_for_git/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to create smart inventory",
        "excerpt":"Smart inventory filter examples   These examples show how to create smart inventory in Tower using facts.   Hosts with a cached fact “some_fact” with value “some_value”  ansible_facts.some_fact:\"some_value\"   Using collected facts  ansible_facts.facter_os.name:\"RedHat\" ansible_facts.facter_os.release.full:\"7.6\" ansible_facts.facter_os.release.major:\"7\" ansible_facts.facter_dmi.product.name:\"VMware Virtual Platform\"  ","categories": ["Ansible"],
        "tags": ["Ansible","inventory","smart inventory","Tower"],
        "url": "/ansible/How_to_create_smart_inventory/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to run tasks on some nodes only",
        "excerpt":"How to run tasks on some nodes only Only on first node in group Check the group array For example - name: Ping first node listed in group \"tower\" ping: when: inventory_hostname == groups['tower'][0] Only if node is in group Is the host in group node_b? --- - hosts: -...","categories": ["Ansible"],
        "tags": ["Ansible","inventory"],
        "url": "/ansible/How_to_run_tasks_on_some_nodes_only/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to search activity stream on Tower",
        "excerpt":"How to search events in activtiy stream   Finding all user creation events  https://&lt;Tower Hostname&gt;/api/v2/activity_stream/?operation=create&amp;object1=user   Finding all lauch job events  /api/v2/activity_stream/?operation=create&amp;object1=job   Finding all delete job template events  /api/v2/activity_stream/?operation=delete&amp;object1=job_template   ","categories": ["Ansible"],
        "tags": ["Ansible","Tower","activity stream"],
        "url": "/ansible/How_to_search_activity_stream/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to search on Tower",
        "excerpt":"Some examples to use the search box in Tower to filter or create smart inventory see Automation Controller API Guide - Filtering old URL https://docs.ansible.com/ansible-tower/latest/html/towerapi/filtering.html Find disabled hosts enabled:false Find hosts with hostvar defined variables.icontains:myvar Use as host filter on tower-cli tower-cli host list --host-filter 'variables__icontains=application' Find hosts with ansible...","categories": ["Ansible"],
        "tags": ["Ansible","Tower","search"],
        "url": "/ansible/How_to_search/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to setup inventory file",
        "excerpt":"How to setup inventory   Define a list of host variables in INI file  oracle.lab.home  instances='[\"db1\",\"db2\",\"db3\"]'   ","categories": ["Ansible"],
        "tags": ["Ansible","invenory"],
        "url": "/ansible/How_to_inventory/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to setup Tower notification for MS Team",
        "excerpt":"Setup Tower notification for MS Teams   https://github.com/ansible/awx/issues/885      In MS Team channel, go to More Options -&gt; Connectors.  Configure “Incoming Webhook”.  Assign a name and create.   Copy the generated URL.   Create a Tower Notification using Mattermost type.  Paste the Team Webhook URL into TARGET URL  ","categories": ["Ansible"],
        "tags": ["Ansible","Tower","notification","Microsoft Teams"],
        "url": "/ansible/How_to_Team_notification/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to use Jinja2 inside a playbook",
        "excerpt":"How to use Jinja2 inside a playbook To create variables - set_fact: foo: | {% set aks_modified = dict() %} {% for ak in activation_keys %} {{ aks_modified.update({ak:[]}) }} {% endfor %} {{ aks_modified | to_json }} To loop in range - debug: msg: | {%- for i in range(0,10)...","categories": ["Ansible"],
        "tags": ["Ansible","Jinja2"],
        "url": "/ansible/How_to_use_Jinja2_in_playbook/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to update a text file",
        "excerpt":"How to update text file      Need to add account ansible_acct_name to SYS_ADMIN group in sudo file if it is not already there.       - name: Add svc_ansible to sudo file  lineinfile:    path: /etc/sudoers    state: present    backrefs: yes    regex: '(^User_Alias\\s+SYS_ADMIN\\s+)=(((?!).)*)$'    line: '\\1=\\2, '    validate: /usr/sbin/visudo -cf %s          ","categories": ["Ansible"],
        "tags": ["Ansible","RegEx","lineinfile"],
        "url": "/ansible/How_to_update_text_file/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to add a custom firewall rule to ESXi",
        "excerpt":"How to add a custom firewall rule to ESXi The vCenter or ESXi web GUI only allow turning pre-fined ports on and off. What to do if we need to add a custom port? For example, connecting to a iSCSI device using port 3261. Create an XML file /etc/vmware/firewall/custom_iscsi.xml &lt;!--...","categories": ["VMware"],
        "tags": ["VMware","ESXi","firewall"],
        "url": "/vmware/ESXi-custom-firewall-rule/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Example usage of the new Oracle SQLcl client sqlformat",
        "excerpt":"Oracle SQLcl sqlformat Set display format SQL&gt; set sqlformat ansiconsole; SQL&gt; select owner, table_name from all_tables where owner LIKE 'HR%'; OWNER TABLE_NAME HR REGIONS HR COUNTRIES HR LOCATIONS HR DEPARTMENTS HR JOBS HR EMPLOYEES HR JOB_HISTORY SQL&gt; set sqlformat csv; SQL&gt; select owner, table_name from all_tables where owner LIKE 'HR%';...","categories": ["Oracle"],
        "tags": ["Oracle","SQLcl","SQL"],
        "url": "/oracle/Oracle_SQLcl_sqlformat/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to get a list of disks from facts",
        "excerpt":"Get the list of block devices from facts gathering   To just display the list of devices     - debug:       msg: \"{{ ansible_devices.keys() }}\"   Get list of devices with “Virtual disk” as model     - debug:       msg: '{{ ansible_devices | dict2items | selectattr(\"value.model\",\"equalto\",\"Virtual disk\") | map(attribute=\"key\") | list }}'   ","categories": ["Ansible"],
        "tags": ["Ansible","facts","search"],
        "url": "/ansible/How_to_get_list_of_disks/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Create user with shared home",
        "excerpt":"Create user with shared home When /home is on a NFS mount, most likely the user home directory is already created from other hosts. Use following steps to avoid error when creating user but not creating the home directory. tasks: - name: Check if user home directory already exists stat:...","categories": ["Ansible"],
        "tags": ["Ansible","jinja2","user"],
        "url": "/ansible/Create_user_with_shared_home/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Find VM with the same name",
        "excerpt":"Find VM with the same name We want to make sure the VM only exists in the folder we want or not exists at all. - name: Find VM with the same name vmware_guest_find: hostname: \"{{ vmware_vm_vcenter.hostname }}\" username: \"{{ vmware_vm_vcenter.username }}\" password: \"{{ vmware_vm_vcenter.password }}\" validate_certs: \"{{ vmware_vm_vcenter.validate_certs |...","categories": ["Ansible"],
        "tags": ["Ansible","VMware","vm"],
        "url": "/ansible/Find_VM_with_the_same_name/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "json_query example with multiple search patterns",
        "excerpt":"Find VM IP address when not on the defined VM network We deployed a KVM VM using macvtap connect directly to the physical network and getting a DHCP address. How can we get the VM IP address from the hypervisor and use it in Ansible? First pull the interfaces information...","categories": ["Ansible"],
        "tags": ["Ansible","json_query","libvirt","kvm","virsh"],
        "url": "/ansible/JSON_query_example/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Sudo Samples",
        "excerpt":"Sudoer samples Sources http://www.courtesan.com/sudo/sample.sudoers https://www.sudo.ws/readme.html # # Sample /etc/sudoers file. # # This file MUST be edited with the 'visudo' command as root. # # See the sudoers man page for the details on how to write a sudoers file. ## # Override built-in defaults ## Defaults syslog=auth Defaults&gt;root !set_logname...","categories": ["Linux"],
        "tags": ["sudo","linux","unix"],
        "url": "/linux/sudo_samples/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Gettinng libselinux-python error in virtual environment or SCL",
        "excerpt":"Getting this error when running Ansible template task with Python3 in virtual environment or SCL TASK [template] ********************************************************************************************************************************************************** fatal: [localhost]: FAILED! =&gt; {\"changed\": false, \"checksum\": \"09908cdcefd9544ab2de069d1a9e3d31a15220db\", \"msg\": \"Aborting, target uses selinux but python bindings (libselinux-python) aren't installed!\"}TASK [template] ********************************************************************************************************************************************************** fatal: [localhost]: FAILED! =&gt; {\"changed\": false, \"checksum\": \"09908cdcefd9544ab2de069d1a9e3d31a15220db\", \"msg\": \"Aborting, target...","categories": ["Ansible"],
        "tags": ["ansible","linux","selinux"],
        "url": "/ansible/ansible-libselinux-error/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "Ansible Variables Precedence Gotcha",
        "excerpt":"I recently got tripped by Ansible variables precedence. We are familiar with the precedence concept. Sometime in a complex playbooks, it help to remember how variables are loaded. In recent project, a playbook is used to deploy configuration to a brand new Cisco switch setup with a temporary password. The...","categories": ["Ansible"],
        "tags": ["ansible","linux"],
        "url": "/ansible/ansible-precedence/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to filter hosts on Tower inventory import",
        "excerpt":"How to filter hosts on Tower inventory import Some examples using filters when importing inventory from vCenter. See the plugin doc for details. Scenario 1 Import VMs in vCenter only with tag “import_to_inventory” under the categories “Test” and “Tower” Put VMs into group name of the corresponding tag category Import...","categories": ["Ansible"],
        "tags": ["ansible","tower","vcenter","vmware"],
        "url": "/ansible/inventory-filter/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to setup RHEL 8 to run as a kiosk",
        "excerpt":"How to setup RHEL 8 to run as a kiosk While investigate how to setup a PC as a kiosk, I found this blog post describing this RHEL 8 feature. It basically run a minimum Gnome desktop, autologin as the kiosk user and launch the kiosk app. It also disabled...","categories": ["RHEL"],
        "tags": ["rhel","kiosk"],
        "url": "/rhel/rhel-kisok/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to deploy AAP 2.1 on OpenShift from CLI",
        "excerpt":"How to deploy AAP 2.1 on OpenShift from CLI without Cluster Admin privileges (kind of) Ask Cluster Admin to assign the following permission to access the OperatorHub oc create clusterrolebinding user-aggregate-olm-view --clusterrole=aggregate-olm-view --user=myname Cluster Admin also need to create an OperatorGroup for your namespace. Create operator-group.yaml apiVersion: operators.coreos.com/v1alpha2 kind: OperatorGroup...","categories": ["Ansible"],
        "tags": ["openshift","operator","ansible","aap"],
        "url": "/ansible/deploy-aap-openshift-cli/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to create a new execution environment",
        "excerpt":"Build a new EE image We would like to use a third part collection, in this case community.efficientip and community.crypto, in our playbooks. The collection is currently in the Automation Hub server and it requires a Python modules, SOLIDserverRest and pyOpenSSL, which are available via pip. The playbooks we are...","categories": ["Ansible"],
        "tags": ["ansible","aap","ee","execution environment","docker","podman","container"],
        "url": "/ansible/create-new-ee/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to setup a lab LDAP for AAP controller and hub",
        "excerpt":"Automation Hub, LDAP and SSO Latest version of Automation Hub does not has built-in LDAP support. Instead it relies on Red Hat SSO to provide integration with the LDAP authentication. Fortunately the AAP installation playbooks will assist setting up the SSO application on a separate VM with Automation Hub. Openldap...","categories": ["Ansible"],
        "tags": ["ansible","aap","docker","podman","container","Tower","Automation Hub","LDAP","OpenLDAP"],
        "url": "/ansible/lab-ldap-for-aap/",
        "teaser": "/assets/images/background_nyc.png"
      },{
        "title": "How to setup an OpenShift container group with AAP",
        "excerpt":"Ansible Automation Platform Container Groups AAP Container Groups is just like Instance Groups. However, the playbooks will be executed in a pod running in your OpenShift or Kubernetes environment. You can find the details at Container and Instance Groups What if you want to test this out but don’t have...","categories": ["Ansible"],
        "tags": ["ansible","aap","container","Tower","OpenShift"],
        "url": "/ansible/aap-container-group/",
        "teaser": "/assets/images/background_nyc.png"
      }]
