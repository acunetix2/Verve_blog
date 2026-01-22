import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Play, CheckCircle2, Clock, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
  modules: Module[];
  createdAt?: string;
}

interface UserProgress {
  completedLessons: Array<{
    lessonId: string;
    completedAt: string;
    quizScore?: number;
  }>;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState<string | null>(localStorage.getItem('token'));
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

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
      } catch (error) {
        console.log('No progress yet');
      }
    };

    if (courseId) {
      fetchCourse();
      if (token) {
        fetchProgress();
      }
    }
  }, [courseId, token, navigate]);

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
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BookOpen size={40} className="text-green-600 mx-auto" />
          </div>
          <p style={fontStyle} className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <p style={fontStyle} className="text-gray-600 dark:text-gray-400">Course not found</p>
      </div>
    );
  }

  const progress_percent = calculateProgress();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-850 border-b border-green-200 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate('/v/courses')}
            className="flex items-center gap-2 text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 mb-4"
          >
            <ArrowLeft size={20} />
            <span style={fontStyle}>Back to Courses</span>
          </button>
          <h1 style={fontStyle} className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
          <p style={fontStyle} className="text-gray-700 dark:text-gray-400 mb-6">{course.description}</p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div style={smallFontStyle} className="flex justify-between text-gray-700 dark:text-gray-400">
              <span>Progress</span>
              <span>{progress_percent}%</span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress_percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg p-4">
            <div style={smallFontStyle} className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
              <BookOpen size={18} />
              <span>{course.modules.length} Modules</span>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {course.modules.map((module, idx) => (
            <div
              key={module._id || idx}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 style={fontStyle} className="text-lg font-semibold text-gray-900 dark:text-white">
                      {module.title}
                    </h3>
                    <p style={smallFontStyle} className="text-gray-600 dark:text-gray-400">
                      {module.lessons.length} lessons
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-400">
                  {expandedModule === idx ? '−' : '+'}
                </div>
              </button>

              {/* Lessons */}
              {expandedModule === idx && (
                <div className="border-t border-gray-300 dark:border-gray-800 divide-y divide-gray-300 dark:divide-gray-800">
                  {module.lessons.map((lesson, lessonIdx) => (
                    <div
                      key={lesson._id || lessonIdx}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <button
                        onClick={() =>
                          navigate(
                            `/v/courses/${course.slug || course._id}/lesson/${lesson._id || lessonIdx}`
                          )
                        }
                        className="w-full flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {isLessonCompleted(lesson._id || `${idx}-${lessonIdx}`) ? (
                            <CheckCircle2 className="text-green-600 dark:text-green-500" size={20} />
                          ) : (
                            <Play className="text-gray-400 dark:text-gray-600" size={20} />
                          )}
                          <span style={fontStyle} className="text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-500 transition">
                            {lesson.title}
                          </span>
                        </div>
                        <span style={smallFontStyle} className="text-gray-600 dark:text-gray-500">
                          ~5 min
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
