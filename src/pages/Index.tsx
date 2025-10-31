import { useState } from "react";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogSearch } from "@/components/BlogSearch";
import Banner from "@/components/Banner";
import { getAllPosts, getPostsByTag } from "@/lib/blog";
import { Terminal, Sparkles } from "lucide-react";
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

    if (tag) posts = getPostsByTag(tag);

    if (query) {
      posts = posts.filter((post) =>
        [post.title, post.description, post.content, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    setFilteredPosts(posts);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="border-b border-gray-800 bg-black">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center items-center gap-3 text-gray-300">
              <Terminal className="h-8 w-8 animate-pulse text-white" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-400">
                System Online • User: Root@Verve
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
              Verve Hub Blog
            </h1>

            <p className="text-lg md:text-2xl text-gray-300 font-mono leading-relaxed">
              Cybersecurity insights, TryHackMe writeups, CTF solutions & hands-on guides.
              <br />
              <span className="text-white font-semibold">// Explore. Learn. Defend.</span>
            </p>

            <p className="text-base text-gray-400 font-mono leading-relaxed max-w-2xl mx-auto">
              Practical experiences and walkthroughs from real-world cyber challenges.  
              Whether you’re studying, training, or exploring — each post breaks down security concepts 
              into simple, actionable insights.
            </p>

            <div className="flex justify-center">
              <Banner />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container py-14">
        <div className="flex flex-col items-center">
          <BlogSearch
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
            selectedTag={selectedTag}
          />

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="h-16 w-16 text-gray-500 mx-auto mb-6 opacity-60" />
              <h3 className="text-xl font-display font-semibold text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-400 font-mono">
                Try adjusting your filters or search keywords
              </p>
            </div>
          ) : (
            <div
              className="grid gap-8 md:grid-cols-2 mt-10 w-full"
              style={{ gridAutoRows: "1fr" }}
            >
              {filteredPosts.map((post) => (
                <div key={post.slug} className="flex">
                  <div className="flex-1 flex flex-col">
                    <BlogCard post={post} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-24 bg-black/80 backdrop-blur-sm">
        <div className="container py-10 text-center space-y-4">
          <p className="text-sm font-mono text-gray-400">
            <span className="text-white">$</span> echo{" "}
            <span className="text-white">"Maintained by Iddy Chesire"</span> 🛡
          </p>

          <p className="text-xs text-gray-500 font-mono">
            <span className="text-white">Learn • Understand • Secure</span>
          </p>

          <div className="flex justify-center gap-6 text-gray-500 pt-2">
            <a
              href="https://github.com/acunetix2/verve_blog.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/iddy-chesire-55009b264/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://twitter.com/iddychesire"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="mailto:iddychesire@gmail.com"
              className="hover:text-white transition-colors"
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
