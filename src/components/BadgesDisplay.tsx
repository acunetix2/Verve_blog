import React, { useState, useEffect } from 'react';
import { Award, Trophy, Zap } from 'lucide-react';
import axios from 'axios';

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  earnedAt?: string;
}

interface BadgesDisplayProps {
  userId: string;
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ userId }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/badges/user/${userId}`
      );
      setBadges(response.data.badges);
      setTotalPoints(response.data.totalPoints);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors = {
    common: 'bg-gray-100 dark:bg-gray-700',
    rare: 'bg-blue-100 dark:bg-blue-900/30',
    epic: 'bg-purple-100 dark:bg-purple-900/30',
    legendary: 'bg-yellow-100 dark:bg-yellow-900/30'
  };

  const rarityBorders = {
    common: 'border-gray-300',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400'
  };

  if (loading) {
    return <div className="text-center py-4">Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg flex items-center gap-4">
        <Trophy className="text-yellow-600" size={32} />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
          <p className="text-2xl font-bold text-yellow-600">{totalPoints}</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Earned Badges ({badges.length})</h3>
        {badges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap size={32} className="mx-auto mb-2 opacity-50" />
            <p>Start learning to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge._id}
                className={`${rarityColors[badge.rarity]} border-2 ${rarityBorders[badge.rarity]} p-4 rounded-lg text-center hover:shadow-lg transition cursor-pointer group`}
              >
                <div className="text-4xl mb-2">{badge.icon || '⭐'}</div>
                <h4 className="font-semibold text-sm">{badge.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {badge.points} pts
                </p>
                <p className="text-xs uppercase tracking-wide mt-2 text-gray-700 dark:text-gray-300 font-medium">
                  {badge.rarity}
                </p>

                {/* Tooltip */}
                <div className="hidden group-hover:block absolute bg-gray-900 text-white text-xs rounded p-2 z-10 -mt-12 whitespace-nowrap">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgesDisplay;
