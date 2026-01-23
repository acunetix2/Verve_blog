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
import SocialSharing from "@/components/SocialSharing";

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
  isPublic?: boolean;
  visibility?: string;
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
      // Fetch post, comments, and views in parallel
      const [postRes, commentsRes, viewsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/comments`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}/views`, { credentials: "include" }),
      ]);

      if (!postRes.ok) throw new Error("Failed to fetch post");

      const postData = await postRes.json();
      
      // SECURITY: Check if post is public/accessible to current user
      const token = localStorage.getItem("token");
      const isAuthenticated = !!token;
      
      // If post is private and user is not authenticated, deny access
      if (postData.isPublic === false || postData.visibility === "private") {
        if (!isAuthenticated) {
          setError("This post is private. Please log in to view it.");
          setLoading(false);
          return;
        }
      }
      
      const commentsData: Comment[] = await commentsRes.json();
      const viewsData = await viewsRes.json();

      setPost(postData);
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

      <div className="min-h-screen bg-white pt-12">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
          * {
            font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
        <Header />
        <article className="w-full py-8 sm:py-12 px-4 sm:px-6">
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
              <button
                onClick={() => handleShare()}
                className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 sm:py-2 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-blue-600" />} 
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              <SocialSharing postId={post?._id || ""} postTitle={post?.title || ""} postSlug={slug || ""} authorName={post?.author || ""} />
            </div>
          </div>

          {/* DISABLED: Reactions section - endpoint may not be available */}
          {/* <section className="mt-8 sm:mt-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">React to this post</h3>
            <ReactionsPanel targetId={post?._id || ""} targetType="post" />
          </section> */}

          {/* DISABLED: Reviews & Ratings section - endpoint may not be available */}
          {/* <section className="mt-8 sm:mt-10">
            <UserReviews postId={post?._id || ""} />
          </section> */}

          {/* DISABLED: Comments section - endpoint may not be available */}
          {/* <section className="mt-8 sm:mt-10">
            <CommentsSystem postId={post?._id || ""} />
          </section> */}

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