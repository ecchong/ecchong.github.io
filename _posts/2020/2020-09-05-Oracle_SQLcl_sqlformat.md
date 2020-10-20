---
title: Example usage of the new Oracle SQLcl client sqlformat
tags: ["Oracle", "SQLcl", "SQL"]
categories: Oracle
layout: post
---
## Oracle SQLcl sqlformat

- Set display format
{% raw %}
```SQL
SQL> set sqlformat ansiconsole;
SQL> select owner, table_name from all_tables where owner LIKE 'HR%';
OWNER  TABLE_NAME
HR     REGIONS
HR     COUNTRIES
HR     LOCATIONS
HR     DEPARTMENTS
HR     JOBS
HR     EMPLOYEES
HR     JOB_HISTORY

SQL> set sqlformat csv;
SQL> select owner, table_name from all_tables where owner LIKE 'HR%';
"OWNER","TABLE_NAME"
"HR","REGIONS"
"HR","COUNTRIES"
"HR","LOCATIONS"
"HR","DEPARTMENTS"
"HR","JOBS"
"HR","EMPLOYEES"
"HR","JOB_HISTORY"

SQL> set sqlformat json;
SQL> select owner, table_name from all_tables where owner LIKE 'HR%';
{"results":[{"columns":[{"name":"OWNER","type":"NUMBER"},{"name":"TABLE_NAME","type":"NUMBER"}],"items":
[
{"owner":"HR","table_name":"REGIONS"},{"owner":"HR","table_name":"COUNTRIES"},{"owner":"HR","table_name":"LOCATIONS"},{"owner":"HR","table_name":"DEPARTMENTS"},{"owner":"HR","table_name":"JOBS"},{"owner":"HR","table_name":"EMPLOYEES"},{"owner":"HR","table_name":"JOB_HISTORY"}]}]}
7 rows selected.
```
{% endraw %}