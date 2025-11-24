import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed with ${email}!`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 sm:p-10 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-white">
        Newsletter
      </h1>
      <p className="text-white/70 mb-6 max-w-3xl text-center">
        Stay updated with the latest writeups, tutorials, and cybersecurity news from Verve Hub.
      </p>

      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-cyan-500/30 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 font-semibold transition-all"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
