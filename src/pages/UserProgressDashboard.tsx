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
} from 'lucide-react';
import { toast } from 'sonner';

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

const UserProgressDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token] = useState<string | null>(localStorage.getItem('token'));

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
    const fetchUserProgress = async () => {
    try {
      setLoading(true);
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
      console.error('Failed to fetch progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
    };

    if (token) {
      fetchUserProgress();
    }
  }, [token]);

  const calculateStats = () => {
    const totalCourses = progressData.length;
    const completedCourses = progressData.filter(
      (p) => p.progress === 100
    ).length;
    const inProgressCourses = progressData.filter(
      (p) => p.progress > 0 && p.progress < 100
    ).length;
    const avgProgress =
      progressData.length > 0
        ? Math.round(
            progressData.reduce((sum, p) => sum + p.progress, 0) /
              progressData.length
          )
        : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      avgProgress,
    };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p style={fontStyle} className="text-gray-600">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1
            style={fontStyle}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            My Learning Progress
          </h1>
          <p style={smallFontStyle} className="text-gray-700">
            Track your course completion and learning journey
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Courses */}
          <div className="bg-white border border-blue-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen size={18} className="text-blue-600" />
              </div>
              <div>
                <p style={smallFontStyle} className="text-gray-700">
                  Total Courses
                </p>
                <p style={fontStyle} className="text-gray-900 font-semibold">
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          {/* Completed Courses */}
          <div className="bg-white border border-green-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <p style={smallFontStyle} className="text-gray-700">
                  Completed
                </p>
                <p style={fontStyle} className="text-gray-900 font-semibold">
                  {stats.completedCourses}
                </p>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white border border-amber-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Zap size={18} className="text-amber-600" />
              </div>
              <div>
                <p style={smallFontStyle} className="text-gray-700">
                  In Progress
                </p>
                <p style={fontStyle} className="text-gray-900 font-semibold">
                  {stats.inProgressCourses}
                </p>
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-white border border-purple-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp size={18} className="text-purple-600" />
              </div>
              <div>
                <p style={smallFontStyle} className="text-gray-700">
                  Avg Progress
                </p>
                <p style={fontStyle} className="text-gray-900 font-semibold">
                  {stats.avgProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          <h2 style={fontStyle} className="text-lg font-semibold text-white">
            Your Courses
          </h2>

          {progressData.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-12 text-center">
              <BookOpen
                size={48}
                className="mx-auto text-slate-600 mb-4 opacity-50"
              />
              <p style={fontStyle} className="text-slate-400 mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <button
                onClick={() => navigate('/v/courses')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                style={fontStyle}
              >
                Browse Courses
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {progressData.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-600/50 transition group"
                >
                  <div className="p-5">
                    {/* Course Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3
                          style={fontStyle}
                          className="text-white font-semibold mb-1 group-hover:text-blue-400 transition"
                        >
                          {course.courseName}
                        </h3>
                        <p style={smallFontStyle} className="text-slate-400">
                          {course.completedLessons} of {course.totalLessons}{' '}
                          lessons completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          style={fontStyle}
                          className="text-white font-semibold text-lg"
                        >
                          {course.progress}%
                        </div>
                        <p style={smallFontStyle} className="text-slate-400">
                          Complete
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats & Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-slate-400">
                        <div style={smallFontStyle} className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(course.lastAccessed)}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/v/courses/${course.slug || course.courseId}`)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition text-sm"
                        style={smallFontStyle}
                      >
                        {course.progress === 100 ? (
                          <>
                            <CheckCircle2 size={14} />
                            Review
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Continue
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section (Future) */}
        {stats.completedCourses > 0 && (
          <div className="mt-12 bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Award size={20} className="text-amber-400" />
                <h3 style={fontStyle} className="text-white font-semibold">
                  Achievements & Certificates
                </h3>
              </div>
              <button
                onClick={() => navigate('/v/my-certificates')}
                className="text-amber-400 hover:text-amber-300 transition text-sm"
                style={smallFontStyle}
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.completedCourses >= 1 && (
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <p style={smallFontStyle} className="text-slate-300">
                    First Course
                  </p>
                </div>
              )}
              {stats.completedCourses >= 3 && (
                <div className="text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <p style={smallFontStyle} className="text-slate-300">
                    Trilogy Complete
                  </p>
                </div>
              )}
              {stats.avgProgress === 100 && (
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <p style={smallFontStyle} className="text-slate-300">
                    Perfect Score
                  </p>
                </div>
              )}
              {stats.inProgressCourses === 0 && stats.totalCourses > 0 && (
                <div className="text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <p style={smallFontStyle} className="text-slate-300">
                    All Complete
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProgressDashboard;
