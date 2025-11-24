import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

const Community = () => {
  const communitySections = [
    {
      title: "Forums",
      content:
        "Discuss topics with other cybersecurity and ethical hacking enthusiasts. Share ideas, ask questions, and get advice from experienced members.",
    },
    {
      title: "Discord Server",
      content:
        "Join our official Discord server for real-time communication and collaboration with the Verve Hub community. Participate in discussions, share resources, and stay updated.",
      link: "https://discord.gg/vervehub", // replace with your server link
    },
    {
      title: "Workshops",
      content:
        "Participate in live training sessions, webinars, and Capture-The-Flag (CTF) challenges to enhance your skills and network with other professionals.",
    },
    {
      title: "Events & Meetups",
      content:
        "Stay informed about upcoming events, meetups, and hackathons organized by Verve Hub for knowledge sharing and networking.",
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
          Community
        </h1>
        <p className="text-white/70 text-lg sm:text-xl md:text-2xl leading-relaxed">
          Join the Verve Hub community to share knowledge, discuss security challenges, 
          and collaborate with like-minded enthusiasts.
        </p>
      </div>

      {/* Collapsible Sections */}
      <div className="max-w-4xl mx-auto space-y-4">
        {communitySections.map((section, index) => (
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
              {section.link && (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition-all text-white text-sm"
                >
                  Join Discord
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-white/70 mb-4">
          Stay connected and never miss updates from the Verve Hub community!
        </p>
        <a
          href="https://discord.gg/vervehub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition-all text-white"
        >
          Join Our Discord Server
        </a>
      </div>
    </div>
  );
};

export default Community;
