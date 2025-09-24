---
title: Using AAP Oauth Application
tags: ["ansible", "aap", "api", "session", "token", "oauth", "platform" ]
categories: Ansible
last_modified_at: 2025-09-19
published: true
description: "AAP - Creating OAuth application token linked to an OAuth user"
---

OAuth users are blocked to create token by default.  We would still want to create token to allow other applications that use NPID users to able to connect to AAP but maintaining RBAC rules applied to the users.

Perform these steps as user with AAP admin right.

## Create an OAuth Application
Creating the OAuth Application via the GUI (Access Management -> OAuth Applications) directly won't allow to attach to a user, so do either one of these instead.
### Using a ansible.platform collection
```yaml
---
- name: "AAP OAuth Application Example"
  hosts: localhost
  ignore_errors: true
  vars:
    aap: aap-node1.lab.automate.nyc
    username: admin
    password: your password
    default_org: "ABC"
    token_user: "eric@lab.automate.nyc"

  tasks:
  - name: "Login to AAP and create AAP token"
    ansible.platform.token:
      description: "OAuth token"
      scope: write
      state: present
      gateway_hostname: "{{ aap }}"
      gateway_username: "{{ username }}"
      gateway_password: "{{ password }}"
      gateway_validate_certs: false
    tags: always

  - name: "Create OAuth Application for association with user {{ token_user }}"
    ansible.platform.application:
      name: "OAuth Application Token for {{ token_user }}"
      description: "OAuth Application Example"
      organization: "{{ default_org }}"
      state: present
      authorization_grant_type: authorization-code
      client_type: confidential
      redirect_uris:
        - https://{{ aap }}/api/gateway/v1/
      gateway_hostname: "{{ aap }}"
      gateway_token: "{{ aap_token.token }}"
      gateway_validate_certs: false
      user: "{{ token_user }}"
    register: _oauth_application
    tags: gateway

  - name: "Output OAuth Application Info "
    ansible.builtin.debug:
      msg: "{{ _oauth_application }}"
```

Save the `client_id` and `client_secret` for later use
```yaml
TASK [Output OAuth Application Info] ***************************************************************************************************
ok: [localhost] => {
    "msg": {
        "changed": true,
        "client_id": "KtWnWDJOrLhhxKyVgGIxc4ObnXlh3GUVwK9x3LK0",
        "client_secret": "zgGTk4iuzO2YL96QTVLjc0T1wsxkaQHCqHlHusi7BBnYjRXXMTMlXqzHVWrEXmpZWLVI3YNsfMmkISwniH2srvxS7bo46ClZCJrd4B2TU8OOtt4ZgQqpZebQrbN1at4q",
        "failed": false,
        "id": 9,
        "name": "OAuth Application Token for eric@lab.automate.nyc"
    }
}
```

### Via API page
* Visit https://hostname/api/gateway/v1/applications/ API page
* Fill in the same info as in the playbook above
* Save the `client_id` and `client_secret` for later use

## Create a token linked to OAuth Application
### Via GUI
* Still as user with admin right, go to User Details -> Token tab and create a token with created OAuth application ![Token Creation](/assets/images/2025/2025-09-19-oauth-applications-token-1.jpg)
* Record the `Token` and `Refresh Token`.  Noted the `Expires` date for the token ![Tokens](/assets/images/2025/2025-09-19-oauth-applications-token-2.jpg)

### Via ansible.platform collection
For example
```yaml
  - name: "Create token"
    ansible.platform.token:
      description: "Token Example"
      organization: "{{ default_org }}"
      gateway_hostname: "{{ aap }}"
      gateway_token: "{{ aap_token.token }}"
      gateway_validate_certs: false
      state: present
      scope: write
      application: "OAuth Application Token for {{ token_user }}"
    register: _token
    tags: gateway
```

Noted that the created token won't be under the login admin user's personal access token tab.  Instead it will be found under the OAuth application token tab ![Token list](/assets/images/2025/2025-09-19-oauth-applications-token-3.jpg)

There is no way to see the token detail on the GUI.  We will have to follow the OAuth Application ID on the API page to see them.  For example: https://AAP_hostname/api/gateway/v1/applications/9/tokens/

## Test
Now the token is generated, it can be used as regular Bearer token until expiration date.
```shell
curl --silent -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" https://AAP_hostname/api/gateway/v1/me/ | jq .
```
It will show the OAuth Application user info, instead of the admin user that created the bearer token
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 15,
      "url": "/api/gateway/v1/users/15/",
      "related": {
        "activity_stream": "/api/gateway/v1/activitystream/?content_type=1&object_id=15",
        "created_by": "/api/gateway/v1/users/1/",
        "modified_by": "/api/gateway/v1/users/1/",
        "authenticators": "/api/gateway/v1/users/15/authenticators/"
      },
      "summary_fields": {
        "modified_by": {
          "id": 1,
          "username": "_system",
          "first_name": "",
          "last_name": ""
        },
        "created_by": {
          "id": 1,
          "username": "_system",
          "first_name": "",
          "last_name": ""
        },
        "resource": {
          "ansible_id": "021be5c1-84fe-4e62-bd1f-4e4292311de3",
          "resource_type": "shared.user"
        }
      },
      "created": "2025-07-09T19:56:44.973831Z",
      "created_by": 1,
      "modified": "2025-09-19T15:27:03.543688Z",
      "modified_by": 1,
      "username": "eric@lab.automate.nyc",
      "email": "eric@lab.automate.nyc",
      "first_name": "Eric",
      "last_name": "Chong",
      "last_login": "2025-09-19T15:27:03.580508Z",
      "password": "Password Disabled",
      "is_superuser": false,
      "is_platform_auditor": false,
      "managed": false,
      "last_login_results": {
        "13": {
          "access_allowed": true,
          "last_login_map_results": [
            {
              "11": "skipped",
              "enabled": true
            },
            {
              "13": false,
              "enabled": true
            },
            {
              "12": true,
              "enabled": true
            }
          ],
          "last_login_attempt": "2025-09-19T15:27:03.512089Z"
        }
      },
      "authenticators": [
        13
      ],
      "authenticator_uid": "251247971"
    }
  ]
}
```
## Managing the tokens
### Renew the token
To renew the token, we will need the `refresh_token`, `client_id` and `client_secret` from previous steps
```shell
curl --silent -X POST -u $CLIENT_ID:$CLIENT_SECRET \
-d "grant_type=refresh_token&refresh_token=$REFRESH_TOKEN" \
https://aap-node1.lab.automate.nyc/o/token/ | jq .
```
Save the new `token` and `refresh_token`
```json
{
  "access_token": "2nrR64trurN1bPJO0VTbo9OoAuXMaU",
  "expires_in": 31536000,
  "token_type": "Bearer",
  "scope": "write",
  "refresh_token": "vw4bqEsAzymEjcMCR0t6P8NfJnjUGi"
}
```
Note: Refreshing the token seems to change its ownership and hence the permission.  Need further investigation.

### Revoke the token
Delete the token from the GUI or via API
```shell
curl --silent -X POST -u $CLIENT_ID:$CLIENT_SECRET -d "token=$TOKEN" https://aap-node1.lab.automate.nyc/o/revoke_token/
```