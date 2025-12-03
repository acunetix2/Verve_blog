import React from "react";
import { Mail, HelpCircle, Bug } from "lucide-react";
import { motion } from "framer-motion";

const Support = () => {
  const supportItems = [
    {
      title: "FAQs",
      description: "Browse the most frequently asked questions about Verve Hub.",
      icon: <HelpCircle className="h-6 w-6 text-cyan-400" />,
      link: "/faqs",
    },
    {
      title: "Contact Support",
      description: "Email or chat with our dedicated support team.",
      icon: <Mail className="h-6 w-6 text-cyan-400" />,
      link: "mailto:iddychesire098@gmail.com",
    },
    {
      title: "Report a Bug",
      description: "Encountered an issue? Help us improve by reporting it.",
      icon: <Bug className="h-6 w-6 text-cyan-400" />,
      link: "/report-bug",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070b] text-white py-14 px-6 sm:px-12 lg:px-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Support</h1>
        <p className="text-white/70 text-lg sm:text-xl">
          We're here to help. Explore the sections below or contact our support team.
        </p>
      </motion.div>

      {/* SUPPORT GRID */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {supportItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            target={item.link.startsWith("http") ? "_blank" : "_self"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="group block p-7 bg-white/10 border border-white/10 
                       rounded-2xl backdrop-blur-lg shadow-xl hover:bg-white/20 
                       transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full 
                            bg-cyan-500/10 mb-5 group-hover:bg-cyan-500/20 transition">
              {item.icon}
            </div>

            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.a>
        ))}
      </div>

      {/* CONTACT BOTTOM CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 text-center"
      >
        <p className="text-white/70 mb-4">
          Still stuck? Our support team is ready to assist you.
        </p>

        <a
          href="mailto:iddychesire098@gmail.com"
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl 
                     font-semibold transition shadow-lg"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  );
};

export default Support;
