---
title: "Installing Virtual Machine Manager on Void Linux"
description: "This step-by-step tutorial shows you how to install and use Virtual Machine Manager on Void Linux."
pubDate: 2024-04-22
---

If you're a fellow Void Linux enthusiast like me, you know the thrill of a lean, customizable system. But sometimes, you might want to run other operating systems within your streamlined Void environment. That's where virtual machines (VMs) come to the rescue, and Virtual Machine Manager makes it super easy to set them up.

In this guide, I'll walk you through the steps I took to get this working.

## Step 1: Installing the Essentials

```bash
sudo xbps-install libvirt virt-manager qemu polkit
```

This gets us all the pieces we need; `libvirt` for virtualization magic, `virt-manager` for a friendly interface, `qemu` as our trusty emulator, and `polkit` for handling permissions.

## Step 2: Getting the Right Permissions

We need to make sure our regular user account can play with virtual machines. Let's add ourselves to the `libvirt` and `kvm` groups:

```bash
sudo usermod -a -G libvirt,kvm your_username
```

(Remember to replace `your_username`!)

## Step 3: A Quick Log Out and Back In

Just to be sure the group changes stick, log out of your account and log back in.

## Step 4: A Tiny Bit of Configuration

Let's setup a config file for libvirt so it knows what's up:

```bash
mkdir ~/.config/libvirt && sudo cp -rv /etc/libvirt/libvirt.conf ~/.config/libvirt/ && sudo chown your_username: ~/.config/libvirt/libvirt.conf
```

## Step 5: Tweaking libvirt Settings

Open `~/.config/libvirt/libvirt.conf` in your favorite text editor and find the line that says `uri_default`. Change it to:

```bash
uri_default = "qemu:///system"
```

## Step 6: QEMU Permissions

Edit `/etc/libvirt/qemu.conf`, setting the `user` and `group` to match your username and `libvirt` respectively. This lets you manage the VMs you create.

## Step 7: Starting the Services

Void Linux uses `runit` for services. Let's enable the ones we need:

```bash
sudo ln -s /etc/sv/dbus /var/service/
sudo ln -s /etc/sv/polkitd /var/service/
sudo ln -s /etc/sv/libvirtd /var/service/
sudo ln -s /etc/sv/virtlockd /var/service/
sudo ln -s /etc/sv/virtlogd /var/service/
```

## Step 8: Launch Time!

That's it! Go ahead, launch Virtual Machine Manager, and get ready to spin up new virtual machines!

---

## Bonus Tip: Pump Up the Graphics

Want smoother graphics in your VMs? Edit a VM's settings, go to "Video", select "Virtio", and check the "3D Acceleration" box.
