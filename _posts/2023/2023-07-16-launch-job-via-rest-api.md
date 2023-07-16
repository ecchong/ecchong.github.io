---
title: Launch AAP job via REST API
tags: ["ansible", "aap", "shell script", "tower" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
---

We want to launch AAP job from shell script.  The job template has `Limit`, `Instance Groups` and `Variables` set with `Prompt on launch` enabled, so users can provides pass these variables in the API call as JSON data via a POST html call.

Out job template name is `AM/Just a ping` under the `Demo` organization.  Since there are "`/`" and space characters in the name, so we will need to url encode them.  Normally it will simply become "AM`%2F`Just`%20`a`%20`ping".  However, as of writing this, there is a bug it AAP that we will also need to url encode the `%` of `%2F` for the "`/`" character.  The final name of the job template becomes "AM`%252F`Just`%20`a`%20`ping". The organization name will be added as `++Demo`

We also would like to use multiple instance groups for the job run.  Since the payload will need the instance group ID instead of the name, extra API calls will be need to retrieve the ID of each instance group and provide them as a list in the json payload.

Extra variables are added to the payload as key value pair JSON dictionary object.  The limit field is simply a string.  The final payload should be something like:
```json
{
  "extra_vars": {
    "new_greeting": "Bob"
  },
  "limit": "node71*",
  "instance_groups": [5,2]
}
```

Following is the full script.
```shell
#!/bin/bash
AAP_HOST=aap-controller1.lab.automate.nyc
AAP_USERNAME=<AAP username>
AAP_PASSWORD=<user password>
INSTANCE_GROUPS=("AM_DEV_instance_group" "default")
TEMPLATE_NAME="AM%252FJust%20a%20ping++Demo"
LIMIT_HOSTS="node70*"


TMPFILE=$(mktemp --suffix _ANSIBLE_)

# Resolve AAP resource name to ID
get_id() {
  RESOURCE_TYPE=$1
  RESOURCE_NAME=$2
  ret_val=`curl -k -s -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $AAP_TOKEN" https://$AAP_HOST/api/v2/$RESOURCE_TYPE/$RESOURCE_NAME/ | jq -r .id`
  echo $ret_val
}

# Authenticate and obtain token
AAP_TOKEN=`curl -k -s -X POST --user $AAP_USERNAME:$AAP_PASSWORD https://$AAP_HOST/api/v2/tokens/  | jq -r .token`

# Build a list of instance group IDs
INSTANCE_GROUPS_ID=()
for i in ${INSTANCE_GROUPS[@]}
do
  id=`get_id instance_groups $i`
  INSTANCE_GROUPS_ID+=($id)
done
INSTANCE_GROUPS_ID_STR=${INSTANCE_GROUPS_ID[@]}
INSTANCE_GROUPS_ID_LIST=${INSTANCE_GROUPS_ID_STR// /,}

# Create payload file
cat <<EOF > $TMPFILE
{
  "extra_vars": {
    "new_greeting": "Bob"
  },
  "limit": "$LIMIT_HOSTS",
  "instance_groups": [$INSTANCE_GROUPS_ID_LIST]
}
EOF

# Launch AAP job template
JOB=$(curl -s -k -H "Content-Type: application/json" \
-H "Authorization: Bearer $AAP_TOKEN" \
-X POST \
-d @$TMPFILE \
https://$AAP_HOST/api/v2/job_templates/$TEMPLATE_NAME/launch/ | jq -r .url)

# Check job status
STATUS=""
until [[ $STATUS == "successful" || $STATUS == "failed" ]]
do
  sleep 5
  STATUS=$(curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer $AAP_TOKEN" -X GET https://$AAP_HOST/$JOB | jq -r .status)
  echo "$JOB: $STATUS"
done

# Cleanup
rm $TMPFILE

```