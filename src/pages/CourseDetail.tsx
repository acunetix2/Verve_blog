import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen, Play, CheckCircle2, Clock, Users, ArrowLeft, Star, Heart, Share2, Award,
  MessageSquare, ChevronDown, Zap, TrendingUp, Lock, Target, GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeContext';

interface Lesson {
  _id?: string;
  title: string;
  content: string;
  order: number;
}

interface Module {
  _id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

interface Course {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string;
  modules: Module[];
  createdAt?: string;
  difficulty?: string;
  rating?: number;
  students?: number;
  price?: number;
  instructor?: { name: string; avatar?: string };
  learningOutcomes?: string[];
  requirements?: string[];
  totalDuration?: string;
}

interface UserProgress {
  completedLessons: Array<{
    lessonId: string;
    completedAt: string;
    quizScore?: number;
  }>;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface Review {
  _id: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
  helpful: number;
  author: { name: string; avatar?: string };
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState<string | null>(localStorage.getItem('token'));
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'qa'>('overview');

  const fontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.8125rem",
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.75rem",
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        toast.error('Failed to load course');
        navigate('/v/courses');
      } finally {
        setLoading(false);
      }
    };

    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgress(response.data);
        setIsEnrolled(true);
      } catch (error) {
        setIsEnrolled(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/reviews/${courseId}`
        );
        setReviewStats(response.data.stats);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.log('No reviews yet');
      } finally {
        setLoadingReviews(false);
      }
    };

    const checkWishlist = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const isInWishlist = response.data?.some((item: { courseId: string }) => item.courseId === courseId);
        setIsWishlisted(isInWishlist);
      } catch (error) {
        console.log('Failed to check wishlist');
      }
    };

    if (courseId) {
      fetchCourse();
      fetchReviews();
      if (token) {
        fetchProgress();
        checkWishlist();
      }
    }
  }, [courseId, token, navigate]);

  const handleEnroll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      if (isWishlisted) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return { bg: "bg-green-900/30", text: "text-green-400", label: "Beginner" };
      case "intermediate":
        return { bg: "bg-yellow-900/30", text: "text-yellow-400", label: "Intermediate" };
      case "advanced":
        return { bg: "bg-red-900/30", text: "text-red-400", label: "Advanced" };
      default:
        return { bg: "bg-blue-900/30", text: "text-blue-400", label: "All Levels" };
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return progress?.completedLessons?.some(l => l.lessonId === lessonId) || false;
  };

  const calculateProgress = (): number => {
    if (!course) return 0;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = progress?.completedLessons?.length || 0;
    return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BookOpen size={40} className="text-blue-600 mx-auto" />
          </div>
          <p style={fontStyle} className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <p style={fontStyle} className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Course not found</p>
      </div>
    );
  }

  const progress_percent = calculateProgress();
  const totalLessons = course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
  const difficultyBadge = getDifficultyBadge(course.difficulty);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Header */}
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100/50 to-white'} border-b ${isDark ? 'border-gray-800' : 'border-blue-200'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/v/courses')}
            className={`flex items-center gap-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mb-6 font-medium transition-colors`}
          >
            <ArrowLeft size={20} />
            <span>Back to Courses</span>
          </button>

          {/* Main Header Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Title and Description */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-3 mb-3">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${difficultyBadge.bg} ${difficultyBadge.text}`}>
                  {difficultyBadge.label}
                </span>
                {isEnrolled && (
                  <span className="px-3 py-1 rounded-lg text-sm font-bold bg-green-900/30 text-green-400 border border-green-600/50 flex items-center gap-1">
                    <span>✓</span> Enrolled
                  </span>
                )}
              </div>
              <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {course.title}
              </h1>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {course.description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 text-sm">
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-500" fill="currentColor" />
                    <div>
                      <div className="font-bold">{course.rating}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{reviewStats?.totalReviews || 0} reviews</div>
                    </div>
                  </div>
                )}
                {course.students && (
                  <div className="flex items-center gap-2">
                    <Users size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    <div>
                      <div className="font-bold">{(course.students / 1000).toFixed(1)}k</div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>students</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  <div>
                    <div className="font-bold">{totalLessons}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>lessons</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enrollment Card */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 h-fit sticky top-20`}>
              {/* Course Image */}
              {(course.imageUrl || course.image) && (
                <div className="rounded-lg overflow-hidden mb-6 h-40">
                  <img
                    src={course.imageUrl || course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-300/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {course.instructor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Instructor</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {course.instructor.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/v/courses/${course.slug || course._id}/lesson/${course.modules?.[0]?.lessons?.[0]?._id || '0'}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Continue Learning
                  </button>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all border flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? `${isDark ? 'bg-red-500/20 border-red-600/50 text-red-400' : 'bg-red-100 border-red-300 text-red-700'}`
                    : `${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          {/* Progress Bar (if enrolled) */}
          {isEnrolled && (
            <div className="mt-8 pt-6 border-t border-gray-300/20">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Progress
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {progress_percent}%
                </span>
              </div>
              <div className={`w-full rounded-full h-3 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress_percent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-8">
            {['overview', 'reviews', 'qa'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'overview' | 'reviews' | 'qa')}
                className={`px-4 py-4 font-semibold border-b-2 transition-all text-sm ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:${isDark ? 'text-gray-300' : 'text-gray-900'}`
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'reviews' && `Reviews (${reviewStats?.totalReviews || 0})`}
                {tab === 'qa' && 'Q&A'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Outcomes */}
              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <div>
                  <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    What you'll learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Requirements
                  </h2>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curriculum */}
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Curriculum
                </h2>
                <div className="space-y-3">
                  {course.modules.map((module, idx) => (
                    <div
                      key={module._id || idx}
                      className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-600/50' : 'bg-white border-gray-200 hover:border-blue-600'} border rounded-lg overflow-hidden transition-all`}
                    >
                      <button
                        onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                        className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition`}
                      >
                        <div className="flex items-center gap-3 text-left flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {module.title}
                            </h3>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                              {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${expandedModule === idx ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                        />
                      </button>

                      {/* Lessons */}
                      {expandedModule === idx && (
                        <div className={`border-t ${isDark ? 'border-gray-700 divide-gray-700' : 'border-gray-200 divide-gray-200'} divide-y`}>
                          {module.lessons.map((lesson, lessonIdx) => {
                            const isCompleted = isLessonCompleted(lesson._id || `${idx}-${lessonIdx}`);
                            return (
                              <div
                                key={lesson._id || lessonIdx}
                                className={`p-4 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} transition`}
                              >
                                <button
                                  onClick={() => {
                                    if (isEnrolled) {
                                      navigate(
                                        `/v/courses/${course.slug || course._id}/lesson/${lesson._id || lessonIdx}`
                                      );
                                    } else {
                                      toast.info('Please enroll to access lessons');
                                    }
                                  }}
                                  className="w-full flex items-center justify-between text-left"
                                  disabled={!isEnrolled}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {isCompleted ? (
                                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                                    ) : (
                                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isDark ? 'border-gray-600' : 'border-gray-400'}`}></div>
                                    )}
                                    <span className={`truncate ${isDark ? 'text-gray-300' : 'text-gray-700'} ${!isEnrolled && 'opacity-50'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <span className={`text-xs flex-shrink-0 ml-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                                    ~5 min
                                  </span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={`space-y-6`}>
              {/* Key Features */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Course Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="text-blue-600" size={20} />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Certificate on completion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="text-yellow-500" size={20} />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Self-paced learning
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="text-purple-600" size={20} />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Hands-on projects
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {loadingReviews ? (
              <div className="text-center py-12">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading reviews...</p>
              </div>
            ) : reviewStats && reviews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Summary */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-yellow-500 mb-2">
                      {reviewStats.averageRating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.round(reviewStats.averageRating) ? 'text-yellow-500' : isDark ? 'text-gray-600' : 'text-gray-300'}
                          fill={i < Math.round(reviewStats.averageRating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Based on {reviewStats.totalReviews} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-10 text-right">{rating}★</span>
                        <div className={`h-2 rounded-full flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <span className={`w-10 text-right text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          {Math.round((reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] || 0) / reviewStats.totalReviews * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {review.author?.name || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? 'text-yellow-500' : isDark ? 'text-gray-600' : 'text-gray-300'}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  No reviews yet. Be the first to review this course!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Q&A Tab */}
        {activeTab === 'qa' && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
            <MessageSquare className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={40} />
            <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              Discussion Coming Soon
            </p>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Be part of the community Q&A section launching soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
