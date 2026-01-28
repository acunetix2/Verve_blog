import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Award, Play } from 'lucide-react';
import { toast } from 'sonner';
import CertificateDisplay from '../components/CertificateDisplay';
import VideoPlayer from '../components/VideoPlayer';
import ResourcesList from '../components/ResourcesList';
import CoursePriceDisplay from '../components/CoursePriceDisplay';
import { useTheme } from '@/components/ThemeContext';

interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

interface Resource {
  title: string;
  description?: string;
  type: 'pdf' | 'code' | 'checklist' | 'template' | 'other';
  url: string;
  fileSize?: number;
  downloadCount?: number;
}

interface Lesson {
  _id?: string;
  title: string;
  content?: string;
  contentUrl?: string; // B2 URL
  contentBlocks?: Array<{
    type: 'text' | 'header' | 'subheader' | 'points' | 'highlight' | 'code' | 'command' | 'table';
    content: string;
    color?: string;
    language?: string; // for code blocks
    order?: number;
  }>;
  quiz?: Quiz[];
  order: number;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'custom';
  videoDuration?: number;
  transcript?: string;
  resources?: Resource[];
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
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
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

  const handlePreviousLesson = () => {
    if (!course) return;
    
    const modules = course.modules;
    let prevLessonFound = false;
    
    // Try to find previous lesson in current module
    if (currentLessonIdx - 1 >= 0) {
      const prevLesson = modules[currentModuleIdx].lessons[currentLessonIdx - 1];
      navigate(`/v/courses/${course.slug || courseId}/lesson/${prevLesson._id || currentLessonIdx - 1}`);
      prevLessonFound = true;
    } else if (currentModuleIdx - 1 >= 0) {
      // Try previous module's last lesson
      const prevLesson = modules[currentModuleIdx - 1].lessons[modules[currentModuleIdx - 1].lessons.length - 1];
      if (prevLesson) {
        navigate(`/v/courses/${course.slug || courseId}/lesson/${prevLesson._id}`);
        prevLessonFound = true;
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 text-sm">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-white' : 'bg-white'} flex transition-colors`}>
      {/* Lesson Sidebar Navigation - TryHackMe Style */}
      {course && (
        <div className={`w-72 ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-slate-700 to-slate-800'} border-r ${isDark ? 'border-slate-700' : 'border-slate-600'} overflow-y-auto max-h-screen transition-colors`}>
          <div className={`p-4 ${isDark ? 'border-b border-slate-700' : 'border-b border-slate-600'} transition-colors`}>
            <button
              onClick={() => navigate(`/v/courses/${course.slug || courseId}`)}
              className={`flex items-center gap-2 text-green-400 hover:text-green-300 mb-3 text-xs font-semibold transition-colors`}
            >
              <ArrowLeft size={16} />
              Back to Course
            </button>
            <h2 className={`${isDark ? 'text-white' : 'text-slate-100'} font-bold text-xs truncate transition-colors line-clamp-2`}>{course.title}</h2>
          </div>
          
          {/* Modules and Lessons List */}
          <div className="p-4 space-y-3">
            {course.modules.map((module, mIdx) => (
              <div key={mIdx} className="space-y-2">
                <h3 className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-300'} uppercase tracking-wider transition-colors`}>
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
                        className={`w-full text-left px-3 py-2 rounded text-xs transition flex items-center gap-2 ${
                          isCurrentLesson
                            ? 'bg-green-600 text-white font-semibold'
                            : `${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-200 hover:bg-slate-600'}`
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                        ) : (
                          <Play size={12} className={`${isDark ? 'text-slate-500' : 'text-slate-400'} flex-shrink-0`} />
                        )}
                        <span className="truncate text-xs">{les.title}</span>
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
        <div className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-xs text-gray-600 mt-1">Follow the steps below to complete this lesson</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Video Player - Display if lesson has video */}
          {lesson.videoUrl && (
            <VideoPlayer 
              videoUrl={lesson.videoUrl} 
              videoType={lesson.videoType || 'youtube'} 
              title={lesson.title}
              duration={lesson.videoDuration}
              transcript={lesson.transcript}
              canDownload={true}
              onProgress={(progress) => {
                // Optional: track video progress
                console.log('Video progress:', progress);
              }}
            />
          )}

          {/* Resources Download - Display if lesson has resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <ResourcesList 
              resources={lesson.resources}
              courseId={courseId!}
              lessonId={lesson._id!}
              canDownload={true}
            />
          )}
          
          {/* Lesson Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 space-y-6">
            {contentLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-green-600 mr-2" size={24} />
                <p className="text-gray-600 text-sm">Loading content...</p>
              </div>
            ) : lesson.contentBlocks && lesson.contentBlocks.length > 0 ? (
              // Render structured content blocks
              <div className="space-y-6">
                {lesson.contentBlocks.map((block, idx) => {
                  const colorClasses = {
                    slate: 'text-gray-700',
                    blue: 'text-blue-700',
                    green: 'text-green-700',
                    purple: 'text-purple-700',
                    orange: 'text-orange-700',
                    red: 'text-red-700',
                  };
                  const textColor = colorClasses[block.color as keyof typeof colorClasses] || colorClasses.slate;

                  if (block.type === 'header') {
                    return (
                      <h1 key={idx} className={`text-3xl font-bold ${textColor}`}>
                        {block.content}
                      </h1>
                    );
                  }
                  if (block.type === 'subheader') {
                    return (
                      <h2 key={idx} className={`text-xl font-semibold ${textColor}`}>
                        {block.content}
                      </h2>
                    );
                  }
                  if (block.type === 'points') {
                    return (
                      <div key={idx} className="space-y-2">
                        {block.content.split('\n').filter(l => l.trim()).map((point, pIdx) => (
                          <div key={pIdx} className="flex gap-3">
                            <span className={`text-lg font-bold ${textColor}`}>•</span>
                            <span className="text-gray-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  // ✅ Updated highlight to use green color
                  if (block.type === 'highlight') {
                    return (
                      <div key={idx} className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500">
                        <p className="text-green-800">{block.content}</p>
                      </div>
                    );
                  }
                  // ✅ Code block support
                  if (block.type === 'code') {
                    return (
                      <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                        <div className="bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-300">
                          {block.language || 'Code'}
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-green-400 font-mono text-sm leading-relaxed">
                            {block.content}
                          </code>
                        </pre>
                      </div>
                    );
                  }
                  // ✅ Command/Terminal block support
                  if (block.type === 'command') {
                    return (
                      <div key={idx} className="bg-black rounded-lg overflow-hidden border border-gray-700">
                        <div className="bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-400">
                          $ Terminal
                        </div>
                        <div className="p-4 font-mono text-sm">
                          {block.content.split('\n').map((line, lineIdx) => (
                            <div key={lineIdx} className="text-green-400 hover:bg-green-900/20 px-2 py-1">
                              <span className="text-green-600">$</span> {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  // ✅ Table block support
                  if (block.type === 'table') {
                    try {
                      const rows = block.content.split('\n').filter(l => l.trim());
                      const headers = rows[0]?.split('|').map(h => h.trim()).filter(h => h) || [];
                      const data = rows.slice(1).map(row => 
                        row.split('|').map(cell => cell.trim()).filter(cell => cell)
                      );
                      return (
                        <div key={idx} className="overflow-x-auto rounded-lg border border-gray-300">
                          <table className="w-full border-collapse bg-white">
                            <thead className="bg-gray-100 border-b border-gray-300">
                              <tr>
                                {headers.map((header, hIdx) => (
                                  <th key={hIdx} className="px-4 py-3 text-left font-semibold text-gray-800 border-r border-gray-300 last:border-r-0">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3 text-gray-700 border-r border-gray-300 last:border-r-0">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    } catch (e) {
                      return (
                        <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-300 text-red-700">
                          Error rendering table
                        </div>
                      );
                    }
                  }
                  return (
                    <p key={idx} className="text-gray-700 leading-relaxed">
                      {block.content}
                    </p>
                  );
                })}
              </div>
            ) : lessonContent ? (
              // Render content with proper markdown/HTML styling (legacy)
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lessonContent }}
              ></div>
            ) : (
              <p className="text-gray-600 text-sm">No content available for this lesson</p>
            )}
          </div>

          {/* Quiz Not Available Message - When no quizzes */}
          {(!lesson.quiz || lesson.quiz.length === 0) && !isLessonCompleted && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <div className="text-amber-600 text-sm font-semibold">ℹ️ No quiz available for this lesson</div>
            </div>
          )}

          {/* Mark as Complete Button - For lessons without quiz or after quiz completion */}
          {(!lesson.quiz || lesson.quiz.length === 0 || quizSubmitted) && !isLessonCompleted && (
            <div className="mb-8">
              <button
                onClick={handleMarkComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 size={18} />
                Mark as Complete
              </button>
            </div>
          )}

          {/* Lesson Completed Badge */}
          {isLessonCompleted && (
            <div className="mb-8 bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <div>
                <p className="text-green-700 font-semibold text-sm">Lesson Completed!</p>
                <p className="text-xs text-gray-600">You've successfully completed this lesson</p>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <div className="bg-white border border-green-200 rounded-lg p-8 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-green-600">📝</span> Knowledge Check
              </h2>
              {!quizSubmitted && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <div className="text-blue-600 text-sm">
                    <p className="font-semibold">⚠️ Quiz Required</p>
                    <p className="text-xs text-blue-600">You must complete this quiz to continue to the next lesson</p>
                  </div>
                </div>
              )}

              {quizSubmitted && (
                <div
                  className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                    quizScore >= 70
                      ? 'bg-green-50 border border-green-300'
                      : 'bg-amber-50 border border-amber-300'
                  }`}
                >
                <CheckCircle2
                  className={quizScore >= 70 ? 'text-green-600' : 'text-amber-600'}
                  size={20}
                />
                <div>
                  <p
                    className={
                      quizScore >= 70 ? 'text-green-700 font-semibold' : 'text-amber-700 font-semibold'
                    }
                  >
                    {quizScore >= 70 ? 'Great job!' : 'Review the material'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Your score: {quizScore}%
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {lesson.quiz.map((q, qIdx) => (
                <div key={qIdx}>
                  <h3 className="text-gray-900 font-semibold mb-4 text-sm">
                    Question {qIdx + 1}: {q.question}
                  </h3>

                  <div className="space-y-2">
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
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${
                            isCorrect
                              ? 'bg-green-50 border-green-300'
                              : isWrong
                              ? 'bg-red-50 border-red-300'
                              : isSelected
                              ? 'bg-blue-50 border-blue-300'
                              : 'bg-white border-gray-200 hover:border-gray-300'
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
                                ? 'text-green-700 font-semibold'
                                : isWrong
                                ? 'text-red-700 font-semibold'
                                : 'text-gray-700'
                            }
                          >
                            {option}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="ml-auto text-green-600" size={18} />
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
                className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition text-sm"
              >
                Submit Quiz
              </button>
            )}
            </div>
          )}

        {/* Navigation Buttons - Previous/Next at bottom */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePreviousLesson}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentModuleIdx === 0 && currentLessonIdx === 0}
          >
            ← Previous Lesson
          </button>
          
          {(!lesson.quiz || lesson.quiz.length === 0 || quizSubmitted) && (
            <button
              onClick={handleNextLesson}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
            >
              Next Lesson →
              <ChevronRight size={18} />
            </button>
          )}
          
          {lesson.quiz && lesson.quiz.length > 0 && !quizSubmitted && (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-600 font-bold py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              title="Complete the quiz first"
            >
              🔒 Complete Quiz First
            </button>
          )}
        </div>

        {quizSubmitted && (
          <button
            onClick={handleNextLesson}
            className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            Continue to Next Lesson
            <ChevronRight size={18} />
          </button>
        )}

        {isCourseComplete && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-8 text-center">
            <Award className="mx-auto mb-4 text-green-600" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Lessons Completed! 🎉</h3>
            <p className="text-gray-700 text-sm mb-4">Now it's time for the final exam to earn your certificate</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/v/courses/${courseId}`)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition text-sm"
              >
                Back to Course
              </button>
              <button
                onClick={() => navigate(`/exam/${courseId}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Award size={18} />
                Take Final Exam
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && certificate && (
        <CertificateDisplay
          certificate={certificate}
          onClose={() => setShowCertificate(false)}
          courseId={courseId}
        />
      )}
    </div>
  );
};

export default LessonView;
