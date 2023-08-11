---
title: Use Kerberos for AAP PostgreSQL Connection
tags: ["ansible", "kerberos", "aap", "tower", "postgresql", "database", "idm" ]
categories: Ansible
last_modified_at: 2023-08-11
published: true
description: "Ansible Automation Platform - Using Kerberos to connect to PostgreSQL database"
---

We have Red Hat Identity Management (IdM) setup in the lab to provide Kerberos authentication.  This how-to will demonstrate setting up AAP to connect to its database using a Kerberos user without storing the password in clear text. `node74.lab.automate.nyc` is the PostgreSQL database server and `node71.lab.automate.nyc` is the AAP Controller.  All nodes are member of the `LAB.AUTOMATE.NYC` realm.

### Create an IdM user

```shell
ipa user-add --first awx --last postgres --cn "AWX Postgres Service Account" --password --password-expiration="2024-01-01 00:00Z" awx_postgres
```
### Add Service Principal to database server

In IdM, add service principal `postgres/node74.lab.automate.nyc@LAB.AUTOMATE.NYC` to our database host `node74.lab.automate.nyc`
![IdM add service principal](/assets/images/2023/2023-08-09-idm-add-serivce-principal.png)

```shell
ipa host-add-principal node74.lab.automate.nyc postgres/node74.lab.automate.nyc
```
### Retrieve Keytab file from IdM

Create a keytab file with both user and postgres principals.

```shell
[root@node74 ~]# ipa-getkeytab --keytab=/root/node74.keytab --principal=postgres/node74.lab.automate.nyc@LAB.AUTOMATE.NYC
Keytab successfully retrieved and stored in: /root/node74.keytab
[root@node74 ~]# ipa-getkeytab --keytab=/root/node74.keytab --principal=awx_postgres@LAB.AUTOMATE.NYC
Keytab successfully retrieved and stored in: /root/node74.keytab
[root@node74 ~]# klist -k node74.keytab 
Keytab name: FILE:node74.keytab
KVNO Principal
---- --------------------------------------------------------------------------
   9 postgres/node74.lab.automate.nyc@LAB.AUTOMATE.NYC
   9 postgres/node74.lab.automate.nyc@LAB.AUTOMATE.NYC
   9 postgres/node74.lab.automate.nyc@LAB.AUTOMATE.NYC
   9 postgres/node74.lab.automate.nyc@LAB.AUTOMATE.NYC
   2 awx_postgres@LAB.AUTOMATE.NYC
   2 awx_postgres@LAB.AUTOMATE.NYC
   2 awx_postgres@LAB.AUTOMATE.NYC
   2 awx_postgres@LAB.AUTOMATE.NYC
```

### Update PostgreSQL config files

Add following line to `/var/lib/pgsql/data/postgres.conf`
```ini
krb_server_keyfile = '/var/lib/pgsql/node74.keytab'
```
Copy the keytab file to `/var/lib/pgsql/node74.keytab` and change file ownership to `postgres:postgres`.

Add following line to `/var/lib/pgsql/data/pg_hba.conf` to allow user `awx_postgres` to connect with Kerberos authentication
```ini
host    awx         awx_postgres@LAB.AUTOMATE.NYC        0.0.0.0/0      gss include_realm=1 krb_realm=LAB.AUTOMATE.NYC
```

Restart PostgreSQL service to enable the changes.

### Add role in PostgreSQL database to match the user

```shell
postgres=# \c awx
You are now connected to database "awx" as user "postgres".
awx=# create user "awx_postgres@LAB.AUTOMATE.NYC";
CREATE ROLE
awx=# grant all on all tables in schema public to "awx_postgres@LAB.AUTOMATE.NYC";
GRANT
awx=# grant all on all sequences in schema public to "awx_postgres@LAB.AUTOMATE.NYC";
GRANT
```

### Create Credential Cache file

On the Controller node, generate a Kerberos credential cache file with user `awx_postgres` credential.
```shell
[root@node71 ~]# KRB5CCNAME=/var/lib/awx/awx_postgres.cache kinit awx_postgres
Password for awx_postgres@LAB.AUTOMATE.NYC: 
[root@node71 ~]# chown awx:awx /var/lib/awx/awx_postgres.cache
```

Notice the expiration date of the credential cache.
```shell
[root@node71 ~]# KRB5CCNAME=/var/lib/awx/awx_postgres.cache klist
Ticket cache: FILE:/var/lib/awx/awx_postgres.cache
Default principal: awx_postgres@LAB.AUTOMATE.NYC

Valid starting       Expires              Service principal
08/10/2023 12:11:38  08/11/2023 11:52:07  krbtgt/LAB.AUTOMATE.NYC@LAB.AUTOMATE.NYC
```

Test PostgreSQL connection to `awx` database using the Kerberos credential cache.
```shell
[root@node71 ~]# KRB5CCNAME=/var/lib/awx/awx_postgres.cache psql -h node74.lab.automate.nyc -U awx_postgres@LAB.AUTOMATE.NYC awx
psql (13.10)
GSSAPI-encrypted connection
Type "help" for help.

awx=> 
```

### Update AAP config files

Update `/etc/tower/conf.d/postgres.py` with the Kerberos user and remove 'PASSWORD'.
```json
DATABASES = {
   'default': {
       'ATOMIC_REQUESTS': True,
       'ENGINE': 'awx.main.db.profiled_pg',
       'NAME': 'awx',
#       'PASSWORD': """old_password""",
       'USER': 'awx_postgres@LAB.AUTOMATE.NYC',
       'HOST': 'node74.lab.automate.nyc',
       'PORT': '5432',
       'OPTIONS': { 'sslmode': 'prefer',
                    'sslrootcert': '/etc/pki/tls/certs/ca-bundle.crt',
       },
   }
}
```

Add following line to `/etc/supervisord.conf`
```ini
...
[supervisord]
environment=KRB5CCNAME=/var/lib/awx/awx_postgres.cache
...
```

Restart AAP and confirm all services are started correctly.

### Extend the expiration of the Kerberos ticket

Default IdM Kerberos ticket policy only allow 7 days of renew.  For demo purpose, we are going to extend the default policy and generate another ticket with longer renewal time.
```shell
[root@node71 ~]# ipa krbtpolicy-mod --maxrenew=2592000 --maxlife=604800
  Max life: 604800
  Max renew: 2592000

[root@node71 ~]# KRB5CCNAME=/var/lib/awx/awx_postgres.cache kinit awx_postgres -r 2592000 -l 604800
Password for awx_postgres@LAB.AUTOMATE.NYC:

[root@node71 ~]# KRB5CCNAME=/var/lib/awx/awx_postgres.cache klist
Ticket cache: FILE:/var/lib/awx/awx_postgres.cache
Default principal: awx_postgres@LAB.AUTOMATE.NYC

Valid starting       Expires              Service principal
08/11/2023 16:02:24  08/12/2023 15:33:44  krbtgt/LAB.AUTOMATE.NYC@LAB.AUTOMATE.NYC
	renew until 08/25/2023 16:02:24
```

We can renew the ticket before it expires by running
```shell
KRB5CCNAME=/var/lib/awx/awx_postgres.cache kinit -R
```

