import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Documentation = () => {
  const docSections = [
    {
      title: "API Reference",
      content:
        "Detailed documentation for developers integrating with our APIs. Includes endpoints, request/response examples, and authentication details.",
    },
    {
      title: "Getting Started",
      content:
        "Step-by-step guide for new users to start using the platform. Covers account setup, dashboard overview, and basic navigation.",
    },
    {
      title: "Best Practices",
      content:
        "Recommendations for secure and efficient usage of Verve Hub tools. Tips for performance optimization, security, and workflow efficiency.",
    },
    {
      title: "Tutorials",
      content:
        "Hands-on tutorials to help you master key features and workflows. Includes example projects and practical exercises.",
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
          Documentation
        </h1>
        <p className="text-white/70 text-lg sm:text-xl md:text-2xl leading-relaxed">
          Official guides, API references, and tutorials to help you navigate
          Verve Hub’s tools and platform features.
        </p>
      </div>

      {/* Collapsible Documentation Sections */}
      <div className="max-w-4xl mx-auto space-y-4">
        {docSections.map((section, index) => (
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
          Need more help? Reach out to our support team.
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

export default Documentation;
