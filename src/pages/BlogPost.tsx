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
        fetch(`http://localhost:5000/api/posts/${slug}`, { credentials: "include" }),
        fetch(`http://localhost:5000/api/posts/${slug}/likes`, { credentials: "include" }),
        fetch(`http://localhost:5000/api/posts/${slug}/comments`, { credentials: "include" }),
        fetch(`http://localhost:5000/api/posts/${slug}/views`, { credentials: "include" }),
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
        const viewRes = await fetch(`http://localhost:5000/api/posts/${slug}/view`, {
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
    if (liked) return; // Restrict multiple likes per user

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${slug}/like`, {
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
      const res = await fetch(`http://localhost:5000/api/posts/${slug}/comments-name`, {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-blue-950">
        <div className="text-center space-y-3">
          <Terminal className="h-10 w-10 text-cyan-400 animate-pulse mx-auto" />
          <p className="text-cyan-300 font-mono animate-pulse">Loading post...</p>
        </div>
      </div>
    );

  if (error || !post)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950">
        <Header />
        <div className="container py-20 text-center">
          <Sparkles className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
            404: Post Not Found
          </h1>
          <p className="text-gray-400 font-mono mb-6">{error}</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/50">
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

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-white">
        <Header />
        <article className="container py-12 max-w-4xl relative z-10">
          {/* Header */}
          <header className="mb-12 space-y-6">
            {post.featured && (
              <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/50 text-white">
                <Shield className="h-3 w-3 mr-1" /> FEATURED
              </Badge>
            )}
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {post.title}
            </h1>
            <p className="text-gray-300 font-mono">{post.description}</p>

            <div className="flex flex-wrap gap-6 text-sm font-mono text-gray-400 pt-4 border-t border-cyan-500/20">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                {new Date(post.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-white" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-400" />
                {views} views
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-cyan-500/30 text-cyan-300 font-mono bg-cyan-950/20">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-cyan max-w-none">
            <MDXContent content={post.content} />
          </div>

          {/* Like & Share */}
          <div className="mt-12 flex items-center justify-between border-t border-cyan-500/20 pt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-2 font-mono border px-4 py-2 rounded-lg transition-all ${
                  liked ? "bg-cyan-600 text-white border-cyan-400 cursor-not-allowed" : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current text-white" : "text-cyan-300"}`} /> {likes} Likes
              </button>

              <button
                onClick={() => handleShare()}
                className="flex items-center gap-2 border border-cyan-500/30 px-4 py-2 rounded-lg text-cyan-300 hover:bg-cyan-500/10"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />} Copy Link
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleShare("twitter")}>
                <Twitter className="h-5 w-5 text-cyan-400 hover:text-cyan-300" />
              </button>
              <button onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-5 w-5 text-cyan-400 hover:text-cyan-300" />
              </button>
            </div>
          </div>

          {/* Comments */}
          <section className="mt-16">
            <h2 className="text-2xl font-display text-cyan-400 mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Comments ({comments.length})
            </h2>

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map(c => (
                  <div key={c._id} className="border border-cyan-500/20 bg-gray-900/40 rounded-lg p-4">
                    <p className="font-mono text-cyan-300">{c.name}</p>
                    <p className="text-gray-300 mt-1">{c.text}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(c.date || Date.now()).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 font-mono">No comments yet. Be the first!</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-8 space-y-4">
              <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full bg-gray-900 border border-cyan-500/20 text-white rounded-lg px-4 py-2 h-28 font-mono resize-none focus:border-cyan-400 focus:outline-none"
              />
              <Button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </section>

          <footer className="mt-16 pt-8 border-t border-cyan-500/20 text-center">
            <div className="text-sm font-mono text-gray-400">
              <Terminal className="inline h-4 w-4 text-cyan-400 mr-1" />
              <span className="text-cyan-400">$</span> Happy Hacking!
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
