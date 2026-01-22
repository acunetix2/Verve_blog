import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, CheckCircle2, Lock, BookOpen, Clock, User } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Lesson {
  _id?: string;
  title: string;
  content: string;
  quiz?: any[];
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
  title: string;
  description: string;
  image?: string;
  modules: Module[];
  createdAt?: string;
}

interface UserProgress {
  completedLessons?: { lessonId: string; completedAt: string; quizScore?: number }[];
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`);
        setCourse(res.data);
      } catch (error) {
        toast.error("Failed to load course");
        navigate("/courses");
      }
    };

    const fetchProgress = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProgress(res.data);
      } catch (error) {
        console.warn("Failed to fetch progress");
      }
    };

    const loadData = async () => {
      await fetchCourse();
      await fetchProgress();
      setLoading(false);
    };

    loadData();
  }, [courseId, token]);

  const handleCompleteLesson = async () => {
    if (!token || !course) return;

    const lesson = course.modules[selectedModule]?.lessons[selectedLesson];
    if (!lesson) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/lesson/${lesson._id}/complete`,
        { quizScore: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserProgress({
        ...userProgress,
        completedLessons: [
          ...(userProgress?.completedLessons || []),
          { lessonId: lesson._id || "", completedAt: new Date().toISOString(), quizScore: 100 },
        ],
      });

      toast.success("Lesson completed! Great job!");

      // Move to next lesson
      const totalLessonsInModule = course.modules[selectedModule].lessons.length;
      if (selectedLesson < totalLessonsInModule - 1) {
        setSelectedLesson(selectedLesson + 1);
      } else if (selectedModule < course.modules.length - 1) {
        setSelectedModule(selectedModule + 1);
        setSelectedLesson(0);
      } else {
        toast.success("Course completed! Congratulations!");
      }
    } catch (error) {
      toast.error("Failed to complete lesson");
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress?.completedLessons?.some(l => l.lessonId === lessonId) || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-green-600/30 dark:border-green-500/30 border-t-green-600 dark:border-t-green-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-semibold">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 dark:text-white text-xl font-semibold">Course not found</p>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[selectedModule];
  const currentLesson = currentModule?.lessons[selectedLesson];
  const totalModules = course.modules.length;
  const completedLessons = userProgress?.completedLessons?.length || 0;
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-50 to-transparent dark:from-gray-900 dark:to-gray-950 border-b border-green-200 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/v/courses")}
            className="flex items-center gap-2 text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Courses
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <div className="text-right">
              <p className="text-sm text-gray-700 dark:text-gray-400">Progress</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">{progressPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Modules */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-6 sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Modules</h2>
              <div className="space-y-2">
                {course.modules.map((module, idx) => {
                  const moduleCompleted = module.lessons.every(lesson =>
                    isLessonCompleted(lesson._id || "")
                  );
                  return (
                    <div key={idx} className="space-y-1">
                      <button
                        onClick={() => {
                          setSelectedModule(idx);
                          setSelectedLesson(0);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                          selectedModule === idx
                            ? "bg-green-600 text-white border border-green-700"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {moduleCompleted ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" /> : <BookOpen className="w-4 h-4" />}
                        {module.title}
                      </button>
                      {selectedModule === idx && (
                        <div className="pl-4 space-y-1">
                          {module.lessons.map((lesson, lessonIdx) => {
                            const completed = isLessonCompleted(lesson._id || "");
                            return (
                              <button
                                key={lessonIdx}
                                onClick={() => setSelectedLesson(lessonIdx)}
                                className={`w-full text-left px-4 py-2 rounded text-xs transition-all flex items-center gap-2 ${
                                  selectedLesson === lessonIdx
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                              >
                                {completed ? <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" /> : <Play className="w-3 h-3" />}
                                <span className="line-clamp-1">{lesson.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Lesson */}
          <div className="lg:col-span-3">
            {currentLesson ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                      Module {selectedModule + 1} of {totalModules}
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{currentLesson.title}</h2>
                  </div>
                  {isLessonCompleted(currentLesson._id || "") && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-500/50">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300 font-semibold">Completed</span>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{currentLesson.content}</div>
                </div>

                {/* Quiz Section */}
                {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                  <div className="bg-green-50 dark:bg-gray-800/50 border border-green-300 dark:border-gray-700 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Quiz</h3>
                    <div className="space-y-4">
                      {currentLesson.quiz.map((q, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-900 dark:text-white font-semibold mb-3">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((option: string, optIdx: number) => (
                              <button
                                key={optIdx}
                                className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-green-600 hover:text-white transition-all border border-gray-300 dark:border-gray-700"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete Button */}
                {!isLessonCompleted(currentLesson._id || "") ? (
                  <button
                    onClick={handleCompleteLesson}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all font-semibold text-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark as Complete
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const totalLessonsInModule = course.modules[selectedModule].lessons.length;
                      if (selectedLesson < totalLessonsInModule - 1) {
                        setSelectedLesson(selectedLesson + 1);
                      } else if (selectedModule < course.modules.length - 1) {
                        setSelectedModule(selectedModule + 1);
                        setSelectedLesson(0);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all font-semibold text-lg"
                  >
                    <Play className="w-5 h-5" />
                    Next Lesson
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-gray-900 dark:text-white text-lg">No lessons available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
