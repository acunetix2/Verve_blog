import { Link, useNavigate } from "react-router-dom";
import { PenTool, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center font-sans text-foreground">
      {/* Back Button */}
      <div className="flex justify-start mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex text-white items-center gap-2 font-mono border-blue-300 hover:white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <h1 className="text-4xl font-display text-white font-bold mb-4">
        About <span className="text-white">Verve Blog</span>
      </h1>

      <p className="text-muted-foreground text-base font-mono mb-8 leading-relaxed">
        Verve Blog is a modern space dedicated to sharing insights in
        cybersecurity, programming, and technology. It’s built to inspire,
        educate, and empower tech enthusiasts through practical knowledge and
        write-ups that make complex concepts simple.
      </p>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-2 text-white">Owner</h2>
        <p className="text-muted-foreground font-mono">
          <span className="font-semibold text-foreground text-white">Iddy Chesire</span> —
          Cybersecurity Analyst, Software Developer, and Founder of Verve Blog.
          Passionate about building secure, user-focused digital experiences and
          promoting continuous learning in tech.
        </p>
      </div>

      <p className="text-muted-foreground mb-6 font-mono">
        Explore my latest write-ups, walkthroughs, and cybersecurity guides.
      </p>

      <Link to="/blog">
        <Button className="bg-gray border-white text-white hover:purple-300 hover:bg-purple-400 hover:border-white">
          <PenTool className="h-4 w-4 mr-2" />
          View Posts
        </Button>
      </Link>
    </div>
  );
}
