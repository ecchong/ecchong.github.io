---
title: Setting up Windows VM on RHEL with GPU passthru
tags: ["rhel", "windows", "vm", "kvm", "libvirt", "gpu"]
categories: RHEL
last_modified_at: 2025-01-19
published: false
description: "RHEL - Setting up Windows VM on RHEL with GPU passthru"
---

### Hardware
* CPU: AMD Ryzen 5 7600X with Radeon Graphics
* GPU: RTX 3060
* Motherboard: Gigabyte B650 Eagle AX that support onboard graphic
* Memory: 64 GB

We will be using the onboard GPU for RHEL OS.  The discrete GPU will be dedicated to the VM. 

### Kernel parameters
#### Ignore the discrete GPU
Find the hardware addresses of the video card using `lspci` command.  The are in the `[]`
```shell
[root@ryzen5-7k ~]# lspci -Dnn | grep NVIDIA
0000:01:00.0 VGA compatible controller [0300]: NVIDIA Corporation GA104 [GeForce RTX 3060] [10de:2487] (rev a1)
0000:01:00.1 Audio device [0403]: NVIDIA Corporation GA104 High Definition Audio Controller [10de:228b] (rev a1)
```
Setup these kernel argument to ignore the NVIDIA graphic card
```shell
grubby --args="pci-stub.ids=10de:2487,10de:228b" --update-kernel ALL
```

#### Allocate Hugepage memory block for the VM
Allocate 16 GB of RAM (in 1GB block) for the VM using Hupage
```shell
[root@ryzen5-7k ~]# grubby --update-kernel=ALL --args="default_hugepagesz=1G hugepagesz=1G hugepages=16"
```

#### Verify
Verify the kernel parameters are added.  We will have to rerun the command if new kernel is installed.
```shell
[root@ryzen5-7k ~]# grubby --info=/boot/vmlinuz-5.14.0-503.19.1.el9_5.x86_64
index=0
kernel="/boot/vmlinuz-5.14.0-503.19.1.el9_5.x86_64"
args="ro crashkernel=1G-4G:192M,4G-64G:256M,64G-:512M resume=/dev/mapper/vg_root-swap rd.lvm.lv=vg_root/lv_root rd.lvm.lv=vg_root/swap rhgb iommu=pt pci-stub.ids=10de:2487,10de:228b default_hugepagesz=1G hugepagesz=1G hugepages=16"
root="/dev/mapper/vg_root-lv_root"
initrd="/boot/initramfs-5.14.0-503.19.1.el9_5.x86_64.img $tuned_initrd"
title="Red Hat Enterprise Linux (5.14.0-503.19.1.el9_5.x86_64) 9.5 (Plow)"
id="a0b8e89423bd44eda123e83b2776fa61-5.14.0-503.19.1.el9_5.x86_64"
```
We should also see 16GB RAM of Hugepage allocated
```shell
[root@ryzen5-7k ~]# cat /proc/meminfo | grep Huge
AnonHugePages:    352256 kB
ShmemHugePages:        0 kB
FileHugePages:         0 kB
HugePages_Total:      16
HugePages_Free:       16
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:    1048576 kB
Hugetlb:        16777216 kB
```

### VM settings
Assuming the Windows 11 VM is already installed.  Following configurations need to be added to the XML of the VM.

#### Hugepage
Add `memoryBacking` to use Hugepages
```xml
  <memoryBacking>
    <hugepages/>
  </memoryBacking>
```

#### Keyboard and Mouse
Update the domain line
```xml
<domain type='kvm' id='6' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>
```
Also add these to specify the RHEL host's keyboard and mouse
```xml
  <qemu:commandline>
    <qemu:arg value='-object'/>
    <qemu:arg value='input-linux,id=kbd1,evdev=/dev/input/by-id/usb-COOLER_MASTER_SK622_Mechanical_Keyboard_-_Black_Edition-event-kbd,grab_all=on,repeat=on'/>
    <qemu:arg value='-object'/>
    <qemu:arg value='input-linux,id=kbd2,evdev=/dev/input/by-id/usb-COOLER_MASTER_SK622_Mechanical_Keyboard_-_Black_Edition-if02-event-kbd,grab_all=on,repeat=on'/> 
    <qemu:arg value='-object'/>
    <qemu:arg value='input-linux,id=mouse1,evdev=/dev/input/by-id/usb-COOLER_MASTER_SK622_Mechanical_Keyboard_-_Black_Edition-if02-event-mouse'/>
    <qemu:arg value='-object'/>
    <qemu:arg value='input-linux,id=mouse2,evdev=/dev/input/by-id/usb-Logitech_USB_Receiver-event-mouse'/>
  </qemu:commandline>
```

Also need to add a USB mouse for the scroll wheel to work
```xml
    <input type='mouse' bus='usb'>
      <alias name='input0'/>
      <address type='usb' bus='0' port='1'/>
    </input>
```

Checkout these references of `evdev_helper`:
* [Evdev guide: sharing mouse and keyboard between host and VM](https://www.youtube.com/watch?v=4XDvHQbgujI&t=4s)
* [README](https://github.com/pavolelsig/evdev_helper/blob/main/README.md)

Use 

#### Audio

#### CPU pinning
TBD