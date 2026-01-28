import React, { useEffect, useState } from "react";
import { BookOpen, Search, Filter, Star, Users, Clock, ArrowRight, Lock, Code, Shield } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeContext";

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
  progress?: {
    completedLessons: Array<{lessonId: string; completedAt: string; quizScore?: number}>;
    enrolledAt: string;
    lastAccessed: string;
  };
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
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "enrolled">("all");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const fontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.8125rem",
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.75rem",
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`);
        setCourses(res.data || []);
        
        // Fetch user's enrolled courses
        if (token) {
          try {
            const enrollRes = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/users/courses/enrolled`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            // Store both course data and IDs
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

  useEffect(() => {
    const filterCourses = () => {
      // Select source based on active tab
      const sourceData = activeTab === "enrolled" ? enrolledCoursesData : courses;
      
      let filtered = sourceData;

      if (searchTerm) {
        filtered = filtered.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (difficultyFilter !== "all") {
        filtered = filtered.filter((course) => course.difficulty === difficultyFilter);
      }

      setFilteredCourses(filtered);
    };
    filterCourses();
  }, [searchTerm, difficultyFilter, courses, enrolledCoursesData, activeTab]);

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
      // Refetch enrolled courses to keep in sync with server
      try {
        const enrollRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/courses/enrolled`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const enrolledIds = (enrollRes.data?.enrolledCourses || []).map((course: Course) => course._id);
        setEnrolledCourses(enrolledIds);
        setEnrolledCoursesData(enrollRes.data?.enrolledCourses || []);
        setActiveTab("enrolled"); // Switch to enrolled tab after enrollment
      } catch (error) {
        // Fallback: add course ID to enrolled list if refetch fails
        if (!enrolledCourses.includes(courseId)) {
          setEnrolledCourses([...enrolledCourses, courseId]);
        }
      }
      toast.success("Successfully enrolled in course!");
    } catch (error) {
      toast.error("Failed to enroll in course");
    }
  };

  const calculateProgress = (course: Course): number => {
    if (!course.progress?.completedLessons) return 0;
    const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
    if (totalLessons === 0) return 0;
    return Math.round((course.progress.completedLessons.length / totalLessons) * 100);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  // Stylish Company Logo Component
  const CompanyLogo = () => (
    <div className="relative w-10 h-10">
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#60A5FA" : "#2563EB"} />
            <stop offset="100%" stopColor={isDark ? "#A78BFA" : "#7C3AED"} />
          </linearGradient>
        </defs>

        {/* Outer circle background */}
        <circle cx="20" cy="20" r="19" fill="url(#logoGradient)" opacity="0.1" stroke="url(#logoGradient)" strokeWidth="0.5" />

        {/* Central hexagon representing network/code */}
        <path
          d="M20 8 L28 12 L28 20 L20 24 L12 20 L12 12 Z"
          fill="url(#logoGradient)"
          opacity="0.3"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
        />

        {/* Inner book/code lines */}
        <line x1="16" y1="16" x2="24" y2="16" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="20" x2="24" y2="20" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="16" y1="24" x2="24" y2="24" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Top accent dot */}
        <circle cx="20" cy="10" r="1.5" fill="url(#logoGradient)" opacity="0.8" />
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BookOpen size={40} className="text-green-600 mx-auto" />
          </div>
          <p style={fontStyle} className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white transition-colors`}>
      {/* Header */}
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 sticky top-0 z-40 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <h1 style={fontStyle} className={`text-2xl font-bold text-gray-900`}>
              Learning Paths
            </h1>
          </div>
          <p style={smallFontStyle} className={`text-gray-700`}>Master cybersecurity and hacking through interactive courses</p>
        </div>
      </div>

      {/* Tabs */}
      {token && (
        <div className={`border-b border-gray-200 bg-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-4 font-semibold border-b-2 transition-all text-xs ${
                  activeTab === "all"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setActiveTab("enrolled")}
                className={`px-4 py-4 font-semibold border-b-2 transition-all flex items-center gap-2 text-xs ${
                  activeTab === "enrolled"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                My Courses
                {enrolledCoursesData.length > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                    {enrolledCoursesData.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all text-xs"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-3 flex-wrap items-center">
            <Filter className="text-gray-600 w-4 h-4" />
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-xs ${
                  difficultyFilter === level
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-gray-600 text-xs">
            Showing <span className="text-gray-900 font-semibold">{filteredCourses.length}</span> of{" "}
            <span className="text-gray-900 font-semibold">{courses.length}</span> courses
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="text-center py-12 bg-red-100 border border-red-300 rounded-lg">
            <div className="inline-block p-3 bg-red-200 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-1xl font-bold text-red-900 mb-2">Unable to Load Courses</h2>
            <p className="text-red-700 mb-4 text-xs">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-xs"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 w-10 h-10 mb-4" />
            <p style={smallFontStyle} className="text-gray-600">
              {activeTab === "enrolled"
                ? "You haven't enrolled in any courses yet. Browse all courses to get started!"
                : "No courses found matching your criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course._id);
              const moduleCount = course.modules?.length || 0;
              const lessonCount = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

              return (
                <div
                  key={course._id}
                  className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-red-600/20 hover:border-red-600/50 transition-all duration-300 overflow-hidden group h-full flex flex-col"
                >
                  {/* Course Image/Banner Header */}
                  <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>

                  {/* Course Image */}
                  {course.imageUrl || course.image ? (
                    <div className="h-40 bg-gradient-to-br from-red-900/30 to-orange-900/30 overflow-hidden">
                      <img
                        src={course.imageUrl || course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-red-900/30 to-orange-900/30 flex items-center justify-center">
                      <BookOpen className="text-red-500/60" size={40} />
                    </div>
                  )}

                  {/* Course Content */}
                  <div className="p-6 space-y-4 flex flex-col flex-1">
                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                    </div>

                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-2">
                      {course.difficulty && (
                        <span style={smallFontStyle} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          course.difficulty === 'beginner' ? 'bg-green-900/30 text-green-400 border border-green-600/50' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-600/50' :
                          'bg-red-900/30 text-red-400 border border-red-600/50'
                        }`}>
                          {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                        </span>
                      )}
                      {isEnrolled && (
                        <span style={smallFontStyle} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-900/30 text-green-400 border border-green-600/50">
                          Enrolled
                        </span>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-700">
                      <div style={smallFontStyle} className="flex items-center gap-2 text-gray-400">
                        <BookOpen size={14} className="text-orange-500" />
                        <span className="text-xs">{moduleCount} Modules</span>
                      </div>
                      <div style={smallFontStyle} className="flex items-center gap-2 text-gray-400">
                        <Clock size={14} className="text-orange-500" />
                        <span className="text-xs">{lessonCount} Lessons</span>
                      </div>
                    </div>

                    {/* Progress Bar - Only for Enrolled Courses */}
                    {activeTab === "enrolled" && isEnrolled && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span style={smallFontStyle} className="text-xs text-gray-400">Progress</span>
                          <span style={smallFontStyle} className="text-xs font-semibold text-orange-400">{calculateProgress(course)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
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
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                        isEnrolled
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-red-600/20 hover:bg-red-600/30 text-orange-500 border border-red-600/50"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <span>Continue Learning</span> <ArrowRight size={14} />
                        </>
                      ) : (
                        <>
                          <span>Enroll Now</span> <ArrowRight size={14} />
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
  );
};

export default CoursesList;
