import React, { useEffect, useState, useCallback } from "react";
import {
  BookOpen, Search, Filter, Star, Users, Clock, ArrowRight, Lock, Code, Shield, X, ChevronDown,
  TrendingUp, Award, Zap, Target, Settings, Heart, Eye
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeContext";
import CourseImage from "@/components/CourseImage";

interface Module {
  lessons?: Array<{ _id?: string }>;
}

interface Course {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string;
  modules?: Module[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  rating?: number;
  students?: number;
  duration?: string;
  category?: string;
  price?: number;
  isPremium?: boolean;
  tags?: string[];
  instructor?: { name: string };
  progress?: {
    completedLessons: Array<{lessonId: string; completedAt: string; quizScore?: number}>;
    enrolledAt: string;
    lastAccessed: string;
  };
}

interface Filters {
  difficulty: string[];
  priceRange: [number, number];
  rating: number;
  category: string[];
  sortBy: "newest" | "popular" | "rating" | "trending";
}

const CoursesList: React.FC = () => {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCoursesData, setEnrolledCoursesData] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "enrolled">("all");

  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.8125rem",
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.75rem",
  };

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems(res.data?.map((item: { courseId: string }) => item.courseId) || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, [token]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`);
        setCourses(res.data || []);
        
        if (token) {
          try {
            const enrollRes = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/users/courses/enrolled`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const enrolledIds = (enrollRes.data?.enrolledCourses || []).map((course: Course) => course._id);
            setEnrolledCourses(enrolledIds);
            setEnrolledCoursesData(enrollRes.data?.enrolledCourses || []);
          } catch (error) {
            setEnrolledCourses([]);
            setEnrolledCoursesData([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        const errorMsg = error instanceof Error ? error.message : "Failed to fetch courses";
        setError(errorMsg);
        setCourses([]);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  // Search filtering
  useEffect(() => {
    const filterCourses = () => {
      const sourceData = activeTab === "enrolled" ? enrolledCoursesData : courses;
      
      const filtered = sourceData.filter(course => {
        // Search filter only
        if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !course.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });

      setFilteredCourses(filtered);
    };
    filterCourses();
  }, [searchTerm, courses, enrolledCoursesData, activeTab]);

  const handleEnroll = async (courseId: string) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      try {
        const enrollRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/courses/enrolled`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const enrolledIds = (enrollRes.data?.enrolledCourses || []).map((course: Course) => course._id);
        setEnrolledCourses(enrolledIds);
        setEnrolledCoursesData(enrollRes.data?.enrolledCourses || []);
        setActiveTab("enrolled");
      } catch (error) {
        if (!enrolledCourses.includes(courseId)) {
          setEnrolledCourses([...enrolledCourses, courseId]);
        }
      }
      toast.success("Successfully enrolled in course!");
    } catch (error) {
      toast.error("Failed to enroll in course");
    }
  };

  const toggleWishlist = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (wishlistItems.includes(courseId)) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems(wishlistItems.filter(id => id !== courseId));
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems([...wishlistItems, courseId]);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
  };

  const calculateProgress = (course: Course): number => {
    if (!course.progress?.completedLessons) return 0;
    const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
    if (totalLessons === 0) return 0;
    return Math.round((course.progress.completedLessons.length / totalLessons) * 100);
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-600/50", label: "Beginner" };
      case "intermediate":
        return { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-600/50", label: "Intermediate" };
      case "advanced":
        return { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-600/50", label: "Advanced" };
      default:
        return { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-600/50", label: "All Levels" };
    }
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-2 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-gray-100 dark:to-gray-600"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="grid grid-cols-2 gap-2 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BookOpen size={40} className="text-blue-600 mx-auto" />
          </div>
          <p style={fontStyle} className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading courses...</p>
        </div>
      </div>
    );
  }



  return (
    <div className={`min-h-screen transition-colors`}>
      {/* Hero Header */}
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100/50 to-white'} border-b ${isDark ? 'border-gray-800' : 'border-blue-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 style={fontStyle} className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
                Discover Courses
              </h1>
              <p style={smallFontStyle} className={`${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Choose from {courses.length} expert-led courses and advance your skills
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" 
                  ? 'bg-blue-600 text-white' 
                  : `${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}`}
                title="Grid view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM3 14a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 14a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" 
                  ? 'bg-green-600 text-white' 
                  : `${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search by course name, instructor, or topic..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border pl-12 pr-4 py-3 rounded-xl focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all`}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      {token && (
          <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-4 font-semibold border-b-2 transition-all text-sm ${
                  activeTab === "all"
                    ? "border-blue-600 text-blue-600"
                    : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:${isDark ? 'text-gray-300' : 'text-gray-900'}`
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setActiveTab("enrolled")}
                className={`px-4 py-4 font-semibold border-b-2 transition-all flex items-center gap-2 text-sm ${
                  activeTab === "enrolled"
                    ? "border-blue-600 text-blue-600"
                    : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:${isDark ? 'text-gray-300' : 'text-gray-900'}`
                }`}
              >
                My Learning
                {enrolledCoursesData.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {enrolledCoursesData.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
                <span className="font-semibold">{courses.length}</span> courses
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className={`${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-300'} border rounded-xl p-6 mb-6`}>
                <p className={`${isDark ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
              </div>
            )}

            {/* Empty State */}
            {filteredCourses.length === 0 && !loading && (
              <div className={`text-center py-16 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <BookOpen className={`mx-auto w-12 h-12 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  No courses found
                </p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                  {activeTab === "enrolled"
                    ? "You haven't enrolled in any courses yet. Browse all courses to get started!"
                    : "Try searching with different terms."}
                </p>
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Courses Grid/List */}
            {loading ? (
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourses.includes(course._id);
                  const isWishlisted = wishlistItems.includes(course._id);
                  const moduleCount = course.modules?.length || 0;
                  const lessonCount = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
                  const difficultyBadge = getDifficultyBadge(course.difficulty);

                  if (viewMode === "list") {
                    return (
                      <div
                        key={course._id}
                        className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-green-600/50' : 'bg-white border-gray-200 hover:border-green-600'} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer`}
                        onClick={() => navigate(`/v/courses/${course.slug || course._id}`)}
                        onMouseEnter={() => setHoveredCourse(course._id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                      >
                        <div className="flex gap-6">
                          {/* Image */}
                          {(course.imageUrl || course.image) && (
                            <div className="w-40 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                              <CourseImage
                                courseId={course._id}
                                courseTitle={course.title}
                                imageUrl={course.imageUrl || course.image}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                alt={course.title}
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className={`text-lg font-semibold mb-1 ${hoveredCourse === course._id ? 'text-blue-600' : ''} transition-colors line-clamp-2`}>
                                  {course.title}
                                </h3>
                                {course.instructor && (
                                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    by {course.instructor.name}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={(e) => toggleWishlist(course._id, e)}
                                className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                                  isWishlisted
                                    ? 'bg-red-500/20 text-red-500'
                                    : `${isDark ? 'bg-gray-700' : 'bg-gray-100'} ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-red-500`
                                }`}
                              >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                              </button>
                            </div>

                            <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {course.description}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center gap-1 text-xs">
                                <Star size={14} className="text-yellow-500" fill="currentColor" />
                                <span className="font-semibold">{course.rating || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Users size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                <span>{(course.students || 0).toLocaleString()} students</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <BookOpen size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                <span>{lessonCount} lessons</span>
                              </div>
                            </div>

                            {/* Badges & Button */}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${difficultyBadge.bg} ${difficultyBadge.text} ${difficultyBadge.border}`}>
                                  {difficultyBadge.label}
                                </span>
                                {isEnrolled && (
                                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-900/30 text-green-400 border border-green-600/50">
                                    Enrolled
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  if (isEnrolled) {
                                    navigate(`/v/courses/${course.slug || course._id}`);
                                  } else {
                                    handleEnroll(course._id);
                                  }
                                }}
                                className={`px-4 py-2 rounded-lg font-medium text-xs transition-all ${
                                  isEnrolled
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 border border-blue-600/30"
                                }`}
                              >
                                {isEnrolled ? "Continue" : "Enroll"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Grid View
                  return (
                    <div
                      key={course._id}
                      className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-green-600/50' : 'bg-white border-gray-200 hover:border-green-600'} border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col cursor-pointer`}
                      onClick={() => navigate(`/v/courses/${course.slug || course._id}`)}
                      onMouseEnter={() => setHoveredCourse(course._id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    >
                      {/* Image Section */}
                      <div className={`relative h-40 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                        {(course.imageUrl || course.image) ? (
                          <CourseImage
                            courseId={course._id}
                            courseTitle={course.title}
                            imageUrl={course.imageUrl || course.image}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            alt={course.title}
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                            <BookOpen className={`${isDark ? 'text-gray-600' : 'text-gray-500'}`} size={40} />
                          </div>
                        )}
                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(course._id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-all ${
                            isWishlisted
                              ? 'bg-red-500/80 text-white'
                              : `bg-white/80 ${isDark ? 'text-gray-900' : 'text-gray-700'} hover:bg-white`
                          }`}
                        >
                          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                        {/* Top Badge */}
                        {course.students && course.students > 1000 && (
                          <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <TrendingUp size={12} />
                            Trending
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-4 flex flex-col flex-1">
                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base font-bold mb-2 line-clamp-2 ${hoveredCourse === course._id ? 'text-blue-600' : ''} transition-colors`}>
                            {course.title}
                          </h3>
                          <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {course.description}
                          </p>
                        </div>

                        {/* Instructor */}
                        {course.instructor && (
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-700'}`}>
                            👨‍🏫 {course.instructor.name}
                          </p>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${difficultyBadge.bg} ${difficultyBadge.text} ${difficultyBadge.border}`}>
                            {difficultyBadge.label}
                          </span>
                          {isEnrolled && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-900/30 text-green-400 border border-green-600/50 flex items-center gap-1">
                              <span>✓</span> Enrolled
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className={`grid grid-cols-3 gap-2 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Star size={14} className="text-yellow-500" fill="currentColor" />
                              <span className="font-bold text-xs">{course.rating || "N/A"}</span>
                            </div>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Rating</p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-xs mb-1">{lessonCount}</div>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Lessons</p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-xs mb-1">{(course.students || 0 / 1000).toFixed(1)}k</div>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Students</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {isEnrolled && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">Progress</span>
                              <span className="text-xs font-bold text-blue-600">{calculateProgress(course)}%</span>
                            </div>
                            <div className={`w-full rounded-full h-2 bg-white dark:bg-gray-900 overflow-hidden`}>
                              <div
                                className="bg-green-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${calculateProgress(course)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          onClick={() => {
                            if (isEnrolled) {
                              navigate(`/v/courses/${course.slug || course._id}`);
                            } else {
                              handleEnroll(course._id);
                            }
                          }}
                          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn ${
                            isEnrolled
                              ? `bg-green-600 hover:bg-green-700 text-white`
                              : `${isDark ? 'bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30' : 'bg-green-600/10 text-green-700 border border-green-200 hover:bg-green-600'} hover:${isDark ? 'text-green-300' : 'text-white'}`
                          }`}
                        >
                          {isEnrolled ? (
                            <>
                              <span>Continue</span>
                              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </>
                          ) : (
                            <>
                              <span>Enroll Now</span>
                              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
