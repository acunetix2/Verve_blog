import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Resources = () => {
  const resourceSections = [
    {
      title: "Cheat Sheets",
      content:
        "Quick references for common pentesting and coding tasks. Includes commands, shortcuts, and workflow tips for cybersecurity and development.",
    },
    {
      title: "Tools & Software",
      content:
        "Recommended tools for ethical hacking, security analysis, and development. Includes setup guides and usage tips for each tool.",
    },
    {
      title: "Tutorials",
      content:
        "Step-by-step guides for learning security and coding skills. Covers practical exercises, example projects, and hands-on labs.",
    },
    {
      title: "Learning Platforms",
      content:
        "Curated platforms and online courses for cybersecurity, programming, and ethical hacking. Find beginner to advanced level resources.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-10 px-4 sm:px-10 lg:px-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
          Resources
        </h1>
        <p className="text-white/70 text-lg sm:text-xl md:text-2xl leading-relaxed">
          A curated list of tools, tutorials, and references to help you improve your
          cybersecurity and development skills.
        </p>
      </div>

      {/* Collapsible Resource Sections */}
      <div className="max-w-4xl mx-auto space-y-4">
        {resourceSections.map((section, index) => (
          <div
            key={index}
            className="border border-cyan-500/20 rounded-xl bg-white/5 overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cyan-500/10 transition-all"
            >
              <span className="text-lg sm:text-xl font-semibold text-white">
                {section.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 py-4" : "max-h-0"
              }`}
            >
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Call-to-Action */}
      <div className="mt-12 text-center">
        <p className="text-white/70 mb-4">
          Need further guidance? Explore our tutorials or reach out to support.
        </p>
        <a
          href="/support"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition-all text-white"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Resources;
