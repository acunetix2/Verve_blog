import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Flame, Trophy, Target, Zap, BookOpen, Users, Award, TrendingUp,
  LogOut, Settings, Edit2, BarChart3, Calendar, Star, Lock,
  ChevronRight, Download, Share2, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserStats {
  _id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  totalPoints: number;
  pointsThisMonth: number;
  currentStreak: number;
  maxStreak: number;
  level: number;
  rank: number;
  roomsCompleted: number;
  totalLearningMinutes: number;
  capabilityScores: {
    web?: number;
    network?: number;
    linux?: number;
    windows?: number;
    offensive?: number;
    defensive?: number;
    cryptography?: number;
    forensics?: number;
  };
}

const THMDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserStats();
  }, [token, navigate]);

  const fetchUserStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserStats(res.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
    );
  }

  const capabilityList = Object.entries(userStats.capabilityScores || {})
    .filter(([, score]) => score && score > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-['Product_Sans'] text-sm">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1A1A1A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Stats - TryHackMe Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Points Card */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 border border-orange-500 border-opacity-30">
            <div className="flex items-start justify-between mb-3">
              <Zap className="w-6 h-6 text-orange-200" />
              <span className="text-2xl font-bold">Level {userStats.level || 1}</span>
            </div>
            <p className="text-orange-100 text-xs mb-2">Total Points</p>
            <p className="text-3xl font-bold">{userStats.totalPoints || 0}</p>
            <p className="text-orange-100 text-xs mt-2">
              +{userStats.pointsThisMonth || 0} this month
            </p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 border border-red-500 border-opacity-30">
            <div className="flex items-start justify-between mb-3">
              <Flame className="w-6 h-6 text-red-200" />
              <span className="text-xs text-red-100">Longest: {userStats.maxStreak || 0}</span>
            </div>
            <p className="text-red-100 text-xs mb-2">Day Streak</p>
            <p className="text-3xl font-bold">{userStats.currentStreak || 0}</p>
            <p className="text-red-100 text-xs mt-2">Keep it going!</p>
          </div>

          {/* Rooms Completed Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500 border-opacity-30">
            <div className="flex items-start justify-between mb-3">
              <Trophy className="w-6 h-6 text-blue-200" />
              <span className="text-xs text-blue-100">Rank #{userStats.rank || 'N/A'}</span>
            </div>
            <p className="text-blue-100 text-xs mb-2">Rooms Completed</p>
            <p className="text-3xl font-bold">{userStats.roomsCompleted || 0}</p>
            <p className="text-blue-100 text-xs mt-2">Keep learning</p>
          </div>

          {/* Learning Time Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 border border-purple-500 border-opacity-30">
            <div className="flex items-start justify-between mb-3">
              <Clock className="w-6 h-6 text-purple-200" />
            </div>
            <p className="text-purple-100 text-xs mb-2">Learning Time</p>
            <p className="text-3xl font-bold">{Math.floor((userStats.totalLearningMinutes || 0) / 60)}h</p>
            <p className="text-purple-100 text-xs mt-2">
              {(userStats.totalLearningMinutes || 0) % 60}m
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 overflow-hidden">
              {/* Profile Header Gradient */}
              <div className="h-24 bg-gradient-to-r from-orange-500 to-red-500"></div>

              {/* Profile Content */}
              <div className="px-6 pb-6 -mt-12 relative">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full border-4 border-[#0F0F0F] bg-gray-800 flex items-center justify-center mb-4 font-bold text-2xl">
                  {userStats.avatar ? (
                    <img
                      src={userStats.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    userStats.username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>

                <h2 className="text-xl font-bold mb-1">
                  {userStats.firstName && userStats.lastName
                    ? `${userStats.firstName} ${userStats.lastName}`
                    : userStats.username || 'User'}
                </h2>
                <p className="text-gray-400 text-xs mb-4">{userStats.email}</p>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    <span>View Full Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rank:</span>
                  <span className="font-semibold">{userStats.rank || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="font-semibold">{userStats.level || 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Streak:</span>
                  <span className="font-semibold flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-red-500" />
                    <span>{userStats.currentStreak || 0} days</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Capability Scores */}
            {capabilityList.length > 0 && (
              <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Top Capabilities</h3>
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-4">
                  {capabilityList.map(([category, score]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <span className="text-xs text-orange-500 font-bold">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity / Recommendations */}
            <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Recommended</h3>
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Start a new room to maintain your {userStats.currentStreak || 0} day streak and level up your skills!
                </p>
                <button
                  onClick={() => navigate('/rooms')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded font-medium text-sm transition-all"
                >
                  Explore Rooms
                </button>
              </div>
            </div>

            {/* Achievement Summary */}
            <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Achievements</h3>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-900 rounded">
                  <p className="text-2xl font-bold">{userStats.totalPoints || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Points</p>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded">
                  <p className="text-2xl font-bold">{userStats.roomsCompleted || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Rooms Done</p>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded">
                  <p className="text-2xl font-bold">{userStats.level || 1}</p>
                  <p className="text-xs text-gray-400 mt-1">Current Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default THMDashboard;