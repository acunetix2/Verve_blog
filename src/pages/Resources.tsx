import React, { useState } from "react";
import { ChevronDown, BookOpen, Code, Terminal, GraduationCap, FileText, Shield } from "lucide-react";

const Resources = () => {
  const resourceSections = [
    {
      title: "Writeup Templates",
      icon: FileText,
      content:
        "Professional templates for documenting your security research and CTF solutions. Includes structured formats for vulnerability reports, exploit documentation, and challenge writeups.",
    },
    {
      title: "Research Methodologies",
      icon: Shield,
      content:
        "Proven frameworks for conducting security assessments and vulnerability research. Covers reconnaissance, exploitation techniques, and proper documentation practices.",
    },
    {
      title: "Tools & Frameworks",
      icon: Terminal,
      content:
        "Essential security research tools and automation frameworks. Includes setup guides, command references, and integration tips for your workflow.",
    },
    {
      title: "Learning Resources",
      icon: GraduationCap,
      content:
        "Curated collection of security research papers, CTF platforms, and training materials. From beginner fundamentals to advanced exploitation techniques.",
    },
    {
      title: "Code Snippets",
      icon: Code,
      content:
        "Reusable code for common security tasks and exploit development. Includes proof-of-concept templates, helper scripts, and automation utilities.",
    },
    {
      title: "Community Writeups",
      icon: BookOpen,
      content:
        "Archive of high-quality writeups from the security research community. Study different approaches, learn new techniques, and improve your documentation skills.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20 backdrop-blur-sm mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Resources
          </h1>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Essential tools, templates, and references to elevate your security research 
            and writeup documentation. Everything you need to create professional, 
            detailed vulnerability reports.
          </p>
        </div>

        {/* Resource Cards with Collapsible Content */}
        <div className="space-y-4 mb-16">
          {resourceSections.map((section, index) => {
            const Icon = section.icon;
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {section.title}
                    </h3>
                  </div>
                  
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-slate-300 leading-relaxed pl-14">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 text-center">
          <p className="text-lg text-slate-300 mb-6">
            Need guidance on documenting your findings or creating professional writeups?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tutorials"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Tutorials
            </a>
            
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-800/50 text-slate-200 font-semibold rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700/50 hover:border-cyan-500/50"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;