import React, { useState, useEffect } from "react";
import {
  Share2,
  Heart,
  MessageSquare,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Link as LinkIcon,
  TrendingUp,
  Award,
  Users,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareOptions {
  title: string;
  description: string;
  url: string;
  author: string;
  tags: string[];
}

interface Engagement {
  likes: number;
  comments: number;
  shares: number;
  userLiked: boolean;
  userBookmarked: boolean;
  shareCount: {
    twitter: number;
    linkedin: number;
    facebook: number;
    email: number;
  };
}

interface SocialEngagementProps {
  postId: string;
  options: ShareOptions;
  initialEngagement?: Engagement;
}

const SocialEngagement: React.FC<SocialEngagementProps> = ({
  postId,
  options,
  initialEngagement,
}) => {
  const [engagement, setEngagement] = useState<Engagement>(
    initialEngagement || {
      likes: 0,
      comments: 0,
      shares: 0,
      userLiked: false,
      userBookmarked: false,
      shareCount: {
        twitter: 0,
        linkedin: 0,
        facebook: 0,
        email: 0,
      },
    }
  );

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialEngagement) {
      setEngagement(initialEngagement);
    }
  }, [initialEngagement]);

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEngagement((prev) => ({
        ...prev,
        likes: response.data.likes,
        userLiked: response.data.userLiked,
      }));
      toast.success(
        response.data.userLiked ? "Added to favorites!" : "Removed from favorites"
      );
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to process like");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/posts/${postId}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEngagement((prev) => ({
        ...prev,
        userBookmarked: response.data.userBookmarked,
      }));
      toast.success(
        response.data.userBookmarked ? "Bookmarked!" : "Removed bookmark"
      );
    } catch (error) {
      console.error("Failed to bookmark post:", error);
      toast.error("Failed to bookmark post");
    } finally {
      setLoading(false);
    }
  };

  const shareToTwitter = () => {
    const text = `Check out: "${options.title}" by ${options.author}\n\n${options.description}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(options.url)}&hashtags=${encodeURIComponent(
      options.tags.join(",")
    )}`;
    window.open(url, "_blank", "width=550,height=420");
    trackShare("twitter");
  };

  const shareToLinkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      options.url
    )}`;
    window.open(url, "_blank", "width=550,height=420");
    trackShare("linkedin");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      options.url
    )}`;
    window.open(url, "_blank", "width=550,height=420");
    trackShare("facebook");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check this out: ${options.title}`);
    const body = encodeURIComponent(
      `${options.description}\n\nRead more: ${options.url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare("email");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(options.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackShare("copy");
    toast.success("Link copied to clipboard!");
  };

  const trackShare = async (platform: string) => {
    try {
      await axios.post(
        `/api/posts/${postId}/share`,
        { platform },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEngagement((prev) => ({
        ...prev,
        shares: prev.shares + 1,
        shareCount: {
          ...prev.shareCount,
          [platform]: (prev.shareCount[platform as keyof typeof prev.shareCount] || 0) + 1,
        },
      }));
    } catch (error) {
      console.error("Failed to track share:", error);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Engagement Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share & Engage</h3>

        {/* Engagement Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 text-center">
            <Heart
              size={20}
              className={`mx-auto mb-2 ${
                engagement.userLiked ? "fill-red-600 text-red-600" : "text-red-400"
              }`}
            />
            <p className="text-2xl font-bold text-gray-900">
              {engagement.likes}
            </p>
            <p className="text-xs text-gray-600">Likes</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 text-center">
            <MessageSquare size={20} className="mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-gray-900">
              {engagement.comments}
            </p>
            <p className="text-xs text-gray-600">Comments</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center">
            <Share2 size={20} className="mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-gray-900">
              {engagement.shares}
            </p>
            <p className="text-xs text-gray-600">Shares</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={handleLike}
              disabled={loading}
              variant={engagement.userLiked ? "default" : "outline"}
              className="flex-1"
            >
              <Heart
                size={18}
                className={engagement.userLiked ? "fill-current" : ""}
              />
              <span className="ml-2">{engagement.userLiked ? "Liked" : "Like"}</span>
            </Button>
            <Button
              onClick={handleBookmark}
              disabled={loading}
              variant={engagement.userBookmarked ? "default" : "outline"}
              className="flex-1"
            >
              <LinkIcon size={18} />
              <span className="ml-2">
                {engagement.userBookmarked ? "Saved" : "Save"}
              </span>
            </Button>
            <div className="relative flex-1">
              <Button
                onClick={() => setShowShareMenu(!showShareMenu)}
                variant="outline"
                className="w-full"
              >
                <Share2 size={18} />
                <span className="ml-2">Share</span>
              </Button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        shareToTwitter();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Twitter size={18} className="text-blue-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Share on Twitter
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        shareToLinkedin();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Linkedin size={18} className="text-blue-700" />
                      <span className="text-sm font-medium text-gray-900">
                        Share on LinkedIn
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        shareToFacebook();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Facebook size={18} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Share on Facebook
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        shareViaEmail();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Mail size={18} className="text-red-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Share via Email
                      </span>
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={() => {
                        copyLink();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {copied ? "Link Copied!" : "Copy Link"}\n                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Sharing Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Twitter size={16} className="text-blue-400" />
              <p className="text-sm font-medium text-gray-600">Twitter</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {engagement.shareCount.twitter}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Linkedin size={16} className="text-blue-700" />
              <p className="text-sm font-medium text-gray-600">LinkedIn</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {engagement.shareCount.linkedin}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Facebook size={16} className="text-blue-600" />
              <p className="text-sm font-medium text-gray-600">Facebook</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {engagement.shareCount.facebook}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} className="text-red-500" />
              <p className="text-sm font-medium text-gray-600">Email</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {engagement.shareCount.email}
            </p>
          </div>
        </div>
      </div>

      {/* Engagement Incentive */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Award className="text-purple-600 mt-1" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Engagement Rewards</h3>
            <p className="text-sm text-gray-600 mb-3">
              Help spread knowledge! Share articles to unlock community badges and recognition.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
                <span>Share 5 articles → Influencer Badge</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
                <span>Get 10 likes → Community Contributor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
                <span>Help 50+ readers → Knowledge Sharer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialEngagement;
