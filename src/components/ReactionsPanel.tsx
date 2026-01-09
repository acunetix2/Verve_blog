import React, { useState, useEffect, useCallback } from "react";
import { Heart, Smile, Lightbulb, ChevronDown } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type ReactionType = "like" | "love" | "useful";

interface ReactionData {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

interface ReactionsPanelProps {
  targetId: string;
  targetType: "post" | "comment";
  onReactionChange?: (reactions: Record<ReactionType, number>) => void;
}

const REACTIONS: Record<ReactionType, { label: string; emoji: string; color: string; bgColor: string }> = {
  like: { label: "Like", emoji: "👍", color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  love: { label: "Love", emoji: "❤️", color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-900/20" },
  useful: { label: "Useful", emoji: "✨", color: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
};

const ReactionsPanel: React.FC<ReactionsPanelProps> = ({ targetId, targetType, onReactionChange }) => {
  const [reactions, setReactions] = useState<Record<ReactionType, ReactionData>>({
    like: { type: "like", count: 0, userReacted: false },
    love: { type: "love", count: 0, userReacted: false },
    useful: { type: "useful", count: 0, userReacted: false },
  });
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReactions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/${targetType}s/${targetId}/reactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reactionsMap: Record<ReactionType, ReactionData> = {
        like: { type: "like", count: response.data.like?.count || 0, userReacted: response.data.like?.userReacted || false },
        love: { type: "love", count: response.data.love?.count || 0, userReacted: response.data.love?.userReacted || false },
        useful: {
          type: "useful",
          count: response.data.useful?.count || 0,
          userReacted: response.data.useful?.userReacted || false,
        },
      };

      setReactions(reactionsMap);
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
      setReactions({
        like: { type: "like", count: 0, userReacted: false },
        love: { type: "love", count: 0, userReacted: false },
        useful: { type: "useful", count: 0, userReacted: false },
      });
    }
  }, [targetId, targetType]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const addReaction = async (reactionType: ReactionType) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/${targetType}s/${targetId}/reactions`,
        { type: reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReactions((prev) => ({
        ...prev,
        [reactionType]: {
          ...prev[reactionType],
          count: prev[reactionType].userReacted ? prev[reactionType].count - 1 : prev[reactionType].count + 1,
          userReacted: !prev[reactionType].userReacted,
        },
      }));

      setShowPicker(false);
      onReactionChange?.(
        Object.entries(reactions).reduce(
          (acc, [key, val]) => ({
            ...acc,
            [key]: val.count,
          }),
          {} as Record<ReactionType, number>
        )
      );
    } catch (error) {
      console.error("Failed to add reaction:", error);
      toast.error("Failed to add reaction");
    } finally {
      setLoading(false);
    }
  };

  const totalReactions = Object.values(reactions).reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="flex items-center gap-2">
      {/* Reaction Buttons */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
        {(Object.keys(REACTIONS) as ReactionType[]).map((reactionType) => {
          const reaction = reactions[reactionType];
          const config = REACTIONS[reactionType];

          return (
            <motion.button
              key={reactionType}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addReaction(reactionType)}
              disabled={loading}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                reaction.userReacted
                  ? `${config.bgColor} ${config.color} border-2 border-current`
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={config.label}
            >
              <span className="text-base">{config.emoji}</span>
              {reaction.count > 0 && <span className="text-xs font-semibold">{reaction.count}</span>}
            </motion.button>
          );
        })}

        {/* More Reactions Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPicker(!showPicker)}
            className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="More reactions"
          >
            <ChevronDown size={16} />
          </motion.button>

          {/* Reaction Picker */}
          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-50"
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Quick reactions</p>
                <div className="flex gap-2">
                  {(Object.entries(REACTIONS) as [ReactionType, typeof REACTIONS[ReactionType]][]).map(
                    ([type, config]) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addReaction(type)}
                        className="text-2xl hover:scale-150 transition-transform"
                        title={config.label}
                      >
                        {config.emoji}
                      </motion.button>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Total Reactions Count */}
      {totalReactions > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2"
        >
          {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
        </motion.div>
      )}
    </div>
  );
};

export default ReactionsPanel;
