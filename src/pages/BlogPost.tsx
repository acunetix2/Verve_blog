import { useEffect, useState } from "react";
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
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 mb-4">
            <Terminal className="h-10 w-10 text-cyan-400 animate-pulse" />
          </div>
          <p className="font-mono text-cyan-300 text-lg animate-pulse">
            Loading post...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950">
        {/* Animated grid background */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <Header />
        <div className="relative z-10 container py-20 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-950/30 to-gray-950/30 border border-red-500/30 mb-8">
            <Sparkles className="h-12 w-12 text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
            404: Post Not Found
          </h1>
          <p className="text-gray-400 mb-8 font-mono text-lg">
            {error || "The post you're looking for doesn't exist."}
          </p>
          <Link to="/">
            <Button className="group px-6 py-3 font-mono bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 rounded-lg shadow-lg shadow-cyan-500/30 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Verve Hub</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-white">
        {/* Animated grid background */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        {/* Floating particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-30px) translateX(15px); }
            50% { transform: translateY(-60px) translateX(-15px); }
            75% { transform: translateY(-30px) translateX(15px); }
          }
        `}</style>

        <Header />

        {/* Back Button */}
        <div className="relative z-10 border-b border-cyan-500/20 bg-gray-950/50 backdrop-blur-sm">
          <div className="container py-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="group font-mono text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/50 bg-gray-900/50 hover:bg-cyan-500/10 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Post Header */}
        <article className="relative z-10 container py-12 max-w-4xl">
          <header className="mb-12 space-y-6">
            {post.featured && (
              <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/50 font-mono shadow-lg shadow-cyan-500/30">
                <Shield className="h-3 w-3 mr-1" />
                FEATURED POST
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed font-mono">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-mono pt-6 border-t border-cyan-500/20">
              <span className="flex items-center gap-2 text-cyan-300">
                <Calendar className="h-4 w-4 text-cyan-400" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2 text-blue-300">
                <Clock className="h-4 w-4 text-blue-400" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-2 text-white">
                <User className="h-4 w-4 text-white" />
                {post.author}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="font-mono text-xs border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Post Content */}
          <div
            className="prose prose-invert prose-cyan max-w-none 
            prose-headings:font-display prose-headings:text-cyan-300
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
            prose-strong:text-cyan-200 prose-strong:font-bold
            prose-code:text-cyan-400 prose-code:bg-gray-900/50 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-cyan-500/30 prose-pre:shadow-lg
            prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-400
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-cyan-400
            prose-img:rounded-lg prose-img:border prose-img:border-cyan-500/20"
          >
            <MDXContent content={post.content} />
          </div>

          {/* Post Footer */}
          <footer className="mt-16 pt-8 border-t border-cyan-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm font-mono text-gray-400">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-400">$</span> Happy Hacking!
              </div>
              <Link to="/blog">
                <Button
                  variant="outline"
                  className="group font-mono border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all"
                >
                  Read more posts
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
