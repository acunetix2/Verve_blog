import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, BookOpen, Award, Flame, Target } from 'lucide-react';
import axios from 'axios';

interface UserStats {
  enrolledCourses: number;
  completedCourses: number;
  totalLessonsCompleted: number;
  badges: number;
  totalPoints: number;
  streak: number;
  certificates: number;
}

interface UserProfileStatsProps {
  userId: string;
}

const UserProfileStats: React.FC<UserProfileStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/profile/${userId}`
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Failed to load profile</div>;
  }

  const statCards = [
    {
      label: 'Enrolled Courses',
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
    },
    {
      label: 'Completed Courses',
      value: stats.completedCourses,
      icon: Target,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600'
    },
    {
      label: 'Lessons Completed',
      value: stats.totalLessonsCompleted,
      icon: TrendingUp,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
    },
    {
      label: 'Badges Earned',
      value: stats.badges,
      icon: Award,
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
    },
    {
      label: 'Total Points',
      value: stats.totalPoints,
      icon: BarChart3,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
    },
    {
      label: 'Current Streak',
      value: stats.streak + ' days',
      icon: Flame,
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Learning Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.color} p-6 rounded-lg flex items-center gap-4 hover:shadow-lg transition`}
            >
              <Icon size={32} className="opacity-70" />
              <div>
                <p className="text-sm opacity-80">{card.label}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Keep Learning!</h3>
        <p className="opacity-90">
          You've completed {stats.completedCourses} courses and earned {stats.badges} badges.
          Keep up the great work! 🎓
        </p>
      </div>
    </div>
  );
};

export default UserProfileStats;
