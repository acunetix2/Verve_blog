import React, { useState } from "react";
import { Share2, Twitter, Linkedin, Facebook, Copy, Mail, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface SocialSharingProps {
  postId: string;
  postTitle: string;
  postSlug: string;
  authorName?: string;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ postId, postTitle, postSlug, authorName }) => {
  const [showMenu, setShowMenu] = useState(false);

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/post/${postSlug}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(postTitle);

  const shareLinks = {
    twitter: {
      label: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${authorName ? `&via=${encodeURIComponent(authorName)}` : ""}`,
      color: "text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20",
    },
    linkedin: {
      label: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    },
    facebook: {
      label: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    },
    email: {
      label: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=Check out this article: ${shareUrl}`,
      color: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    },
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
    setShowMenu(false);
  };

  const shareOnPlatform = (url: string, label: string) => {
    window.open(url, `share-${label}`, "width=600,height=400");
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors font-medium"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline">Share</span>
      </motion.button>

      {/* Share Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-3 z-50 w-max"
          >
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 px-2">Share this post</p>

            <div className="space-y-2">
              {/* Social Platform Links */}
              {Object.entries(shareLinks).map(([key, platform]) => {
                const Icon = platform.icon;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      if (key === "email") {
                        window.location.href = platform.url;
                      } else {
                        shareOnPlatform(platform.url, platform.label);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${platform.color}`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{platform.label}</span>
                    <ExternalLink size={14} className="ml-auto opacity-60" />
                  </motion.button>
                );
              })}

              {/* Copy Link */}
              <motion.button
                whileHover={{ x: 5 }}
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-800 mt-2 pt-2"
              >
                <Copy size={18} />
                <span className="text-sm font-medium">Copy Link</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};

export default SocialSharing;
