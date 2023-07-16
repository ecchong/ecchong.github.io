---
title: Use signed certificate for WinRM
tags: ["ansible", "winrm", "certificate", "windows" ]
categories: Ansible
#last_modified_at: YYYY-MM-DD
published: true
description: "Ansible - using certificate for WinRM authentication"
---
WinRM setup default create a self-signed certificate for the HTTPS transport.  We have to set `ansible_winrm_server_cert_validation: ignore` to avoid getting SSL error.  If we have no access to a CA, we can create our own and self-sign our cert.  With a valid or a self generated CA, we can avoid skipping the certification validation when connecting to WinRM.

### Generate our own CA
```shell
echo -n 'secret password' > mypass.enc
openssl genrsa -des3 -passout file:mypass.enc -out ca.key 4096
openssl rsa -noout -text -in ca.key -passin file:mypass.enc
openssl req -new -x509 -days 365 -key ca.key -out ca.cert.pem -passin file:mypass.enc -subj "/CN=Eric Chong CA/C=US/ST=New York/L=
New York/O=automate.nyc/OU=lab/emailAddress=echong@redhat.com"
openssl x509 -noout -text -in ca.cert.pem 
```

### Generate a CSR for a Windows server and sign it with our CA
```shell
export SERVER=mywindows.lab.automate.nyc
openssl genrsa -des3 -passout file:mypass.enc -out $SERVER.key 4096
openssl req -new -key $SERVER.key -out $SERVER.csr -passin file:mypass.enc -subj "/CN=$SERVER" \
-addext "keyUsage = digitalSignature, keyEncipherment, dataEncipherment, cRLSign, keyCertSign" \
-addext "extendedKeyUsage = serverAuth, clientAuth" \
-addext "subjectAltName = DNS:$SERVER"
openssl rsa -noout -text -in ca.key -passin file:mypass.enc 
openssl rsa -noout -text -in $SERVER.key -passin file:mypass.enc 
openssl req -noout -text -in $SERVER.csr 
openssl x509 -req -days 365 -in $SERVER.csr -CA ca.cert.pem -CAkey ca.key -CAcreateserial -out $SERVER.crt -passin file:mypass.enc -extfile my.ext
openssl x509 -noout -text -in $SERVER.crt
openssl pkcs12 -export -inkey $SERVER.key -in $SERVER.crt -out $SERVER.pfx  -passin file:mypass.enc
```

The `my.ext` file:
```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = clientAuth, serverAuth
```

### Setup WinRM on Windows server
```shell
New-NetFirewallRule -DisplayName 'WinRM HTTPS Inbound' -Profile Domain -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5986
Set-Service -Name "WinRM" -StartupType Automatic
Start-Service -Name "WinRM"
Enable-PSRemoting -SkipNetworkProfileCheck -Force
Set-Item -Path WSMan:\localhost\Service\Auth\Basic -Value $true
# Import pfx cert via GUI (TBD for PowerShell command)
get-childitem cert:\localmachine\my
$newWsmanParams = @{
        ResourceUri = 'winrm/config/Listener'
        SelectorSet = @{ Transport = "HTTPS"; Address = "*" }
        ValueSet    = @{ Hostname = $hostName; CertificateThumbprint = $serverCert.Thumbprint }
        # UseSSL = $true
}
$null = New-WSManInstance @newWsmanParams
```

### Setup Ansible inventory file
Now add `ansible_winrm_ca_trust_path` parameter in inventory file
```ini
[windows:vars]
ansible_connection=winrm
ansible_winrm_transport=basic
ansible_user=ansibleuser
ansible_password=mypassword
ansible_port=5986
ansible_winrm_scheme=https
ansible_winrm_ca_trust_path=ca.cert.pem
```