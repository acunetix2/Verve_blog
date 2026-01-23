import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        "Join our official Discord server for real-time community discussion, resource sharing, and announcements from the Verve Hub team.",
      link: "https://discord.gg/vervehub",
    },
    {
      title: "Workshops",
      content:
        "Participate in live workshops, webinars, and Capture-The-Flag (CTF) sessions to enhance your skills and connect with experts.",
    },
    {
      title: "Events & Meetups",
      content:
        "Stay informed about upcoming cybersecurity events, meetups, and hackathons organized by Verve Hub.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-14 px-6 sm:px-12 lg:px-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Community</h1>
        <p className="text-white/70 text-lg sm:text-xl leading-relaxed">
          Connect, collaborate, and grow with the Verve Hub cybersecurity community.
        </p>
      </motion.div>

      {/* COLLAPSIBLE SECTIONS */}
      <div className="max-w-4xl mx-auto space-y-5">
        {communitySections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-red-900/20 border border-red-600/30 rounded-xl backdrop-blur-xl
                       shadow-xl hover:bg-red-900/40 transition-all duration-300"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between px-6 py-5 
                         text-left transition-all"
            >
              <span className="text-lg sm:text-xl font-semibold text-white">
                {section.title}
              </span>

              <ChevronDown
                className={`h-6 w-6 text-cyan-400 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5"
                >
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    {section.content}
                  </p>

                  {section.link && (
                    <a
                      href={section.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 
                                 rounded-lg font-medium transition-all text-white text-sm shadow-md"
                    >
                      Join Discord
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-14 text-center"
      >
        <p className="text-white/70 mb-4">
          Don’t miss out—connect with the community in real time!
        </p>

        <a
          href="https://discord.gg/vervehub"
          target="_blank"
          rel="noopener noreferrer"
          className="px-7 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl 
                     font-semibold transition shadow-lg"
        >
          Join Our Discord Server
        </a>
      </motion.div>
    </div>
  );
};

export default Community;
