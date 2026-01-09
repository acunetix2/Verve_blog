import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Send, Trash2, Edit2 } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Review {
  _id: string;
  author: {
    _id: string;
    name: string;
    profileImage: string;
  };
  rating: number;
  comment: string;
  helpful: number;
  unhelpful: number;
  userVote?: "helpful" | "unhelpful" | null;
  createdAt: string;
  updatedAt: string;
}

interface UserReviewsProps {
  postId: string;
  onReviewAdded?: () => void;
}

const UserReviews: React.FC<UserReviewsProps> = ({ postId, onReviewAdded }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentUserId = localStorage.getItem("userId");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
      setAverageRating(0);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async () => {
    if (!newReview.comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/reviews/${editingId}`,
          newReview,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Review updated!");
        setEditingId(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/reviews`,
          newReview,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Review posted!");
      }

      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
      onReviewAdded?.();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  const markHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/reviews/${reviewId}/helpful`,
        { helpful },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews();
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{reviews.length} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{stars}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* New Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>

        <div className="space-y-4">
          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`text-2xl transition-colors ${
                    star <= newReview.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                  }`}
                >
                  ★
                </motion.button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this post..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={submitReview}
            disabled={submitting}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {editingId ? "Update Review" : "Post Review"}
          </button>
        </div>
      </motion.div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <img
                    src={review.author.profileImage}
                    alt={review.author.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{review.author.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {currentUserId === review.author._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(review._id);
                        setNewReview({ rating: review.rating, comment: review.comment });
                        window.scrollTo(0, 0);
                      }}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

              {/* Helpful Buttons */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => markHelpful(review._id, true)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    review.userVote === "helpful"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  👍 {review.helpful}
                </button>
                <button
                  onClick={() => markHelpful(review._id, false)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    review.userVote === "unhelpful"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  👎 {review.unhelpful}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
          <p>No reviews yet. Be the first to share your opinion!</p>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
