import { useEffect, useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import { BlogPost } from "@/lib/blog";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, X, Tag } from "lucide-react";

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<BlogPost[]>(`${API_BASE_URL}/posts`);
        const postsData = response.data;

        setPosts(postsData);
        setFilteredPosts(postsData);

        // Extract unique tags dynamically
        const tags = Array.from(
          new Set(postsData.flatMap((p) => p.tags || []))
        );
        setAllTags(tags);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter logic
  useEffect(() => {
    let updatedPosts = [...posts];

    if (searchQuery.trim()) {
      updatedPosts = updatedPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      updatedPosts = updatedPosts.filter((post) =>
        post.tags?.includes(selectedTag)
      );
    }

    setFilteredPosts(updatedPosts);
  }, [searchQuery, selectedTag, posts]);

  const handleSearch = (value: string) => setSearchQuery(value);
  const handleTagClick = (tag: string) =>
    setSelectedTag(selectedTag === tag ? null : tag);

  // Loading & error states
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground font-mono">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-mono">{error}</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Available WriteUps
        </h1>
        <Link
          to="/"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-input border-border focus:border-primary focus:ring-primary font-mono"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-destructive/20"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tag List below search */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.length > 0 ? (
          allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className={`cursor-pointer font-mono text-xs transition-all ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "border-border hover:border-primary hover:bg-primary/10"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground font-mono">
            No tags available.
          </p>
        )}
        {selectedTag && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 text-xs font-mono text-muted-foreground hover:text-destructive"
            onClick={() => setSelectedTag(null)}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-mono">
          No posts found.
        </div>
      ) : (
        <div
          className="
            grid gap-6 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            auto-rows-fr
          "
        >
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="
                flex flex-col justify-between 
                h-full bg-card 
                border border-border 
                rounded-xl p-4 
                shadow-sm hover:shadow-md 
                transition-all duration-200
              "
            >
              <div className="flex-1">
                <BlogCard post={post} />
              </div>

              {/* Tags inside post */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-border">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer font-mono text-xs border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      onClick={() => handleTagClick(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
