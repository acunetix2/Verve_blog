import React, { useEffect, useState } from 'react';
import { Trophy, Zap, Target, Flame } from 'lucide-react';
import axios from 'axios';

interface LeaderboardUser {
  _id: string;
  username: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  roomsCompleted: number;
  avatar?: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('points'); // 'points', 'streak', 'level'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/leaderboard', {
          params: { sortBy: filter },
        });
        setUsers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-500';
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-gray-400">See how you rank against other learners</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'points', label: 'Points', icon: Zap },
            { key: 'streak', label: 'Streaks', icon: Flame },
            { key: 'level', label: 'Level', icon: Target },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                filter === key
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading leaderboard...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-700 bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      User
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      {filter === 'points' && 'Points'}
                      {filter === 'streak' && 'Day Streak'}
                      {filter === 'level' && 'Level'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      Level
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      Rooms
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-800 transition-colors ${
                        index === 0 ? 'bg-yellow-500 bg-opacity-10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-lg font-bold ${getMedalColor(
                              index + 1
                            )}`}
                          >
                            {getMedalIcon(index + 1) || `#${index + 1}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                            {(user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold">
                          {filter === 'points' && user.totalPoints.toLocaleString()}
                          {filter === 'streak' && `${user.currentStreak} days`}
                          {filter === 'level' && `Level ${user.level}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full bg-blue-500 bg-opacity-20 text-blue-300 text-sm font-medium">
                          Level {user.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400">
                        {user.roomsCompleted} completed
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            Leaderboard updates in real-time as users complete rooms and earn points.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
