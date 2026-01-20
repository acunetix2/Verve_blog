import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle, Send, Reply, Heart, Trash2, MoreVertical, Edit2 } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Comment {
  _id: string;
  author: {
    _id: string;
    name: string;
    profileImage: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface CommentsSystemProps {
  postId: string;
  onCommentAdded?: () => void;
}

const CommentsSystem: React.FC<CommentsSystemProps> = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const currentUserId = localStorage.getItem("userId");

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      toast.success("Comment posted!");
      
      // Add a small delay to ensure backend has saved the data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      fetchComments();
      onCommentAdded?.();
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments/${parentCommentId}/replies`,
        { content: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingTo(null);
      toast.success("Reply posted!");
      
      // Add a small delay to ensure backend has saved the data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      fetchComments();
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comment deleted");
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const CommentThread: React.FC<{ comment: Comment; depth: number }> = ({ comment, depth }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${depth > 0 ? "ml-8 pt-4 border-l-2 border-gray-200 dark:border-gray-800 pl-4" : ""}`}
    >
      <img
        src={comment.author.profileImage}
        alt={comment.author.name}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />

      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{comment.author.name}</h4>
            {currentUserId === comment.author._id && (
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <MoreVertical size={16} className="text-gray-500" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm">
          <button
            onClick={() => likeComment(comment._id)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              comment.isLiked
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            }`}
          >
            <Heart size={14} className={comment.isLiked ? "fill-current" : ""} />
            {comment.likes}
          </button>

          {depth < 2 && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 px-2 py-1"
            >
              <Reply size={14} />
              Reply
            </button>
          )}

          {currentUserId === comment.author._id && (
            <button
              onClick={() => deleteComment(comment._id)}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 px-2 py-1"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {replyingTo === comment._id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex gap-2"
            >
              <img
                src={localStorage.getItem("userImage") || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                alt="You"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 outline-none"
                />
                <button
                  onClick={() => submitReply(comment._id)}
                  disabled={submitting}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <CommentThread key={reply._id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comments ({comments.length})</h2>
      </div>

      {/* New Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <img
          src={localStorage.getItem("userImage") || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
          alt="You"
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={submitComment}
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>

      {/* Comments Thread */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading comments...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentThread key={comment._id} comment={comment} depth={0} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSystem;
