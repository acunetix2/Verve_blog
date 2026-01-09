import React, { useState, useEffect, useRef } from "react";
import { AtSign, X } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface MentionableUser {
  _id: string;
  name: string;
  profileImage: string;
  username: string;
}

interface MentionSystemProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MentionSystem: React.FC<MentionSystemProps> = ({ value, onChange, placeholder = "Write a comment...", className = "" }) => {
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionResults, setMentionResults] = useState<MentionableUser[]>([]);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(-1);
  const [mentions, setMentions] = useState<MentionableUser[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionBoxRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);

    // Detect @ mentions
    const lastAtSymbol = text.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const afterAt = text.substring(lastAtSymbol + 1);
      const lastSpace = afterAt.indexOf(" ");
      const lastNewline = afterAt.indexOf("\n");
      const endIndex = Math.min(
        lastSpace === -1 ? afterAt.length : lastSpace,
        lastNewline === -1 ? afterAt.length : lastNewline
      );

      const searchTerm = afterAt.substring(0, endIndex);

      if (searchTerm.length > 0) {
        searchUsers(searchTerm);
        setMentionSearch(searchTerm);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
      setMentionSearch("");
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/search`, {
        params: { q: query, limit: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentionResults(response.data);
      setSelectedMentionIndex(-1);
    } catch (error) {
      console.error("Failed to search users:", error);
      setMentionResults([]);
    }
  };

  const insertMention = (user: MentionableUser) => {
    const text = value;
    const lastAtSymbol = text.lastIndexOf("@");
    const beforeAt = text.substring(0, lastAtSymbol);
    const afterAt = text.substring(lastAtSymbol + 1);

    const lastSpace = afterAt.indexOf(" ");
    const lastNewline = afterAt.indexOf("\n");
    const endIndex = Math.min(
      lastSpace === -1 ? afterAt.length : lastSpace,
      lastNewline === -1 ? afterAt.length : lastNewline
    );

    const afterMention = afterAt.substring(endIndex);
    const newText = `${beforeAt}@${user.username} ${afterMention}`;

    onChange(newText);
    setMentions([...mentions, user]);
    setShowMentions(false);
    setMentionSearch("");

    // Focus textarea and move cursor to end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }, 0);
  };

  const removeMention = (userId: string) => {
    const updatedMentions = mentions.filter((m) => m._id !== userId);
    setMentions(updatedMentions);

    // Remove mention from text
    const userToRemove = mentions.find((m) => m._id === userId);
    if (userToRemove) {
      onChange(value.replace(`@${userToRemove.username}`, "").trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev + 1) % mentionResults.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev - 1 + mentionResults.length) % mentionResults.length);
        break;
      case "Enter":
        if (selectedMentionIndex >= 0) {
          e.preventDefault();
          insertMention(mentionResults[selectedMentionIndex]);
        }
        break;
      case "Escape":
        setShowMentions(false);
        break;
    }
  };

  return (
    <div className="relative">
      {/* Mentions Tags */}
      {mentions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {mentions.map((mention) => (
            <motion.div
              key={mention._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              <img src={mention.profileImage} alt={mention.name} className="w-5 h-5 rounded-full" />
              <span>@{mention.username}</span>
              <button
                onClick={() => removeMention(mention._id)}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 outline-none resize-none ${className}`}
        />

        {/* Mention Dropdown */}
        <AnimatePresence>
          {showMentions && mentionResults.length > 0 && (
            <motion.div
              ref={mentionBoxRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50 max-h-48 overflow-y-auto"
            >
              <div className="p-2">
                {mentionResults.map((user, idx) => (
                  <motion.button
                    key={user._id}
                    onClick={() => insertMention(user)}
                    onMouseEnter={() => setSelectedMentionIndex(idx)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedMentionIndex === idx
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mention Indicator */}
        {showMentions && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-gray-400">
            <AtSign size={14} />
            <span>Type to mention</span>
          </div>
        )}
      </div>

      {/* Character Count & Mention Help */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>{value.length} characters</div>
        <div>Type @ to mention users</div>
      </div>
    </div>
  );
};

export default MentionSystem;
