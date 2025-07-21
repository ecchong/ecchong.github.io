---
title: Using AAP session authentication for API calls
tags: ["ansible", "aap", "api", "session", "token" ]
categories: Ansible
last_modified_at: 2025-07-21
published: true
description: "AAP - Using AAP session authentication for API calls"
---

While reading the [Automation execution API overview](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/automation_execution_api_overview/controller-api-auth-methods) doc, I noticed that beside [OAuth 2 token](https://www.automate.nyc/ansible/How_to_authenticate_with_auth_token/), and basic auth with username and password, we can also use gateway session ID cookie.

Here is a quick summary of steps using CURL and shell script.

## Get the CSRF Token
Hitting the login page with curl
```shell
curl -s -c - https://$AAP_HOSTNAME/api/gateway/v1/login/
```
will generate the `csrfToken` somewhere in the output like
```shell
...
</div>

      <script type="application/json" id="drf_csrf">
        {
          "csrfHeaderName": "X-CSRFToken",
          "csrfToken": "eC1zNXSLZHTE6xqu9xwC6TU57HS91b8uDAfwVsac6Uaonmi31D4cB8tFcPcqzGwn"
        }
      </script>
      <script src="/static/rest_framework/js/jquery-3.7.1.min.js"></script>
      <script src="/static/rest_framework/js/ajax-form.js"></script>
...
```

### Get the gateway_sessionid cookie
Using the `csrfToken`, login with `username` and `password`
```shell
curl -s -X POST -D - -H 'Content-Type: application/x-www-form-urlencoded' \
--referer https://$AAP_HOSTNAME/api/gateway/v1/login/ \
-H "X-CSRFToken: $CSRFTOKEN" \
--data "username=$AAP_USERNAME&password=$AAP_PASSWORD" \
--cookie "csrftoken=$CSRFTOKEN" \
https://$AAP_HOSTNAME/api/gateway/v1/login/
```
Check the header output of the response and look for `gateway_sessionid` cookie
```shell
HTTP/1.1 302 Found
server: envoy
date: Mon, 21 Jul 2025 21:41:23 GMT
content-type: text/html; charset=utf-8
content-length: 0
location: /api/gateway/v1/
expires: Mon, 21 Jul 2025 21:41:23 GMT
cache-control: max-age=0, no-cache, no-store, must-revalidate, private
vary: Cookie
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: same-origin
cross-origin-opener-policy: same-origin
set-cookie: csrftoken=CoVFnyrQg4QZDthOpsqmIyUNJ7W2JBvJ; expires=Mon, 20 Jul 2026 21:41:23 GMT; Max-Age=31449600; Path=/; SameSite=Lax; Secure
set-cookie: gateway_sessionid=9tltx97vwynzpdw0xbohp2vtwo2suvbu; expires=Mon, 21 Jul 2025 21:56:23 GMT; HttpOnly; Max-Age=900; Path=/; SameSite=Lax; Secure
strict-transport-security: max-age=63072000
x-content-type-options: nosniff
x-envoy-upstream-service-time: 260
```
Now we can access other APIs using this `gateway_sessionid` cookie.  For example, to check the status
```shell
curl -X GET -H 'Cookie: gateway_sessionid=9tltx97vwynzpdw0xbohp2vtwo2suvbu;'  https://$AAP_HOSTNAME/api/gateway/v1/status/
```

### Note
* No OAuth2 token will be generated under the authenticated user
* The session ID expiration is controlled by Settings -> Platform gateway -> Session cookie age

### Complete shell script
```shell
AAP_HOSTNAME=hostname
AAP_USERNAME=username
AAP_PASSWORD=password

CSRF_TOKEN=$(curl -s -c - https://$AAP_HOSTNAME/api/gateway/v1/login/ | awk '/<script type="application\/json" id="drf_csrf">/{flag=1; next} /<\/script>/{flag=0} flag' | jq .csrfToken)

SESSIONID=$(curl -s -X POST -D - -H 'Content-Type: application/x-www-form-urlencoded' \
--referer https://$AAP_HOSTNAME/api/gateway/v1/login/ \
-H "X-CSRFToken: $CSRFTOKEN" \
--data "username=$AAP_USERNAME&password=$AAP_PASSWORD" \
--cookie "csrftoken=$CSRFTOKEN" \
https://$AAP_HOSTNAME/api/gateway/v1/login/ | awk '/gateway_sessionid/ {print $2}')

curl -X GET -H "Cookie: $SESSIONID"  https://$AAP_HOSTNAME/api/gateway/v1/status/ | jq .
```