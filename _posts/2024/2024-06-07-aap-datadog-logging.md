---
title: Using Datadog as External Logging for AAP
tags: ["ansible", "aap", "datadog", "rsyslog", "logging" ]
categories: Ansible
last_modified_at: 2024-06-07
published: true
description: "AAP - Using Datadog as external logging aggregator"
---

If you want to integrate Datadog logging directly with the playbooks or projects, check out this article [KB3982961](https://access.redhat.com/solutions/3982961) and [Datadog callback plugin](https://github.com/DataDog/ansible-datadog-callback)

Datadog is not a support external logger for AAP.  Here we will set it up by creating a customize rsyslog configuration and trick AAP dumping events to a discard port.

1. Create a rsyslog config file `/var/lib/awx/rsyslog/conf.d/datadog_rsyslog.conf`
```
template( name="awx_datadog" type="list") {
  constant(value="{")
  constant(value="\"ddsource\": \"aap\", ")
  constant(value="\"ddtags\": \"env:LAB,type:ansible,application:ansible\", ")
  constant(value="\"hostname\": \"")
  property(name="hostname")
  constant(value="\", ")
  constant(value="\"message\": ")
  property(name="rawmsg-after-pri")
  constant(value="}\n")
}
module(load="omhttp")
action(
  type="omhttp"
  server="http-intake.logs.datadoghq.com"
  restpath="api/v2/logs"
  serverport="443"
  usehttps="on"
  allowunsignedcerts="off"
  skipverifyhost="off"
  action.resumeRetryCount="-1"
  template="awx_datadog"
  action.resumeInterval="5"
  errorfile="/var/log/tower/rsyslog.err"
  queue.spoolDirectory="/var/lib/awx"
  queue.filename="awx-datadog-logger-action-queue"
  queue.maxDiskSpace="1g"
  queue.maxFileSize="100m"
  queue.type="LinkedList"
  queue.saveOnShutdown="on"
  queue.syncqueuefiles="on"
  queue.checkpointInterval="1000"
  queue.size="131072"
  queue.highwaterMark="98304"
  queue.discardMark="117964"
  queue.discardSeverity="5"
  httpheaders=[ "DD-API-KEY: XXXXXXXXXXXXXXXXXXXXXXXXXXX" ]
)
```
This generate an JSON output that follow [this Datadog doc](https://docs.datadoghq.com/api/latest/logs/#send-logs).  The `DD-API-KEY` header should contain the API key to authenticate with Datadog.

2. AAP won't send events to external logger unless an aggregator is configured.  We will setup a dummy aggregator by sending events to discard port (9/udp) on localhost.  Since it is a privilege port, normal user should not be able to listen to these events. ![External Logging Settings](/assets/images/2024/2024-06-07-datadog-aap-setting.png)

3. To see the AAP Rsyslog debug message, enable the `LOG_AGGREGATOR_RSYSLOGD_DEBUG` via the REST API `https://AAP Controller/api/v2/settings/logging/`.  This is not the `LOG_AGGREGATOR_LEVEL` parameter that can be set via the web GUI.  Once enabled, AAP Rsyslog debug messages can be found in `/var/log/supervisor/awx-rsyslog.log`
