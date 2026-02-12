import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Play, BookOpen, Users, Clock, Star, Lock, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import CourseImage from "@/components/CourseImage";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string;
  modules?: Array<{ lessons?: Array<{ _id?: string }> }>;
  createdAt?: string;
  enrollmentCount?: number;
}

interface UserProgress {
  courseId: string;
  completedLessons?: Array<{ lessonId: string; completedAt: string; quizScore?: number }>;
  enrolledAt?: string;
}

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<{ [key: string]: UserProgress }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`);
        console.log("Courses response:", res.data);
        // Handle both array and object responses
        const coursesData = Array.isArray(res.data) ? res.data : res.data.courses || [];
        setCourses(coursesData);
        setError(null);
      } catch (error: unknown) {
        console.error("Failed to fetch courses - Full error:", error);
        let errorMsg = "Failed to fetch courses";
        if (error instanceof Error) {
          errorMsg = error.message;
        } else if (typeof error === "object" && error !== null) {
          const errorObj = error as Record<string, unknown>;
          if ("response" in errorObj && typeof errorObj.response === "object" && errorObj.response !== null) {
            const response = errorObj.response as Record<string, unknown>;
            console.error("Response status:", response.status);
            console.error("Response data:", response.data);
            if (typeof response.data === "object" && response.data !== null) {
              const data = response.data as Record<string, unknown>;
              errorMsg = (data.message as string) || errorMsg;
            }
          }
        }
        setError(errorMsg);
        setCourses([]);
        toast.error(errorMsg);
      }
    };

    const loadData = async () => {
      await fetchCourses();
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!token || courses.length === 0) return;
      try {
        const progressData: { [key: string]: UserProgress } = {};
        for (const course of courses) {
          try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${course._id}/progress`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            progressData[course._id] = res.data;
          } catch (error) {
            // User not enrolled yet
          }
        }
        setUserProgress(progressData);
      } catch (error) {
        console.warn("Failed to fetch user progress");
      }
    };

    fetchUserProgress();
  }, [courses, token]);

  const handleEnroll = async (courseId: string) => {
    if (!token) {
      toast.error("Please log in to enroll in courses");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProgress({ ...userProgress, [courseId]: res.data });
      toast.success("Successfully enrolled in course!");
    } catch (error) {
      toast.error("Failed to enroll in course");
    }
  };

  const getProgressPercentage = (courseId: string) => {
    const progress = userProgress[courseId];
    if (!progress) return 0;
    const course = courses.find(c => c._id === courseId);
    const totalLessons = (course?.modules || []).reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    if (totalLessons === 0) return 0;
    return Math.round((progress.completedLessons?.length || 0) / totalLessons * 100);
  };

  const isEnrolled = (courseId: string) => {
    return !!userProgress[courseId];
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-semibold">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800/50 to-transparent border-b border-slate-700/50 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Learning Paths</h1>
              <p className="text-slate-400">Master new skills with our interactive courses</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-lg focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="inline-block p-3 bg-red-500/20 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Courses</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-500" />
            <h2 className="text-2xl font-bold text-white mb-2">No courses found</h2>
            <p className="text-slate-400">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course._id);
              const progress = getProgressPercentage(course._id);
              const totalLessons = (course.modules || []).reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

              return (
                <div
                  key={course._id}
                  className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden hover:border-slate-600/50 transition-all group hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer transform hover:scale-105 active:scale-95 duration-200 ease-out"
                >
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 overflow-hidden">
                    {course.imageUrl || course.image ? (
                      <CourseImage
                        courseId={course._id}
                        courseTitle={course.title}
                        imageUrl={course.imageUrl || course.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        alt={course.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                    {enrolled && (
                      <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-semibold text-white">Enrolled</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{course.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.modules?.length || 0} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount || 0} enrolled</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {enrolled && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-slate-300">Progress</p>
                          <p className="text-xs font-bold text-blue-400">{progress}%</p>
                        </div>
                        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {enrolled ? (
                      <Link
                        to={`/course/${course._id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg transition-all font-semibold text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-blue-600/50 hover:to-blue-700/50 text-white px-4 py-2.5 rounded-lg transition-all font-semibold text-sm border border-slate-600/50"
                      >
                        <Lock className="w-4 h-4" />
                        Enroll Now
                      </button>
                    )}
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

export default CoursesPage;
