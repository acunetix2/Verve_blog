import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { MDXContent } from "@/components/MDXContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono text-muted-foreground animate-pulse">
          Loading post...
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            404: Post Not Found
          </h1>
          <p className="text-muted-foreground mb-6 font-mono">
            {error || "The post you're looking for doesn't exist."}
          </p>
          <Link to="/">
            <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
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

      <div className="min-h-screen bg-background">
        <Header />

        {/* Back Button */}
        <div className="border-b border-border bg-muted/20">
          <div className="container py-4">
            <Link to="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Post Header */}
        <article className="container py-12 max-w-4xl">
          <header className="mb-12 space-y-6">
            {post.featured && (
              <Badge className="bg-primary/20 text-primary border-primary/50 font-mono">
                FEATURED POST
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground glow-text">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-mono text-muted-foreground pt-4 border-t border-border">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                {post.author}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="font-mono border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose-custom text-white">
            <MDXContent content={post.content} />
          </div>

          {/* Post Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm font-mono text-muted-foreground">
                <span className="text-primary">$</span> EOF - End of file
              </div>
              <Link to="/">
                <Button
                  variant="outline"
                  className="font-mono border-primary/30 text-primary hover:bg-primary/10 hover:shadow-glow"
                >
                  Read more posts →
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
