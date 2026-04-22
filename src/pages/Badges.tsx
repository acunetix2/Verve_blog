import React, { useEffect, useState } from 'react';
import { Award, Lock, Target, Zap, Shield, Flame } from 'lucide-react';
import axios from 'axios';

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  category: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

const Badges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'earned', 'locked'

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/badges');
        setBadges(response.data.data || []);
      } catch (error) {
        console.error('Error fetching badges:', error);
        // Set default badges if no endpoint
        setDefaultBadges();
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const setDefaultBadges = () => {
    setBadges([
      {
        _id: '1',
        name: 'First Steps',
        description: 'Complete your first room',
        icon: '🚀',
        requirement: 'Complete 1 room',
        category: 'beginner',
        earned: true,
        earnedAt: new Date(),
      },
      {
        _id: '2',
        name: 'Web Warrior',
        description: 'Complete 5 web security rooms',
        icon: '🌐',
        requirement: 'Complete 5 web rooms',
        category: 'web',
        earned: true,
        earnedAt: new Date(),
        progress: { current: 5, required: 5 },
      },
      {
        _id: '3',
        name: 'Network Ninja',
        description: 'Complete 5 network security rooms',
        icon: '🕸️',
        requirement: 'Complete 5 network rooms',
        category: 'network',
        earned: false,
        progress: { current: 2, required: 5 },
      },
      {
        _id: '4',
        name: 'Code Breaker',
        description: 'Solve 10 cryptography challenges',
        icon: '🔐',
        requirement: '10 crypto challenges',
        category: 'cryptography',
        earned: false,
        progress: { current: 3, required: 10 },
      },
      {
        _id: '5',
        name: 'Linux Legend',
        description: 'Master 8 Linux rooms',
        icon: '🐧',
        requirement: '8 Linux rooms',
        category: 'linux',
        earned: false,
        progress: { current: 1, required: 8 },
      },
      {
        _id: '6',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        requirement: '7-day streak',
        category: 'streak',
        earned: false,
        progress: { current: 3, required: 7 },
      },
    ]);
  };

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const getBadgeIcon = (icon: string) => {
    return icon || '🏆';
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Badges</h1>
          </div>
          <p className="text-gray-400">Earn badges by completing challenges and maintaining streaks</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6">
            <div className="text-sm text-orange-100 mb-2">Total Badges</div>
            <div className="text-3xl font-bold">{badges.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-6">
            <div className="text-sm text-green-100 mb-2">Badges Earned</div>
            <div className="text-3xl font-bold">{badges.filter((b) => b.earned).length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6">
            <div className="text-sm text-blue-100 mb-2">Progress</div>
            <div className="text-3xl font-bold">
              {Math.round(
                ((badges.filter((b) => b.earned).length) / badges.length) * 100
              )}%
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Badges' },
            { key: 'earned', label: 'Earned' },
            { key: 'locked', label: 'Locked' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === key
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading badges...</div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No badges found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge) => (
              <div
                key={badge._id}
                className={`rounded-lg p-6 transition-all hover:scale-105 ${
                  badge.earned
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500 border-opacity-50'
                    : 'bg-gray-900 border border-gray-700 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{getBadgeIcon(badge.icon)}</div>

                {/* Badge Info */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-400">{badge.description}</p>
                </div>

                {/* Requirement */}
                <div className="mb-4 text-xs text-gray-500">
                  <div className="mb-2">{badge.requirement}</div>
                  {badge.progress && (
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
                        style={{
                          width: `${Math.min(
                            (badge.progress.current / badge.progress.required) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  {badge.earned ? (
                    <span className="text-xs text-green-400 font-semibold">✓ EARNED</span>
                  ) : (
                    <span className="text-xs text-gray-500 font-semibold flex items-center">
                      <Lock className="w-3 h-3 mr-1" /> LOCKED
                    </span>
                  )}
                  {badge.earned && badge.earnedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 p-6 bg-gray-900 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            How to Earn Badges
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>✓ Complete rooms to unlock achievement badges</li>
            <li>✓ Maintain daily streaks to earn streak badges</li>
            <li>✓ Master specific categories for specialization badges</li>
            <li>✓ Reach milestones in points and level for rank badges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Badges;
