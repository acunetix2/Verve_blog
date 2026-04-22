/**
 * TryHackMe-Style Rooms List Component
 * Displays learning rooms with difficulty levels, badges, and certificates
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Star, Lock, Award, Target, Clock, Users, Filter, Search,
  ChevronRight, Play, Shield, Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Room {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  imageUrl?: string;
  category: string;
  roomType: 'challenge' | 'learning' | 'ctf';
  rewards: {
    badge?: { name: string; icon: string };
    certificate?: boolean;
    pointsPerQuestion: number;
    totalPoints: number;
  };
  roomStats: {
    usersEnrolled: number;
    usersCompleted: number;
    timeEstimate: number;
  };
  isPremium?: boolean;
  userProgress?: {
    started: boolean;
    completed: boolean;
    progress: number;
    pointsEarned: number;
  };
}

export default function THMRoomsList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, difficultyFilter, typeFilter]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses?isRoom=true`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setRooms(res.data || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(room => room.difficulty === difficultyFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(room => room.roomType === typeFilter);
    }

    setFilteredRooms(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Intermediate': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Advanced': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Expert': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty] || colors['Beginner'];
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Rooms</h1>
          <p className="text-gray-400 text-lg">Learn with interactive security challenges and earn points</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="learning">Learning</option>
              <option value="challenge">Challenge</option>
              <option value="ctf">CTF</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading rooms...</div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">No rooms found. Try adjusting your filters.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} onClick={() => handleRoomClick(room._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Room Card Component
function RoomCard({ room, onClick }: { room: Room; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-600 to-red-600 overflow-hidden">
        {room.imageUrl ? (
          <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Shield className="text-white/50" size={64} />
          </div>
        )}
        
        {/* Room Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoomTypeBadge(room.roomType)}`}>
            {room.roomType.toUpperCase()}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyBadge(room.difficulty)}`}>
            {room.difficulty}
          </span>
        </div>

        {/* Premium Badge */}
        {room.isPremium && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-semibold">
            <Lock size={14} /> Premium
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title and Category */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">{room.category}</span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition line-clamp-2">
            {room.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">
          {room.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={16} className="text-orange-400" />
            <span>{room.roomStats?.usersEnrolled || 0} users</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={16} className="text-blue-400" />
            <span>{room.roomStats?.timeEstimate || 60}m</span>
          </div>
        </div>

        {/* Rewards */}
        <div className="space-y-2">
          {room.rewards?.certificate && (
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <Award size={16} /> Certificate Available
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-orange-400">
            <Zap size={16} /> +{room.rewards?.totalPoints || 0} points available
          </div>
        </div>

        {/* Progress Bar (if started) */}
        {room.userProgress?.started && (
          <div className="space-y-2 pt-2 border-t border-gray-700">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{room.userProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
                style={{ width: `${room.userProgress.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition group-hover:shadow-lg group-hover:shadow-orange-500/30">
          <Play size={18} />
          {room.userProgress?.started ? 'Continue' : 'Start'} Room
          <ChevronRight size={18} className="group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
}

function getDifficultyBadge(difficulty: string) {
  const badges: { [key: string]: string } = {
    'Beginner': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Intermediate': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Advanced': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Expert': 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return badges[difficulty] || badges['Beginner'];
}

function getRoomTypeBadge(type: string) {
  const badges: { [key: string]: string } = {
    'learning': 'bg-blue-500/20 text-blue-400',
    'challenge': 'bg-orange-500/20 text-orange-400',
    'ctf': 'bg-purple-500/20 text-purple-400'
  };
  return badges[type] || badges['learning'];
}
