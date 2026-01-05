import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Award,
  Trophy,
  Zap,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Camera,
  Edit,
  Save,
  X,
  Shield,
  Star,
  Flame,
  BookOpen,
  Heart,
  Share2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  profileImage?: string;
  joinDate: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  badges: Badge[];
  achievements: Achievement[];
  stats: {
    postsPublished: number;
    articlesRead: number;
    resourcesShared: number;
    communitiesJoined: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  icon: string;
  completed: boolean;
}

const EnhancedUserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        "/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProfile(response.data);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const BadgeComponent = ({ badge }: { badge: Badge }) => (
    <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br rounded-lg border-2 transition-transform hover:scale-105" 
         style={{
           borderColor: badge.color,
           background: `linear-gradient(135deg, ${badge.color}15 0%, ${badge.color}05 100%)`
         }}>
      <div className="text-3xl">{badge.icon}</div>
      <p className="text-sm font-semibold text-center text-gray-900">{badge.name}</p>
      <p className="text-xs text-gray-600 text-center">{badge.description}</p>
    </div>
  );

  const AchievementBar = ({ achievement }: { achievement: Achievement }) => (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div>
            <p className="font-semibold text-gray-900">{achievement.title}</p>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
        </div>
        {achievement.completed && <Trophy className="text-yellow-500 flex-shrink-0" />}
      </div>
      <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            achievement.completed ? "bg-yellow-500" : "bg-blue-500"
          }`}
          style={{
            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
          }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-2">
        {achievement.progress} / {achievement.maxProgress} completed
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-60 rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white relative">
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            <Edit size={20} />
          </button>
        )}

        <div className="flex items-start gap-6 flex-wrap">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg overflow-hidden">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
                <Camera size={16} className="text-gray-700" />
              </button>
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border border-white/40 rounded-lg text-white placeholder-white/60"
                  placeholder="Name"
                />
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border border-white/40 rounded-lg text-white placeholder-white/60 h-20 resize-none"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-white/80 mt-2">{profile.bio || "No bio added yet"}</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <p className="text-white/70 text-sm">Total Posts</p>
            <p className="text-2xl font-bold text-white">{profile.totalPosts}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <p className="text-white/70 text-sm">Total Views</p>
            <p className="text-2xl font-bold text-white">{profile.totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <p className="text-white/70 text-sm">Total Likes</p>
            <p className="text-2xl font-bold text-white">{profile.totalLikes}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <p className="text-white/70 text-sm">Member Since</p>
            <p className="text-lg font-bold text-white">{new Date(profile.joinDate).getFullYear()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveProfile} className="bg-white text-blue-600 hover:bg-gray-100">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
            <Button
              onClick={() => setEditing(false)}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Contact Info */}
      {!editing && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Contact & Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin size={18} className="text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Location</p>
                  <p className="text-sm font-medium text-gray-900">{profile.location}</p>
                </div>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe size={18} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Website</p>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                    {profile.website}
                  </a>
                </div>
              </div>
            )}
            {profile.github && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Github size={18} className="text-gray-800" />
                <div>
                  <p className="text-xs text-gray-600">GitHub</p>
                  <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                    {profile.github}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">Badges & Achievements</h2>
        </div>
        {profile.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.badges.map((badge) => (
              <BadgeComponent key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No badges earned yet. Keep publishing to unlock badges!</p>
        )}
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">Achievement Progress</h2>
        </div>
        <div className="space-y-4">
          {profile.achievements.map((achievement) => (
            <AchievementBar key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <BookOpen className="text-blue-600 mx-auto mb-2" size={24} />
          <p className="text-3xl font-bold text-gray-900">{profile.stats.postsPublished}</p>
          <p className="text-sm text-gray-600 mt-1">Posts Published</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Heart className="text-red-600 mx-auto mb-2" size={24} />
          <p className="text-3xl font-bold text-gray-900">{profile.stats.articlesRead}</p>
          <p className="text-sm text-gray-600 mt-1">Articles Read</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Share2 className="text-green-600 mx-auto mb-2" size={24} />
          <p className="text-3xl font-bold text-gray-900">{profile.stats.resourcesShared}</p>
          <p className="text-sm text-gray-600 mt-1">Resources Shared</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Zap className="text-yellow-600 mx-auto mb-2" size={24} />
          <p className="text-3xl font-bold text-gray-900">{profile.stats.communitiesJoined}</p>
          <p className="text-sm text-gray-600 mt-1">Communities Joined</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;
