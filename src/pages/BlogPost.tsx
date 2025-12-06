import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { MDXContent } from "@/components/MDXContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Shield,
  Terminal,
  Sparkles,
  Heart,
  MessageSquare,
  Copy,
  Twitter,
  Linkedin,
  CheckCircle2,
  Eye,
  Share2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Post {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  views?: number;
}

interface Comment {
  _id?: string;
  name: string;
  text: string;
  date?: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [views, setViews] = useState<number>(0);
  const [viewed, setViewed] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPostData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);

    try {
      // Fetch post, likes, comments, and views in parallel
      const [postRes, likesRes, commentsRes, viewsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/likes`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/comments`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/views`, { credentials: "include" }),
      ]);

      if (!postRes.ok) throw new Error("Failed to fetch post");

      const postData = await postRes.json();
      const likesData = await likesRes.json();
      const commentsData: Comment[] = await commentsRes.json();
      const viewsData = await viewsRes.json();

      setPost(postData);
      setLikes(likesData.likes || 0);
      setLiked(likesData.userHasLiked || false);
      setComments(commentsData || []);
      setViews(viewsData.views || 0);
      setViewed(viewsData.userHasViewed || false);

      // Increment view only if user has not viewed yet
      if (!viewsData.userHasViewed) {
        const viewRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/view`, {
          method: "POST",
          credentials: "include",
        });
        if (viewRes.ok) {
          const updatedViewData = await viewRes.json();
          setViews(updatedViewData.views);
          setViewed(true);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPostData();
  }, [fetchPostData]);

  const handleLike = async () => {
    if (liked) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("You must be logged in to like this post");

      const data = await res.json();
      setLikes(data.likes);
      setLiked(true);
    } catch (err) {
      console.error("Like error:", err);
      alert((err as Error).message);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/comments-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: "Anonymous", text: commentText }),
      });

      if (!res.ok) throw new Error("You must be logged in to comment");

      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${post?.title}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${post?.title}`, "_blank");
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
          * {
            font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Shield className="absolute h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-700 font-medium">Loading post...</p>
        </div>
      </div>
    );

  if (error || !post)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
          * {
            font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
        <Header />
        <div className="container py-12 sm:py-20 text-center px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
            <Sparkles className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            404: Post Not Found
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{post.title} | Verve Hub</title>
        <meta name="description" content={post.description} />
      </Helmet>

      <div className="min-h-screen bg-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
          * {
            font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
        <Header />
        <article className="container py-8 sm:py-12 max-w-3xl relative z-10 px-4 sm:px-6">
          {/* Header */}
          <header className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            {post.featured && (
              <Badge className="bg-blue-600 text-white text-xs sm:text-sm border-0">
                <Shield className="h-3 w-3 mr-1" /> Featured
              </Badge>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{post.description}</p>

            <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 pt-3 sm:pt-4 border-t border-gray-100">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="hidden xs:inline">{new Date(post.date).toLocaleDateString()}</span>
                <span className="xs:hidden">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="truncate max-w-[100px] sm:max-w-none">{post.author}</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                {views} <span className="hidden xs:inline">views</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 text-xs">
                  <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-sm sm:prose lg:prose-lg prose-gray max-w-none bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 leading-relaxed">
            <style>{`
              .prose {
                color: #374151;
                line-height: 1.8;
              }
              .prose h1, .prose h2, .prose h3, .prose h4 {
                color: #1f2937;
                font-weight: 700;
              }
              .prose p {
                margin-top: 1.25em;
                margin-bottom: 1.25em;
              }
              .prose code {
                background-color: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 0.25rem;
                font-size: 0.9em;
              }
              .prose pre {
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
              }
              .prose a {
                color: #2563eb;
                text-decoration: underline;
              }
              .prose strong {
                color: #1f2937;
                font-weight: 600;
              }
            `}</style>
            <MDXContent content={post.content} />
          </div>

          {/* Like & Share */}
          <div className="mt-8 sm:mt-10 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-4">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center justify-center gap-2 border px-4 py-2.5 sm:py-2 rounded-xl transition-all text-sm font-medium ${
                    liked ? "bg-blue-600 text-white border-blue-600 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current text-white" : "text-blue-600"}`} /> 
                  <span>{likes} Likes</span>
                </button>

                <button
                  onClick={() => handleShare()}
                  className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 sm:py-2 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-blue-600" />} 
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>

              <div className="flex gap-3 justify-center sm:justify-start">
                <button 
                  onClick={() => handleShare("twitter")}
                  className="p-2.5 sm:p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl transition-all"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </button>
                <button 
                  onClick={() => handleShare("linkedin")}
                  className="p-2.5 sm:p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <section className="mt-8 sm:mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" /> 
              <span>Comments ({comments.length})</span>
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {comments.length > 0 ? (
                comments.map(c => (
                  <div key={c._id} className="border border-gray-200 bg-gray-50 rounded-xl p-3 sm:p-4 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                    <p className="text-blue-600 text-sm sm:text-base font-semibold">{c.name}</p>
                    <p className="text-gray-700 mt-1.5 sm:mt-2 text-sm sm:text-base leading-relaxed">{c.text}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">{new Date(c.date || Date.now()).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm sm:text-base">No comments yet. Be the first!</p>
                </div>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 h-24 sm:h-28 resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all"
              />
              <Button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </section>

          <footer className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100 text-center">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-50 border border-blue-200 rounded-xl">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span className="text-xs sm:text-sm text-gray-700">
                Happy Hacking!
              </span>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogPost;