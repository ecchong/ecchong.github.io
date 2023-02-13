---
title: Using signed SSH certificate in AAP
tags: ["ansible", "ssh", "aap", "certificate" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
---

AAP support using signed SSH certificate as machine credential. Here are example instructions setting it up.

### Signing certificates and distrubte CA public key
This can be either just a new set of SSH keys:
````shell
$ ssh-keygen -C 'My CA' -f ca
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in ca.
Your public key has been saved in ca.pub.
The key fingerprint is:
SHA256:6KQVQu2IvXtrjr++mRhvOKeCBHSGb8cbtugV7T015VY My CA
The key's randomart image is:
+---[RSA 3072]----+
|  . ..           |
| o +  .      . E |
|. +oooo     o .  |
|. .ooB.+   o o   |
|. . +.X S . o    |
| . ..O . o       |
|... +o.   .      |
|. ..+==o         |
|   .+@@+         |
+----[SHA256]-----+
$ ls -l
total 8
-rw-------. 1 echong echong 2635 Feb 13 10:18 ca
-rw-r--r--. 1 echong echong  559 Feb 13 10:18 ca.pub
````
It generates a normal pair of SSH keys.  In this example, we are going to use my SSL certificate.  First, we need to extract the public key from the certificate:
````shell
$ openssl x509 -pubkey -in automate.nyc.crt -noout > x509-key.pub
````
Then, we need to convert it to OpenSSH public key
````shell
$ ssh-keygen -i -m pkcs8 -f x509-key.pub > automate.nyc.pub
$ ls -l
total 16
-rw-r--r--. 1 echong echong 1927 Feb 13 10:19 automate.nyc.crt
-rw-------. 1 echong echong 1675 Feb 13 10:19 automate.nyc.key
-rw-rw-r--. 1 echong echong  381 Feb 13 10:25 automate.nyc.pub
-rw-rw-r--. 1 echong echong  451 Feb 13 10:21 x509-key.pub
$ cat automate.nyc.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDj9HfV3SAlTWVdDYjts7nF0+16....
````
Next, we will generate another set of SSH keys and signed it with our certificate key:
````shell
$ ssh-keygen -C 'signed with automate.nyc.crt' -f my_ssh
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in my_ssh.
Your public key has been saved in my_ssh.pub.
The key fingerprint is:
SHA256:5IqjQ/lo5zCDaIjkEGsIg7nIYjTU+z72F27a8C0k91g signed with automate.nyc.crt
The key's randomart image is:
+---[RSA 3072]----+
| ..              |
|o. .             |
|*o  .   .        |
|*=..   o         |
|B= ..   S        |
|@.o  o o + E     |
|=++o+ ..= =      |
|. +=o=  +*..     |
| ..+o oo+o..     |
+----[SHA256]-----+
````
The key ID will be `echong_ssh_automate_nyc` and valid for 52 weeks for username `echong` only.
````shell
$ ssh-keygen -s automate.nyc.key -I 'echong_ssh_automate_nyc' -V +52w -n echong my_ssh
Signed user key my_ssh-cert.pub: id "echong_ssh_automate_nyc" serial 0 for echong valid from 2023-02-13T10:50:00 to 2024-02-12T10:51:05
$ ls -l
total 28
-rw-------. 1 echong echong 1927 Feb 13 10:19 automate.nyc.crt
-rw-------. 1 echong echong 1675 Feb 13 10:19 automate.nyc.key
-rw-rw-r--. 1 echong echong  381 Feb 13 10:27 automate.nyc.pub
-rw-------. 1 echong echong 2675 Feb 13 10:29 my_ssh
-rw-r--r--. 1 echong echong 1711 Feb 13 10:51 my_ssh-cert.pub
-rw-r--r--. 1 echong echong  582 Feb 13 10:29 my_ssh.pub
-rw-rw-r--. 1 echong echong  451 Feb 13 10:21 x509-key.pub
$ ssh-keygen -L -f my_ssh-cert.pub 
my_ssh-cert.pub:
        Type: ssh-rsa-cert-v01@openssh.com user certificate
        Public key: RSA-CERT SHA256:5IqjQ/lo5zCDaIjkEGsIg7nIYjTU+z72F27a8C0k91g
        Signing CA: RSA SHA256:Spn7YWfSWItTuSbzp+0zJKxBSTnYLpcRIcvtNrt9NBE (using rsa-sha2-512)
        Key ID: "echong_ssh_automate_nyc"
        Serial: 0
        Valid: from 2023-02-13T10:50:00 to 2024-02-12T10:51:05
        Principals: 
                echong
        Critical Options: (none)
        Extensions: 
                permit-X11-forwarding
                permit-agent-forwarding
                permit-port-forwarding
                permit-pty
                permit-user-rc
````
Now we need to distribute the CA pub key to all the hosts will be accepting this SSH key.  Copy the signing SSH public key string, in our case it will be the content of the converted `automate.nyc.pub`.  On the target hosts, update the `/etc/ssh/sshd_config` with parameter `TrustedUserCAKeys` point to the public keys file:
````shell
TrustedUserCAKeys /etc/ssh/ca.pub
````
where the `ca.pub` file holds all the CA pub keys, one per line.  Restart `sshd` to update the configuraiton.
This will allow all users/principles listed in the signed SSH key to login the the host.  The CA public key can also assined per user by entering into user's `~/.ssh/authorized_keys` file.

## Setup AAP machine credential
On AAP machine credential page, paste the content `my_ssh` private key to the `SSH Private Key` and the content of `my_ssh-cert.pub` to the `Signed SSH Certificate` text boxes.  If the `my_ssh` key is generated with a passphrase, enter the `Private Key Passphrase` text box too.
![AAP Machine Credential](/assets/images/2023/2023-02-13-aap-signed-ssh-cert_1.png)

When using this credential to connect to the target host, the following will be logged in syslog:
````shell
Feb 13 11:26:32 aap-db1.lab.automate.nyc sshd[109844]: Accepted publickey for echong from 192.168.0.101 port 53348 ssh2: RSA-CERT SHA256:5IqjQ/lo5zCDaIjkEGsIg7nIYjTU+z72F27a8C0k91g ID echong_ssh_automate_nyc (serial 0) CA RSA SHA256:Spn7YWfSWItTuSbzp+0zJKxBSTnYLpcRIcvtNrt9NBE
````
Noticed the `Key ID` `echong_ssh_automate_nyc` we used to sign the SSH key, the thumbnails of the ssh key and signing key are logged in the message.

### References

[AWX PR for implementing SSH signed key](https://github.com/ansible/awx/issues/1654)

[Red Hat doc on signing SSH key](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html-single/deployment_guide/index#sec-Introduction_to_SSH_Certificates)

[Using HashiCorp Vault](https://developer.hashicorp.com/vault/docs/secrets/ssh/signed-ssh-certificates)

[Extracting SSH pub key from SSL certificate](https://support.axway.com/kb/180119/language/en)

[How Facebook does it](https://engineering.fb.com/2016/09/12/security/scalable-and-secure-access-with-ssh/)
