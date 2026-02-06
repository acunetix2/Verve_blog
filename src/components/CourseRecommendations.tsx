import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string;
  difficulty?: string;
  rating?: number;
}

interface CourseRecommendationsProps {
  limit?: number;
  showTrending?: boolean;
}

const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({
  limit = 6,
  showTrending = true
}) => {
  const [personalized, setPersonalized] = useState<Course[]>([]);
  const [trending, setTrending] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  const fetchRecommendations = async () => {
    try {
      if (token) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/recommendations/personalized?limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPersonalized(response.data.recommendations);
      }

      if (showTrending) {
        const trendingResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/recommendations/trending?limit=${limit}`
        );
        setTrending(trendingResponse.data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <div
      onClick={() => navigate(`/v/courses/${course._id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {course.imageUrl && (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover hover:scale-110 transition"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {course.description}
        </p>
        {course.difficulty && (
          <div className="mt-3">
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              {course.difficulty}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading recommendations...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Personalized Recommendations */}
      {token && personalized.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={24} className="text-purple-600" />
            <h2 className="text-xl font-bold">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalized.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Courses */}
      {trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={24} className="text-orange-600" />
            <h2 className="text-xl font-bold">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}

      {personalized.length === 0 && trending.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No recommendations available yet.</p>
        </div>
      )}
    </div>
  );
};

export default CourseRecommendations;
