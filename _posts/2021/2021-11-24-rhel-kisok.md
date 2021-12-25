---
title: How to setup RHEL 8 to run as a kiosk
tags: ["rhel", "kiosk" ]
categories: RHEL

---

# How to setup RHEL 8 to run as a kiosk

While investigate how to setup a PC as a kiosk, I found this blog post describing this RHEL 8 feature.  It basically run a minimum Gnome desktop, autologin as the kiosk user and launch the kiosk app.  It also disabled the Crtl + Alt + F# key combination to switch to another virtual terminal.

To summarize:
- Create a dedicated kiosk user
  ```
  useradd kioskuser
  ```
- Install the requred packages
  ```
  yum install -y gnome-session-kiosk-session gdm firefox
  ```
- Make sure the system start up graphical target
  ```
  systemctl set-default graphical.target
  ```
- Setup to autologin as the dedicated user.  Edit `/etc/gdm/custom.conf`.  Will also need to make sure Wayland is not running.
  ```
  [daemon]
  AutomaticLoginEnable=True
  AutomaticLogin=kioskuser
  WaylandEnable=false
  ```
- Setup the user's session to run `com.redhat.Kiosk`.  Edit `/var/lib/AccountService/users/kioskuser`.
  ```
  [User]
  Session=com.redhat.Kiosk
  SystemAccount=false
  ```
- Suppress initial setup dialog box.  Edit `/etc/xdg/autostart/gnome-initial-setup-first-login.desktop`.
  ```
  line: "X-GNOME-Autostart-enabled=false"
  ```
- Create an infinite loop script to run the kiosk app by creating file `~kioskuser/.local/bin/redhat-kiosk`.  In this example, bring up the world clock on firefox.
  ```
  #!/bin/sh
  while true; do
      firefox -kiosk https://time.gov
  done
  ```
  Make sure the script is executable
  ```
  chmod +x ~kioskuser/.local/bin/redhat-kiosk
  ```

## References
[Using RHEL’s Lightweight Kiosk Mode in Edge Deployments](https://www.redhat.com/en/blog/using-rhels-lightweight-kiosk-mode-edge-deployments)

[How to enable kiosk mode in Red Hat Enterprise Linux 7/8?](https://access.redhat.com/solutions/4243461)

[Single-application mode](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_the_desktop_environment_in_rhel_8/assembly_restricting-the-session-to-a-single-application_using-the-desktop-environment-in-rhel-8)

[Configure single-application mode](https://help.gnome.org/admin/system-admin-guide/stable/lockdown-single-app-mode.html.en)

[Setting the org.gnome.desktop.lockdown.disable-command-line Key](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/using_the_desktop_environment_in_rhel_8/index#setting-the-org-gnome-desktop-lockdown-disable-key)

