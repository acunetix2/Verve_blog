import React from "react";
import { Mail, HelpCircle, Bug } from "lucide-react";

const Support = () => {
  const supportItems = [
    {
      title: "FAQs",
      description: "Frequently asked questions about the platform and writeups.",
      icon: <HelpCircle className="h-5 w-5 text-cyan-400" />,
    },
    {
      title: "Contact Support",
      description: "Email or chat with our team for personalized help.",
      icon: <Mail className="h-5 w-5 text-cyan-400" />,
    },
    {
      title: "Bug Reports",
      description: "Report issues or suggest improvements for the platform.",
      icon: <Bug className="h-5 w-5 text-cyan-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-10 px-4 sm:px-10 lg:px-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
          Support
        </h1>
        <p className="text-white/70 text-lg sm:text-xl md:text-2xl leading-relaxed">
          Need help? Reach out to our support team or find answers to common questions.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {supportItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col p-6 bg-white/5 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/10 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-cyan-500/10">
              {item.icon}
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {item.title}
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center">
        <p className="text-white/70 mb-4">
          Can't find what you're looking for? Our team is here to help.
        </p>
        <a
          href="mailto:iddychesire098@gmail.com"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition-all text-white"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default Support;
