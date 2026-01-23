import React, { useState } from "react";
import { Mail, Shield, Bell, CheckCircle, Lock, Users, FileText, Zap } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsLoading(false);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 5000);
  };

  const benefits = [
    {
      icon: FileText,
      title: "Latest Writeups",
      description: "Get notified when new TryHackMe writeups are published with detailed step-by-step solutions."
    },
    {
      icon: Shield,
      title: "Security Updates",
      description: "Stay informed about new vulnerabilities, exploits, and cybersecurity developments."
    },
    {
      icon: Zap,
      title: "Learning Resources",
      description: "Access curated tools, techniques, and reference materials for penetration testing."
    },
    {
      icon: Users,
      title: "Community Content",
      description: "Featured writeups and contributions from the Verve Hub community."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-orange-500 text-sm font-medium">
              <Mail className="h-4 w-4" />
              <span>Verve Hub WriteUps Newsletter</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Stay Updated
            </h1>
            <p className="text-white/60 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Subscribe to receive the latest TryHackMe writeups, cybersecurity tutorials, and learning resources directly to your inbox.
            </p>
          </div>

          {/* Subscription Form */}
          <div className="max-w-2xl mx-auto mb-16">
            {!isSubscribed ? (
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSubscribe(e as any);
                        }
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-semibold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-white/40 text-sm text-center mt-4">
                  Free forever. Unsubscribe anytime.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-500/10 to-red-600/10 border border-red-600/30 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Successfully Subscribed!</h3>
                <p className="text-white/60">
                  Check your email for confirmation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What You'll Receive
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Regular updates on cybersecurity content and learning materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 border border-red-600/30 rounded-2xl p-8 hover:bg-gray-800 hover:border-red-600/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-600/20 rounded-xl group-hover:bg-red-600/40 transition-all">
                    <Icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-600/30 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Subscribe?
            </h2>
            <p className="text-white/60 text-lg">
              Join the cybersecurity learning community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-600/20 rounded-2xl mb-4">
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-white/70 font-medium">New content notifications</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-600/20 rounded-2xl mb-4">
                <Lock className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-white/70 font-medium">Privacy protected</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-600/20 rounded-2xl mb-4">
                <Mail className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-white/70 font-medium">Unsubscribe anytime</p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-12 pt-8 border-t border-red-600/20 text-center">
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              We respect your privacy. Your email will only be used for newsletter purposes and will never be shared with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-600/30 rounded-3xl p-12">
          <Shield className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe now to receive regular updates on TryHackMe writeups and cybersecurity resources
          </p>
          {!isSubscribed && (
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
            >
              <Mail className="h-5 w-5" />
              <span>Subscribe to Newsletter</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-red-600/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-white/40">
            <p>© 2024 Verve Hub. Cybersecurity learning platform.</p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white/60 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Newsletter;