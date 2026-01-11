import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Award, Play } from 'lucide-react';
import { toast } from 'sonner';
import CertificateDisplay from '../components/CertificateDisplay';

interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

interface Lesson {
  _id?: string;
  title: string;
  content?: string;
  contentUrl?: string; // B2 URL
  quiz?: Quiz[];
  order: number;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  slug?: string;
  title: string;
  modules: Module[];
}

// Use same Certificate type as CertificateDisplay
interface Certificate {
  _id: string;
  courseTitle: string;
  userName: string;
  certificateNumber: string;
  completionDate: string;
  totalQuizScore?: number;
  isDownloaded?: boolean;
  downloadedAt?: string;
}

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentModuleIdx, setCurrentModuleIdx] = useState<number>(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState<number>(0);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [token] = useState<string | null>(localStorage.getItem('token'));
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isCourseComplete, setIsCourseComplete] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`
        );
        setCourse(response.data);

        // Find the lesson and track its position
        let found = false;
        for (let mIdx = 0; mIdx < response.data.modules.length; mIdx++) {
          const module = response.data.modules[mIdx];
          for (let lIdx = 0; lIdx < module.lessons.length; lIdx++) {
            const l = module.lessons[lIdx];
            if (l._id === lessonId || l.order === parseInt(lessonId || '0')) {
              setLesson(l);
              setCurrentModuleIdx(mIdx);
              setCurrentLessonIdx(lIdx);
              // Fetch content from B2 if contentUrl exists
              if (l.contentUrl) {
                await fetchLessonContent(l.contentUrl);
              } else if (l.content) {
                setLessonContent(l.content);
              }
              found = true;
              break;
            }
          }
          if (found) break;
        }
      } catch (error) {
        toast.error('Failed to load lesson');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    // Fetch user progress to check if lesson is already completed
    const fetchProgress = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data?.completedLessons) {
          const completed = response.data.completedLessons.some(
            (cl: {lessonId: string; completedAt: string; quizScore?: number}) => cl.lessonId === lessonId
          );
          setIsLessonCompleted(completed);
        }
      } catch (error) {
        console.log('Could not fetch progress');
      }
    };

    if (courseId) {
      fetchCourse();
      fetchProgress();
    }
  }, [courseId, token, navigate, lessonId]);

  const fetchLessonContent = async (contentUrl: string) => {
    try {
      setContentLoading(true);
      const response = await axios.get(contentUrl);
      // If it's HTML content
      if (typeof response.data === 'string') {
        setLessonContent(response.data);
      } else {
        // If it's JSON, stringify it
        setLessonContent(JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch lesson content from B2:', error);
      toast.error('Failed to load lesson content');
    } finally {
      setContentLoading(false);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!lesson?.quiz) return;

    // Calculate score
    let correct = 0;
    lesson.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const score = Math.round((correct / lesson.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Mark lesson as complete and get certificate if course is complete
    if (token && course?._id && lesson._id) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${course._id}/lesson/${lesson._id}/complete`,
          { quizScore: score },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Check if course is now complete and certificate was generated
        if (response.data.isCourseComplete && response.data.certificate) {
          setIsCourseComplete(true);
          setCertificate(response.data.certificate);
          setShowCertificate(true);
          setIsLessonCompleted(true);
          toast.success('🎉 Congratulations! You completed the course!');
        } else {
          setIsLessonCompleted(true);
          toast.success(`Quiz submitted! Score: ${score}%`);
        }
      } catch (error) {
        console.error('Error marking lesson complete:', error);
        toast.error('Failed to submit quiz. Please try again.');
      }
    }
  };

  const handleMarkComplete = async () => {
    if (token && course?._id && lesson._id) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${course._id}/lesson/${lesson._id}/complete`,
          { quizScore: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Check if course is now complete and certificate was generated
        if (response.data.isCourseComplete && response.data.certificate) {
          setIsCourseComplete(true);
          setCertificate(response.data.certificate);
          setShowCertificate(true);
          setIsLessonCompleted(true);
          toast.success('🎉 Congratulations! You completed the course!');
        } else {
          setIsLessonCompleted(true);
          toast.success('Lesson marked as complete!');
        }
      } catch (error) {
        console.error('Error marking lesson complete:', error);
        toast.error('Failed to mark lesson as complete. Please try again.');
      }
    }
  };

  const handleNextLesson = () => {
    if (!course) return;
    
    const modules = course.modules;
    let nextLessonFound = false;
    
    // Try to find next lesson in current module
    if (currentLessonIdx + 1 < modules[currentModuleIdx].lessons.length) {
      const nextLesson = modules[currentModuleIdx].lessons[currentLessonIdx + 1];
      navigate(`/v/courses/${course.slug || courseId}/lesson/${nextLesson._id || currentLessonIdx + 1}`);
      nextLessonFound = true;
    } else if (currentModuleIdx + 1 < modules.length) {
      // Try next module's first lesson
      const nextLesson = modules[currentModuleIdx + 1].lessons[0];
      if (nextLesson) {
        navigate(`/v/courses/${course.slug || courseId}/lesson/${nextLesson._id || 0}`);
        nextLessonFound = true;
      }
    }
    
    // If no next lesson, go back to course
    if (!nextLessonFound) {
      navigate(`/v/courses/${course.slug || courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Lesson Sidebar Navigation */}
      {course && (
        <div className="w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto max-h-screen">
          <div className="p-4 border-b border-slate-700">
            <button
              onClick={() => navigate(`/v/courses/${course.slug || courseId}`)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-3 text-sm"
            >
              <ArrowLeft size={18} />
              Back to Course
            </button>
            <h2 className="text-white font-bold text-sm truncate">{course.title}</h2>
          </div>
          
          {/* Modules and Lessons List */}
          <div className="p-4 space-y-3">
            {course.modules.map((module, mIdx) => (
              <div key={mIdx} className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Module {mIdx + 1}: {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((les, lIdx) => {
                    const isCurrentLesson = mIdx === currentModuleIdx && lIdx === currentLessonIdx;
                    const isCompleted = les._id && isLessonCompleted && mIdx === currentModuleIdx && lIdx === currentLessonIdx;
                    return (
                      <button
                        key={lIdx}
                        onClick={() =>
                          navigate(
                            `/v/courses/${course.slug || courseId}/lesson/${les._id || lIdx}`
                          )
                        }
                        className={`w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2 ${
                          isCurrentLesson
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                        ) : (
                          <Play size={14} className="text-slate-500 flex-shrink-0" />
                        )}
                        <span className="truncate">{les.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 py-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Lesson Content */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          {contentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-500 mr-2" size={24} />
              <p className="text-slate-400">Loading content...</p>
            </div>
          ) : lessonContent ? (
            <div
              className="prose prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: lessonContent }}
            ></div>
          ) : (
            <p className="text-slate-400">No content available for this lesson</p>
          )}
        </div>

        {/* Mark as Complete Button - For lessons without quiz or after quiz completion */}
        {(!lesson.quiz || lesson.quiz.length === 0 || quizSubmitted) && !isLessonCompleted && (
          <div className="mb-8">
            <button
              onClick={handleMarkComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              Mark as Complete
            </button>
          </div>
        )}

        {/* Lesson Completed Badge */}
        {isLessonCompleted && (
          <div className="mb-8 bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-500" size={24} />
            <div>
              <p className="text-green-400 font-semibold">Lesson Completed!</p>
              <p className="text-sm text-slate-400">You've successfully completed this lesson</p>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Knowledge Check</h2>

            {quizSubmitted && (
              <div
                className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                  quizScore >= 70
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-amber-500/20 border border-amber-500/50'
                }`}
              >
                <CheckCircle2
                  className={quizScore >= 70 ? 'text-green-500' : 'text-amber-500'}
                  size={24}
                />
                <div>
                  <p
                    className={
                      quizScore >= 70 ? 'text-green-400' : 'text-amber-400'
                    }
                  >
                    {quizScore >= 70 ? 'Great job!' : 'Review the material'}
                  </p>
                  <p className="text-sm text-slate-400">
                    Your score: {quizScore}%
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {lesson.quiz.map((q, qIdx) => (
                <div key={qIdx}>
                  <h3 className="text-white font-semibold mb-4">
                    Question {qIdx + 1}: {q.question}
                  </h3>

                  <div className="space-y-3">
                    {q.options.map((option, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === option;
                      const isCorrect = quizSubmitted && q.answer === option;
                      const isWrong =
                        quizSubmitted &&
                        isSelected &&
                        q.answer !== option;

                      return (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                            isCorrect
                              ? 'bg-green-500/20 border-green-500/50'
                              : isWrong
                              ? 'bg-red-500/20 border-red-500/50'
                              : isSelected
                              ? 'bg-blue-500/20 border-blue-500/50'
                              : 'bg-slate-700/50 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            value={option}
                            checked={isSelected}
                            onChange={() =>
                              !quizSubmitted &&
                              handleQuizAnswer(qIdx, option)
                            }
                            disabled={quizSubmitted}
                            className="w-4 h-4"
                          />
                          <span
                            className={
                              isCorrect
                                ? 'text-green-400'
                                : isWrong
                                ? 'text-red-400'
                                : 'text-slate-300'
                            }
                          >
                            {option}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="ml-auto text-green-500" size={20} />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!quizSubmitted && (
              <button
                onClick={handleSubmitQuiz}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Submit Quiz
              </button>
            )}

            {quizSubmitted && (
              <button
                onClick={handleNextLesson}
                className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                Continue to Next Lesson
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {isCourseComplete && (
          <div className="mt-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-lg p-8 text-center">
            <Award className="mx-auto mb-4 text-yellow-500" size={48} />
            <h3 className="text-2xl font-bold text-white mb-2">Course Completed! 🎉</h3>
            <p className="text-slate-400 mb-4">You've earned your Verve Academy Certificate</p>
            <button
              onClick={() => setShowCertificate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              View Certificate
            </button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateDisplay
          certificate={certificate}
          onClose={() => setShowCertificate(false)}
          courseId={courseId}
        />
      )}
      </div>
    </div>
  );
};

export default LessonView;
