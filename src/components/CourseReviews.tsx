import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Edit2, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface CourseReviewsProps {
  courseId: string;
  onReviewAdded?: () => void;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId, onReviewAdded }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reviews/${courseId}`
      );
      setReviews(response.data.reviews);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to review');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reviews/${courseId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted!');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      fetchReviews();
      onReviewAdded?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {stats.avgRating?.toFixed(1) || 'N/A'}
              </div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(stats.avgRating || 0))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stats.totalReviews} reviews
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-12">{star} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${stats.totalReviews ? (stats[`${star}Stars`] / stats.totalReviews) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {stats[`${star}Stars`] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={formData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Brief summary of your experience"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-24"
              placeholder="Share your experience with this course..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {review.userId.avatar && (
                    <img
                      src={review.userId.avatar}
                      alt={review.userId.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{review.userId.name}</h4>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mt-3">{review.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
                <ThumbsUp size={16} />
                {review.helpfulCount}
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
                <ThumbsDown size={16} />
                {review.unhelpfulCount}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseReviews;
