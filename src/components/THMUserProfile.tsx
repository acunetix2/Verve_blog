/**
 * TryHackMe-Style User Profile Component
 * Complete profile management with sidebar navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Shield, Award, Zap, Settings, LogOut, Edit2, ChevronRight,
  Clock, TrendingUp, Trophy, Target, Flame, BookOpen, Download, Share2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  company?: string;
  totalPoints: number;
  level: number;
  rank: string;
  roomsCompleted: number;
  currentStreak: number;
  maxStreak: number;
}

interface RoomProgress {
  roomId: string;
  title: string;
  completed: boolean;
  progress: number;
  pointsEarned: number;
}

export default function THMUserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roomProgress, setRoomProgress] = useState<RoomProgress[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      
      // Also fetch rooms progress
      const roomsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/rooms-progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoomProgress(roomsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-blue-500/20 text-blue-400',
      'Intermediate': 'bg-purple-500/20 text-purple-400',
      'Advanced': 'bg-orange-500/20 text-orange-400',
      'Expert': 'bg-red-500/20 text-red-400'
    };
    return colors[rank] || colors['Beginner'];
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spinner">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur z-40 border-b border-gray-800">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/v')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 p-6 fixed left-0 top-20 bottom-0 overflow-y-auto">
          {/* Profile Card */}
          <div className="mb-8">
            <div className="relative mb-4">
              <div className="w-full h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
              <div className="absolute -bottom-8 left-4">
                <img 
                  src={profile?.profileImage || 'https://via.placeholder.com/80'} 
                  alt={profile?.firstName}
                  className="w-24 h-24 rounded-full border-4 border-gray-900 bg-gray-700"
                />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold text-white">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-gray-400 text-sm mb-3">{profile?.email}</p>
              
              {profile?.bio && (
                <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Mini */}
          <div className="space-y-3 mb-8 p-4 bg-gray-900/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Points:</span>
              <span className="text-orange-400 font-bold text-lg">{profile?.totalPoints || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Level:</span>
              <span className="text-blue-400 font-bold text-lg">{profile?.level || 1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Rank:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRankColor(profile?.rank || 'Beginner')}`}>
                {profile?.rank || 'Beginner'}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <NavItem
              icon={<User size={20} />}
              label="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem
              icon={<Zap size={20} />}
              label="Rooms"
              active={activeTab === 'rooms'}
              onClick={() => setActiveTab('rooms')}
              badge={roomProgress.length}
            />
            <NavItem
              icon={<Trophy size={20} />}
              label="Badges"
              active={activeTab === 'badges'}
              onClick={() => setActiveTab('badges')}
              badge={badges.length}
            />
            <NavItem
              icon={<Award size={20} />}
              label="Certificates"
              active={activeTab === 'certificates'}
              onClick={() => setActiveTab('certificates')}
              badge={certificates.length}
            />
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-80 flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  icon={<Zap className="text-orange-400" size={32} />}
                  label="Total Points"
                  value={profile?.totalPoints || 0}
                  color="orange"
                />
                <StatCard
                  icon={<TrendingUp className="text-blue-400" size={32} />}
                  label="Level"
                  value={profile?.level || 1}
                  color="blue"
                />
                <StatCard
                  icon={<Trophy className="text-yellow-400" size={32} />}
                  label="Rooms Completed"
                  value={profile?.roomsCompleted || 0}
                  color="yellow"
                />
                <StatCard
                  icon={<Flame className="text-red-400" size={32} />}
                  label="Current Streak"
                  value={profile?.currentStreak || 0}
                  color="red"
                />
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-3 gap-4">
                  {badges.slice(0, 3).map((badge: any, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="font-semibold text-white text-sm">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Your Rooms</h3>
              <div className="space-y-3">
                {roomProgress.map((room, idx) => (
                  <RoomProgressCard key={idx} room={room} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Certificates</h3>
              <div className="grid grid-cols-2 gap-4">
                {certificates.map((cert: any, idx) => (
                  <CertificateCard key={idx} certificate={cert} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Settings</h3>
              <SettingsPanel profile={profile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-orange-500/20 text-orange-400 border-l-2 border-orange-500'
          : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {badge && <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{badge}</span>}
      {active && <ChevronRight size={20} />}
    </button>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        {icon}
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
}

// Room Progress Card
function RoomProgressCard({ room }: any) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-white">{room.title}</h4>
        <span className={`px-3 py-1 rounded text-xs font-bold ${
          room.completed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {room.completed ? 'Completed' : 'In Progress'}
        </span>
      </div>
      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
          style={{ width: `${room.progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-400 mt-2">{room.pointsEarned} points earned</p>
    </div>
  );
}

// Certificate Card
function CertificateCard({ certificate }: any) {
  return (
    <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 p-6 rounded-lg border border-yellow-600/30">
      <Award size={40} className="text-yellow-400 mb-3" />
      <h4 className="font-bold text-white mb-2">{certificate.title}</h4>
      <p className="text-sm text-gray-300 mb-4">{certificate.room}</p>
      <button className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium">
        <Download size={16} /> Download
      </button>
    </div>
  );
}

// Settings Panel Component
function SettingsPanel({ profile }: any) {
  return (
    <div className="space-y-4">
      <SettingField label="Email Notifications" defaultValue={true} />
      <SettingField label="Public Profile" defaultValue={true} />
      <SettingField label="Show Points" defaultValue={true} />
      <SettingField label="Display Statistics" defaultValue={true} />
    </div>
  );
}

function SettingField({ label, defaultValue }: any) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
      <label className="text-white font-medium">{label}</label>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => setValue(e.target.checked)}
        className="w-5 h-5 cursor-pointer"
      />
    </div>
  );
}
