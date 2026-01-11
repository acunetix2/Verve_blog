import React, { useEffect, useState } from "react";
import { BookOpen, Search, Filter, Star, Users, Clock, ArrowRight, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Module {
  lessons?: Array<{ _id?: string }>;
}

interface Course {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  image?: string;
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
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">
            <BookOpen size={48} className="text-blue-400" />
          </div>
          <p style={fontStyle}>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-blue-400" size={32} />
            <h1 style={fontStyle} className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Learning Paths
            </h1>
          </div>
          <p style={smallFontStyle} className="text-slate-300">Master cybersecurity and hacking through interactive courses</p>
        </div>
      </div>

      {/* Tabs */}
      {token && (
        <div className="border-b border-slate-700/50 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-4 font-semibold border-b-2 transition-all ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setActiveTab("enrolled")}
                className={`px-4 py-4 font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "enrolled"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                My Courses
                {enrolledCoursesData.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 pl-12 pr-4 py-3 rounded-lg focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-3 flex-wrap">
            <Filter className="text-slate-400 w-5 h-5" />
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficultyFilter === level
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-slate-400 text-sm">
            Showing <span className="text-white font-semibold">{filteredCourses.length}</span> of{" "}
            <span className="text-white font-semibold">{courses.length}</span> courses
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="inline-block p-3 bg-red-500/20 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-1xl font-bold text-white mb-2">Unable to Load Courses</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg  transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-slate-500 w-12 h-12 mb-4" />
            <p style={smallFontStyle} className="text-slate-400">
              {activeTab === "enrolled"
                ? "You haven't enrolled in any courses yet. Browse all courses to get started!"
                : "No courses found matching your criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course._id);
              const moduleCount = course.modules?.length || 0;
              const lessonCount = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

              return (
                <div
                  key={course._id}
                  className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all group h-full flex flex-col"
                >
                  {/* Course Image/Banner */}
                  {course.image ? (
                    <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <BookOpen className="text-blue-400/50" size={36} />
                    </div>
                  )}

                  {/* Course Content */}
                  <div className="p-4 space-y-3 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2">{course.description}</p>
                    </div>

                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-2">
                      {course.difficulty && (
                        <span style={smallFontStyle} className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                        </span>
                      )}
                      {isEnrolled && (
                        <span style={smallFontStyle} className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Enrolled
                        </span>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-slate-700/50">
                      <div style={smallFontStyle} className="flex items-center gap-1 text-slate-300 text-xs">
                        <BookOpen size={14} className="text-blue-400" />
                        <span>{moduleCount} Modules</span>
                      </div>
                      <div style={smallFontStyle} className="flex items-center gap-1 text-slate-300 text-xs">
                        <Clock size={14} className="text-orange-400" />
                        <span>{lessonCount} Lessons</span>
                      </div>
                      {course.rating && (
                        <div style={smallFontStyle} className="flex items-center gap-2 text-slate-300">
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar - Only for Enrolled Courses */}
                    {activeTab === "enrolled" && isEnrolled && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={smallFontStyle} className="text-xs text-slate-400">Progress</span>
                          <span style={smallFontStyle} className="text-xs font-semibold text-blue-400">{calculateProgress(course)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500"
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
                      className={`w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        isEnrolled
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          : "bg-slate-700/50 hover:bg-slate-700 text-white"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <span style={fontStyle}>Continue Learning</span> <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          <span style={fontStyle}>Enroll Now</span> <ArrowRight size={16} />
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
