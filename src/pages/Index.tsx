import { useState } from "react";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogSearch } from "@/components/BlogSearch";
import Banner from "@/components/Banner";
import { getAllPosts, getPostsByTag, searchPosts } from "@/lib/blog";
import { Terminal, Zap } from "lucide-react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const Index = () => {
  const [filteredPosts, setFilteredPosts] = useState(getAllPosts());
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updatePosts(query, selectedTag);
  };

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    updatePosts(searchQuery, tag);
  };

  const updatePosts = (query: string, tag: string | null) => {
    let posts = getAllPosts();
    
    if (tag) {
      posts = getPostsByTag(tag);
    }
    
    if (query) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredPosts(posts);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20">
	  <div className="container py-16 md:py-24">
		<div className="max-w-3xl space-y-6">
		  <div className="flex items-center gap-3 text-primary">
			<Terminal className="h-8 w-8" />
			<span className="text-sm font-mono uppercase tracking-wider glow-text">
			  System Online💎
			  Logged In User: System <span className="terminal-cursor"></span>
			</span>
		  </div>
		  
		  <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight glow-text">
			VERVE HUB BLOG🛡
		  </h1>
		  
		  <p className="text-xl md:text-2xl text-muted-foreground font-mono">
			Cybersecurity insights, TryHackMe writeups, Capture the Flag solutions and Guides.
			<br />
			<span className="text-primary">// Welcome to the digital underground</span>
		  </p>

		  {/* Added short contextual info */}
		  <p className="text-base text-muted-foreground font-mono leading-relaxed">
			This space shares practical experiences, learning notes, and walkthroughs from real-world
			cybersecurity challenges. Whether you're training, researching, or exploring security concepts,
			each post aims to simplify and inform.
		  </p>
		  <div className="text-center  font-display font-bold tracking-tight glow-text">
			<Banner />
		  </div>
		</div>
	  </div>
	</section>

      {/* Blog Content */}
      <section className="container py-12">
        <BlogSearch
          onSearch={handleSearch}
          onTagFilter={handleTagFilter}
          selectedTag={selectedTag}
        />

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Terminal className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              No posts found
            </h3>
            <p className="text-muted-foreground font-mono">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredPosts.map((posts) => (
              <BlogCard key={posts.slug} post={posts} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
		 <footer className="border-t border-border mt-20">
      <div className="container py-8 text-center space-y-3">
        <p className="text-sm font-mono text-muted-foreground">
          <span className="text-primary">$</span> echo "Maintained by Iddy Chesire" 🛡
          <span className="terminal-cursor"></span>
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary">Learn • Understand • Secure</span>
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-muted-foreground">
          <a
            href="https://github.com/acunetix2/verve_blog.git"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/iddy-chesire-55009b264/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://twitter.com/iddychesire"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href="mailto:iddychesire@gmail.com"
            className="hover:text-primary transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Index;
