import { Link } from "react-router-dom";
import { Terminal, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Terminal className="h-6 w-6 text-primary" />
          <span className="text-xl font-display font-bold glow-text">
            $VERVE_HUB BLOG<span className="terminal-cursor"></span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/blog"
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            Posts
          </Link>
          <a
            href="https://tryhackme.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-muted-foreground hover:text-secondary transition-colors"
          >
            tryhackme
          </a>
          <Button
            variant="outline"
            size="sm"
            className="font-mono border-primary/30 text-primary hover:bg-primary/10 hover:shadow-glow"
          >
            <Search className="h-4 w-4 mr-2" />
            search
          </Button>

          {/* 🆕 Create Post Button */}
          <Link to="/create">
            <Button
              variant="default"
              size="sm"
              className="font-mono bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
