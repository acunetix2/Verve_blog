import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, Phone, MapPin, Award, Book, Clock, TrendingUp, Heart, Settings,
  LogOut, Edit2, Camera, Check, X, Lock, Shield, Bell, ArrowLeft, Star,
  Calendar, Zap, Target, BookOpen, Users, Download, Flame
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeContext';

interface UserData {
  _id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
  location?: string;
  professionalTitle?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  enrolledCourses?: string[];
  completedCourses?: string[];
  badges?: string[];
  twoFactorEnabled?: boolean;
  createdAt?: string;
  lastLogin?: string;
  totalLearningMinutes?: number;
  currentStreak?: number;
  maxStreak?: number;
  lastActivityDate?: string;
}

interface CourseData {
  _id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  difficulty?: string;
  rating?: number;
  instructor?: { name: string };
  modules?: Array<{ lessons?: Array<{ _id?: string; duration?: number }> }>;
  totalDuration?: number;
  progress?: {
    completedLessons: Array<{ lessonId: string; completedAt: string; quizScore?: number }>;
    enrolledAt: string;
    lastAccessed: string;
  };
}

interface BadgeData {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  rarity?: string;
  earnedAt?: string;
}

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState<CourseData[]>([]);
  const [completedCourses, setCompletedCourses] = useState<CourseData[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeData[]>([]);
  const [editFormData, setEditFormData] = useState<Partial<UserData>>({});
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const fontStyle = {
    fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: '0.8125rem',
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: '0.75rem',
  };

  const tabs: TabType[] = [
    { id: 'overview', label: 'Overview', icon: <User size={18} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
    { id: 'badges', label: 'Achievements', icon: <Award size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch user profile
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
          { headers }
        );
        
        // Handle both direct user data and wrapped response
        const userData = response.data?.user || response.data;
        
        if (!userData || !userData._id) {
          toast.error('User profile not found');
          setLoading(false);
          return;
        }

        setUser(userData);
        setEditFormData(userData);
        setIsOwnProfile(true);

        // Fetch enrolled courses with progress data
        try {
          const coursesRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/courses/enrolled`,
            { headers }
          );
          if (coursesRes.data?.enrolledCourses) {
            setEnrolledCourses(coursesRes.data.enrolledCourses);
            
            // Extract completed courses (progress = 100%)
            const completed = coursesRes.data.enrolledCourses.filter((course: CourseData) => {
              if (!course.progress?.completedLessons) return false;
              // Determine if course is completed
              const modules = course.modules || [];
              const totalLessons = modules.reduce((sum: number, m) => sum + (m.lessons?.length || 0), 0);
              const completedLessons = course.progress.completedLessons.length;
              return totalLessons > 0 && completedLessons === totalLessons;
            });
            setCompletedCourses(completed);
          }
        } catch (coursesError) {
          console.error('Failed to fetch enrolled courses:', coursesError);
          setEnrolledCourses([]);
          setCompletedCourses([]);
        }

        // Fetch badges
        try {
          const badgesRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/badges/user/${userData._id}`,
            { headers }
          );
          setUserBadges(badgesRes.data?.badges || []);
        } catch (badgesError) {
          console.error('Failed to fetch badges:', badgesError);
          setUserBadges([]);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Calculate learning time from enrolled courses
  const calculateTotalLearningTime = (): number => {
    let totalMinutes = 0;
    enrolledCourses.forEach(course => {
      if (course.totalDuration) {
        totalMinutes += course.totalDuration;
      } else if (course.modules) {
        course.modules.forEach(module => {
          if (module.lessons) {
            module.lessons.forEach(lesson => {
              totalMinutes += lesson.duration || 0;
            });
          }
        });
      }
    });
    return totalMinutes;
  };

  // Calculate day streak based on activity
  const calculateDayStreak = (): number => {
    if (!user?.lastActivityDate) return 0;
    const lastActivity = new Date(user.lastActivityDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 1 ? (user?.currentStreak || 0) : 0;
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update user data with new profile info
      const updatedUser = response.data?.user || response.data;
      setUser(updatedUser);
      setEditFormData(updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin mb-4">
            <User size={40} className="text-blue-600 mx-auto" />
          </div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Profile not found</p>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 border-gray-800' : 'bg-gradient-to-br from-blue-50 via-blue-100/50 to-white border-blue-200'} border-b py-8`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            <ArrowLeft size={20} />
            <span style={fontStyle}>Back</span>
          </button>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold overflow-hidden ring-4 ring-white dark:ring-gray-800">
                {user.avatar ? (
                  <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase()
                )}
              </div>
              {isOwnProfile && editMode && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera size={18} />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                {fullName}
              </h1>
              {editMode ? (
                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editFormData.firstName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editFormData.lastName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Professional Title"
                    value={editFormData.professionalTitle || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, professionalTitle: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={editFormData.company || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>
              ) : (
                <>
                  {user.professionalTitle && (
                    <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {user.professionalTitle}
                    </p>
                  )}
                  {user.company && (
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      at {user.company}
                    </p>
                  )}
                </>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{enrolledCourses.length}</div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={fontStyle}>Enrolled</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{completedCourses.length}</div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={fontStyle}>Completed</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{userBadges.length}</div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={fontStyle}>Badges</p>
                </div>
                <div className="text-center flex items-center gap-1">
                  <Flame size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
                  <div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{calculateDayStreak()}</div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={fontStyle}>Day Streak</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex gap-2 w-full md:w-auto">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className={`flex-1 md:flex-none ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                      <Check size={18} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className={`flex-1 md:flex-none font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className={`flex-1 md:flex-none ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                   
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 font-semibold border-b-2 transition-all flex items-center gap-2 text-sm ${
                  activeTab === tab.id
                    ? isDark ? 'border-blue-600 text-blue-400' : 'border-blue-500 text-blue-600'
                    : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                }`}
                style={fontStyle}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-12 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: User Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                  About
                </h3>
                {editMode ? (
                  <textarea
                    placeholder="Tell us about yourself"
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                ) : (
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'} style={fontStyle}>
                    {user.bio || 'No bio yet. Add one to complete your profile!'}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
                    {editMode ? (
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      />
                    ) : (
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'} style={fontStyle}>{user.email}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
                    {editMode ? (
                      <input
                        type="tel"
                        value={editFormData.phoneNumber || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      />
                    ) : (
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'} style={fontStyle}>{user.phoneNumber || 'Not provided'}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
                    {editMode ? (
                      <input
                        type="text"
                        value={editFormData.location || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-blue-600/50 text-white' : 'bg-gray-50 border-blue-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                      />
                    ) : (
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'} style={fontStyle}>{user.location || 'Not provided'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                  Learning Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={isDark ? 'text-blue-400' : 'text-blue-600'} size={18} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Total Learning</span>
                    </div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {Math.floor((user.totalLearningMinutes || calculateTotalLearningTime()) / 60)}h {((user.totalLearningMinutes || calculateTotalLearningTime()) % 60)}m
                    </div>
                  </div>

                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className={isDark ? 'text-blue-400' : 'text-blue-600'} size={18} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Current Streak</span>
                    </div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {calculateDayStreak()} days
                    </div>
                  </div>

                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={isDark ? 'text-blue-400' : 'text-blue-600'} size={18} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Max Streak</span>
                    </div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {user.maxStreak || 0} days
                    </div>
                  </div>

                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={isDark ? 'text-blue-400' : 'text-blue-600'} size={18} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Member Since</span>
                    </div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {isOwnProfile && (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className={`w-full p-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                      <Heart size={18} />
                      Wishlisted Courses
                    </button>
                    <button className={`w-full p-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                      <Award size={18} />
                      My Certificates
                    </button>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Last Login</span>
                    <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`} style={smallFontStyle}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>2FA Status</span>
                    <span className="flex items-center gap-1">
                      {user.twoFactorEnabled ? (
                        <>
                          <Check size={16} className="text-blue-600" />
                          <span className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`} style={smallFontStyle}>Enabled</span>
                        </>
                      ) : (
                        <>
                          <X size={16} className="text-gray-400" />
                          <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Disabled</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            {/* Enrolled Courses */}
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                Enrolled Courses
              </h2>
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => {
                    // Calculate progress if available
                    const progress = course.progress?.completedLessons ? Math.round((course.progress.completedLessons.length / ((course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0)) || 1)) * 100) : 0;
                    
                    return (
                      <div
                        key={course._id}
                        onClick={() => navigate(`/v/courses/${course._id}`)}
                        className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-600/50' : 'bg-white border-gray-200 hover:border-blue-600'} border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group`}
                      >
                        <div className="h-40 bg-gray-300 relative overflow-hidden">
                          {course.imageUrl || course.image ? (
                            <img src={course.imageUrl || course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <BookOpen size={40} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className={`font-bold mb-1 line-clamp-2 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} transition`} style={fontStyle}>
                              {course.title}
                            </h3>
                            {course.progress?.completedLessons && (
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>
                                {course.progress.completedLessons.length} of {course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0} lessons
                              </p>
                            )}
                          </div>
                          
                          {course.progress?.completedLessons && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>Progress</span>
                                <span className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`} style={smallFontStyle}>{progress}%</span>
                              </div>
                              <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all" style={{ width: `${progress}%` }}></div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>
                              {course.difficulty && (
                                <span className="capitalize">{course.difficulty}</span>
                              )}
                            </div>
                            {course.rating && (
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500" fill="currentColor" />
                                <span className="text-xs font-semibold" style={smallFontStyle}>{course.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={fontStyle}>
                    No enrolled courses yet. <button onClick={() => navigate('/v/courses')} className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline font-medium`}>Browse courses</button>
                  </p>
                </div>
              )}
            </div>

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                  Completed Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((course) => (
                    <div
                      key={course._id}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden relative group hover:shadow-lg transition-all`}
                    >
                      <div className="h-40 bg-gray-300 relative overflow-hidden">
                        {course.imageUrl || course.image ? (
                          <img src={course.imageUrl || course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <BookOpen size={40} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full p-2">
                          <Check size={20} />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className={`font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                          {course.title}
                        </h3>
                        <div className="w-full rounded-full h-2 bg-gradient-to-r from-blue-500 to-purple-600 mb-2"></div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`} style={smallFontStyle}>
                          ✓ Completed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
              Achievements & Badges
            </h2>
            {userBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userBadges.map((badge) => (
                  <div
                    key={badge._id}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3 text-2xl">
                      🏆
                    </div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={fontStyle}>
                      {badge.name}
                    </h3>
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={smallFontStyle}>
                      {badge.description}
                    </p>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                      badge.rarity === 'rare' ? 'bg-blue-600/20 text-blue-400' :
                      badge.rarity === 'epic' ? 'bg-purple-600/20 text-purple-400' :
                      'bg-blue-600/20 text-blue-400'
                    }`} style={smallFontStyle}>
                      {badge.rarity || 'common'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
                <Award className={`mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-400'}`} size={40} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={fontStyle}>
                  No badges yet. Complete courses to earn achievements!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && isOwnProfile && (
          <div className="space-y-6 max-w-2xl">
            {/* Password Settings */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`} style={fontStyle}>
                <Lock size={20} />
                Password & Security
              </h3>
              <div className="space-y-4">
                <button className={`w-full p-3 rounded-lg text-sm font-semibold transition-colors border ${isDark ? 'border-blue-600/50 text-blue-400 hover:bg-gray-700' : 'border-blue-300 text-blue-600 hover:bg-gray-50'}`}>
                  Change Password
                </button>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={fontStyle}>Two-Factor Authentication</span>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    user.twoFactorEnabled
                      ? isDark ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      : isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}>
                    {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`} style={fontStyle}>
                <Bell size={20} />
                Notifications
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Course Updates', checked: true },
                  { label: 'Achievement Unlocked', checked: true },
                  { label: 'Learning Reminders', checked: false },
                  { label: 'News & Promotions', checked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded accent-blue-600" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'} style={smallFontStyle}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className={`${isDark ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'} border rounded-lg p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-red-400' : 'text-red-700'}`} style={fontStyle}>
                Danger Zone
              </h3>
              <button className={`w-full p-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-red-600/30 text-red-400 hover:bg-red-600/50' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
);
};
export default UserProfile;
