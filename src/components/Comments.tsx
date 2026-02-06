import React, { useState, useEffect } from 'react';
import { Send, Trash2, Edit2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Comment {
  _id: string;
  text: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  isEdited: boolean;
  editedAt?: string;
  likeCount: number;
  replyCount?: number;
}

interface CommentsProps {
  contentType: 'course' | 'lesson' | 'post' | 'document';
  contentId: string;
}

const Comments: React.FC<CommentsProps> = ({ contentType, contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId, page]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${contentType}/${contentId}?page=${page}`
      );
      setComments(response.data.comments);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${contentType}/${contentId}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Comment posted!');
      setNewComment('');
      setPage(1);
      fetchComments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Comment deleted');
      fetchComments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!token) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {token && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <Send size={18} />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {!token && (
        <div className="text-center py-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </a>
            {' '}to join the discussion
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700"
            >
              <div className="flex gap-3">
                {comment.userId.avatar && (
                  <img
                    src={comment.userId.avatar}
                    alt={comment.userId.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{comment.userId.name}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {comment.isEdited && (
                      <span className="text-xs text-gray-500 italic">(edited)</span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{comment.text}</p>

                  {/* Actions */}
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="text-sm text-gray-600 hover:text-blue-600 transition"
                    >
                      👍 {comment.likeCount}
                    </button>
                    {comment.replyCount !== undefined && (
                      <button className="text-sm text-gray-600 hover:text-blue-600 transition">
                        💬 {comment.replyCount}
                      </button>
                    )}

                    {currentUserId === comment.userId._id && (
                      <>
                        <button className="text-sm text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-sm text-red-600 hover:text-red-700 transition flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
