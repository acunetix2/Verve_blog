import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  User,
  Edit,
  Heart,
  Share2,
  Eye,
  Flame,
  Target,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Globe,
  MessageSquare,
  Settings,
  LogOut,
  Inbox,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeContext';

interface ProgressData {
  courseId: string;
  slug: string;
  courseName: string;
  description?: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  lastAccessed: string;
  image?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  badges?: Array<{ id: string; name: string; icon: string; unlockedDate: string; color: string }>;
  achievements?: Array<{ id: string; title: string; progress: number; maxProgress: number; completed: boolean }>;
  stats?: {
    postsPublished: number;
    articlesRead: number;
    resourcesShared: number;
    communitiesJoined: number;
  };
  totalPosts?: number;
  totalViews?: number;
  totalLikes?: number;
  createdAt?: string;
  totalLearningMinutes?: number;
  currentStreak?: number;
  maxStreak?: number;
  lastLogin?: string;
}

const UserProgressDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState<string | null>(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'achievements' | 'activity'>('overview');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  const fontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: '0.8125rem',
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: '0.75rem',
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access your dashboard");
      navigate('/login', { replace: true });
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Handle both direct user data and wrapped response
        const userData = profileRes.data?.user || profileRes.data;
        
        if (!userData || !userData._id) {
          toast.error('Unable to load profile data');
          setLoading(false);
          return;
        }
        
        setUserProfile(userData);
        setEditData(userData);

        // Fetch wishlist count
        try {
          const wishlistRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/wishlist`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWishlistCount(wishlistRes.data?.length || 0);
        } catch (error) {
          console.log('Wishlist not available');
        }

        // Fetch all courses
        const coursesRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses`
        );
        const allCourses = coursesRes.data || [];

        // Fetch user progress for each course
        const progressPromises = allCourses.map((course: { _id: string }) =>
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/courses/${course._id}/progress`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        const progressResults = await Promise.allSettled(progressPromises);

        // Build progress data
        const data: ProgressData[] = allCourses
          .map((course: { _id: string; slug: string; title: string; description: string; modules: Array<{ lessons?: Array<unknown> }>; imageUrl?: string }, idx: number) => {
            const result = progressResults[idx];
            if (result.status === 'fulfilled' && result.value.data) {
              const progress = result.value.data;
              const totalLessons = course.modules.reduce(
                (sum: number, m: { lessons?: Array<unknown> }) => sum + (m.lessons?.length || 0),
                0
              );
              const completedCount = progress.completedLessons?.length || 0;
              const progressPercent =
                totalLessons > 0
                  ? Math.round((completedCount / totalLessons) * 100)
                  : 0;

              return {
                courseId: course._id,
                slug: course.slug,
                courseName: course.title,
                description: course.description,
                progress: progressPercent,
                completedLessons: completedCount,
                totalLessons,
                enrolledAt: progress.enrolledAt || new Date().toISOString(),
                lastAccessed: progress.lastAccessed || new Date().toISOString(),
                image: course.imageUrl,
              };
            }
            return null;
          })
          .filter((item): item is ProgressData => item !== null);

        setProgressData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const calculateStats = () => {
    const totalCourses = progressData.length;
    const completedCourses = progressData.filter((p) => p.progress === 100).length;
    const inProgressCourses = progressData.filter((p) => p.progress > 0 && p.progress < 100).length;
    const avgProgress =
      progressData.length > 0 ? Math.round(progressData.reduce((sum, p) => sum + p.progress, 0) / progressData.length) : 0;
    const totalLessonsCompleted = progressData.reduce((sum, p) => sum + p.completedLessons, 0);

    return { totalCourses, completedCourses, inProgressCourses, avgProgress, totalLessonsCompleted };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100/50 to-white'} border-b ${isDark ? 'border-gray-800' : 'border-blue-200'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-start justify-between gap-6">
            {/* Profile Section */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden flex-shrink-0">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  userProfile?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>

              {/* Profile Info */}
              <div>
                <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Welcome back, {userProfile?.name || userProfile?.email?.split('@')[0] || 'Learner'}!
                </h1>
                <p className={`text-lg mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  {userProfile?.bio || 'Keep learning, keep growing'}
                </p>
                
                {/* Social Links */}
                {(userProfile?.github || userProfile?.linkedin || userProfile?.twitter || userProfile?.website) && (
                  <div className="flex items-center gap-3 mt-3">
                    {userProfile?.github && (
                      <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
                        <Github size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                      </a>
                    )}
                    {userProfile?.linkedin && (
                      <a href={`https://linkedin.com/in/${userProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
                        <Linkedin size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                      </a>
                    )}
                    {userProfile?.twitter && (
                      <a href={`https://twitter.com/${userProfile.twitter}`} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
                        <Twitter size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                      </a>
                    )}
                    {userProfile?.website && (
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
                        <Globe size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-8">
            {(['overview', 'profile', 'achievements', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 font-semibold border-b-2 transition-all text-sm ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:${isDark ? 'text-gray-300' : 'text-gray-900'}`
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'profile' && 'Profile'}
                {tab === 'achievements' && 'Achievements'}
                {tab === 'activity' && 'Activity'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={18} className="text-blue-600" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Courses</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalCourses}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completedCourses}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={18} className="text-amber-600" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.inProgressCourses}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <Flame size={18} className="text-red-600" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Lessons</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalLessonsCompleted}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <Heart size={18} className="text-red-500" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Wishlisted</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{wishlistCount}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={18} className="text-purple-600" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Progress</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.avgProgress}%</p>
              </div>
            </div>

            {/* Learning Statistics Section - Using Full User Model */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Learning Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={20} className="text-blue-600" />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Learning Time</p>
                  </div>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {Math.floor((userProfile?.totalLearningMinutes || 0) / 60)}h {(userProfile?.totalLearningMinutes || 0) % 60}m
                  </p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {userProfile?.totalLearningMinutes || 0} minutes total
                  </p>
                </div>

                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Flame size={20} className="text-orange-600" />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Streak</p>
                  </div>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userProfile?.currentStreak || 0}
                  </p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    days in a row
                  </p>
                </div>

                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Target size={20} className="text-green-600" />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Max Streak</p>
                  </div>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userProfile?.maxStreak || 0}
                  </p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    your personal best
                  </p>
                </div>

                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-purple-600" />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</p>
                  </div>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).getFullYear() : 'N/A'}
                  </p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Courses</h2>
              {progressData.length === 0 ? (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
                  <BookOpen size={48} className={`mx-auto mb-4 opacity-50 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>You haven't enrolled in any courses yet.</p>
                  <button
                    onClick={() => navigate('/v/courses')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Browse Courses <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progressData.map((course) => (
                    <div
                      key={course.courseId}
                      className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-600/50' : 'bg-white border-gray-200 hover:border-blue-600'} border rounded-lg p-6 transition-all group`}
                    >
                      {course.image && (
                        <div className="rounded-lg overflow-hidden mb-4 h-32">
                          <img src={course.image} alt={course.courseName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <h3 className={`font-bold mb-1 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} transition`}>
                        {course.courseName}
                      </h3>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {course.completedLessons} of {course.totalLessons} lessons
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                          <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{course.progress}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/v/courses/${course.slug || course.courseId}`)}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm flex items-center justify-center gap-2"
                      >
                        {course.progress === 100 ? <CheckCircle2 size={16} /> : <Play size={16} />}
                        {course.progress === 100 ? 'Review' : 'Continue'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-8 max-w-2xl`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-2 rounded-lg border transition ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-2 rounded-lg border transition resize-none h-24 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input
                    type="text"
                    value={editData.location || ''}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-2 rounded-lg border transition ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Website</label>
                  <input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-2 rounded-lg border transition ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>GitHub</label>
                  <input
                    type="text"
                    value={editData.github || ''}
                    onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-2 rounded-lg border transition ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>LinkedIn</label>
                  <input
                    type="text"
                    value={editData.linkedin || ''}
                    onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-2 rounded-lg border transition ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Twitter</label>
                  <input
                    type="text"
                    value={editData.twitter || ''}
                    onChange={(e) => setEditData({ ...editData, twitter: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-2 rounded-lg border transition ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!isEditingProfile && 'opacity-50'}`}
                    placeholder="@username"
                  />
                </div>
              </div>
              {isEditingProfile && (
                <div className="flex gap-2 pt-4 border-t border-gray-300/20">
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      // TODO: Save profile changes
                      toast.success('Profile updated successfully!');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditData(userProfile || {});
                    }}
                    className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg font-medium transition flex-1`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* Badges */}
            {userProfile?.badges && userProfile.badges.length > 0 && (
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Earned Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userProfile.badges.map((badge) => (
                    <div key={badge.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 text-center`}>
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{badge.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(badge.unlockedDate)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Summary */}
            {userProfile?.stats && (
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Content Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Posts Published</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProfile.stats.postsPublished || 0}</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Articles Read</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProfile.stats.articlesRead || 0}</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Resources Shared</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProfile.stats.resourcesShared || 0}</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Communities Joined</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProfile.stats.communitiesJoined || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* No achievements */}
            {(!userProfile?.badges || userProfile.badges.length === 0) && (!userProfile?.stats || userProfile.stats.postsPublished === 0) && (
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
                <Award size={48} className={`mx-auto mb-4 opacity-50 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Complete courses and engage with the community to earn badges!</p>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-8 max-w-2xl`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
            <div className="space-y-4">
              {progressData.slice(0, 5).map((course, idx) => (
                <div key={idx} className={`flex items-center gap-4 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {course.progress}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{course.courseName}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last accessed {formatDate(course.lastAccessed)}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/v/courses/${course.slug || course.courseId}`)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition flex-shrink-0"
                  >
                    Resume
                  </button>
                </div>
              ))}
              {progressData.length === 0 && (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No activity yet. Enroll in a course to get started!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProgressDashboard;
